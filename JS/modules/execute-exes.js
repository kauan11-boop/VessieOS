(function () {
  const appName = 'Execute Exes';
  const catalog = [
    { id: 'calc', name: 'Calculator.exe', path: 'C:/System32/Calculator.exe', icon: '🧮', type: 'native', memory: 48, description: 'Calculadora do sistema', owner: 'system' },
    { id: 'cmd', name: 'Command Prompt.exe', path: 'C:/Windows/System32/cmd.exe', icon: '💻', type: 'console', memory: 64, description: 'Prompt de comandos', owner: 'user' },
    { id: 'notepad', name: 'Notepad.exe', path: 'C:/Windows/System32/notepad.exe', icon: '📝', type: 'editor', memory: 52, description: 'Bloco de notas do Windows', owner: 'user' },
    { id: 'taskmgr', name: 'Task Manager.exe', path: 'C:/Windows/System32/taskmgr.exe', icon: '📊', type: 'monitor', memory: 96, description: 'Gerenciador de tarefas', owner: 'system' }
  ];

  function ensureKernel() {
    if (!window.VessieOS || !window.VessieOS.kernel) {
      return false;
    }
    return true;
  }

  function ensureDesktopIcon() {
    const area = document.getElementById('icons-area');
    if (area && !document.querySelector('[data-app="execute-exes"]')) {
      const icon = document.createElement('div');
      icon.className = 'di';
      icon.dataset.app = 'execute-exes';
      icon.innerHTML = `
        <div class="ic" title="${appName}">💼</div>
        <div class="label">${appName}</div>
      `;
      icon.addEventListener('dblclick', openWindow);
      area.appendChild(icon);
    }
    ensureStartMenuEntry();
  }

  // O grid do Menu Iniciar (#sm-grid) é limpo e reconstruído do zero por
  // JS/core/main.js sempre que o usuário faz login (renderStartMenu ->
  // grid.innerHTML = ''), o que apagava esta entrada. Reagimos ao evento
  // "vessieos:startmenu-rendered" (disparado por main.js) para reinserir o
  // item toda vez que isso acontece, e não só uma vez no boot.
  function ensureStartMenuEntry() {
    const startMenu = document.getElementById('sm-grid');
    if (!startMenu || startMenu.querySelector('[data-app-id="execute-exes"]')) return;
    const item = document.createElement('div');
    item.className = 'sm-app';
    item.dataset.appId = 'execute-exes';
    item.innerHTML = '<div class="ai">💼</div><span>Execute Exes</span>';
    item.addEventListener('click', () => {
      openWindow();
      const sm = document.getElementById('sm');
      if (sm) sm.style.display = 'none';
    });
    startMenu.appendChild(item);
  }

  function openWindow() {
    let windowEl = document.getElementById('execute-exes-window');
    if (!windowEl) {
      const desktop = document.getElementById('desktop');
      if (!desktop) return;

      windowEl = document.createElement('div');
      windowEl.id = 'execute-exes-window';
      windowEl.className = 'window execute-exes-window';
      windowEl.style.left = '18vw';
      windowEl.style.top = '12vh';
      windowEl.style.width = 'min(860px, 78vw)';
      windowEl.style.height = 'min(620px, 72vh)';
      windowEl.innerHTML = `
        <div class="window-header">
          <div class="window-controls">
            <span class="close"></span>
            <span class="min"></span>
            <span class="max"></span>
          </div>
          <div class="window-title">Execute Exes</div>
          <div style="width:72px"></div>
        </div>
        <div class="window-body execute-exes-body">
          <div class="execute-exes-sidebar">
            <div class="execute-exes-header-row">
              <strong>Executáveis</strong>
              <button class="execute-exes-button" id="execute-exes-refresh">Atualizar</button>
            </div>
            <div id="execute-exes-list" class="execute-exes-list"></div>
          </div>
          <div class="execute-exes-panel">
            <div class="execute-exes-card">
              <div class="execute-exes-card-head">
                <span id="selected-exe-icon">💼</span>
                <div>
                  <h3 id="selected-exe-name">Calculator.exe</h3>
                  <small id="selected-exe-path">C:/System32/Calculator.exe</small>
                </div>
              </div>
              <p id="selected-exe-description">Calculadora do sistema</p>
              <div class="execute-exes-actions">
                <button id="execute-exe-launch" class="execute-exes-button primary">Executar</button>
                <button id="execute-exe-kernel" class="execute-exes-button">Kernel</button>
              </div>
            </div>

            <div class="execute-exes-metrics">
              <div class="metric-box">
                <label>PID</label>
                <strong id="metric-pid">-</strong>
              </div>
              <div class="metric-box">
                <label>Memória</label>
                <strong id="metric-memory">0 MB</strong>
              </div>
              <div class="metric-box">
                <label>Estado</label>
                <strong id="metric-state">idle</strong>
              </div>
            </div>

            <div class="execute-exes-log-box">
              <div class="execute-exes-log-header">
                <strong>Kernel logs</strong>
                <button class="execute-exes-button tiny" id="execute-exes-clear-log">Limpar</button>
              </div>
              <div id="execute-exes-log" class="execute-exes-log"></div>
            </div>
          </div>
        </div>
      `;

      desktop.appendChild(windowEl);
      bindWindowActions(windowEl);
    }

    windowEl.style.display = 'block';
    renderList();
    updateKernelInfo();
  }

  function bindWindowActions(windowEl) {
    const closeButton = windowEl.querySelector('.close');
    if (closeButton) {
      closeButton.addEventListener('click', () => { windowEl.style.display = 'none'; });
    }

    const launchButton = document.getElementById('execute-exe-launch');
    const kernelButton = document.getElementById('execute-exe-kernel');
    const refreshButton = document.getElementById('execute-exes-refresh');
    const clearLogButton = document.getElementById('execute-exes-clear-log');

    if (launchButton) {
      launchButton.addEventListener('click', () => {
        const selected = getSelectedExecutable();
        if (!selected) return;
        launchExecutable(selected);
      });
    }

    if (kernelButton) {
      kernelButton.addEventListener('click', () => {
        updateKernelInfo();
      });
    }

    if (refreshButton) {
      refreshButton.addEventListener('click', () => {
        renderList();
        updateKernelInfo();
      });
    }

    if (clearLogButton) {
      clearLogButton.addEventListener('click', () => {
        const kernel = window.VessieOS && window.VessieOS.kernel;
        if (kernel) kernel.logs = [];
        renderLogs();
      });
    }
  }

  function getSelectedExecutable() {
    const selected = document.querySelector('.exe-item.active');
    if (!selected) return catalog[0];
    const id = selected.dataset.exeId;
    return catalog.find((item) => item.id === id) || catalog[0];
  }

  function renderList() {
    const list = document.getElementById('execute-exes-list');
    if (!list) return;

    list.innerHTML = catalog.map((item, index) => `
      <button class="exe-item ${index === 0 ? 'active' : ''}" data-exe-id="${item.id}">
        <span>${item.icon}</span>
        <div>
          <strong>${item.name}</strong>
          <small>${item.type}</small>
        </div>
      </button>
    `).join('');

    list.querySelectorAll('.exe-item').forEach((button) => {
      button.addEventListener('click', () => {
        list.querySelectorAll('.exe-item').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        const exe = catalog.find((entry) => entry.id === button.dataset.exeId) || catalog[0];
        updateSelectedInfo(exe);
      });
    });

    const first = catalog[0];
    if (first) updateSelectedInfo(first);
  }

  function updateSelectedInfo(exe) {
    const label = document.getElementById('selected-exe-name');
    const path = document.getElementById('selected-exe-path');
    const description = document.getElementById('selected-exe-description');
    const icon = document.getElementById('selected-exe-icon');

    if (label) label.textContent = exe.name;
    if (path) path.textContent = exe.path;
    if (description) description.textContent = exe.description;
    if (icon) icon.textContent = exe.icon;
  }

  function launchExecutable(executable) {
    const kernel = window.VessieOS && window.VessieOS.kernel;
    if (!kernel) {
      alert('Kernel do VessieOS indisponível.');
      return;
    }

    const process = kernel.createProcess({
      name: executable.name,
      path: executable.path,
      memory: executable.memory || 48,
      owner: executable.owner || 'user',
      state: 'running',
      cpu: 4,
      metadata: {
        type: executable.type,
        launchedFrom: 'Execute Exes',
        signed: true
      }
    });

    const log = document.getElementById('execute-exes-log');
    if (log) {
      const entry = document.createElement('div');
      entry.className = 'execute-log-entry';
      entry.textContent = `[${new Date().toLocaleTimeString('pt-BR')}] ${executable.name} -> PID ${process.pid}`;
      log.prepend(entry);
    }

    updateKernelInfo();
    kernel.log('info', `${executable.name} foi executado pelo Execute Exes.`, 'ExecuteExes');
    renderLogs();
  }

  function renderLogs() {
    const log = document.getElementById('execute-exes-log');
    if (!log) return;
    const kernel = window.VessieOS && window.VessieOS.kernel;
    const entries = kernel ? kernel.logs.slice(0, 14) : [];
    log.innerHTML = entries.map((entry) => `
      <div class="execute-log-entry ${entry.level || 'info'}">
        <span class="log-tag">${entry.level || 'info'}</span>
        <span>${entry.message}</span>
      </div>
    `).join('');
  }

  function updateKernelInfo() {
    const kernel = window.VessieOS && window.VessieOS.kernel;
    const pid = document.getElementById('metric-pid');
    const memory = document.getElementById('metric-memory');
    const state = document.getElementById('metric-state');

    if (!kernel) {
      if (pid) pid.textContent = 'n/a';
      if (memory) memory.textContent = '0 MB';
      if (state) state.textContent = 'offline';
      return;
    }

    const first = kernel.listProcesses()[0] || null;
    if (pid) pid.textContent = first ? String(first.pid) : '0';
    if (memory) memory.textContent = `${kernel.memory.used || 0} MB`;
    if (state) state.textContent = first ? first.state : 'idle';

    renderLogs();
  }

  function init() {
    if (window.VessieOS && window.VessieOS.kernel && typeof window.VessieOS.kernel.boot === 'function') {
      if (!window.VessieOS.kernel.booted) {
        window.VessieOS.kernel.booted = true;
        window.VessieOS.kernel.boot();
      }
    }

    if (window.VessieOS && window.VessieOS.Registry && typeof window.VessieOS.Registry.register === 'function') {
      window.VessieOS.Registry.register('app.execute-exes', {
        name: appName,
        type: 'desktop-app',
        description: 'Executor virtual de aplicativos Windows em ambiente web.',
        load: openWindow
      });
    }

    ensureKernel();
    ensureDesktopIcon();
    renderLogs();
    updateKernelInfo();

    document.addEventListener('vessieos:startmenu-rendered', ensureStartMenuEntry);
  }

  window.VessieOS = window.VessieOS || {};
  window.VessieOS.modules = window.VessieOS.modules || {};
  window.VessieOS.modules.executeExes = { init, open: openWindow, launchExecutable };
  window.VessieOS.ExecuteExes = {
    catalog,
    open: openWindow,
    launchExecutable,
    getSelectedExecutable,
    init
  };

  document.addEventListener('DOMContentLoaded', init);
})();
