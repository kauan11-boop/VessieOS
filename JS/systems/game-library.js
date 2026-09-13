/*!
 * VessieGameLibrary — biblioteca de jogos com seleção, limpeza e import/export.
 *
 * Concentra tudo que antes estava espalhado em JS/core/main.js:
 *   - normalização dos registros (id, name, url, icon, cover, source, health);
 *   - validação de segurança na entrada (nada em IP cru entra ou permanece);
 *   - seleção individual / em massa / invertida sobre o resultado filtrado;
 *   - exclusão em lote, limpeza dos jogos quebrados e varredura de segurança;
 *   - envio de novos jogos (manual ou importação de JSON).
 *
 * A persistência é injetável: no navegador usa localStorage, nos testes usa
 * um objeto em memória.
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  if (root) root.VessieGameLibrary = mod;
})(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function () {
  'use strict';

  const STORAGE_KEY = 'vessieos_steam_lib_v2';

  function memoryStorage() {
    const data = new Map();
    return {
      getItem: (k) => (data.has(k) ? data.get(k) : null),
      setItem: (k, v) => data.set(k, String(v))
    };
  }

  function newId() {
    return 'g_' + Math.random().toString(36).slice(2, 9);
  }

  function identity(url) {
    try {
      const parsed = new URL(url);
      return (parsed.hostname + parsed.pathname).toLowerCase().replace(/\/+$/, '');
    } catch (e) {
      return String(url || '').toLowerCase();
    }
  }

  class GameLibrary {
    constructor(options = {}) {
      this.guard = options.guard || (typeof VessieURLGuard !== 'undefined' ? VessieURLGuard : null);
      if (!this.guard) throw new Error('VessieGameLibrary exige VessieURLGuard');
      this.doctor = options.doctor || (typeof VessieIframeDoctor !== 'undefined' ? VessieIframeDoctor : null);
      this.storage = options.storage || (typeof localStorage !== 'undefined' ? localStorage : memoryStorage());
      this.key = options.key || STORAGE_KEY;
      this.games = [];
      this.selection = new Set();
      this.lastSecurityReport = null;
      this.listeners = [];
    }

    onChange(fn) { this.listeners.push(fn); return () => { this.listeners = this.listeners.filter((l) => l !== fn); }; }
    _emit() { this.listeners.forEach((fn) => { try { fn(this.games); } catch (e) { /* listener isolado */ } }); }

    /** Normaliza qualquer formato conhecido ({n,u,ic} ou completo). */
    normalize(raw) {
      if (!raw) return null;
      const url = raw.url || raw.u || '';
      const verdict = this.guard.inspect(url);
      if (!verdict.ok) return null;
      const icon = raw.icon || raw.ic || raw.cover || '';
      const safeIcon = icon ? this.guard.sanitize(icon) : '';
      return {
        id: raw.id || newId(),
        name: String(raw.name || raw.n || '').trim() || verdict.host,
        url: verdict.url,
        icon: safeIcon || '',
        cover: safeIcon || raw.cover || '',
        source: raw.source || verdict.host,
        added: raw.added || Date.now(),
        plays: raw.plays || 0,
        health: raw.health || null
      };
    }

    load(seed = []) {
      let stored = [];
      try {
        stored = JSON.parse(this.storage.getItem(this.key) || '[]');
      } catch (e) {
        stored = [];
      }
      const source = Array.isArray(stored) && stored.length ? stored : seed;
      this.games = this.dedupe(source.map((g) => this.normalize(g)).filter(Boolean));
      this.save();
      return this.games;
    }

    save() {
      try { this.storage.setItem(this.key, JSON.stringify(this.games)); } catch (e) { /* cota cheia */ }
      this._emit();
      return this.games;
    }

    dedupe(games) {
      const seen = new Set();
      const result = [];
      for (const game of games) {
        const key = identity(game.url);
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(game);
      }
      return result;
    }

    all() { return this.games.slice(); }
    get(id) { return this.games.find((g) => g.id === id) || null; }

    filter(query) {
      const q = String(query || '').trim().toLowerCase();
      if (!q) return this.all();
      return this.games.filter((g) => g.name.toLowerCase().includes(q) || g.url.toLowerCase().includes(q));
    }

    // ---- envio de jogos -----------------------------------------------
    /** @returns {{ok: boolean, game?: object, reason?: string, message?: string}} */
    add(raw) {
      const verdict = this.guard.inspect(raw && (raw.url || raw.u));
      if (!verdict.ok) return { ok: false, reason: verdict.reason, message: verdict.message };
      if (this.games.some((g) => identity(g.url) === identity(verdict.url))) {
        return { ok: false, reason: 'duplicado', message: 'Esse jogo já está na biblioteca.' };
      }
      const game = this.normalize(raw);
      if (!game) return { ok: false, reason: 'invalido', message: 'Registro inválido.' };
      this.games.unshift(game);
      this.save();
      return { ok: true, game };
    }

    addMany(list) {
      const added = [];
      const rejected = [];
      for (const raw of list || []) {
        const result = this.add(raw);
        if (result.ok) added.push(result.game);
        else rejected.push({ url: (raw && (raw.url || raw.u)) || '', reason: result.reason, message: result.message });
      }
      return { added, rejected };
    }

    remove(id) {
      const before = this.games.length;
      this.games = this.games.filter((g) => g.id !== id);
      this.selection.delete(id);
      this.save();
      return this.games.length < before;
    }

    // ---- seleção -------------------------------------------------------
    isSelected(id) { return this.selection.has(id); }
    selectedIds() { return Array.from(this.selection); }
    selectedCount() { return this.selection.size; }

    toggle(id) {
      if (this.selection.has(id)) this.selection.delete(id);
      else this.selection.add(id);
      return this.selection.has(id);
    }

    select(ids) { (ids || []).forEach((id) => this.selection.add(id)); return this.selectedCount(); }
    deselect(ids) { (ids || []).forEach((id) => this.selection.delete(id)); return this.selectedCount(); }
    selectAll(list) { (list || this.games).forEach((g) => this.selection.add(g.id)); return this.selectedCount(); }
    clearSelection() { this.selection.clear(); return 0; }

    invertSelection(list) {
      const scope = list || this.games;
      scope.forEach((g) => {
        if (this.selection.has(g.id)) this.selection.delete(g.id);
        else this.selection.add(g.id);
      });
      return this.selectedCount();
    }

    selectedGames() { return this.games.filter((g) => this.selection.has(g.id)); }

    /** Exclui tudo que está selecionado. */
    deleteSelected() {
      const ids = new Set(this.selection);
      const removed = this.games.filter((g) => ids.has(g.id));
      this.games = this.games.filter((g) => !ids.has(g.id));
      this.selection.clear();
      this.save();
      return removed;
    }

    // ---- limpeza -------------------------------------------------------
    /**
     * Re-aplica a política de segurança em toda a biblioteca. É o que remove
     * jogos "colados" apontando para IP cru (200.168.0.10 e afins).
     */
    securitySweep() {
      const removed = [];
      const kept = [];
      for (const game of this.games) {
        const verdict = this.guard.inspect(game.url);
        if (verdict.ok) kept.push(Object.assign({}, game, { url: verdict.url }));
        else removed.push(Object.assign({}, game, { blockedReason: verdict.reason, blockedMessage: verdict.message }));
      }
      this.games = kept;
      removed.forEach((g) => this.selection.delete(g.id));
      this.save();
      this.lastSecurityReport = { removed, at: Date.now() };
      return removed;
    }

    /** Grava o resultado do doctor em cada jogo. */
    applyHealth(results) {
      const byId = new Map((results || []).map((r) => [r.id || r.url, r]));
      this.games = this.games.map((game) => {
        const result = byId.get(game.id) || byId.get(game.url);
        if (!result) return game;
        return Object.assign({}, game, {
          health: { status: result.status, label: result.label, detail: result.detail, checkedAt: result.checkedAt }
        });
      });
      this.save();
      return this.games;
    }

    brokenGames() {
      const isBroken = this.doctor ? this.doctor.isBroken.bind(this.doctor) : (s) => ['blocked', 'error', 'timeout'].includes(s);
      return this.games.filter((g) => g.health && isBroken(g.health.status));
    }

    /** Remove os jogos marcados como quebrados pelo doctor. */
    deleteBroken() {
      const broken = this.brokenGames();
      const ids = new Set(broken.map((g) => g.id));
      this.games = this.games.filter((g) => !ids.has(g.id));
      ids.forEach((id) => this.selection.delete(id));
      this.save();
      return broken;
    }

    // ---- import/export -------------------------------------------------
    exportJSON(onlySelected = false) {
      const games = onlySelected ? this.selectedGames() : this.games;
      return JSON.stringify({
        format: 'vessieos-game-library',
        version: 2,
        exportedAt: new Date().toISOString(),
        count: games.length,
        games: games.map(({ id, name, url, icon, cover, source }) => ({ id, name, url, icon, cover, source }))
      }, null, 2);
    }

    /** Aceita o export acima ou um array cru; tudo passa pelo guard. */
    importJSON(text) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        return { added: [], rejected: [], error: 'JSON inválido' };
      }
      const list = Array.isArray(parsed) ? parsed : (parsed && parsed.games) || [];
      if (!Array.isArray(list)) return { added: [], rejected: [], error: 'Formato não reconhecido' };
      return this.addMany(list);
    }

    stats() {
      const health = { ok: 0, blocked: 0, error: 0, timeout: 0, unverified: 0, unchecked: 0 };
      for (const game of this.games) {
        const status = game.health && game.health.status;
        if (status && health[status] !== undefined) health[status]++;
        else health.unchecked++;
      }
      return {
        total: this.games.length,
        selected: this.selection.size,
        hosts: new Set(this.games.map((g) => { try { return new URL(g.url).hostname; } catch (e) { return ''; } })).size,
        health
      };
    }
  }

  return { GameLibrary, STORAGE_KEY, identity };
});
