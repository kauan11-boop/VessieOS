/*!
 * VessieIframeDoctor — diagnóstico de jogos que não abrem no iframe.
 *
 * Importante (honestidade técnica): o navegador NÃO entrega ao site que
 * incorpora o motivo exato de uma recusa cross-origin. Quando um destino
 * responde com X-Frame-Options: DENY ou CSP frame-ancestors, o `onload` pode
 * até disparar, e ler o documento de dentro é proibido. Por isso o doctor
 * classifica em níveis de confiança em vez de fingir certeza:
 *
 *   ok          — carregou e há sinal positivo (mesma origem legível ou load
 *                 dentro do tempo com resposta de rede)
 *   blocked     — o guard de segurança recusou a URL (certeza total)
 *   error       — o iframe emitiu erro / a URL não respondeu
 *   timeout     — nada aconteceu dentro do limite (provável bloqueio)
 *   unverified  — carregou mas é cross-origin e opaco; não dá para afirmar
 *
 * Só `blocked`, `error` e `timeout` são tratados como "quebrado" na limpeza
 * em massa; `unverified` nunca é apagado automaticamente.
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  if (root) root.VessieIframeDoctor = mod;
})(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function () {
  'use strict';

  const STATUS = {
    OK: 'ok',
    BLOCKED: 'blocked',
    ERROR: 'error',
    TIMEOUT: 'timeout',
    UNVERIFIED: 'unverified'
  };

  const BROKEN_STATUSES = [STATUS.BLOCKED, STATUS.ERROR, STATUS.TIMEOUT];

  const LABELS = {
    [STATUS.OK]: 'Abre normalmente',
    [STATUS.BLOCKED]: 'Bloqueado pela segurança',
    [STATUS.ERROR]: 'Erro ao carregar',
    [STATUS.TIMEOUT]: 'Não respondeu (provável bloqueio de iframe)',
    [STATUS.UNVERIFIED]: 'Carregou, mas não é possível confirmar (cross-origin)'
  };

  function isBroken(status) { return BROKEN_STATUSES.includes(status); }

  /** Testa uma URL em um iframe oculto. Só funciona no navegador. */
  function probe(url, options = {}) {
    const guard = options.guard || (typeof VessieURLGuard !== 'undefined' ? VessieURLGuard : null);
    const timeout = options.timeout || 9000;

    if (guard) {
      const verdict = guard.inspect(url);
      if (!verdict.ok) {
        return Promise.resolve({ url, status: STATUS.BLOCKED, label: LABELS[STATUS.BLOCKED], detail: verdict.message, checkedAt: Date.now() });
      }
      url = verdict.url;
    }

    if (typeof document === 'undefined') {
      return Promise.resolve({ url, status: STATUS.UNVERIFIED, label: LABELS[STATUS.UNVERIFIED], detail: 'sem DOM', checkedAt: Date.now() });
    }

    return new Promise((resolve) => {
      const frame = document.createElement('iframe');
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      frame.referrerPolicy = 'no-referrer';
      frame.style.cssText = 'position:fixed;width:320px;height:240px;left:-9999px;top:-9999px;opacity:0;border:0';
      let done = false;

      const finish = (status, detail) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        frame.remove();
        resolve({ url, status, label: LABELS[status], detail: detail || '', checkedAt: Date.now() });
      };

      const timer = setTimeout(() => finish(STATUS.TIMEOUT, `sem resposta em ${timeout}ms`), timeout);

      frame.onerror = () => finish(STATUS.ERROR, 'evento de erro do iframe');
      frame.onload = () => {
        // Um documento "about:blank" após load costuma indicar recusa.
        try {
          const doc = frame.contentDocument;
          if (doc && doc.location && doc.location.href === 'about:blank') {
            finish(STATUS.ERROR, 'destino recusou a incorporação (documento vazio)');
            return;
          }
          if (doc && doc.body && doc.body.childElementCount === 0) {
            finish(STATUS.ERROR, 'documento carregado vazio');
            return;
          }
          finish(STATUS.OK, 'documento legível');
        } catch (e) {
          // SecurityError = carregou de verdade em outra origem: bom sinal,
          // mas sem como confirmar que o jogo renderizou.
          finish(STATUS.UNVERIFIED, 'cross-origin opaco');
        }
      };

      frame.src = url;
      document.body.appendChild(frame);
    });
  }

  /**
   * Diagnostica uma lista de jogos, em lotes para não travar o navegador.
   * @param {Array<{id?: string, url: string}>} games
   * @param {{concurrency?: number, timeout?: number, onProgress?: Function}} options
   */
  async function diagnose(games, options = {}) {
    const concurrency = options.concurrency || 3;
    const list = Array.from(games || []);
    const results = [];
    let index = 0;

    async function worker() {
      while (index < list.length) {
        const current = list[index++];
        const result = await probe(current.url, options);
        const entry = Object.assign({ id: current.id, name: current.name }, result);
        results.push(entry);
        if (options.onProgress) options.onProgress(entry, results.length, list.length);
      }
    }

    await Promise.all(Array.from({ length: Math.min(concurrency, list.length) }, worker));
    return results;
  }

  /** Agrupa um relatório de diagnóstico. */
  function summarize(results) {
    const summary = { ok: 0, blocked: 0, error: 0, timeout: 0, unverified: 0, broken: [] };
    for (const result of results || []) {
      if (summary[result.status] !== undefined) summary[result.status]++;
      if (isBroken(result.status)) summary.broken.push(result.id || result.url);
    }
    return summary;
  }

  return { STATUS, LABELS, BROKEN_STATUSES, isBroken, probe, diagnose, summarize };
});
