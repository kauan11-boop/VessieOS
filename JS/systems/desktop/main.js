(function () {
  // Raiz do projeto derivada da URL deste próprio script
  const ROOT = new URL('../../../', document.currentScript.src).href;

  const scripts = [
    // Segurança e Game Hub v2 — precisam existir ANTES de core/main.js,
    // que consulta window.VessieURLGuard/VessieGameLibrary ao montar a Steam.
    'JS/kernel/security/url-guard.js',
    'JS/systems/game-patterns.js',
    'JS/systems/iframe-doctor.js',
    'JS/systems/game-library.js',
    'JS/systems/game-collector-v2.js',
    'JS/core/main.js',
    'JS/core/bootstrap.js',
    'JS/core/storage.js',
    'JS/core/theme.js',
    'JS/core/graphics.js',
    'JS/core/events.js',
    'JS/kernel/kernel.js',
    'JS/kernel/logging.js',
    'JS/kernel/registry.js',
    'JS/kernel/filesystem.js',
    'JS/kernel/process-manager.js',
    'JS/kernel/security.js',
    'JS/kernel/module-system.js',        // registrador de pipelines (window.VessieOS.moduleSystem) — não era carregado antes
    'JS/kernel/lm-studio-ai.js',         // LMStudioIntegration — exigido por ai-integration, nunca era carregado antes
    'JS/kernel/web-content-fetcher.js',  // WebContentFetcher — exigido por web-system-generator, nunca era carregado antes
    'JS/kernel/loader.js',
    'JS/kernel/monitor.js',
    'JS/modules/desktop-icons.js',
    'JS/modules/taskbar.js',
    'JS/modules/notifications.js',
    'JS/modules/windows.js',
    'JS/modules/apps.js',
    'JS/modules/execute-exes.js',
    'JS/kernel/modules/resources/lib/event-bus.js',
    'JS/kernel/modules/resources/lib/anti-fall.js',
    'JS/kernel/modules/graphics/engines/Vessie3DProEngine.js', // motor 3D unificado — antes nunca era carregado no boot
    'JS/systems/game-hub-collector.js',  // classe-base GameHubCollector — EnhancedGameHub quebrava sem isso
    'JS/kernel/modules/gamehub/index.js',
    'JS/kernel/modules/gamehub/lib/three-hook.js',
    'JS/kernel/modules/start-menu/index.js',
    'JS/kernel/modules/command-palette/index.js',
    'JS/kernel/modules/subsystem-manager/index.js',
    'JS/kernel/modules/ai-integration/index.js',
    'JS/kernel/modules/system-manager/index.js',
    'JS/kernel/modules/web-system-generator/index.js',
    'JS/kernel/modules/vessiecoin/index.js',
    'JS/kernel/modules/bsod-simulator/index.js',
    'JS/kernel/modules/adaptive-color/index.js'
  ];

  let idx = 0;

  function loadNext() {
    if (idx >= scripts.length) { syncModules(); return; }
    const script = document.createElement('script');
    script.src = ROOT + scripts[idx++];
    script.async = false;
    script.onload = loadNext;
    script.onerror = () => { console.error('[Loader] falhou:', script.src); loadNext(); };
    document.head.appendChild(script);
  }

  /**
   * Sincronização dos módulos: cada arquivo em JS/modules/ e
   * JS/kernel/modules/ que segue o padrão do projeto só se REGISTRA em
   * window.VessieOS.modules.<nome> = { init } — não se inicializa sozinho.
   * Até aqui nada chamava esse init() (exceto execute-exes.js, que se
   * auto-inicia por conta própria). Depois que o último script termina de
   * carregar, percorremos o registro e chamamos init() em cada módulo
   * exatamente uma vez, na ordem em que foram registrados.
   */
  function syncModules() {
    const registry = (window.VessieOS && window.VessieOS.modules) || {};
    Object.keys(registry).forEach((name) => {
      const mod = registry[name];
      if (!mod || mod._vosSynced || typeof mod.init !== 'function') return;
      try {
        mod.init();
        mod._vosSynced = true;
      } catch (error) {
        console.error(`[Loader] módulo "${name}" falhou ao sincronizar:`, error);
      }
    });
  }

  loadNext();
})();