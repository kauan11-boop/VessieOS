/*!
 * VessieCollector — coletor de jogos v2.
 *
 * Diferenças para o coletor antigo (JS/systems/game-hub-collector.js, mantido
 * como base histórica):
 *   1. usa VessieGamePatterns para aprender com a lista de jogos que já
 *      funciona e pontuar os links de um site novo, em vez de aceitar
 *      qualquer link interno;
 *   2. passa TODA URL (jogo, capa e até o proxy) pelo VessieURLGuard, então
 *      endereços em IP cru (200.168.0.10, 10.0.0.5, 0x7f000001) nunca entram
 *      na biblioteca;
 *   3. reporta o motivo de cada descarte, para o painel do Game Hub mostrar o
 *      que foi bloqueado e por quê.
 *
 * As dependências (fetch de HTML, parser de DOM, guard, patterns) são
 * injetáveis para permitir testes em Node sem navegador.
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  if (root) root.VessieCollector = mod;
})(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function () {
  'use strict';

  const DEFAULT_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy/?quest='
  ];

  function defaultParseDOM(html) {
    if (typeof DOMParser === 'undefined') throw new Error('DOMParser indisponível — injete parseDOM');
    return new DOMParser().parseFromString(html, 'text/html');
  }

  function resolve(href, base) {
    try { return new URL(href, base).href; } catch (e) { return null; }
  }

  class VessieCollector {
    /**
     * @param {object} deps
     * @param {(url: string) => Promise<string>} [deps.fetchText]
     * @param {(html: string) => Document} [deps.parseDOM]
     * @param {object} [deps.guard] VessieURLGuard
     * @param {object} [deps.patterns] VessieGamePatterns
     * @param {(msg: string, kind?: string) => void} [deps.log]
     */
    constructor(deps = {}) {
      this.guard = deps.guard || (typeof VessieURLGuard !== 'undefined' ? VessieURLGuard : null);
      this.patterns = deps.patterns || (typeof VessieGamePatterns !== 'undefined' ? VessieGamePatterns : null);
      if (!this.guard) throw new Error('VessieCollector exige VessieURLGuard');
      if (!this.patterns) throw new Error('VessieCollector exige VessieGamePatterns');
      this.parseDOM = deps.parseDOM || defaultParseDOM;
      this.proxies = deps.proxies || DEFAULT_PROXIES;
      this.fetchText = deps.fetchText || ((url) => this._fetchThroughProxies(url));
      this.log = deps.log || (() => {});
      this.knowledge = { hosts: [], patterns: [], covers: [], globalTemplates: [] };
      this.stats = { inspected: 0, accepted: 0, rejectedBySecurity: 0, rejectedByPattern: 0 };
    }

    /** Alimenta o motor de padrões com a lista de jogos atual do sistema. */
    train(games) {
      this.knowledge = this.patterns.learn(games);
      this.log(`Padrões aprendidos: ${this.knowledge.patterns.length} em ${this.knowledge.hosts.length} hosts`);
      return this.knowledge;
    }

    async _fetchThroughProxies(url) {
      const safe = this.guard.sanitize(url);
      if (!safe) throw new Error('URL bloqueada pela segurança');
      let lastError = null;
      for (const proxy of this.proxies) {
        try {
          const response = await fetch(proxy + encodeURIComponent(safe), { signal: AbortSignal.timeout(12000) });
          if (response.ok) {
            const text = await response.text();
            if (text && text.length > 100) return text;
          }
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error('Falha em todos os proxies');
    }

    /** Extrai todos os links internos de uma página. */
    discoverLinks(html, baseUrl) {
      const doc = this.parseDOM(html);
      const base = new URL(baseUrl);
      const links = new Set();
      doc.querySelectorAll('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.toLowerCase().startsWith('javascript')) return;
        const absolute = resolve(href, baseUrl);
        if (!absolute) return;
        const parsed = new URL(absolute);
        if (parsed.hostname !== base.hostname) return;
        links.add(`${parsed.origin}${parsed.pathname}`);
      });
      return Array.from(links);
    }

    /**
     * Filtra e ordena links usando segurança + padrões aprendidos.
     * @returns {{candidates: Array, blocked: Array, discarded: Array}}
     */
    evaluateLinks(links, minScore = 0.4) {
      const candidates = [];
      const blocked = [];
      const discarded = [];

      for (const link of links) {
        this.stats.inspected++;
        const verdict = this.guard.inspect(link);
        if (!verdict.ok) {
          this.stats.rejectedBySecurity++;
          blocked.push({ url: link, reason: verdict.reason, message: verdict.message });
          continue;
        }
        const scored = this.patterns.score(verdict.url, this.knowledge);
        if (scored.score < minScore) {
          this.stats.rejectedByPattern++;
          discarded.push({ url: verdict.url, score: scored.score, reasons: scored.reasons });
          continue;
        }
        this.stats.accepted++;
        candidates.push({ url: verdict.url, score: scored.score, reasons: scored.reasons, matchedTemplate: scored.matchedTemplate });
      }

      candidates.sort((a, b) => b.score - a.score);
      return { candidates, blocked, discarded };
    }

    /** Título + capa de uma página de jogo, já com a capa validada. */
    extractMetadata(html, pageUrl) {
      const doc = this.parseDOM(html);
      const title = (
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent ||
        ''
      ).trim().replace(/\s*[|\-–·]\s*.*$/, '').slice(0, 80);

      const imageCandidates = [
        doc.querySelector('meta[property="og:image"]')?.getAttribute('content'),
        doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
        ...Array.from(doc.querySelectorAll('img')).map((img) => img.getAttribute('src') || img.getAttribute('data-src'))
      ].filter(Boolean);

      let cover = null;
      for (const candidate of imageCandidates) {
        const absolute = resolve(candidate, pageUrl);
        if (!absolute) continue;
        const verdict = this.guard.inspect(absolute);
        if (verdict.ok) { cover = verdict.url; break; }
      }
      if (!cover) cover = this.patterns.guessCover(pageUrl, this.knowledge);

      return {
        name: title || this.patterns.nameFromUrl(pageUrl),
        cover: cover || '',
        icon: cover || ''
      };
    }

    /**
     * Coleta um site inteiro: descobre links, filtra por segurança/padrão e
     * busca metadados dos melhores candidatos.
     * @returns {Promise<{games: Array, blocked: Array, discarded: Array, source: string}>}
     */
    async collectSite(siteUrl, options = {}) {
      const limit = options.limit || 15;
      const minScore = options.minScore ?? 0.4;
      const source = this.guard.sanitize(siteUrl);
      if (!source) throw new Error('Site bloqueado pela segurança (host em IP cru ou endereço inválido)');

      this.log(`Explorando ${source}`, 'in');
      const html = await this.fetchText(source);
      const links = this.discoverLinks(html, source);
      this.log(`${links.length} links internos encontrados`, 'in');

      const { candidates, blocked, discarded } = this.evaluateLinks(links, minScore);
      this.log(`${candidates.length} candidatos aprovados, ${blocked.length} bloqueados por segurança`, 'in');

      const games = [];
      for (const candidate of candidates.slice(0, limit)) {
        try {
          const pageHtml = await this.fetchText(candidate.url);
          const meta = this.extractMetadata(pageHtml, candidate.url);
          games.push({
            name: meta.name,
            url: candidate.url,
            icon: meta.icon,
            cover: meta.cover,
            score: candidate.score,
            matchedTemplate: candidate.matchedTemplate,
            source,
            added: Date.now(),
            plays: 0
          });
          this.log(`✓ ${meta.name}`, 'ok');
        } catch (error) {
          discarded.push({ url: candidate.url, score: candidate.score, reasons: [`falha-no-fetch:${error.message}`] });
          this.log(`✗ ${candidate.url} — ${error.message}`, 'er');
        }
      }

      return { games, blocked, discarded, source, stats: Object.assign({}, this.stats) };
    }

    /** Coleta um único jogo. */
    async collectGame(gameUrl) {
      const safe = this.guard.sanitize(gameUrl);
      if (!safe) throw new Error('Endereço bloqueado pela segurança (host em IP cru ou endereço inválido)');
      const html = await this.fetchText(safe);
      const meta = this.extractMetadata(html, safe);
      return {
        name: meta.name,
        url: safe,
        icon: meta.icon,
        cover: meta.cover,
        score: this.patterns.score(safe, this.knowledge).score,
        source: new URL(safe).origin,
        added: Date.now(),
        plays: 0
      };
    }
  }

  return { VessieCollector, DEFAULT_PROXIES };
});
