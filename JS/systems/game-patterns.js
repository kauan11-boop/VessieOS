/*!
 * VessieGamePatterns — motor de padrões do coletor de jogos.
 *
 * Em vez de heurísticas fixas ("caminho maior que 4 letras"), o coletor
 * aprende com a própria lista de jogos que já funciona no VessieOS: cada URL
 * conhecida vira um *template* de caminho (segmentos fixos + curingas), e os
 * links encontrados em um site são pontuados pela semelhança com esses
 * templates.
 *
 *   https://orbit-kick.com/games/city-brawl/      -> /games/:slug/
 *   https://1v1-lol.gitlab.io/go/class-389.html   -> /go/class-:num.html
 *   https://snowroad.io/drift-boss                -> /:slug
 *
 * Também aprende os padrões de imagem de capa por host, o que permite montar
 * a capa de um jogo novo sem baixar a página dele.
 *
 * Uso no navegador: window.VessieGamePatterns
 * Uso em Node (testes): require('./game-patterns.js')
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  if (root) root.VessieGamePatterns = mod;
})(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function () {
  'use strict';

  const NON_GAME_SEGMENTS = new Set([
    'privacy', 'privacy-policy', 'terms', 'terms-of-service', 'about', 'contact',
    'dmca', 'cookie', 'cookies', 'login', 'signup', 'register', 'account',
    'category', 'categories', 'tag', 'tags', 'page', 'blog', 'news', 'sitemap',
    'search', 'feed', 'rss', 'author', 'help', 'support', 'faq'
  ]);

  const GAME_HINTS = ['game', 'games', 'play', 'jogo', 'jogos', 'io', 'unblocked', 'arcade', 'go'];

  const ASSET_EXTENSIONS = /\.(png|jpe?g|gif|webp|svg|css|js|json|xml|txt|ico|mp3|mp4|zip|pdf)$/i;

  function safeURL(value, base) {
    try { return new URL(value, base); } catch (e) { return null; }
  }

  /** Segmento vira curinga quando é claramente um identificador variável. */
  function tokenizeSegment(segment) {
    if (/^\d+$/.test(segment)) return { kind: 'num', text: ':num' };
    if (/^[a-z]+-\d+$/i.test(segment)) {
      const prefix = segment.split('-')[0];
      return { kind: 'prefixed-num', text: `${prefix}-:num` };
    }
    if (/^[a-z]+-\d+\.[a-z]+$/i.test(segment)) {
      const prefix = segment.split('-')[0];
      const ext = segment.split('.').pop();
      return { kind: 'prefixed-num-ext', text: `${prefix}-:num.${ext}` };
    }
    if (/^[a-z0-9]+(-[a-z0-9]+)+$/i.test(segment)) return { kind: 'slug', text: ':slug' };
    if (/^[a-z0-9]{3,}$/i.test(segment)) return { kind: 'word', text: segment.toLowerCase() };
    return { kind: 'literal', text: segment.toLowerCase() };
  }

  /**
   * Template de um caminho: segmentos fixos preservados, variáveis viram
   * curingas. O primeiro segmento só vira curinga se houver outros depois —
   * assim `/games/:slug/` mantém o "games" como âncora do padrão.
   */
  function pathTemplate(pathname) {
    const trailing = pathname.endsWith('/') && pathname !== '/';
    const segments = pathname.split('/').filter(Boolean);
    if (!segments.length) return { template: '/', segments: [], trailing: false };
    const tokens = segments.map((segment, index) => {
      const token = tokenizeSegment(segment);
      const isLast = index === segments.length - 1;
      // Segmentos fixos intermediários (games/, go/, play/) são âncoras.
      if (!isLast && token.kind === 'slug') return { kind: 'word', text: segment.toLowerCase() };
      return token;
    });
    return {
      template: '/' + tokens.map((t) => t.text).join('/') + (trailing ? '/' : ''),
      segments: tokens,
      trailing
    };
  }

  function templateFor(url) {
    const parsed = safeURL(url);
    if (!parsed) return null;
    const { template } = pathTemplate(parsed.pathname);
    return { host: parsed.hostname.toLowerCase(), template };
  }

  /** Padrão de capa: https://host/cache/.../<slug>-cover.png.webp -> tokens */
  function coverTemplate(gameUrl, coverUrl) {
    const game = safeURL(gameUrl);
    const cover = safeURL(coverUrl);
    if (!game || !cover) return null;
    const slug = game.pathname.split('/').filter(Boolean).pop();
    if (!slug) return null;
    const href = cover.href;
    if (!href.includes(slug)) return null;
    return { host: game.hostname.toLowerCase(), template: href.split(slug).join(':slug') };
  }

  /**
   * Aprende os padrões a partir da lista de jogos do sistema.
   * @param {Array<{url?: string, u?: string, cover?: string, icon?: string, ic?: string}>} games
   */
  function learn(games) {
    const hosts = new Map();

    for (const game of games || []) {
      const rawUrl = game && (game.url || game.u);
      const parsed = safeURL(rawUrl);
      if (!parsed) continue;

      const host = parsed.hostname.toLowerCase();
      if (!hosts.has(host)) hosts.set(host, { host, total: 0, paths: new Map(), covers: new Map() });
      const entry = hosts.get(host);
      entry.total++;

      const { template } = pathTemplate(parsed.pathname);
      entry.paths.set(template, (entry.paths.get(template) || 0) + 1);

      const cover = coverTemplate(rawUrl, game.cover || game.icon || game.ic);
      if (cover) entry.covers.set(cover.template, (entry.covers.get(cover.template) || 0) + 1);
    }

    const patterns = [];
    for (const entry of hosts.values()) {
      for (const [template, count] of entry.paths.entries()) {
        patterns.push({
          host: entry.host,
          template,
          count,
          share: count / entry.total,
          regex: templateToRegex(template)
        });
      }
    }
    patterns.sort((a, b) => b.count - a.count);

    const covers = [];
    for (const entry of hosts.values()) {
      for (const [template, count] of entry.covers.entries()) {
        covers.push({ host: entry.host, template, count });
      }
    }
    covers.sort((a, b) => b.count - a.count);

    return {
      hosts: Array.from(hosts.keys()),
      patterns,
      covers,
      /** Templates que aparecem em mais de um host — padrões "universais". */
      globalTemplates: globalTemplates(patterns)
    };
  }

  function globalTemplates(patterns) {
    const byTemplate = new Map();
    for (const p of patterns) {
      if (!byTemplate.has(p.template)) byTemplate.set(p.template, new Set());
      byTemplate.get(p.template).add(p.host);
    }
    return Array.from(byTemplate.entries())
      .filter(([, hosts]) => hosts.size > 1)
      .map(([template, hosts]) => ({ template, hosts: hosts.size, regex: templateToRegex(template) }))
      .sort((a, b) => b.hosts - a.hosts);
  }

  function templateToRegex(template) {
    const escaped = template
      .split('/')
      .map((segment) => segment
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/:slug/g, '[a-z0-9][a-z0-9-]*')
        .replace(/:num/g, '\\d+'))
      .join('/');
    return new RegExp(`^${escaped}$`, 'i');
  }

  /**
   * Pontua um link candidato (0 a 1) contra os padrões aprendidos.
   * @returns {{score: number, reasons: string[], matchedTemplate: string|null}}
   */
  function score(candidateUrl, knowledge) {
    const parsed = safeURL(candidateUrl);
    if (!parsed) return { score: 0, reasons: ['url-invalida'], matchedTemplate: null };

    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const reasons = [];
    let total = 0;
    let matchedTemplate = null;

    if (!segments.length) return { score: 0, reasons: ['raiz-do-site'], matchedTemplate: null };
    if (segments.some((s) => NON_GAME_SEGMENTS.has(s.toLowerCase()))) {
      return { score: 0, reasons: ['segmento-institucional'], matchedTemplate: null };
    }
    if (ASSET_EXTENSIONS.test(pathname)) {
      return { score: 0, reasons: ['arquivo-estatico'], matchedTemplate: null };
    }

    const hostPatterns = (knowledge.patterns || []).filter((p) => p.host === host);
    const exact = hostPatterns.find((p) => p.regex.test(pathname));
    if (exact) {
      total += 0.6 + Math.min(0.15, exact.share * 0.15);
      matchedTemplate = exact.template;
      reasons.push(`padrao-do-host:${exact.template}`);
    } else if (hostPatterns.length) {
      const { template } = pathTemplate(pathname);
      const shapeMatch = hostPatterns.find((p) => sameShape(p.template, template));
      if (shapeMatch) {
        total += 0.4;
        matchedTemplate = shapeMatch.template;
        reasons.push(`formato-do-host:${shapeMatch.template}`);
      }
    }

    if (!matchedTemplate) {
      const globalMatch = (knowledge.globalTemplates || []).find((p) => p.regex.test(pathname));
      if (globalMatch) {
        total += 0.35;
        matchedTemplate = globalMatch.template;
        reasons.push(`padrao-global:${globalMatch.template}`);
      }
    }

    if ((knowledge.hosts || []).includes(host)) {
      total += 0.15;
      reasons.push('host-conhecido');
    }
    if (segments.some((s) => GAME_HINTS.includes(s.toLowerCase()))) {
      total += 0.1;
      reasons.push('caminho-com-palavra-de-jogo');
    }
    const last = segments[segments.length - 1];
    if (/^[a-z0-9]+(-[a-z0-9]+)+$/i.test(last)) {
      total += 0.15;
      reasons.push('slug-de-jogo');
    }
    if (segments.length > 4) {
      total -= 0.2;
      reasons.push('caminho-muito-profundo');
    }

    return { score: Math.max(0, Math.min(1, total)), reasons, matchedTemplate };
  }

  function sameShape(templateA, templateB) {
    const a = templateA.split('/').filter(Boolean);
    const b = templateB.split('/').filter(Boolean);
    if (a.length !== b.length) return false;
    return a.every((segment, i) => segment === b[i] || segment.startsWith(':') === b[i].startsWith(':'));
  }

  /** Ordena e filtra candidatos por pontuação mínima. */
  function rank(urls, knowledge, minScore = 0.4) {
    return (urls || [])
      .map((url) => Object.assign({ url }, score(url, knowledge)))
      .filter((c) => c.score >= minScore)
      .sort((a, b) => b.score - a.score);
  }

  /** Tenta prever a capa de um jogo usando os padrões de imagem do host. */
  function guessCover(gameUrl, knowledge) {
    const parsed = safeURL(gameUrl);
    if (!parsed) return null;
    const host = parsed.hostname.toLowerCase();
    const slug = parsed.pathname.split('/').filter(Boolean).pop();
    if (!slug) return null;
    const template = (knowledge.covers || []).find((c) => c.host === host);
    if (!template) return null;
    return template.template.split(':slug').join(slug);
  }

  /** Nome legível a partir do slug: "city-brawl" -> "City Brawl". */
  function nameFromUrl(gameUrl) {
    const parsed = safeURL(gameUrl);
    if (!parsed) return 'Jogo';
    const slug = parsed.pathname.split('/').filter(Boolean).pop() || parsed.hostname;
    return slug
      .replace(/\.(html?|php|aspx)$/i, '')
      .split(/[-_]/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Jogo';
  }

  return {
    learn,
    score,
    rank,
    guessCover,
    nameFromUrl,
    pathTemplate,
    templateFor,
    templateToRegex
  };
});
