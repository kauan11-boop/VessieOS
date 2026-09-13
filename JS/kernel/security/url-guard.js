/*!
 * VessieURLGuard — camada de segurança de URLs do VessieOS.
 *
 * Decide se uma URL pode entrar na biblioteca de jogos, ser aberta em um
 * iframe ou ser usada como imagem de capa. O foco é bloquear endereços que
 * apontam para máquinas cruas na rede (hosts escritos como IP, tipo
 * `200.168.0.10`, `10.0.0.5` ou `http://2130706433/`), que são o vetor típico
 * de jogos "colados" de painéis improvisados e de payloads de trojan/drive-by.
 *
 * Regras (ver docs/SECURITY-URL-GUARD.md):
 *   - apenas http/https;
 *   - host literal em IP (v4 decimal pontuado, v4 comprimido, decimal puro,
 *     octal, hexadecimal, IPv6 entre colchetes) é sempre bloqueado;
 *   - hosts locais/reservados (localhost, *.local, *.internal, .onion) são
 *     bloqueados;
 *   - portas fora de 80/443/8080/8443 são bloqueadas (painéis caseiros);
 *   - credenciais embutidas (user:senha@host) são bloqueadas;
 *   - extensões executáveis (.exe, .msi, .apk, .scr, .bat, .jar, ...) são
 *     bloqueadas;
 *   - http:// é promovido a https:// quando o resto passa.
 *
 * Uso no navegador: window.VessieURLGuard
 * Uso em Node (testes): require('./url-guard.js')
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  if (root) root.VessieURLGuard = mod;
})(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function () {
  'use strict';

  const ALLOWED_PORTS = new Set(['', '80', '443', '8080', '8443']);

  const BLOCKED_EXTENSIONS = [
    '.exe', '.msi', '.apk', '.scr', '.bat', '.cmd', '.com', '.jar',
    '.vbs', '.ps1', '.dll', '.dmg', '.deb', '.rpm', '.sh', '.hta'
  ];

  const LOCAL_HOST_SUFFIXES = ['.local', '.localhost', '.internal', '.lan', '.home', '.onion'];
  const LOCAL_HOST_NAMES = new Set(['localhost', 'ip6-localhost', 'broadcasthost']);

  const REASONS = {
    INVALID: 'url-invalida',
    PROTOCOL: 'protocolo-nao-permitido',
    CREDENTIALS: 'credenciais-embutidas',
    IP_LITERAL: 'host-ip-literal',
    LOCAL_HOST: 'host-local-ou-reservado',
    PORT: 'porta-nao-permitida',
    EXECUTABLE: 'arquivo-executavel',
    BLOCKLIST: 'host-na-blocklist'
  };

  const MESSAGES = {
    [REASONS.INVALID]: 'Endereço inválido.',
    [REASONS.PROTOCOL]: 'Só são aceitos endereços http:// e https://.',
    [REASONS.CREDENTIALS]: 'Endereços com usuário/senha embutidos são bloqueados.',
    [REASONS.IP_LITERAL]: 'Host é um IP cru (ex.: 200.168.0.10) — bloqueado por segurança.',
    [REASONS.LOCAL_HOST]: 'Host local/reservado — bloqueado por segurança.',
    [REASONS.PORT]: 'Porta fora das permitidas (80, 443, 8080, 8443).',
    [REASONS.EXECUTABLE]: 'O endereço aponta para um arquivo executável.',
    [REASONS.BLOCKLIST]: 'Host está na blocklist do sistema.'
  };

  /** IPv4 em notação decimal pontuada completa: 200.168.0.10 */
  function isDottedIPv4(host) {
    const parts = host.split('.');
    if (parts.length !== 4) return false;
    return parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255);
  }

  /**
   * Formas alternativas de escrever um IPv4, todas aceitas pelos navegadores e
   * usadas para driblar filtros ingênuos:
   *   127.1            (comprimido)
   *   2130706433       (decimal puro)
   *   0x7f000001       (hexadecimal)
   *   0177.0.0.1       (octal)
   */
  function isObfuscatedIPv4(host) {
    if (/^0x[0-9a-f]+$/i.test(host)) return true;
    if (/^\d+$/.test(host)) return true;
    const parts = host.split('.');
    if (parts.length < 2 || parts.length > 4) return false;
    return parts.every((p) => /^0x[0-9a-f]+$/i.test(p) || /^0[0-7]*$/.test(p) || /^\d+$/.test(p));
  }

  /** IPv6 chega do parser de URL entre colchetes: [::1], [2001:db8::1] */
  function isIPv6(host) {
    return host.startsWith('[') && host.endsWith(']');
  }

  function isIPLiteral(host) {
    if (!host) return false;
    const h = host.toLowerCase();
    return isIPv6(h) || isDottedIPv4(h) || isObfuscatedIPv4(h);
  }

  /** Faixas privadas/reservadas, só para explicar melhor o motivo no log. */
  function ipClass(host) {
    if (isIPv6(host)) return 'ipv6';
    if (!isDottedIPv4(host)) return 'ipv4-ofuscado';
    const [a, b] = host.split('.').map(Number);
    if (a === 10 || a === 127 || a === 0) return 'ipv4-privado';
    if (a === 172 && b >= 16 && b <= 31) return 'ipv4-privado';
    if (a === 192 && b === 168) return 'ipv4-privado';
    if (a === 169 && b === 254) return 'ipv4-link-local';
    if (a === 100 && b >= 64 && b <= 127) return 'ipv4-cgnat';
    return 'ipv4-publico';
  }

  function isLocalHostname(host) {
    const h = host.toLowerCase();
    if (LOCAL_HOST_NAMES.has(h)) return true;
    // Host de rótulo único ("Exemple", "servidor") só existe em rede interna,
    // e é o que sobra quando alguém cola um nome solto no campo de URL.
    if (!h.includes('.')) return true;
    return LOCAL_HOST_SUFFIXES.some((suffix) => h.endsWith(suffix));
  }

  function hasExecutableExtension(pathname) {
    const p = pathname.toLowerCase();
    return BLOCKED_EXTENSIONS.some((ext) => p.endsWith(ext));
  }

  function normalizeInput(raw) {
    const value = String(raw == null ? '' : raw).trim();
    if (!value) return '';
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
    return `https://${value}`;
  }

  const state = {
    blocklist: new Set(),
    blocked: []
  };

  function deny(reason, url, extra) {
    return Object.assign({
      ok: false,
      reason,
      message: MESSAGES[reason] || 'Endereço bloqueado.',
      url: url || null
    }, extra || {});
  }

  const VessieURLGuard = {
    REASONS,

    /** Hosts adicionais bloqueados manualmente pelo usuário. */
    blocklist() { return Array.from(state.blocklist); },
    blockHost(host) { if (host) state.blocklist.add(String(host).toLowerCase()); return this.blocklist(); },
    unblockHost(host) { state.blocklist.delete(String(host).toLowerCase()); return this.blocklist(); },

    /** Histórico das últimas rejeições, usado pelo painel de segurança. */
    rejections(limit = 50) { return state.blocked.slice(-limit); },
    clearRejections() { state.blocked = []; },

    isIPLiteral,
    ipClass,

    /**
     * @returns {{ok: boolean, url?: string, host?: string, reason?: string, message?: string}}
     */
    inspect(rawUrl) {
      const normalized = normalizeInput(rawUrl);
      if (!normalized) return deny(REASONS.INVALID, null);

      let parsed;
      try {
        parsed = new URL(normalized);
      } catch (e) {
        return deny(REASONS.INVALID, normalized);
      }

      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return deny(REASONS.PROTOCOL, normalized, { protocol: parsed.protocol });
      }
      if (parsed.username || parsed.password) {
        return deny(REASONS.CREDENTIALS, normalized, { host: parsed.hostname });
      }

      const host = parsed.hostname.toLowerCase();
      if (isIPLiteral(host)) {
        return deny(REASONS.IP_LITERAL, normalized, { host, ipClass: ipClass(host) });
      }
      if (isLocalHostname(host)) {
        return deny(REASONS.LOCAL_HOST, normalized, { host });
      }
      if (state.blocklist.has(host)) {
        return deny(REASONS.BLOCKLIST, normalized, { host });
      }
      if (!ALLOWED_PORTS.has(parsed.port)) {
        return deny(REASONS.PORT, normalized, { host, port: parsed.port });
      }
      if (hasExecutableExtension(parsed.pathname)) {
        return deny(REASONS.EXECUTABLE, normalized, { host });
      }

      // Downgrade evitado: tudo que passa é servido por https.
      if (parsed.protocol === 'http:') parsed.protocol = 'https:';
      parsed.hash = '';

      return { ok: true, url: parsed.href, host };
    },

    /** Atalho booleano. Registra a rejeição para o painel de segurança. */
    isAllowed(rawUrl) {
      const verdict = this.inspect(rawUrl);
      if (!verdict.ok) {
        state.blocked.push({ url: rawUrl, reason: verdict.reason, at: Date.now() });
        if (state.blocked.length > 500) state.blocked.shift();
      }
      return verdict.ok;
    },

    /** Retorna a URL normalizada ou null quando bloqueada. */
    sanitize(rawUrl) {
      const verdict = this.inspect(rawUrl);
      if (!verdict.ok) {
        state.blocked.push({ url: rawUrl, reason: verdict.reason, at: Date.now() });
        if (state.blocked.length > 500) state.blocked.shift();
        return null;
      }
      return verdict.url;
    },

    /**
     * Separa uma lista de jogos entre aprovados e bloqueados.
     * @param {Array<{url: string}>} games
     */
    partition(games) {
      const allowed = [];
      const blocked = [];
      for (const game of games || []) {
        const verdict = this.inspect(game && game.url);
        if (verdict.ok) allowed.push(Object.assign({}, game, { url: verdict.url }));
        else blocked.push(Object.assign({}, game, { blockedReason: verdict.reason, blockedMessage: verdict.message }));
      }
      return { allowed, blocked };
    }
  };

  return VessieURLGuard;
});
