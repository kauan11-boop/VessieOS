/*!
 * vessie-game-api.js — ponte entre o VessieScript e o Game Hub do VessieOS.
 *
 * É aqui que os "dois conteúdos" se encontram: a linguagem passa a enxergar a
 * biblioteca de jogos, o coletor e a política de segurança através de dois
 * módulos de alto nível, `games` e `sec`. O script NUNCA recebe `window`,
 * `document`, `fetch` ou `eval` — só estas funções, e toda URL que entra por
 * elas passa pelo VessieURLGuard.
 *
 *   var novos = await games.collect("https://exemplo-de-jogos.com", 5);
 *   for jogo in novos {
 *     if (sec.check(jogo["url"])["ok"]) { games.add(jogo["name"], jogo["url"]); }
 *   }
 *   games.removeBroken();
 *
 * Uso:
 *   const hostAPI = VessieGameAPI.createHostAPI({ library, collector, print });
 *   await VessieScript.run(source, hostAPI);
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  if (root) root.VessieGameAPI = mod;
})(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function () {
  'use strict';

  function plainGame(game) {
    if (!game) return null;
    return {
      id: game.id,
      name: game.name,
      url: game.url,
      icon: game.icon || '',
      cover: game.cover || '',
      source: game.source || '',
      plays: game.plays || 0,
      health: game.health ? game.health.status : 'unchecked'
    };
  }

  /**
   * @param {object} deps
   * @param {object} deps.library instância de VessieGameLibrary.GameLibrary
   * @param {object} [deps.collector] instância de VessieCollector
   * @param {object} [deps.guard] VessieURLGuard
   * @param {object} [deps.doctor] VessieIframeDoctor
   * @param {Function} [deps.print]
   */
  function createHostAPI(deps = {}) {
    const library = deps.library;
    const collector = deps.collector || null;
    const guard = deps.guard || (typeof VessieURLGuard !== 'undefined' ? VessieURLGuard : null);
    const doctor = deps.doctor || (typeof VessieIframeDoctor !== 'undefined' ? VessieIframeDoctor : null);
    if (!library) throw new Error('VessieGameAPI exige uma biblioteca de jogos');
    if (!guard) throw new Error('VessieGameAPI exige o VessieURLGuard');

    const games = {
      all: () => library.all().map(plainGame),
      count: () => library.all().length,
      find: (query) => library.filter(query).map(plainGame),
      get: (id) => plainGame(library.get(id)),
      stats: () => library.stats(),

      add: (name, url, icon) => {
        const result = library.add({ name, url, icon });
        return result.ok ? { ok: true, game: plainGame(result.game) } : { ok: false, reason: result.reason, message: result.message };
      },
      remove: (id) => library.remove(id),

      select: (id) => library.toggle(id),
      selectAll: () => library.selectAll(),
      clearSelection: () => library.clearSelection(),
      selected: () => library.selectedGames().map(plainGame),
      deleteSelected: () => library.deleteSelected().map(plainGame),

      /** Roda o diagnóstico de iframe e grava a saúde de cada jogo. */
      diagnose: async (ids) => {
        if (!doctor) throw new Error('Doctor de iframe indisponível');
        const targets = ids && ids.length ? library.all().filter((g) => ids.includes(g.id)) : library.all();
        const results = await doctor.diagnose(targets);
        library.applyHealth(results);
        return doctor.summarize(results);
      },
      broken: () => library.brokenGames().map(plainGame),
      removeBroken: () => library.deleteBroken().map(plainGame),
      /** Reaplica a política de segurança e devolve o que saiu da biblioteca. */
      purgeUnsafe: () => library.securitySweep().map((g) => ({ name: g.name, url: g.url, reason: g.blockedReason })),

      exportJSON: (onlySelected) => library.exportJSON(!!onlySelected),
      importJSON: (text) => {
        const result = library.importJSON(text);
        return { added: (result.added || []).length, rejected: (result.rejected || []).length, error: result.error || null };
      },

      /** Coleta um site inteiro com o coletor v2 (não grava nada sozinho). */
      collect: async (siteUrl, limit) => {
        if (!collector) throw new Error('Coletor indisponível neste contexto');
        collector.train(library.all());
        const result = await collector.collectSite(siteUrl, { limit: Number(limit) || 10 });
        return {
          games: result.games.map(plainGame),
          blocked: result.blocked.map((b) => ({ url: b.url, reason: b.reason })),
          discarded: result.discarded.length
        };
      },
      /** Coleta e já grava o que passar na política. */
      collectAndSave: async (siteUrl, limit) => {
        const result = await games.collect(siteUrl, limit);
        const { added, rejected } = library.addMany(result.games);
        return { added: added.length, rejected: rejected.length, blocked: result.blocked.length };
      }
    };

    const sec = {
      /** Veredito completo de uma URL. */
      check: (url) => guard.inspect(url),
      /** true/false rápido. */
      allowed: (url) => guard.inspect(url).ok,
      /** URL normalizada ou null. */
      clean: (url) => guard.sanitize(url),
      /** Detecta host escrito como IP cru (200.168.0.10, 0x7f000001, [::1]). */
      isIP: (host) => guard.isIPLiteral(String(host || '').toLowerCase()),
      blockHost: (host) => guard.blockHost(host),
      unblockHost: (host) => guard.unblockHost(host),
      blocklist: () => guard.blocklist(),
      rejections: (limit) => guard.rejections(Number(limit) || 20)
    };

    return {
      print: deps.print || ((text) => console.log(text)),
      modules: { games, sec }
    };
  }

  return { createHostAPI, plainGame };
});
