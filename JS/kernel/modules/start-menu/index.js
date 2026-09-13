/**
 * VessieOS Kernel Module — Start Menu (Enhanced)
 *
 * O grid de apps do Menu Iniciar já é renderizado por JS/core/main.js
 * (evento "vessieos:startmenu-rendered"). Este módulo NÃO re-renderiza o
 * grid — ele apenas o observa e adiciona três recursos novos por cima:
 *
 *   1. Apps recentes  → popula #sm-recent (existia no HTML, mas nada o
 *      preenchia) ouvindo o evento "vessieos:app-opened".
 *   2. Navegação por teclado → setas para navegar no grid, Enter para
 *      abrir, Esc para fechar o menu.
 *   3. Fixar/desafixar apps → um alfinete aparece ao passar o mouse sobre
 *      cada app; apps fixados sobem para o topo do grid. Persistido em
 *      localStorage, então sobrevive a recarregamentos.
 *
 * Convenção do projeto: IIFE clássica + window.VessieOS.modules.*, para
 * poder ser carregado via <script> simples pelo boot loader
 * (JS/systems/desktop/main.js), sem precisar de bundler nem de
 * `type="module"`.
 */
(function () {
  const STORAGE_PINNED = 'vos-pinned-apps';
  const STORAGE_RECENT = 'vos-recent-apps';
  const MAX_RECENT = 6;

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* localStorage indisponível */ }
  }

  function injectStyles() {
    if (document.getElementById('sm-enhanced-style')) return;
    const style = document.createElement('style');
    style.id = 'sm-enhanced-style';
    style.textContent = `
      .sm-app{position:relative}
      .sm-app.sm-nav-active{outline:2px solid var(--a,#60a5fa);outline-offset:2px;border-radius:12px}
      .sm-pin-btn{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;
        border:none;background:rgba(0,0,0,.35);color:#fff;font-size:.65rem;display:flex;
        align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:.15s}
      .sm-app:hover .sm-pin-btn,.sm-app.sm-pinned .sm-pin-btn{opacity:1}
      .sm-app.sm-pinned .sm-pin-btn{color:#facc15}
      .sm-recent-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;
        border-radius:999px;background:rgba(255,255,255,.06);border:1px solid var(--border,rgba(255,255,255,.1));
        cursor:pointer;font-size:.8rem;transition:.15s}
      .sm-recent-chip:hover{background:rgba(255,255,255,.12)}
    `;
    document.head.appendChild(style);
  }

  function getPinned() {
    return new Set(readJSON(STORAGE_PINNED, []));
  }

  function togglePin(appId) {
    const pinned = getPinned();
    if (pinned.has(appId)) pinned.delete(appId); else pinned.add(appId);
    writeJSON(STORAGE_PINNED, [...pinned]);
    return pinned;
  }

  /**
   * Reordena o grid existente (não recria os elementos, só reordena os já
   * renderizados por renderStartMenu) colocando os fixados primeiro, e
   * adiciona o botão de alfinete em cada card.
   */
  function applyPinningAndButtons() {
    const grid = document.getElementById('sm-grid');
    if (!grid) return;
    const pinned = getPinned();
    const cards = Array.from(grid.querySelectorAll('.sm-app'));
    if (!cards.length) return;

    cards.forEach((card) => {
      const appId = card.dataset.appId;
      if (!appId) return;

      card.classList.toggle('sm-pinned', pinned.has(appId));

      if (!card.querySelector('.sm-pin-btn')) {
        const pinBtn = document.createElement('button');
        pinBtn.className = 'sm-pin-btn';
        pinBtn.type = 'button';
        pinBtn.innerHTML = '<i class="fas fa-thumbtack"></i>';
        pinBtn.title = 'Fixar / desafixar';
        pinBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const nowPinned = togglePin(appId);
          card.classList.toggle('sm-pinned', nowPinned.has(appId));
          reorderGrid();
        });
        card.appendChild(pinBtn);
      }
    });

    reorderGrid();
  }

  function reorderGrid() {
    const grid = document.getElementById('sm-grid');
    if (!grid) return;
    const pinned = getPinned();
    const cards = Array.from(grid.querySelectorAll('.sm-app'));
    cards
      .sort((a, b) => {
        const aPinned = pinned.has(a.dataset.appId) ? 0 : 1;
        const bPinned = pinned.has(b.dataset.appId) ? 0 : 1;
        return aPinned - bPinned;
      })
      .forEach((card) => grid.appendChild(card));
  }

  /**
   * Apps recentes: escuta "vessieos:app-opened" (disparado por
   * JS/core/main.js toda vez que openApp() roda) e mantém uma lista
   * persistida das últimas aberturas.
   */
  function recordRecent(appId) {
    if (!appId) return;
    let recent = readJSON(STORAGE_RECENT, []);
    recent = [appId, ...recent.filter((id) => id !== appId)].slice(0, MAX_RECENT);
    writeJSON(STORAGE_RECENT, recent);
    renderRecent();
  }

  function renderRecent() {
    const box = document.getElementById('sm-recent');
    if (!box) return;
    const recent = readJSON(STORAGE_RECENT, []);
    const apps = window.APPS || [];

    if (!recent.length || !apps.length) {
      box.innerHTML = '<span>Nenhum app recente</span>';
      return;
    }

    box.innerHTML = '';
    recent.forEach((appId) => {
      const app = apps.find((a) => a.id === appId);
      if (!app) return;
      const chip = document.createElement('div');
      chip.className = 'sm-recent-chip';
      chip.innerHTML = `<span>${app.ic}</span><span>${app.n}</span>`;
      chip.addEventListener('click', () => {
        if (typeof window.openApp === 'function') window.openApp(app.id);
        const sm = document.getElementById('sm');
        if (sm) sm.style.display = 'none';
      });
      box.appendChild(chip);
    });
  }

  /**
   * Navegação por teclado dentro do grid de apps: setas movem a seleção,
   * Enter abre o app selecionado, Esc fecha o menu. Não interfere com o
   * campo de busca (#sm-q), que já tem seu próprio onkeydown em main.js —
   * aqui só reage quando o foco não está sendo usado para digitar texto.
   */
  function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      const sm = document.getElementById('sm');
      if (!sm || sm.style.display !== 'block') return;

      const grid = document.getElementById('sm-grid');
      if (!grid) return;
      const visible = Array.from(grid.querySelectorAll('.sm-app:not(.hidden)'));
      if (!visible.length) return;

      const activeEl = grid.querySelector('.sm-nav-active');
      let idx = visible.indexOf(activeEl);

      if (e.key === 'Escape') {
        sm.style.display = 'none';
        return;
      }

      const isArrow = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key);
      if (!isArrow && e.key !== 'Enter') return;

      // Estima quantas colunas o grid tem, para as setas cima/baixo pularem de linha corretamente
      const gridStyle = window.getComputedStyle(grid);
      const cols = gridStyle.gridTemplateColumns ? gridStyle.gridTemplateColumns.split(' ').length : 4;

      if (e.key === 'Enter' && activeEl) {
        e.preventDefault();
        const appId = activeEl.dataset.appId;
        if (appId && typeof window.openApp === 'function') window.openApp(appId);
        sm.style.display = 'none';
        return;
      }

      if (!isArrow) return;
      e.preventDefault();

      if (idx === -1) { idx = 0; }
      else if (e.key === 'ArrowRight') idx = Math.min(idx + 1, visible.length - 1);
      else if (e.key === 'ArrowLeft') idx = Math.max(idx - 1, 0);
      else if (e.key === 'ArrowDown') idx = Math.min(idx + cols, visible.length - 1);
      else if (e.key === 'ArrowUp') idx = Math.max(idx - cols, 0);

      if (activeEl) activeEl.classList.remove('sm-nav-active');
      visible[idx].classList.add('sm-nav-active');
      visible[idx].scrollIntoView({ block: 'nearest' });
    });

    // Limpa a seleção visual sempre que o menu fecha/reabre, pra não ficar preso num item antigo
    document.addEventListener('click', (e) => {
      const trigger = document.getElementById('tb-start');
      if (e.target === trigger) {
        const active = document.querySelector('#sm-grid .sm-nav-active');
        if (active) active.classList.remove('sm-nav-active');
      }
    });
  }

  function init() {
    injectStyles();
    setupKeyboardNav();

    // O grid pode já existir (reinicializações) ou ainda não (primeiro boot,
    // antes do login) — cobre os dois casos.
    if (document.getElementById('sm-grid') && document.getElementById('sm-grid').children.length) {
      applyPinningAndButtons();
      renderRecent();
    }
    document.addEventListener('vessieos:startmenu-rendered', () => {
      applyPinningAndButtons();
      renderRecent();
    });
    document.addEventListener('vessieos:app-opened', (e) => {
      recordRecent(e.detail && e.detail.id);
    });
  }

  window.VessieOS = window.VessieOS || {};
  window.VessieOS.modules = window.VessieOS.modules || {};
  window.VessieOS.modules.startMenu = { init };
})();
