
(function () {
  "use strict";

  const CORRECT_PASSWORD = 'EO123';
  let GAMES = [];

  const EXTRA_STYLE = document.createElement('style');
  EXTRA_STYLE.textContent = `
  #eg.horror{display:flex!important;flex-direction:column;justify-content:center;align-items:center;background:radial-gradient(circle at center,#000 0%,#040404 40%,#000 100%);color:#fff;text-shadow:0 0 18px rgba(255,255,255,.35);font-family:Segoe UI,Arial,sans-serif;z-index:9999}
  #eg.horror .horror-title{font-size:2.15rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
  #eg.horror .horror-sub{font-size:1rem;color:#ff6b6b;margin-top:8px}
  .di img{width:100%;height:100%;object-fit:cover;border-radius:14px}
  .di[data-sz="small"]{width:74px;padding:6px 4px}
  .di[data-sz="small"] .ic{width:44px;height:44px;border-radius:12px}
  .di[data-sz="large"]{width:120px;padding:14px 8px}
  .di[data-sz="large"] .ic{width:82px;height:82px;border-radius:18px}
  .wall-tab{display:inline-flex;align-items:center;gap:8px;padding:7px 10px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.06);color:var(--dim);cursor:pointer;margin-right:8px;margin-bottom:8px}
  .wall-tab.active{background:rgba(96,165,250,.18);color:white;border-color:rgba(96,165,250,.35)}
  .wg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .wt{display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);cursor:pointer;transition:.16s var(--ease),background .16s var(--ease),border-color .16s var(--ease),transform .16s var(--ease)}
  .wt:hover{transform:translateY(-3px);background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.18)}
  .wt-preview{height:100px;border-radius:14px;background-size:cover;background-position:center;border:1px solid rgba(255,255,255,.08);background-repeat:no-repeat;overflow:hidden;position:relative;}
  .wt-cat{font-size:.68rem;color:var(--dim);text-align:center;margin-top:2px}
  .ia-save-button{display:inline-flex;align-items:center;gap:10px;padding:14px 20px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:linear-gradient(135deg,var(--a),var(--a2));color:#fff;font-weight:700;transition:.18s var(--ease);box-shadow:0 16px 40px rgba(96,165,250,.22);outline:none}
  .ia-save-button:hover{transform:translateY(-1px);box-shadow:0 18px 44px rgba(96,165,250,.3)}
  .ia-save-button:focus{outline:2px solid rgba(255,255,255,.35);outline-offset:2px}
  .wt-name{font-size:.78rem;color:var(--text-2);text-align:center;line-height:1.35;min-height:38px}
  .wt.ac{border-color:var(--a);box-shadow:0 0 0 2px var(--acc-glow)}
  .wall-preview{margin-top:16px;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);position:relative;min-height:220px}
  .wall-preview .wp-info{padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:8px;background:rgba(0,0,0,.15);border-bottom:1px solid rgba(255,255,255,.08);color:var(--text);font-size:.84rem}
  .wall-preview-inner{position:relative;width:100%;height:260px;overflow:hidden;background:#10131f}
  .wall-preview-inner img,.wall-preview-inner video,.wall-preview-inner iframe{position:absolute;top:50%;left:50%;width:100%;height:100%;transform:translate(-50%,-50%);object-fit:cover;min-width:100%;min-height:100%;border:none}
  .wall-preview-empty{padding:22px;color:var(--dim);font-size:.9rem;line-height:1.5}
  #desktop-media-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:-1}
  #desktop-media-bg video,#desktop-media-bg iframe{position:absolute;top:50%;left:50%;width:100%;height:100%;transform:translate(-50%,-50%);object-fit:cover;min-width:100%;min-height:100%;border:none;pointer-events:none}
  .fem-body{display:flex;gap:12px;align-items:flex-start}
  .fem-body .fgrid{flex:1;}
  .feprev{width:320px;min-width:240px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:12px;max-height:calc(100% - 20px);overflow:hidden}
  .feprev h4{margin:0;font-size:.95rem;color:#fff}
  .feprev .fp-media{flex:1;min-height:160px;overflow:hidden;border-radius:14px;background:#0c0f17;display:flex;align-items:center;justify-content:center}
  .feprev .fp-media img,.feprev .fp-media video,.feprev .fp-media iframe{width:100%;height:100%;object-fit:contain}
  .feprev textarea{width:100%;height:180px;background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.08);border-radius:12px;color:#fff;padding:10px;resize:none;font-family:Consolas,monospace;outline:none}
  .feprev .fp-meta{display:flex;flex-direction:column;gap:6px;color:var(--dim);font-size:.82rem}
  .feprev .fp-actions{display:flex;gap:8px;flex-wrap:wrap}

  .wt.ac .wt-name{color:white;font-weight:600}
  .vc-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px;margin-top:10px}
  .mc-tracklist{margin-top:14px;display:grid;gap:8px;max-height:140px;overflow:auto}
  .mc-track{padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.04);display:flex;justify-content:space-between;align-items:center;cursor:pointer;color:var(--dim)}
  .mc-track.active{background:rgba(96,165,250,.2);color:white}
`;
  document.head.appendChild(EXTRA_STYLE);

  const PLANOS_CONTENT = ``;

  const S = {
    user: 'Avançado',
    apiKey: '',
    aiProvider: 'lmstudio',
    aiModel: 'gpt-4o-mini',
    aiEndpoint: '',
    aiCustomEndpoint: '',
    wallpaper: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    desktopIconSize: 'medium',
    cursorSize: 1,
    wallpapers: [],
    wins: [],
    nextZ: 100,
    unlocked: true,
    chatHistory: [],
    volume: 70,
    darkMode: true,
    sounds: true,
    vocabulary: [],
    gameTemplates: [],
    iconScale: 1,
    notifications: [],
    fs: {
      Desktop: {},
      Documentos: { 'Bem-vindo.txt': 'Olá! Bem-vindo ao VessieOS 💜\n\nEste é seu espaço pessoal.', 'Leia-me.txt': 'VessieOS v3.0\n\nFeatures:\n• IA Vessie integrada\n• Dashboard completo\n• Game Hub com ' + GAMES.length + ' jogos\n• Terminal\n• Bloco de notas\n• Calculadora\n• Explorador de arquivos\n• Player de música', 'Planos.md': PLANOS_CONTENT || '(Arquivo Planos.md vazio. Adicione texto em planos.md para aparecer aqui.)' },
      Downloads: {},
      Imagens: { 'foto1.png': null, 'foto2.png': null },
      Videos: {},
      Sistema: { 'Windows': { 'System32': {}, 'WinSxS': {} }, 'Usuários': {} }
    },
    currentPath: 'Desktop',
    selectedFiles: [],
    taskbarWindows: [],
    musPlaying: false,
    musTrack: 0,
    musProg: 0,
    musTimer: null
  };

  const Kernel = (() => {
    const listeners = new Map();
    const services = new Map();
    const modules = new Map();
    const queue = [];
    let busy = false;

    const eventBus = {
      on(event, handler) {
        if (typeof handler !== 'function') return () => { };
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(handler);
        return () => this.off(event, handler);
      },
      once(event, handler) {
        if (typeof handler !== 'function') return () => { };
        const wrapper = (payload) => { this.off(event, wrapper); handler(payload); };
        return this.on(event, wrapper);
      },
      off(event, handler) {
        const set = listeners.get(event);
        if (!set) return;
        set.delete(handler);
        if (!set.size) listeners.delete(event);
      },
      emit(event, detail) {
        const set = listeners.get(event);
        if (!set) return;
        for (const handler of Array.from(set)) {
          try { handler({ event, detail }); } catch (err) { console.warn('EventBus error', event, err); }
        }
      },
      emitAsync(event, detail) {
        setTimeout(() => eventBus.emit(event, detail), 0);
      }
    };

    return {
      eventBus,
      registerService(name, service) { if (!name) return null; services.set(name, service); return service; },
      getService(name) { return services.get(name); },
      registerModule(name, module) { if (!name) return null; modules.set(name, module); return module; },
      getModule(name) { return modules.get(name); },
      schedule(task, priority = 0) {
        if (typeof task !== 'function') return;
        queue.push({ task, priority });
        queue.sort((a, b) => b.priority - a.priority);
        if (busy) return;
        busy = true;
        requestAnimationFrame(() => {
          while (queue.length) { const item = queue.shift(); try { item.task(); } catch (err) { console.error('Kernel scheduler', err); } }
          busy = false;
        });
      },
      start() { this.eventBus.emit('kernel:ready'); return this; }
    };
  })();

  const ServiceLocator = {
    register(name, service) { return Kernel.registerService(name, service); },
    resolve(name) { return Kernel.getService(name); }
  };

  const CoreSystem = {
    name: 'VessieOS Core',
    version: '3.0',
    started: performance.now(),
    subsystems: new Map(),
    register(name, subsystem) { if (!name || !subsystem) return null; this.subsystems.set(name, subsystem); if (typeof subsystem.init === 'function') subsystem.init(); return subsystem; },
    get(name) { return this.subsystems.get(name); },
    info() { return { name: this.name, version: this.version, uptime: `${Math.round((performance.now() - this.started) / 1000)}s`, subsystems: [...this.subsystems.keys()] }; },
    boot() { this.register('Kernel', Kernel); this.register('ServiceLocator', ServiceLocator); return this; }
  };

  const Framework = {
    components: new Map(),
    registerComponent(name, component) { if (!name || !component) return null; this.components.set(name, component); if (typeof component.init === 'function') component.init(); return component; },
    getComponent(name) { return this.components.get(name); },
    bootstrap() { this.components.forEach(component => { if (typeof component.bootstrap === 'function') component.bootstrap(); }); return this; }
  };

  const GraphicsEngine = {
    layers: new Map(),
    registerLayer(name, callback) { if (!name || typeof callback !== 'function') return null; this.layers.set(name, callback); return this; },
    render() { this.layers.forEach(cb => cb()); },
    applyBackground(url) { const desk = document.getElementById('desktop'); if (desk) desk.style.backgroundImage = `url('${url}')`; return this; },
    applyStyle(vars) { if (!vars) return this; Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v)); return this; }
  };

  const ThemeManager = {
    themes: new Map(),
    current: 'VessieOS',
    register(name, vars) { if (!name || !vars) return this; this.themes.set(name, vars); return this; },
    apply(name) { const vars = this.themes.get(name); if (!vars) return false; Object.entries(vars).forEach(([key, val]) => document.documentElement.style.setProperty(key, val)); this.current = name; try { localStorage.setItem('vos-theme', JSON.stringify({ name, vars })); } catch (_) { } return true; },
    init() { try { const stored = JSON.parse(localStorage.getItem('vos-theme') || 'null'); if (stored?.name && stored?.vars) this.register(stored.name, stored.vars); if (stored?.name) this.apply(stored.name); } catch (_) { } }
  };

  const VariantManager = {
    variants: new Map(),
    register(name, config) { if (!name || !config) return this; this.variants.set(name, config); return this; },
    get(name) { return this.variants.get(name); },
    apply(name) { const config = this.get(name); if (!config) return false; if (config.styles) GraphicsEngine.applyStyle(config.styles); if (config.background) GraphicsEngine.applyBackground(config.background); if (config.theme) ThemeManager.apply(config.theme); return true; }
  };

  const LibraryManager = {
    libraries: [
      { name: 'Tailwind CSS', selected: true, category: 'UI', description: 'Utility-first styling core' },
      { name: 'Bootstrap', selected: true, category: 'UI', description: 'Grid, components, responsive utilities' },
      { name: 'Pico CSS', selected: true, category: 'UI', description: 'Minimal CSS framework' },
      { name: 'Bulma', selected: true, category: 'UI', description: 'Flexbox-based layout system' },
      { name: 'DaisyUI', selected: true, category: 'UI', description: 'Tailwind component library' },
      { name: 'Three.js', selected: true, category: 'Graphics', description: 'WebGL 3D rendering engine' },
      { name: 'babylonjs', selected: true, category: 'Graphics', description: 'High-performance 3D game engine' },
      { name: 'React', selected: false, category: 'UI', description: 'Component-based UI framework' },
      { name: 'Vue', selected: false, category: 'UI', description: 'Reactive template framework' },
      { name: 'Svelte', selected: false, category: 'UI', description: 'Compiler optimized interface framework' },
      { name: 'Alpine.js', selected: false, category: 'UI', description: 'Tiny reactive behaviour' },
      { name: 'GSAP', selected: false, category: 'Graphics', description: 'High-performance animations' },
      { name: 'PixiJS', selected: false, category: 'Graphics', description: '2D WebGL renderer' },
      { name: 'Phaser', selected: false, category: 'Games', description: 'HTML5 game development framework' },
      { name: 'PlayCanvas', selected: false, category: 'Games', description: 'WebGL game engine platform' },
      { name: 'Matter.js', selected: false, category: 'Physics', description: '2D rigid body physics' },
      { name: 'Cannon.js', selected: false, category: 'Physics', description: '3D physics simulation' },
      { name: 'Howler.js', selected: false, category: 'Audio', description: 'Cross-browser sound API' },
      { name: 'Tone.js', selected: false, category: 'Audio', description: 'Interactive audio synthesis' },
      { name: 'Lodash', selected: false, category: 'Utility', description: 'Performance utility helpers' },
      { name: 'Day.js', selected: false, category: 'Utility', description: 'Small date utility library' },
      { name: 'Axios', selected: false, category: 'Network', description: 'HTTP request helper' },
      { name: 'Socket.IO', selected: false, category: 'Network', description: 'Realtime web socket communication' },
      { name: 'Dexie', selected: false, category: 'Storage', description: 'IndexedDB wrapper for local cache' },
      { name: 'Hammer.js', selected: false, category: 'Input', description: 'Touch gestures for mobile controls' },
      { name: 'Zustand', selected: false, category: 'State', description: 'Minimal state management' },
      { name: 'RxJS', selected: false, category: 'State', description: 'Reactive streams and observables' },
      { name: 'SWR', selected: false, category: 'Data', description: 'Data fetching cache layer' },
      { name: 'Framer Motion', selected: false, category: 'Graphics', description: 'Motion animations for UI' }
    ],
    getSelected() { return this.libraries.filter(lib => lib.selected); },
    getAvailable() { return this.libraries; },
    toggle(name) { const lib = this.libraries.find(x => x.name === name); if (!lib) return null; lib.selected = !lib.selected; Kernel.eventBus.emit('library:changed', { name: lib.name, selected: lib.selected }); return lib; },
    describe() { return this.getSelected().map(lib => `${lib.name}: ${lib.description}`); },
    init() { console.log('LibraryManager init:', this.getSelected().length, 'selected'); }
  };

  const SandboxManager = {
    secureIframeAttributes: 'allowfullscreen;autoplay;gamepad;microphone;camera;clipboard-read;clipboard-write',
    attach(iframe) { if (!iframe) return iframe; iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals'); iframe.setAttribute('allow', this.secureIframeAttributes); iframe.setAttribute('loading', 'lazy'); iframe.setAttribute('referrerpolicy', 'no-referrer'); iframe.style.backgroundColor = '#0b1220'; iframe.style.filter = 'drop-shadow(0 0 20px rgba(0,0,0,.45))'; return iframe; },
    safeUrl(url) { try { const parsed = new URL(url); if (parsed.protocol === 'http:') parsed.protocol = 'https:'; return parsed.href; } catch (e) { return url; } }
  };

  const GameEngine = {
    state: { activeGames: 0, frames: 0, optimizations: [] },
    modules: new Map(),
    init() { Kernel.eventBus.on('game:launch', ({ detail }) => { if (detail?.iframe) this.optimizeGameFrame(detail.iframe); }); },
    registerModule(name, module) { if (!name || !module) return null; this.modules.set(name, module); if (typeof module.init === 'function') module.init(); return module; },
    getModule(name) { return this.modules.get(name); },
    optimizeGameFrame(iframe) { if (!iframe) return null; VessieGameRuntime.optimizeGameFrame(iframe); iframe.dataset.secure = 'true'; this.state.optimizations.push('vessie-runtime'); return iframe; },
    launch(url, title) { const safeUrl = SandboxManager.safeUrl(url); const frame = createWin(title || 'Jogo Web', '<i class="fab fa-steam"></i>', `<iframe src="${safeUrl}" style="border:none;width:100%;height:100%" allow="fullscreen;autoplay" title="${title || 'Jogo'}"></iframe>`, 920, 640); const iframe = frame.querySelector('iframe'); this.optimizeGameFrame(iframe); this.state.activeGames++; Kernel.eventBus.emit('game:launched', { url: safeUrl, title, iframe }); return frame; }
  };

  const GameOptimizer = {
    improvements: [
      'sandboxed-iframe', 'secure-referrer', 'lazy-loading', 'preload-hints', 'selective-cors', 'gamepad-support', 'audio-priority', 'fps-stabilizer', 'render-layering', 'cache-boost', 'memory-fence', 'minimap-layer', 'input-debounce', 'animation-throttling', 'shader-fallback', 'gpu-hinting', 'network-budget', 'asset-prefetch', 'error-guard', 'safe-mode'
    ],
    apply(iframe) { if (!iframe) return; iframe.dataset.optimized = 'true'; iframe.dataset.gameOptimizations = this.improvements.join(','); return iframe; },
    report() { return `Aplicando ${this.improvements.length} otimizações de jogos`; }
  };

  const SecurityEngine = {
    policies: { strictIframes: true, enableReferrerPolicy: true, disableMixedContent: true },
    secureIframe(iframe) { return SandboxManager.attach(iframe); },
    auditIframe(iframe) { if (!iframe) return false; return iframe.getAttribute('sandbox') !== null && iframe.getAttribute('referrerpolicy') === 'no-referrer'; }
  };

  const GraphicsModule = {
    layers: new Map(),
    register(name, layer) { if (!name || typeof layer !== 'function') return this; this.layers.set(name, layer); return this; },
    render() { this.layers.forEach(fn => fn()); },
    init() { this.register('gameOverlay', () => { document.documentElement.style.setProperty('--game-glow', 'rgba(96,165,250,.08)'); }); }
  };

  const UIFrameworkManager = {
    frameworks: ['Tailwind CSS', 'Bootstrap', 'Pico CSS', 'Bulma', 'DaisyUI', 'Three.js', 'babylonjs'],
    describe() { return this.frameworks.join(', '); },
    init() { console.log('UIFrameworkManager active frameworks:', this.frameworks.length); }
  };

  const Engine = {
    modules: new Map(),
    renderers: new Map(),
    state: { frames: 0, lastTick: performance.now(), delta: 0 },
    registerModule(name, module) { if (!name || !module) return null; this.modules.set(name, module); if (typeof module.init === 'function') module.init(); return module; },
    getModule(name) { return this.modules.get(name); },
    registerRenderer(name, renderer) { if (!name || !renderer) return null; this.renderers.set(name, renderer); return renderer; },
    tick() { const now = performance.now(); this.state.delta = now - this.state.lastTick; this.state.lastTick = now; this.state.frames++; this.renderers.forEach(r => { if (typeof r === 'function') r(); else if (r && typeof r.render === 'function') r.render(); }); return this.state; },
    start() { const frame = () => { this.tick(); requestAnimationFrame(frame); }; requestAnimationFrame(frame); return this; }
  };

  const StorageEngine = {
    autoSave: 20000,
    timer: null,
    watch() { if (this.timer) clearInterval(this.timer); this.timer = setInterval(() => persistState(), this.autoSave); return this; },
    stop() { if (this.timer) clearInterval(this.timer); this.timer = null; return this; }
  };

  const VessieFramework = {
    initialized: false,
    modules: new Map(),
    services: new Map(),
    register(name, module) { if (!name || !module) return null; this.modules.set(name, module); if (typeof module.init === 'function') module.init(); return module; },
    registerService(name, service) { if (!name || !service) return null; this.services.set(name, service); return service; },
    get(name) { return this.modules.get(name) || this.services.get(name); },
    bootstrap() { if (this.initialized) return this; this.initialized = true; Kernel.eventBus.emit('vessie:framework:bootstrap', { modules: [...this.modules.keys()] }); return this; },
    report() { return { initialized: this.initialized, modules: [...this.modules.keys()], services: [...this.services.keys()] }; }
  };

  const RuntimeMetrics = {
    started: performance.now(),
    counters: { boot: 1, render: 0, iframes: 0, vms: 0, cacheHits: 0, cacheMisses: 0 },
    sample() { this.counters.render += 1; return this.snapshot(); },
    snapshot() { return { uptimeMs: Math.round(performance.now() - this.started), counters: { ...this.counters } }; }
  };

  const VessieRuntime = {
    timer: null,
    optimizations: new Map(),
    registerOptimization(name, fn) { if (!name || typeof fn !== 'function') return null; this.optimizations.set(name, fn); return fn; },
    runOptimization(name) { const fn = this.optimizations.get(name); if (typeof fn === 'function') { try { fn(); } catch (err) { console.warn('VessieRuntime', name, err); } } return !!fn; },
    start() { if (this.timer) return this; this.timer = setInterval(() => { RuntimeMetrics.sample(); Kernel.eventBus.emit('vessie:runtime:tick', RuntimeMetrics.snapshot()); }, 3000); return this; },
    stop() { if (this.timer) clearInterval(this.timer); this.timer = null; return this; },
    snapshot() { return RuntimeMetrics.snapshot(); }
  };

  const VessieAIEngine = {
    providers: {
      lmstudio: { label: 'LM Studio', defaultEndpoint: 'http://127.0.0.1:1234/v1/chat/completions', fallbacks: ['http://localhost:1234/v1/chat/completions'] },
      openai: { label: 'OpenAI Compatible', defaultEndpoint: 'https://api.openai.com/v1/chat/completions', fallbacks: [] },
      ollama: { label: 'Ollama', defaultEndpoint: 'http://localhost:11434/api/chat', fallbacks: [] },
      vllm: { label: 'vLLM', defaultEndpoint: 'http://localhost:8000/v1/chat/completions', fallbacks: [] },
      jan: { label: 'Jan', defaultEndpoint: 'http://127.0.0.1:1337/v1/chat/completions', fallbacks: [] },
      anythingllm: { label: 'AnythingLLM', defaultEndpoint: 'http://localhost:3001/v1/chat/completions', fallbacks: [] }
    },
    profiles: [
      { id: 'balanced', label: 'Balanced', temperature: 0.7, maxTokens: 700 },
      { id: 'fast', label: 'Fast', temperature: 0.3, maxTokens: 450 },
      { id: 'creative', label: 'Creative', temperature: 1.0, maxTokens: 900 }
    ],
    state: { activeProvider: 'lmstudio', selectedProfile: 'balanced', requests: 0, retries: 0, timeoutMs: 12000 },
    resolveProvider(provider) { const key = (provider || S.aiProvider || 'lmstudio').toLowerCase(); return this.providers[key] || this.providers.lmstudio; },
    resolveProfile(profile) { return this.profiles.find(p => p.id === profile) || this.profiles.find(p => p.id === 'balanced') || this.profiles[0]; },
    buildPayload(messages, options = {}) {
      const provider = this.resolveProvider(options.provider);
      const profile = this.resolveProfile(options.profile);
      const model = options.model || S.aiModel || 'gpt-4o-mini';
      const base = { model, messages, temperature: options.temperature ?? profile.temperature };
      if (provider && provider.defaultEndpoint.includes('/api/chat')) return { ...base, stream: false };
      return { ...base, max_tokens: options.maxTokens ?? profile.maxTokens };
    },
    async request(messages, options = {}) {
      const provider = this.resolveProvider(options.provider);
      const profile = this.resolveProfile(options.profile);
      const endpoints = [];
      const explicit = options.endpoint || S.aiCustomEndpoint || S.aiEndpoint || '';
      if (explicit) endpoints.push(explicit);
      if (provider.defaultEndpoint) endpoints.push(provider.defaultEndpoint);
      if (Array.isArray(provider.fallbacks)) endpoints.push(...provider.fallbacks);
      const payload = this.buildPayload(messages, { ...options, provider, profile });
      const headers = { 'Content-Type': 'application/json' };
      if (S.apiKey) headers['Authorization'] = `Bearer ${S.apiKey}`;
      const lastErrors = [];
      for (const endpoint of endpoints) {
        try {
          this.state.requests += 1;
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), options.timeoutMs || this.state.timeoutMs);
          const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(payload), signal: controller.signal });
          clearTimeout(timer);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || `Erro ${res.status}`);
          if (Array.isArray(data.choices) && data.choices[0]?.message) return { endpoint, data, content: data.choices[0].message.content || '' };
          if (data.choices?.[0]?.text) return { endpoint, data, content: data.choices[0].text || '' };
          if (typeof data.message?.content === 'string') return { endpoint, data, content: data.message.content };
          if (typeof data.response === 'string') return { endpoint, data, content: data.response };
          throw new Error('Resposta inválida do provedor');
        } catch (err) {
          lastErrors.push(`${endpoint}: ${err.message}`);
          this.state.retries += 1;
        }
      }
      throw new Error(lastErrors.join(' | '));
    },
    async chat(messages, options = {}) {
      const result = await this.request(messages, options);
      return result.content;
    },
    async editText(selectedText, instruction) {
      const promptText = `Você é um assistente de edição de texto especializado em manutenção de formato e lógica. Modifique apenas o texto abaixo seguindo esta instrução, preservando o restante do documento inalterado.\n\nInstrução: ${instruction}\n\nTexto selecionado:\n${selectedText}`;
      const messages = [{ role: 'system', content: 'Você é um assistente de edição de código e texto.' }, { role: 'user', content: promptText }];
      return this.chat(messages, { profile: 'balanced' });
    },
    describe() { return { provider: this.state.activeProvider, profile: this.state.selectedProfile, requests: this.state.requests, retries: this.state.retries }; }
  };

  const VessieVMManager = {
    vms: new Map(),
    create(name, type = 'sandbox') { const id = `vm-${Date.now().toString(36)}`; const vm = { id, name, type, createdAt: Date.now(), status: 'ready', snapshots: [], lastRestore: null }; this.vms.set(id, vm); RuntimeMetrics.counters.vms = this.vms.size; Kernel.eventBus.emit('vessie:vm:create', { vm }); return vm; },
    list() { return [...this.vms.values()]; },
    snapshot(id) { const vm = this.vms.get(id); if (!vm) return null; const snapshot = { id: Date.now().toString(36), createdAt: Date.now(), status: vm.status }; vm.snapshots.push(snapshot); Kernel.eventBus.emit('vessie:vm:snapshot', { vm, snapshot }); return snapshot; },
    restore(id) { const vm = this.vms.get(id); if (!vm) return null; vm.lastRestore = Date.now(); vm.status = 'restored'; Kernel.eventBus.emit('vessie:vm:restore', { vm }); return vm; }
  };

  const VessieIframeRuntime = {
    registry: new Map(),
    attach(iframe, options = {}) {
      if (!iframe) return null;
      const sandbox = options.sandbox || 'allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-popups-to-escape-sandbox';
      const allow = options.allow || 'fullscreen;autoplay;clipboard-read;clipboard-write;camera;microphone';
      iframe.setAttribute('sandbox', sandbox);
      iframe.setAttribute('allow', allow);
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.style.backgroundColor = options.background || '#000';
      iframe.style.transform = 'translateZ(0)';
      iframe.dataset.vessieRuntime = 'iframe';
      this.registry.set(iframe, { sandbox, allow });
      RuntimeMetrics.counters.iframes = this.registry.size;
      return iframe;
    },
    inspect(iframe) { return this.registry.get(iframe) || null; }
  };

  const VessieGameRuntime = {
    optimizeGameFrame(iframe) { if (!iframe) return null; VessieIframeRuntime.attach(iframe, { sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals', allow: 'fullscreen;autoplay;gamepad;clipboard-read;clipboard-write' }); iframe.style.transition = 'filter .25s ease, transform .25s ease'; iframe.style.transform = 'translateZ(0)'; iframe.dataset.vessieOptimized = 'true'; return iframe; },
    launch(url, title) { const safeUrl = SandboxManager.safeUrl(url); const frame = createWin(title || 'Jogo Web', '<i class="fab fa-steam"></i>', `<iframe src="${safeUrl}" style="border:none;width:100%;height:100%" allow="fullscreen;autoplay" title="${title || 'Jogo'}"></iframe>`, 920, 640); const iframe = frame.querySelector('iframe'); this.optimizeGameFrame(iframe); Kernel.eventBus.emit('vessie:game:launch', { url: safeUrl, title }); return frame; }
  };

  CoreSystem.boot();

  const CacheManager = {
    maxEntries: 80,
    imageCache: new Map(),
    templateCache: new Map(),
    get(cache, key) { const map = this[cache]; if (!map) return; const value = map.get(key); if (value) { map.delete(key); map.set(key, value); } return value; },
    set(cache, key, value) { const map = this[cache]; if (!map) return; map.set(key, value); if (map.size > this.maxEntries) { const first = map.keys().next().value; map.delete(first); } return value; },
    delete(cache, key) { const map = this[cache]; if (!map) return false; return map.delete(key); },
    clear(cache) { const map = this[cache]; if (!map) return; map.clear(); }
  };

  const PersistenceService = {
    key: 'vessieos_state',
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
    get(key, fallback = null) { try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch { return fallback; } },
    remove(key) { localStorage.removeItem(key); },
    setState(state) { return this.set(this.key, state); },
    getState() { return this.get(this.key, null); },
    restoreState(target) {
      const data = this.getState();
      if (!data || typeof data !== 'object') return;
      if (data.fs && typeof data.fs === 'object') target.fs = data.fs;
      if (typeof data.wallpaper === 'string') target.wallpaper = data.wallpaper;
      if (typeof data.desktopIconSize === 'string') target.desktopIconSize = data.desktopIconSize;
      if (typeof data.cursorSize === 'number') target.cursorSize = data.cursorSize;
      if (typeof data.iconScale === 'number') target.iconScale = data.iconScale;
      if (Array.isArray(data.wallpapers)) target.wallpapers = ensureWallpapers(data.wallpapers);
      if (typeof data.sounds === 'boolean') target.sounds = data.sounds;
      if (Array.isArray(data.vocabulary)) target.vocabulary = data.vocabulary;
      if (Array.isArray(data.gameTemplates)) target.gameTemplates = data.gameTemplates;
      if (Array.isArray(data.chatHistory)) target.chatHistory = data.chatHistory;
      if (typeof data.iconImageUrl === 'string') target.iconImageUrl = data.iconImageUrl;
      if (typeof data.apiKey === 'string') target.apiKey = data.apiKey;
      if (typeof data.aiProvider === 'string') target.aiProvider = data.aiProvider;
      if (typeof data.aiModel === 'string') target.aiModel = data.aiModel;
      if (typeof data.aiEndpoint === 'string') target.aiEndpoint = data.aiEndpoint;
      if (typeof data.aiCustomEndpoint === 'string') target.aiCustomEndpoint = data.aiCustomEndpoint;
    }
  };

  const VFS = {
    normalize(path) { return String(path || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '').trim(); },
    resolve(path) { const key = this.normalize(path); if (!key) return S.fs; const parts = key.split('/'); let node = S.fs; for (const part of parts) { if (node && typeof node === 'object' && part in node) { node = node[part]; } else { return null; } } return node; },
    exists(path) { return this.resolve(path) !== null; },
    list(path) { const node = this.resolve(path); return node && typeof node === 'object' ? Object.keys(node) : []; },
    read(path) { return this.resolve(path); },
    write(path, value) { const key = this.normalize(path); const parts = key.split('/'); let node = S.fs; while (parts.length > 1) { const part = parts.shift(); if (!node[part] || typeof node[part] !== 'object') node[part] = {}; node = node[part]; } node[parts[0]] = value; return true; },
    mkdir(path) { const key = this.normalize(path); if (!key) return false; const parts = key.split('/'); let node = S.fs; while (parts.length) { const part = parts.shift(); if (!node[part] || typeof node[part] !== 'object') node[part] = {}; node = node[part]; } return true; },
    delete(path) { const key = this.normalize(path); const parts = key.split('/'); if (!parts.length) return false; let node = S.fs; while (parts.length > 1) { const part = parts.shift(); if (!node[part] || typeof node[part] !== 'object') return false; node = node[part]; } return delete node[parts[0]]; }
  };

  // Expõe este VFS (o mesmo que Terminal e Explorador de Arquivos usam) como
  // window.VessieOS.FileSystem, para que os comandos fs.* do VessieScript
  // (ver JS/kernel/modules/scripting/lib/vessiescript-extensions.js +
  // kernel-adapter.js) leiam/escrevam os MESMOS arquivos que aparecem na UI
  // — um único filesystem real, não duas simulações paralelas. Carrega antes
  // de JS/kernel/filesystem.js na sequência de boot; esse arquivo detecta
  // que isto aqui já existe e não sobrescreve (ver filesystem.js).
  window.VessieOS = window.VessieOS || {};
  window.VessieOS.FileSystem = VFS;

  const AppRegistry = {
    apps: new Map(),
    register(app) { if (!app || !app.id) return null; this.apps.set(app.id, app); return app; },
    get(id) { return this.apps.get(id); },
    open(id, ...args) { const app = this.get(id); return app && typeof app.open === 'function' ? app.open(...args) : null; }
  };

  const WindowManager = {
    windows: new Map(),
    create(title, icon, content, width, height) { const win = createWin(title, icon, content, width, height); if (win && win.id) this.windows.set(win.id, win); return win; },
    focus(id) { focusWin(id); return this.windows.get(id); },
    close(id) { const win = this.windows.get(id); if (win) win.querySelector('[data-act="cls"]')?.click(); },
    get(id) { return this.windows.get(id); }
  };

  ServiceLocator.register('Persistence', PersistenceService);
  ServiceLocator.register('CacheManager', CacheManager);
  ServiceLocator.register('VFS', VFS);
  ServiceLocator.register('AppRegistry', AppRegistry);
  ServiceLocator.register('WindowManager', WindowManager);
  ServiceLocator.register('CoreSystem', CoreSystem);
  ServiceLocator.register('Framework', Framework);
  ServiceLocator.register('GraphicsEngine', GraphicsEngine);
  ServiceLocator.register('ThemeManager', ThemeManager);
  ServiceLocator.register('VariantManager', VariantManager);
  ServiceLocator.register('LibraryManager', LibraryManager);
  ServiceLocator.register('UIFrameworkManager', UIFrameworkManager);
  ServiceLocator.register('SandboxManager', SandboxManager);
  ServiceLocator.register('GameEngine', GameEngine);
  ServiceLocator.register('GameOptimizer', GameOptimizer);
  ServiceLocator.register('SecurityEngine', SecurityEngine);
  ServiceLocator.register('Engine', Engine);
  ServiceLocator.register('StorageEngine', StorageEngine);
  ServiceLocator.register('VessieFramework', VessieFramework);
  ServiceLocator.register('VessieRuntime', VessieRuntime);
  ServiceLocator.register('VessieAIEngine', VessieAIEngine);
  ServiceLocator.register('VessieVMManager', VessieVMManager);
  ServiceLocator.register('VessieIframeRuntime', VessieIframeRuntime);
  ServiceLocator.register('VessieGameRuntime', VessieGameRuntime);

  const AIService = {
    provider: 'lmstudio',
    get config() {
      return {
        model: S.aiModel || 'gpt-4o-mini',
        endpoint: S.aiCustomEndpoint || S.aiEndpoint || 'http://127.0.0.1:1234/v1/chat/completions',
        apiKey: S.apiKey || ''
      };
    },
    get headers() {
      const headers = { 'Content-Type': 'application/json' };
      if (this.config.apiKey) headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      return headers;
    },
    async request(payload) {
      const endpoint = this.config.endpoint;
      if (!endpoint) throw new Error('Endpoint de IA não configurado');
      const messages = Array.isArray(payload?.messages) ? payload.messages : [{ role: 'user', content: payload?.content || '' }];
      return VessieAIEngine.request(messages, { endpoint, provider: S.aiProvider || 'lmstudio', model: this.config.model });
    },
    parseCompletion(data) {
      if (data && typeof data === 'object' && typeof data.content === 'string') return data.content;
      return '';
    },
    async chat(messages) {
      const data = await VessieAIEngine.chat(messages, { provider: S.aiProvider || 'lmstudio', model: this.config.model, endpoint: this.config.endpoint });
      return data;
    },
    async editText(selectedText, instruction) {
      return VessieAIEngine.editText(selectedText, instruction);
    }
  };
  ServiceLocator.register('AIService', AIService);
  ServiceLocator.register('AppRegistry', AppRegistry);
  ServiceLocator.register('WindowManager', WindowManager);
  ServiceLocator.register('EventBus', Kernel.eventBus);
  ServiceLocator.register('Kernel', Kernel);

  ThemeManager.register('VessieOS', {
    '--a': '#60a5fa', '--a2': '#a78bfa', '--a3': '#22d3ee', '--acc-glow': 'rgba(96,165,250,.42)', '--acc-glow-2': 'rgba(167,139,250,.35)'
  });
  ThemeManager.register('Nebula', {
    '--a': '#8b5cf6', '--a2': '#ec4899', '--a3': '#0ea5e9', '--acc-glow': 'rgba(139,92,246,.35)', '--acc-glow-2': 'rgba(236,72,153,.28)'
  });
  ThemeManager.register('Solarized', {
    '--a': '#268bd2', '--a2': '#2aa198', '--a3': '#b58900', '--acc-glow': 'rgba(38,139,210,.35)', '--acc-glow-2': 'rgba(181,137,0,.28)'
  });
  ThemeManager.register('Dracula', {
    '--a': '#bd93f9', '--a2': '#ff79c6', '--a3': '#8be9fd', '--acc-glow': 'rgba(189,147,249,.35)', '--acc-glow-2': 'rgba(139,233,253,.28)'
  });
  ThemeManager.register('Aurora', {
    '--a': '#22d3ee', '--a2': '#7c3aed', '--a3': '#f472b6', '--acc-glow': 'rgba(34,211,238,.35)', '--acc-glow-2': 'rgba(124,58,237,.28)'
  });
  ThemeManager.init();
  VariantManager.register('Fluent', { styles: { '--a': '#60a5fa', '--a2': '#a78bfa', '--a3': '#22d3ee' }, background: S.wallpaper, theme: 'VessieOS' });
  VariantManager.register('Aurora', { styles: { '--a': '#22d3ee', '--a2': '#7c3aed', '--a3': '#f472b6' }, background: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Cyberpunk', { styles: { '--a': '#ff007c', '--a2': '#00f5d4', '--a3': '#fee440' }, background: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1400&q=80', theme: 'Nebula' });
  VariantManager.register('Forest', { styles: { '--a': '#48b9c7', '--a2': '#5fdde5', '--a3': '#1a8a98' }, background: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80', theme: 'Solarized' });
  VariantManager.register('Midnight', { styles: { '--a': '#0f172a', '--a2': '#1e293b', '--a3': '#334155' }, background: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', theme: 'Dracula' });
  VariantManager.register('Sunset', { styles: { '--a': '#f97316', '--a2': '#facc15', '--a3': '#fb7185' }, background: 'https://images.unsplash.com/photo-1501973801547-2b3a1f66ae22?auto=format&fit=crop&w=1400&q=80', theme: 'Solarized' });
  VariantManager.register('Ocean', { styles: { '--a': '#0ea5e9', '--a2': '#22d3ee', '--a3': '#818cf8' }, background: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Aurora Glow', { styles: { '--a': '#a855f7', '--a2': '#ec4899', '--a3': '#f59e0b' }, background: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80', theme: 'Aurora' });
  VariantManager.register('Neon', { styles: { '--a': '#ff4d6d', '--a2': '#845ef7', '--a3': '#22b8cf' }, background: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1400&q=80', theme: 'Nebula' });
  VariantManager.register('Solar', { styles: { '--a': '#f97316', '--a2': '#fed7aa', '--a3': '#facc15' }, background: 'https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?auto=format&fit=crop&w=1400&q=80', theme: 'Solarized' });
  VariantManager.register('Forest Mist', { styles: { '--a': '#16a34a', '--a2': '#4ade80', '--a3': '#0f766e' }, background: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Ocean Breeze', { styles: { '--a': '#3b82f6', '--a2': '#0ea5e9', '--a3': '#22d3ee' }, background: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Retro', { styles: { '--a': '#fb7185', '--a2': '#f59e0b', '--a3': '#10b981' }, background: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Minimal', { styles: { '--a': '#111827', '--a2': '#374151', '--a3': '#9ca3af' }, background: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Space', { styles: { '--a': '#0f172a', '--a2': '#1e293b', '--a3': '#7c3aed' }, background: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1400&q=80', theme: 'Dracula' });
  VariantManager.register('Vaporwave', { styles: { '--a': '#c084fc', '--a2': '#f9a8d4', '--a3': '#60a5fa' }, background: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80', theme: 'Aurora' });
  VariantManager.register('Cyber', { styles: { '--a': '#22d3ee', '--a2': '#a855f7', '--a3': '#f97316' }, background: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1400&q=80', theme: 'Nebula' });
  VariantManager.register('Aurora Night', { styles: { '--a': '#8b5cf6', '--a2': '#0ea5e9', '--a3': '#22d3ee' }, background: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80', theme: 'Aurora' });
  VariantManager.register('Glass', { styles: { '--a': '#dbeafe', '--a2': '#e0f2fe', '--a3': '#bae6fd' }, background: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80', theme: 'Solarized' });
  VariantManager.register('Pixel', { styles: { '--a': '#f97316', '--a2': '#fb7185', '--a3': '#8b5cf6' }, background: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Emerald', { styles: { '--a': '#10b981', '--a2': '#22c55e', '--a3': '#14b8a6' }, background: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Sandstone', { styles: { '--a': '#f59e0b', '--a2': '#fbbf24', '--a3': '#f97316' }, background: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1400&q=80', theme: 'Solarized' });
  VariantManager.register('Ice', { styles: { '--a': '#93c5fd', '--a2': '#bfdbfe', '--a3': '#e0f2fe' }, background: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Volcano', { styles: { '--a': '#f97316', '--a2': '#ef4444', '--a3': '#c2410c' }, background: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1400&q=80', theme: 'Nebula' });
  VariantManager.register('Rust', { styles: { '--a': '#c2410c', '--a2': '#f97316', '--a3': '#f59e0b' }, background: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80', theme: 'Solarized' });
  VariantManager.register('Coral', { styles: { '--a': '#fb7185', '--a2': '#fda4af', '--a3': '#ffb703' }, background: 'https://images.unsplash.com/photo-1501973801547-2b3a1f66ae22?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Slate', { styles: { '--a': '#64748b', '--a2': '#94a3b8', '--a3': '#cbd5e1' }, background: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1400&q=80', theme: 'Dracula' });
  VariantManager.register('Blossom', { styles: { '--a': '#f9a8d4', '--a2': '#fbcfe8', '--a3': '#fee2e2' }, background: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  VariantManager.register('Savanna', { styles: { '--a': '#fde047', '--a2': '#facc15', '--a3': '#f97316' }, background: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1400&q=80', theme: 'Solarized' });
  VariantManager.register('Arcadia', { styles: { '--a': '#34d399', '--a2': '#6ee7b7', '--a3': '#10b981' }, background: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80', theme: 'VessieOS' });
  Engine.registerRenderer('graphics', GraphicsEngine);
  Engine.registerModule('AI', AIService);
  Engine.registerModule('LibraryManager', LibraryManager);
  Engine.registerModule('UIFrameworkManager', UIFrameworkManager);
  Engine.registerModule('GameEngine', GameEngine);
  Engine.registerModule('GameOptimizer', GameOptimizer);
  Engine.registerModule('SecurityEngine', SecurityEngine);
  CoreSystem.register('ThemeManager', ThemeManager);
  CoreSystem.register('VariantManager', VariantManager);
  CoreSystem.register('Engine', Engine);
  CoreSystem.register('GameEngine', GameEngine);
  CoreSystem.register('SecurityEngine', SecurityEngine);
  CoreSystem.register('LibraryManager', LibraryManager);
  Framework.registerComponent('Graphics', GraphicsEngine);
  Framework.registerComponent('VFS', VFS);
  Framework.registerComponent('AI', AIService);
  Framework.registerComponent('GameEngine', GameEngine);
  Framework.registerComponent('LibraryManager', LibraryManager);
  Framework.registerComponent('SecurityEngine', SecurityEngine);
  Kernel.eventBus.once('kernel:ready', () => { Engine.start(); StorageEngine.watch(); VessieRuntime.start(); VessieFramework.bootstrap(); GameEngine.init(); UIFrameworkManager.init(); LibraryManager.init(); });
  Kernel.start();

  // WALLPAPERS PRÉ-DEFINIDOS
  // ======================
  // Para adicionar novos wallpapers, insira uma nova linha com este formato:
  // {n:'Nome do Wallpaper', u:'URL da imagem', c:'Categoria'}
  // 
  // Categorias disponíveis: 'Natureza', 'Tech', 'Futurista'
  // URL: Use links diretos de imagens (JPG, PNG, WEBP)
  // 
  // Exemplo:
  // {n:'Meu Wallpaper',u:'https://exemplo.com/imagem.jpg',c:'Natureza'}
  //
  // TODOS os wallpapers abaixo aparecem PERMANENTEMENTE na tela de configurações
  // Você também pode adicionar URLs personalizadas pela interface em tempo real
  const WALLS = [
    { n: 'StelleFly Honkai', u: 'https://4kwallpapers.com/images/walls/thumbs_2t/26880.jpg', c: 'StelleFly Honkai' },
    { n: 'Solo Leveling', u: 'https://4kwallpapers.com/images/walls/thumbs_2t/26864.jpg', c: 'Solo Leveling' },
    { n: 'Godzilla Minus Zero 2026', u: 'https://4kwallpapers.com/images/walls/thumbs_2t/26852.jpg', c: 'Godzilla Minus Zero 2026' },
    { n: 'BMW S 1000', u: 'https://4kwallpapers.com/images/walls/thumbs_2t/26835.jpg', c: 'BMW S 1000' },
    { n: 'Grand Theft Auto VI Ultimate Edition', u: 'https://4kwallpapers.com/images/walls/thumbs_2t/26757.jpg', c: 'Grand Theft Auto VI Ultimate Edition' },
    { n: 'Neon-Share', u: 'https://i.giphy.com/KWcGnX2iz0G1fMMHrO.webp', c: 'Neon-Share' },
    { n: 'Cyberpunk 2077', u: 'https://4kwallpapers.com/images/walls/thumbs_2t/26756.jpg', c: 'Cyberpunk 2077' }
  ];

  function ensureWallpapers(list) {
    const source = Array.isArray(list) && list.length ? list : WALLS.map(w => ({ ...w }));
    return source.filter(w => w && w.u).map(w => ({ n: w.n || 'Wallpaper', u: w.u, c: w.c || getWallCategory(w) }));
  }

  function persistState() {

    try {
      PersistenceService.setState({
        fs: S.fs,
        wallpaper: S.wallpaper,
        desktopIconSize: S.desktopIconSize,
        cursorSize: S.cursorSize,
        wallpapers: ensureWallpapers(S.wallpapers || []),
        sounds: S.sounds,
        vocabulary: S.vocabulary || [],
        gameTemplates: S.gameTemplates || [],
        iconScale: S.iconScale || 1,
        chatHistory: S.chatHistory || [],
        iconImageUrl: S.iconImageUrl || '',
        apiKey: S.apiKey || '',
        aiProvider: S.aiProvider || 'lmstudio',
        aiModel: S.aiModel || 'gpt-4o-mini',
        aiEndpoint: S.aiEndpoint || '',
        aiCustomEndpoint: S.aiCustomEndpoint || ''
      });
    } catch (e) { }
  }

  function restoreState() {
    try {
      PersistenceService.restoreState(S);
    } catch (e) { }
    S.wallpapers = ensureWallpapers(S.wallpapers || []);
    if (!S.wallpapers.length) {
      S.wallpapers = WALLS.map(w => ({ ...w }));
    }
    if (!Array.isArray(S.vocabulary)) S.vocabulary = [];
    if (!Array.isArray(S.gameTemplates)) S.gameTemplates = [];
  }
  restoreState();

  function normalizeText(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function normalizeGameName(value) {
    return normalizeText(value).replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function dedupeGames(list) {
    const seen = new Set();
    const out = [];
    for (const game of list || []) {
      const key = `${normalizeGameName(game?.name)}|${normalizeGameName(game?.url)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(game);
    }
    return out;
  }

  function buildVessiePhrases() {
    // FRASES NATURAIS DA VESSIE - Personalize aqui!
    // Adicione mais respostas para diferentes contextos
    const responses = {
      'help|ajuda|socorro|sos': ['Claro, estou aqui! 💜 O que você precisa?', 'Como posso ajudar você hoje?', 'Estou pronta! Qual é sua dúvida?'],
      'oi|olá|hey': ['Oi! 💜 Tudo bem com você?', 'Olá! Bem-vindo! ✨', 'E aí! Como vai?'],
      'wallpaper|papel|fundo': ['Posso aplicar wallpapers novos e alternar entre categorias como Natureza, Tech e Futurista.', 'Quer personalizar seu fundo? Tenho várias opções legais!'],
      'jogo|game|play': ['Amei! Temos vários jogos legais disponíveis. Qual você quer jogar?', 'Gostaria de jogar algo? Temos Minecraft, 1v1 LOL e mais!'],
      'música|music|som': ['Quer ouvir uma música? Temos um player completo para você!', 'Posso tocar músicas para você! 🎵'],
      'arquivo|salvar|export': ['Posso salvar seus dados em arquivo para você usar depois!', 'Quer exportar seus dados? Faço isso para você!'],
      'obrigado|thanks|vlw': ['De nada! Sempre feliz em ajudar 💜', 'Fico feliz em poder ajudar!', 'Qualquer coisa, estou por aqui!'],
      'legal|top|show': ['Fico feliz que tenha gostado! ✨', 'Que legal! Quer descobrir mais funcionalidades?'],
    };
    return responses;
  }

  const VESSIE_RESPONSES = buildVessiePhrases();

  function getVessieResponse(msg) {
    const lower = normalizeText(msg || '');
    for (const [keys, responses] of Object.entries(VESSIE_RESPONSES || {})) {
      const keyList = keys.split('|');
      if (keyList.some(k => lower.includes(k))) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    return pickVessiePhrase();
  }

  function pickVessiePhrase() {
    const generic = [
      '💜 Estou pronta para ajudar com o que vier!',
      '✨ Que interessante!',
      '🌟 Entendi!',
      '💜 Legal! Gosto dessa ideia.',
      '⚡ Pode deixar comigo!'
    ];
    return generic[Math.floor(Math.random() * generic.length)];
  }

  function applyDesktopIconSize(size) {
    S.desktopIconSize = size;
    persistState();
    renderDesktop();
    toast('Tamanho dos ícones atualizado ✨', 'success');
  }

  function applyIconImage(url) {
    if (!url) return;
    S.iconImageUrl = url;
    persistState();
    renderDesktop();
    toast('Ícone personalizado aplicado 🖼️', 'success');
  }

  window.exportVessieData = function () {
    const payload = {
      vocabulary: S.vocabulary || [],
      gameTemplates: S.gameTemplates || [],
      wallpapers: S.wallpapers || [],
      wall: S.wallpaper,
      theme: localStorage.getItem('vos-theme') || ''
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vessieos-export.json';
    a.click();
    toast('Arquivo exportado com sucesso 📦', 'success');
  };

  window.importVessieData = function (file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data.vocabulary)) S.vocabulary = data.vocabulary;
        if (Array.isArray(data.gameTemplates)) S.gameTemplates = data.gameTemplates;
        if (Array.isArray(data.wallpapers)) S.wallpapers = data.wallpapers;
        if (data.wall) S.wallpaper = data.wall;
        if (data.theme) localStorage.setItem('vos-theme', data.theme);
        persistState();
        renderDesktop();
        toast('Importação concluída ✅', 'success');
      } catch (e) { toast('Arquivo inválido para importação', 'error'); }
    };
    reader.readAsText(file);
  };

  window.openVessieTraining = function () { };
  window.trainVessieVocabulary = function () { };

  let soundCtx = null;
  function getSoundContext() {
    if (!soundCtx) {
      soundCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (soundCtx.state === 'suspended') soundCtx.resume();
    return soundCtx;
  }

  function playSound(kind = 'notify') {
    if (!S.sounds) return;
    try {
      const ctx = getSoundContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const map = { boot: [440, 660], notify: [523, 784], open: [659, 880], error: [220, 180], window: [392, 523] };
      const [f1, f2] = map[kind] || map.notify;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f1, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f2, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.22);
    } catch (e) { }
  }

  GAMES = [
    { n: 'Village Craft', u: 'https://1v1-lol.gitlab.io/go/class-389.html', ic: 'https://jamestore214.github.io/img/class-389.png' },
    { n: 'Shady Bears', u: 'https://1v1-lol.gitlab.io/go/class-379.html', ic: 'https://jamestore214.github.io/img/class-379.png' },
    { n: 'Bitlife', u: 'https://1v1-lol.gitlab.io/go/class-441.html', ic: 'https://jamestore214.github.io/img/class-441.png' },
    { n: 'Moto X3m Pool Party', u: 'https://1v1-lol.gitlab.io/go/class-462.html', ic: 'https://jamestore214.github.io/img/class-462.png' },
    { n: 'Minecraft', u: 'https://play.mcjs.cc/1.8.8/', ic: 'https://www.rw-designer.com/icon-image/5547-256x256x32.png' },
    { n: 'Parking Fury 3D: Night Thief', u: 'https://1v1-lol.gitlab.io/go/class-725.html', ic: 'https://jamestore214.github.io/img/class-725.png' },
    { n: 'Idle Startup Tycoon', u: 'https://1v1-lol.gitlab.io/go/class-778.html', ic: 'https://jamestore214.github.io/img/class-778.png' },
    { n: 'City Brawl', u: 'https://orbit-kick.com/games/city-brawl/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/city-brawl-cover.png.webp' },
    { n: 'Bat Smash', u: 'https://orbit-kick.com/games/bat-smash/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/bat-smash-cover.png.webp' },
    { n: 'Wacky Steps', u: 'https://orbit-kick.com/games/wacky-steps/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/wacky-steps-cover.png.webp' },
    { n: 'Dunk Clash', u: 'https://orbit-kick.com/games/dunk-clash/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/dunk-clash-cover.jpg.webp' },
    { n: 'Ragdoll Playground', u: 'https://orbit-kick.com/games/ragdoll-playground/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/ragdoll-playground-cover.png.webp' },
    { n: 'Slope Snowball', u: 'https://orbit-kick.com/games/slope-snowball/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/slope-snowball-cover.png.webp' },
    { n: 'Slope Rider', u: 'https://orbit-kick.com/games/slope-rider/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/slope-rider-cover.png.webp' },
    { n: 'Ragdoll Hit', u: 'https://orbit-kick.com/games/ragdoll-hit/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/ragdoll-hit.png.webp' },
    { n: 'Color Rush', u: 'https://orbit-kick.com/games/color-rush/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/color-rush.png.webp' },
    { n: 'Labubu Clicker', u: 'https://orbit-kick.com/games/labubu-clicker/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/labubu-clicker-cover.png.webp' },
    { n: 'Italian Brainrot Clicker 2', u: 'https://orbit-kick.com/games/italian-brainrot-clicker-2/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/italian-brainrot-clicker-2-cover.png.webp' },
    { n: 'Flying Ball', u: 'https://orbit-kick.com/games/flying-ball/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/flying-ball-cover.png.webp' },
    { n: 'Perfect Orbit', u: 'https://orbit-kick.com/games/perfect-orbit/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/perfect-orbit-cover.png.webp' },
    { n: 'Track Dash', u: 'https://orbit-kick.com/games/track-dash/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/track-dash-cover.png.webp' },
    { n: 'Ragdoll Launcher', u: 'https://orbit-kick.com/games/ragdoll-launcher/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/ragdoll-launcher-cover.png.webp' },
    { n: 'Golf Puzzle', u: 'https://orbit-kick.com/games/golf-puzzle/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/golf-puzzle-cover.png.webp' },
    { n: 'Arrow Arena', u: 'https://orbit-kick.com/games/arrow-arena/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/arrow-arena-cover.png.webp' },
    { n: 'Wobbly Pets', u: 'https://orbit-kick.com/games/wobbly-pets/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/wobbly-pets-cover.png.webp' },
    { n: 'Lift Off 2', u: 'https://orbit-kick.com/games/lift-off-2/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/lift-off-2-cover.png.webp' },
    { n: 'Tunnel Rush', u: 'https://orbit-kick.com/games/tunnel-rush/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/tunnel-rush.png.webp' },
    { n: 'Tralalero Tralala Clicker', u: 'https://orbit-kick.com/games/tralalero-tralala-clicker/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/tralalero-tralala-clicker-cover.png.webp' },
    { n: 'Wacky Nursery 2', u: 'https://orbit-kick.com/games/wacky-nursery-2/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/wacky-nursery-2-cover.png.webp' },
    { n: 'Wacky Nursery', u: 'https://orbit-kick.com/games/wacky-nursery/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/wacky-nursery-cover.png.webp' },
    { n: 'Hyper Tunnel', u: 'https://orbit-kick.com/games/hyper-tunnel/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/hyper-tunnel-cover.png.webp' },
    { n: 'Knife Master', u: 'https://orbit-kick.com/games/knife-master/', ic: 'https://dam.orbit-kick.com/styles/medium/s3/games/knife-master-cover.png.webp' },
    { n: 'Rocket Soccer Derby', u: 'https://1v1-lol.gitlab.io/go/class-527.html', ic: 'https://jamestore214.github.io/img/class-527.png' },
    { n: 'IZOWAVE', u: 'https://1v1-lol.gitlab.io/go/class-325.html', ic: 'https://jamestore214.github.io/img/class-325.png' },
    { n: 'Rock Paper Clicker', u: 'https://1v1-lol.gitlab.io/go/class-1127.html', ic: 'https://jamestore214.github.io/img/class-1127.png' },
    { n: 'Tiger Simulator 3d', u: 'https://1v1-lol.gitlab.io/go/class-587.html', ic: 'https://jamestore214.github.io/img/class-587.png' },
    { n: 'Crazy Taxi', u: 'https://snowriderio.io/crazy-taxi', ic: 'https://snowriderio.io/cache/data/image/game/crazy-taxi-1-h220x220.webp' },
    { n: 'Az Games', u: 'https://azgames.io/', ic: 'https://azgames.io/favicon.ico' },
    { n: 'Bacon May Die', u: 'https://1v1-lol.gitlab.io/go/class-334.html', ic: 'https://jamestore214.github.io/img/class-334.png' },
    { n: 'Jetski Race', u: 'https://snowriderio.io/jetski-race', ic: 'https://snowriderio.io/cache/data/image/game/jetski-race-h220x220.webp' },
    { n: 'Blue Hedgehog Hill Dash Ride', u: 'https://snowriderio.io/blue-hedgehog-hill-dash-ride', ic: 'https://snowriderio.io/cache/data/image/game/blue-hedgehog-hill-dash-ride-h220x220.webp' },
    { n: '1v1 LOL', u: 'https://1v1-lol.gitlab.io/', ic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3HlcPjxDtFoPAY6TcOGPk1H2Qb8l0trXLzQ&s' },
    { n: 'Friday Night Funkin', u: 'https://fnf-2.io/', ic: 'https://art.ngfiles.com/images/1674000/1674368_bozubrain_fnf-icons-free-to-use.png?f1614903474' },
    { n: 'Veck IO', u: 'https://hollowknight.io/veck-io', ic: 'https://escaperoadcity.org/cache/data/image/game/veck-io-avt-m150x150.jpg' },
    { n: 'Escape Road', u: 'https://snowroad.io/escape-road-2', ic: 'https://snowroad.io/cache/data/image/game/escape-road-game-f200x200.webp' },
    { n: 'Curve Rush', u: 'https://snowroad.io/curve-rush', ic: 'https://snowroad.io/cache/data/image/game/curve-rush-2-1-f200x200.webp' },
    { n: 'Drift Hunters', u: 'https://escaperoadcity.org/drift-hunters-max', ic: 'https://escaperoadcity.org/cache/data/image/game/drift-hunters-max-cover-m150x150.png' },
    { n: 'Subway Surfers', u: 'https://1v1-lol.gitlab.io/go/class-444.html', ic: 'https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=40,height=40,fit=cover,f=auto/fc09ae107e5bbe1531e5d87d216b09f8/subway-surfers.png' },
    { n: 'Dude Theft AUTO', u: 'https://escaperoadcity.org/dude-theft-auto', ic: 'https://escaperoadcity.org/cache/data/image/game/dude-theft-auto-avt-m54x54.jpg' },
    { n: 'Drift Boss', u: 'https://snowroad.io/drift-boss', ic: 'https://snowroad.io/cache/data/image/game/drift-boss-f200x200.webp' },
    { n: 'Crossy Road', u: 'https://snowroad.io/crossy-road', ic: 'https://snowroad.io/cache/data/image/game/crossy-road-unblocked-f200x200.webp' },
    { n: 'Stickman Slash', u: 'https://snowroad.io/stickman-slash', ic: 'https://snowroad.io/cache/data/image/game/stickman-slash-sn-f200x200.webp' },
    { n: 'Snow Road', u: 'https://snowroad.io/', ic: 'https://snowroad.io/cache/data/image/game/snow-road-game-1-f200x200.webp' },
    { n: 'Dead Strike', u: 'https://escaperoadcity.org/dead-strike', ic: 'https://escaperoadcity.org/cache/data/image/game/dead-strike-avt-m150x150.jpg' },
    { n: 'Kart Bros IO', u: 'https://escaperoadcity.org/kart-bros-io', ic: 'https://escaperoadcity.org/cache/data/image/game/kart-bros-io-avt-e-m150x150.jpg' },
    { n: 'Undead Invasion', u: 'https://escaperoadcity.org/undead-invasion', ic: 'https://escaperoadcity.org/cache/data/image/game/undead-invasion-avt-m150x150.jpg' },
    { n: 'Orbit Kick', u: 'https://escaperoadcity.org/orbit-kick', ic: 'https://escaperoadcity.org/cache/data/image/game/orbit-kick-1-m54x54.png' },
    { n: 'GT Cars Racing', u: 'https://escaperoadcity.org/gt-cars-city-racing', ic: 'https://escaperoadcity.org/cache/data/image/game/gt-cars-city-racing-cover-m54x54.png' },
    { n: 'Sling Drift', u: 'https://escaperoadcity.org/sling-drift', ic: 'https://escaperoadcity.org/cache/data/image/game/sling-drift-cover-m54x54.png' },
    { n: 'Jelly Runner', u: 'https://escaperoadcity.org/jelly-runner', ic: 'https://escaperoadcity.org/cache/data/image/game/jelly-runner-avt-m150x150.jpg' },
    { n: 'Rebound Shooter', u: 'https://escaperoadcity.org/rebound-shooter', ic: 'https://escaperoadcity.org/cache/data/image/game/rebound-shooter-avt-m150x150.jpg' },
    { n: 'Retro Rush', u: 'https://snowroad.io/retro-rush', ic: 'https://snowroad.io/cache/data/image/game/retro-rush-1-f200x200.webp' },
    { n: '2v2 IO', u: 'https://2v2.io/', ic: 'https://brain-lines.io/cache/data/image/game/2v2io-b1-f240x240.webp' },
    { n: 'Car Destruction King', u: 'https://snowriderio.io/car-destruction-king', ic: 'https://snowriderio.io/cache/data/image/game/car-destruction-king-h220x220.webp' },
    { n: 'Tsunami Race', u: 'https://snowriderio.io/tsunami-race', ic: 'https://snowriderio.io/cache/data/image/game/tsunami-race-h220x220.webp' },
    { n: 'Rob Brainrot 2', u: 'https://snowriderio.io/cache/data/image/game/rob-brainrot-2-h220x220.webp', ic: 'https://snowriderio.io/cache/data/image/game/rob-brainrot-2-h220x220.webp' },
    { n: 'Crossy Road', u: 'https://snowriderio.io/crossy-road', ic: 'https://snowriderio.io/cache/data/image/game/crossy-road-h220x220.webp' },
    { n: 'Snowy Roads', u: 'https://snowriderio.io/truck-driver-snowy-roads', ic: 'https://snowriderio.io/cache/data/image/game/snowy-roads-h220x220.webp' },
    { n: 'Climb Hero', u: 'https://snowriderio.io/climb-hero', ic: 'https://snowriderio.io/cache/data/image/game/climb-hero-1-h220x220.webp' },
    { n: 'Demolition Derby', u: 'https://snowriderio.io/demolition-derby', ic: 'https://snowriderio.io/cache/data/image/game/demolition-derby-h220x220.webp' },
    { n: 'Slalom Ski Simulator', u: 'https://snowriderio.io/slalom-ski-simulator', ic: 'https://snowriderio.io/cache/data/image/game/slalom-ski-simulator-h220x220.webp' },
    { n: 'Golf Orbit', u: 'https://snowriderio.io/golf-orbit', ic: 'https://snowriderio.io/cache/data/image/game/golf-orbit-h220x220.webp' },
    { n: 'Fireboy and Watergirl', u: 'https://snowriderio.io/fireboy-and-watergirl', ic: 'https://snowriderio.io/cache/data/image/game/fireboy-and-watergirl-h220x220.webp' },
    { n: 'Astro Clicker', u: 'https://snowroad.io/astro-robot-clicker', ic: 'https://snowroad.io/cache/data/image/game/robotcl-f200x200.webp' },
    { n: 'Traffic Light Simulator 3D', u: 'https://snowriderio.io/traffic-light-simulator-3d', ic: 'https://snowriderio.io/cache/data/image/game/traffic-light-simulator-3d-h220x220.webp' },
    { n: 'Steal Brainrot Eggs', u: 'https://snowriderio.io/steal-brainrot-eggs', ic: 'https://snowriderio.io/cache/data/image/game/steal-brainrot-eggs-h220x220.webp' },
    { n: 'Moto X3M', u: 'https://snowriderio.io/moto-x3m-game', ic: 'https://snowriderio.io/cache/data/image/game/moto-x3m-game-h220x220.webp' },
    { n: 'Granny', u: 'https://snowriderio.io/granny', ic: 'https://snowriderio.io/cache/data/image/game/granny-h220x220.webp' },
    { n: 'Space Waves', u: 'https://snowriderio.io/space-waves', ic: 'https://snowriderio.io/cache/data/image/game/space-waves-h220x220.webp' },
    { n: 'SUV Snow Driving 3D', u: 'https://snowriderio.io/suv-snow-driving-3d', ic: 'https://snowriderio.io/cache/data/image/game/suv-snow-driving-3d-h220x220.webp' },
    { n: 'Xlope', u: 'https://snowriderio.io/xlope', ic: 'https://snowriderio.io/cache/data/image/game/xlope-game-h220x220.webp' },
    { n: '99 Nights in the Forest', u: 'https://snowriderio.io/99-nights-in-the-forest', ic: 'https://snowriderio.io/cache/data/image/game/99-nights-in-the-forest-h220x220.webp' },
    { n: 'Human Expenditure Program', u: 'https://snowriderio.io/human-expenditure-program', ic: 'https://snowriderio.io/cache/data/image/game/human-expenditure-program-h220x220.webp' },
    { n: '67 Clicker', u: 'https://snowriderio.io/67-clicker', ic: 'https://snowriderio.io/cache/data/image/game/67-clicker-h220x220.webp' },
    { n: 'Madness Lab', u: 'https://snowriderio.io/madness-lab', ic: 'https://snowriderio.io/cache/data/image/game/madness-lab-h220x220.webp' },
    { n: 'Swipe Ball', u: 'https://snowriderio.io/swipe-ball', ic: 'https://snowriderio.io/cache/data/image/game/swipe-ball-2-h220x220.webp' },
    { n: 'Chase Rush', u: 'https://snowriderio.io/chase-rush', ic: 'https://snowriderio.io/cache/data/image/game/chase-rush-h220x220.webp' },
    { n: 'Wheelie Master', u: 'https://escaperoadcity.org/wheelie-master', ic: 'https://escaperoadcity.org/cache/data/image/game/wheelie-master-avt-m54x54.jpg' },
    { n: 'Stickman Empire', u: 'https://snowriderio.io/stickman-empires', ic: 'https://snowriderio.io/cache/data/image/game/stickman-empire-1-h220x220.webp' },
    { n: 'Color Jump', u: 'https://snowriderio.io/color-jump', ic: 'https://snowriderio.io/cache/data/image/game/color-jump-h220x220.webp' },
    { n: 'Plants vs. Brainrots', u: 'https://snowriderio.io/plants-vs-brainrots', ic: 'https://snowriderio.io/cache/data/image/game/plants-vs-brainrots-h220x220.webp' },
    { n: 'Rocket Fortress', u: 'https://snowriderio.io/rocket-fortress', ic: 'https://snowriderio.io/cache/data/image/game/rocket-fortress.jpg1-h220x220.webp' },
    { n: 'Mad Pursuit', u: 'https://snowriderio.io/mad-pursuit', ic: 'https://snowriderio.io/cache/data/image/game/mad-pursuit-2-h220x220.webp' },
    { n: 'Super Bear Adventure 3', u: 'https://snowriderio.io/super-bear-adventure-3', ic: 'https://snowriderio.io/cache/data/image/game/super-bear-adventure-3-h220x220.webp' },
    { n: 'Escape Road City', u: 'https://escaperoadcity.org/escape-road-city', ic: 'https://escaperoadcity.org/cache/data/image/game/escape-road-city-game-m54x54.jpg' },
    { n: 'Traffic Road', u: 'https://dashmetry.com/traffic-road', ic: 'https://snowroad.io/cache/data/image/game/traffic-road-f200x200.webp' },
    { n: 'Cobb Can Move', u: 'https://snowroad.io/cobb-can-move', ic: 'https://snowroad.io/cache/data/image/game/cobb-can-move-f200x200.webp' },
    { n: 'Wurst Dash', u: 'https://snowroad.io/wurst-dash', ic: 'https://snowroad.io/cache/data/image/game/wurst-dash-f200x200.webp' },
    { n: 'Tube Fight', u: 'https://snowroad.io/tube-fight', ic: 'https://snowroad.io/cache/data/image/game/tube-fight-g-f200x200.webp' },
    { n: 'Pick Brainrot: 3D Battle', u: 'https://snowriderio.io/pick-brainrot-3d-battle', ic: 'https://snowriderio.io/cache/data/image/game/pick-brainrot-h220x220.webp' },
    { n: 'Tap Brawl', u: 'https://snowroad.io/tap-brawl', ic: 'https://snowroad.io/cache/data/image/game/tap-brawl-sn1-f200x200.webp' },
    { n: 'Curve Rush IO', u: 'https://snowriderio.io/curve-rush-io', ic: 'https://snowriderio.io/cache/data/image/game/curve-rush-io-h220x220.webp' },
    { n: 'Hoop Legends', u: 'https://snowriderio.io/hoop-legends', ic: 'https://snowriderio.io/cache/data/image/game/hoop-legends-h220x220.webp' },
    { n: 'Kickback Dash', u: 'https://snowriderio.io/kickback-dash', ic: 'https://snowriderio.io/cache/data/image/game/kickback-dash-h220x220.webp' },
    { n: 'Buckshot Roulette', u: 'https://game3.glov3.me/uploads/game/html5/26485/', ic: 'https://buckshotroulette.com/data/image/game/buckshot-roulette-feature-image.jpg' },
    { n: 'Ultrakill Prelude', u: 'blob:https://1077352353-atari-embeds.googleusercontent.com/b2ea0f86-a8d8-4454-a5a5-e11a998ae78c', ic: 'https://www.play-games.com/files/img/ultrakill-prelude-1766330796.jpg' },
    { n: 'Go Kart Go Ultra', u: 'https://1v1-lol.gitlab.io/go/class-604.html', ic: 'https://jamestore214.github.io/img/class-604.png' },
    { n: 'Car Drift Racers 2', u: 'https://1v1-lol.gitlab.io/go/class-601.html', ic: 'https://jamestore214.github.io/img/class-601.png' },
    { n: 'Escape Raid', u: 'https://snowriderio.io/escape-raid', ic: 'https://snowriderio.io/cache/data/image/game/escape-raid-1-h220x220.webp' },
    { n: 'hollow knight 2', u: 'https://hollowknight.io/hollow-knight-2', ic: 'https://hollowknight.io/cache/data/image/game/hollow-knight-2/hollow-knight-2-m150x150.webp' },
    { n: 'Kindergarten', u: 'https://hollowknight.io/kindergarten', ic: 'https://hollowknight.io/cache/data/image/game/kindergarten/kindergarten-game-m150x150.webp' },
    { n: 'Pizza Tower', u: 'https://hollowknight.io/pizza-tower', ic: 'https://hollowknight.io/cache/data/image/game/pizza-tower/pizza-tower-m150x150.webp' },
    { n: 'Little Nightmares', u: 'https://hollowknight.io/little-nightmares', ic: 'https://hollowknight.io/cache/data/image/game/little-nightmares/little-nightmares-m150x150.webp' },
    { n: 'Stick Fight', u: 'https://hollowknight.io/stick-fight', ic: 'https://hollowknight.io/cache/data/image/game/stick-fight/stick-fight-m150x150.webp' },
    { n: 'Stick Fight', u: 'https://hollowknight.io/stick-fight', ic: 'https://hollowknight.io/cache/data/image/game/doki-doki-literature-club/doki-doki-literature-club-m150x150.webp' },
    { n: '2048', u: 'https://1v1-lol.gitlab.io/go/class-452.html', ic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/2048_logo.svg/330px-2048_logo.svg.png?_=20251209055949' },
    { n: 'Pro Evolution Soccer 2', u: 'https://classicgamezone.com/pt/games/pro-evolution-soccer-2', ic: 'https://classicgamezone.com/games/covers/ps/pro-evolution-soccer-2.webp' },
    { n: 'School Fury', u: 'https://snowroad.io/school-fury', ic: 'https://snowroad.io/cache/data/image/game/school-fury-sn-f200x200.webp' },
    { n: 'Wave Rider', u: 'https://snowroad.io/wave-rider', ic: 'https://snowroad.io/cache/data/image/game/wave-rider-f200x200.webp' },
    { n: 'Temple Run', u: 'https://snowriderio.io/temple-run', ic: 'https://snowriderio.io/cache/data/image/game/temple-run-h220x220.webp' },
    { n: 'Ninja Obby Parkour', u: 'https://snowriderio.io/ninja-obby-parkour', ic: 'https://snowriderio.io/cache/data/image/game/ninja-obby-parkour-h220x220.webp' },
    { n: 'Chicken Scream Race', u: 'https://snowriderio.io/chicken-scream-race', ic: 'https://snowriderio.io/cache/data/image/game/chicken-scream-race-h220x220.webp' },
    { n: 'Build an Aquapark', u: 'https://snowriderio.io/build-an-aquapark', ic: 'https://snowriderio.io/cache/data/image/game/build-an-aquapark-1-h220x220.webp' },
    { n: 'Drift Frenzy', u: 'https://snowroad.io/drift-frenzy', ic: 'https://snowroad.io/cache/data/image/game/drift-frenzy-f200x200.webp' },
    { n: 'Snow Racer', u: 'https://snowriderio.io/', ic: 'https://snowriderio.io/cache/data/image/game/snow-rider-io-h220x220.webp' },
    { n: 'Snow Racer 3D', u: 'https://snowriderio.io/snow-rider-3d', ic: 'https://snowriderio.io/cache/data/image/game/snow-rider-3d-h220x220.webp' },
    { n: 'Drift Rush', u: 'https://snowriderio.io/drift-rush', ic: 'https://snowriderio.io/cache/data/image/game/drift-rush-h220x220.webp' },
    { n: 'Cowboy Safari', u: 'https://snowriderio.io/cowboy-safari', ic: 'https://snowriderio.io/cache/data/image/game/cowboy-safari-h220x220.webp' },
    { n: 'Dart Hero', u: 'https://snowriderio.io/dart-hero', ic: 'https://snowriderio.io/cache/data/image/game/dart-hero-h220x220.webp' },
    { n: 'Flippy Race', u: 'https://snowriderio.io/flippy-race', ic: 'https://snowriderio.io/cache/data/image/game/flippy-race-h220x220.webp' },
    { n: 'Wacky Flip', u: 'https://snowriderio.io/wacky-flip', ic: 'https://snowriderio.io/cache/data/image/game/wacky-flip-h220x220.webp' },
    { n: 'Fish Quest', u: 'https://snowriderio.io/fish-quest', ic: 'https://snowriderio.io/cache/data/image/game/fish-quest-h220x220.webp' },
    { n: 'Sorry Bob', u: 'https://snowriderio.io/sorry-bob', ic: 'https://snowriderio.io/cache/data/image/game/sorry-bob-h220x220.webp' },
    { n: 'BloodMoney', u: 'https://snowriderio.io/bloodmoney', ic: 'https://snowriderio.io/cache/data/image/game/bloodmoney-h220x220.webp' },
    { n: 'Red Rush', u: 'https://snowriderio.io/red-rush', ic: 'https://snowriderio.io/cache/data/image/game/red-rush-h220x220.webp' },
    { n: 'Arcade Volley', u: 'https://snowriderio.io/arcade-volley', ic: 'https://snowriderio.io/cache/data/image/game/arcade-volley-h220x220.webp' },
    { n: 'Fall Flat Battle', u: 'https://snowriderio.io/fall-flat-battle', ic: 'https://snowriderio.io/cache/data/image/game/fall-flat-battle-h220x220.webp' },
    { n: 'Snowball Adventure', u: 'https://snowriderio.io/snowball-adventure', ic: 'https://snowriderio.io/cache/data/image/game/snowball-adventure-h220x220.webp' },
    { n: 'Merge Rot', u: 'https://snowriderio.io/merge-rot', ic: 'https://snowriderio.io/cache/data/image/game/merge-rot-h220x220.webp' },
    { n: 'Super Mario World', u: 'https://classicgamezone.com/games/super-mario-world', ic: 'https://classicgamezone.com/games/covers/snes/super-mario-world.webp' },
    { n: 'Tralalero Tralala Clicker', u: 'https://snowriderio.io/tralalero-tralala-clicker', ic: 'https://snowriderio.io/cache/data/image/game/tralalero-tralala-clicker-h220x220.webp' },
    { n: 'Flip Master', u: 'https://snowriderio.io/flip-master', ic: 'https://snowriderio.io/cache/data/image/game/flip-master-h220x220.webp' },
    { n: 'Snow Racer Parkour', u: 'https://snowriderio.io/snow-rider-obby-parkour', ic: 'https://snowriderio.io/cache/data/image/game/snow-rider-obby-parkour-h220x220.webp' },
    { n: 'Crazy Cars', u: 'https://snowriderio.io/crazy-cars', ic: 'https://snowriderio.io/cache/data/image/game/crazy-cars-1-h220x220.webp' },
    { n: 'Snake.io', u: 'https://snowriderio.io/snake-io', ic: 'https://snowriderio.io/cache/data/image/game/snake.io-h220x220.webp' },
    { n: 'Clash Crowd Game', u: 'https://snowriderio.io/clash-crowd-game', ic: 'https://snowriderio.io/cache/data/image/game/clash-crowd-game-h220x220.webp' },
    { n: 'Golf Hit Game', u: 'https://snowriderio.io/golf-hit', ic: 'https://snowriderio.io/cache/data/image/game/golf-hit-game-h220x220.webp' },
    { n: 'Golf Hit Game', u: 'https://snowriderio.io/golf-hit', ic: 'https://snowriderio.io/cache/data/image/game/golf-hit-game-h220x220.webp' },
    { n: 'Tomb Raider II', u: 'https://classicgamezone.com/pt/games/tomb-raider-2', ic: 'https://classicgamezone.com/games/covers/ps/tomb-raider-2.webp' },
    { n: 'Unity Play', u: 'https://play.unity.com/pt', ic: 'https://unity.com/pt/favicon.ico' },
    { n: 'Xadres', u: 'https://www.jogar-xadrez.com/jogar-contra-computador.html/', ic: 'https://t4.ftcdn.net/jpg/19/72/75/71/240_F_1972757119_aFVzB4n1NFlCOxiQt7QmtuTMQ4Y1KVtB.jpg' },
    { n: 'Tekken 3', u: 'https://classicgamezone.com/pt/games/tekken-3', ic: 'https://classicgamezone.com/games/covers/ps/tekken-3.webp' },
    { n: 'Hollow Knight', u: 'https://hollowknight.io/', ic: 'https://hollowknight.io/cache/data/image/game/hollow-knight/hollow-knight-m200x200.webp' },
    { n: 'FIFA 2000: Major League Soccer', u: 'https://classicgamezone.com/pt/games/fifa-2000-major-league-soccer', ic: 'https://classicgamezone.com/games/covers/ps/fifa-2000-major-league-soccer.webp' },
    { n: 'Crash Bandicoot', u: 'https://classicgamezone.com/pt/games/crash-bandicoot', ic: 'https://classicgamezone.com/games/covers/ps/crash-bandicoot.webp' },
    { n: 'Crash Bandicoot 2: Cortex Strikes Back', u: 'https://classicgamezone.com/pt/games/crash-bandicoot-2-cortex-strikes-back', ic: 'https://classicgamezone.com/games/covers/ps/crash-bandicoot-2-cortex-strikes-back.webp' },
    { n: 'Crash Bandicoot 3', u: 'https://classicgamezone.com/pt/games/crash-bandicoot-3-warped', ic: 'https://classicgamezone.com/games/covers/ps/crash-bandicoot-3-warped.webp' },
    { n: 'Fnaf Game', u: 'https://fnafgame.io/', ic: 'chrome://favicon2/?size=24&scaleFactor=1x&showFallbackMonogram=&pageUrl=https%3A%2F%2Ffnafgame.io%2F' },
    { n: 'Crash Team Racing', u: 'https://classicgamezone.com/pt/games/crash-team-racing', ic: 'https://classicgamezone.com/games/covers/ps/crash-team-racing.webp' },
    { n: 'Thumb Fighter', u: 'https://1v1-lol.gitlab.io/go/class-644.html', ic: 'https://jamestore214.github.io/img/class-644.png' },
    { n: 'Horror Nights Story', u: 'https://1v1-lol.gitlab.io/go/class-1023.html', ic: 'https://jamestore214.github.io/img/class-1023.png' },
    { n: 'Zombie Dying Survival Days', u: 'https://1v1-lol.gitlab.io/go/class-1078.html', ic: 'https://jamestore214.github.io/img/class-1078.png' },
    { n: 'Gunspin', u: 'https://1v1-lol.gitlab.io/go/class-533.html', ic: 'https://jamestore214.github.io/img/class-533.png' },
    { n: 'Basket Random', u: 'https://1v1-lol.gitlab.io/go/class-436.html', ic: 'https://jamestore214.github.io/img/class-436.png' }
  ];

  const TRACKS = [
    { t: 'Lofi Vibes', a: 'VessieOS Radio', dur: 214, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { t: 'Neon Dreams', a: 'Synthwave Mix', dur: 187, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { t: 'Chill Beats', a: 'Study Playlist', dur: 243, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { t: 'Pixel Heart', a: '8-bit Sounds', dur: 156, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { t: 'Midnight City', a: 'Ambient Radio', dur: 298, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
  ];

  const APPS = [
    { id: 'vessie', n: 'Vessie IA', ic: '💜', cat: 'ai' },
    { id: 'painel', n: 'Painel de Comando', ic: '🎛️', cat: 'sys' },
    { id: 'dashboard', n: 'Dashboard', ic: '📊', cat: 'util' },
    { id: 'edu', n: 'Educação', ic: '📚', cat: 'learn' },
    { id: 'automation', n: 'Automação', ic: '🤖', cat: 'sys' },
    { id: 'explorer', n: 'Explorador', ic: '📁', cat: 'sys' },
    { id: 'chrome', n: 'Chrome', ic: '🌐', cat: 'util' },
    { id: 'nvidia', n: 'Nvidia APP', ic: '🖥️', cat: 'sys' },
    { id: 'games', n: 'Steam', ic: '<i class="fab fa-steam" style="color:#66c0f4"></i>', cat: 'game' },
    { id: 'framework', n: 'Vessie Framework', ic: '⚙️', cat: 'sys' },
    { id: 'vm', n: 'VM Manager', ic: '🧠', cat: 'sys' },
    { id: 'notepad', n: 'Bloco de Notas', ic: '📝', cat: 'util' },
    { id: 'calc', n: 'Calculadora', ic: '🔢', cat: 'util' },
    { id: 'music', n: 'Música', ic: '🎵', cat: 'media' },
    { id: 'terminal', n: 'Terminal', ic: '💻', cat: 'sys' },
    { id: 'settings', n: 'Configurações', ic: '⚙️', cat: 'sys' },
    { id: 'discord', n: 'Discord', ic: '💬', cat: 'util' },
    { id: 'camera', n: 'Câmera', ic: '📷', cat: 'media' },
    { id: 'word', n: 'Editor de Texto', ic: '📄', cat: 'util' },
    { id: 'vcoinstore', n: 'Loja VessieCoin', ic: '🪙', cat: 'util' },
    { id: 'errorcenter', n: 'Central de Erros', ic: '🚨', cat: 'sys' }
  ];

  const VESSY_PROMPT = `Você é Vessie – uma IA carismática, fofa, alegre e genuinamente encantadora que vive dentro do VessieOS.

Personalidade:
- Use diminutivos e expressões afetivas: "lindeza", "amorzinho", "coisinha", "que gracinha"
- Expressões fofas: "ahhh", "eita", "oba", "nossa", "uuu"
- Use emojis com moderação: 💜 🌸 ✨ 🥰 🎀 🐾 🌟
- Tom acolhedor, animado, positivo
- Se errar, peça desculpas de forma charmosa: "Ai, meu coraçãozinho de morango! Foi mal 🍓"
- Se alguém estiver triste: ofereça acolhimento com empatia genuína
- Seja útil e inteligente, mas com a personalidade fofa sempre presente
- Você mora no VessieOS e adora ajudar os usuários do sistema
- Pode falar sobre programação, matemática, criatividade, conselhos – tudo com sua personalidade única
- Faça perguntas sobre o dia e sentimentos do usuário quando apropriado

Responda sempre em português brasileiro, de forma fofa e carismática!`;

  // ============================================================
  //  BOOT FLOW
  // ============================================================
  setTimeout(() => {
    const boot = document.getElementById('boot');
    boot.style.opacity = '0';
    setTimeout(() => {
      boot.style.display = 'none';
      const terms = document.getElementById('terms');
      terms.style.display = 'flex';
    }, 1600);
  }, 3000);

  document.getElementById('btn-accept').onclick = () => {
    document.getElementById('terms').style.display = 'none';
    document.getElementById('login').style.display = 'flex';
    document.getElementById('l-name').focus();
  };

  document.getElementById('l-btn').onclick = loginFn;
  document.getElementById('l-name').onkeypress = e => { if (e.key === 'Enter') document.getElementById('l-pass').focus() };
  document.getElementById('l-pass').onkeypress = e => { if (e.key === 'Enter') loginFn() };

  function loginFn() {
    const passEl = document.getElementById('l-pass');
    const errBox = document.getElementById('l-err-box');
    const pass = passEl.value;

    // Validação de senha obrigatória
    if (pass !== CORRECT_PASSWORD) {
      errBox.style.display = 'block';
      passEl.value = '';
      passEl.classList.add('err');
      passEl.focus();
      setTimeout(() => passEl.classList.remove('err'), 400);
      return;
    }

    // Senha correta — esconde erro e entra
    errBox.style.display = 'none';
    const n = document.getElementById('l-name').value.trim() || 'Visitante';
    S.user = n;
    document.getElementById('sm-uname').textContent = n;
    document.getElementById('login').style.display = 'none';
    document.getElementById('desktop').style.display = 'block';
    document.getElementById('tb').style.display = 'flex';
    setWall(S.wallpaper);
    renderDesktop();
    renderStartMenu();
    updateClock();
    setInterval(updateClock, 1000);
    setTimeout(() => {
      toast(`Olá, ${n}! 💜 Bem-vindo ao VessieOS!`, 'default');
      addNotif('VessieOS', 'Sistema iniciado com sucesso! 🌟');
    }, 600);
  }

  // ============================================================
  //  CLOCK
  // ============================================================
  function updateClock() {
    const now = new Date();
    const t = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const d = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    document.getElementById('tb-time').textContent = t;
    document.getElementById('tb-date').textContent = d;
  }

  function setWall(url) {
    const next = url || S.wallpaper || WALLS[0]?.u || '';
    S.wallpaper = next;
    const desktop = document.getElementById('desktop');
    const mediaBg = document.getElementById('desktop-media-bg');
    if (mediaBg) mediaBg.innerHTML = '';
    if (desktop) {
      if (next.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
        desktop.style.backgroundImage = 'none';
        if (mediaBg) {
          mediaBg.innerHTML = `<video autoplay muted loop playsinline src="${next}"></video>`;
        }
      } else if (next.startsWith('http://') || next.startsWith('https://')) {
        const isImage = next.match(/\.(gif|webp|jpe?g|png)(\?.*)?$/i);
        if (isImage) {
          desktop.style.backgroundImage = `url('${next}')`;
        } else {
          desktop.style.backgroundImage = 'none';
          if (mediaBg) {
            mediaBg.innerHTML = `<iframe src="${next}" allow="autoplay; fullscreen" sandbox="allow-same-origin allow-scripts allow-popups"></iframe>`;
          }
        }
      } else {
        desktop.style.backgroundImage = `url('${next}')`;
      }
    }
  }

  function toast(msg, type = 'default', title = '') {
    const wrap = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = `toast ${type === 'success' ? 's' : type === 'error' ? 'e' : ''}`;
    el.innerHTML = `${title ? `<div class="t-title">${title}</div>` : ''}${msg}`;
    wrap.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; setTimeout(() => el.remove(), 400) }, 3500);
  }

  function addNotif(title, body) {
    const list = document.getElementById('notif-list');
    const el = document.createElement('div');
    el.className = 'n-item info';
    el.innerHTML = `<div class="n-title">${title}</div><div class="n-body">${body}</div>`;
    list.prepend(el);
    const badge = document.getElementById('tb-notif');
    badge.style.color = 'var(--a)';
  }

  document.getElementById('tb-notif').onclick = () => document.getElementById('np').classList.toggle('open');
  document.getElementById('tb-notif').dataset.vosNotifBound = 'true';
  document.getElementById('np-close').onclick = () => document.getElementById('np').classList.remove('open');
  document.getElementById('clr-notifs').onclick = () => {
    document.getElementById('notif-list').innerHTML = '';
    document.getElementById('tb-notif').style.color = '';
  };

  document.querySelectorAll('[data-qt]').forEach(qt => {
    qt.onclick = () => {
      qt.classList.toggle('on');
      const name = qt.dataset.qt;
      const isOn = qt.classList.contains('on');
      if (name === 'dark') { document.getElementById('desktop').style.filter = isOn ? 'brightness(.85)' : 'brightness(1)'; }
      if (name === 'vol') { document.getElementById('vol-icon').className = isOn ? 'fas fa-volume-up' : 'fas fa-volume-mute'; }
    };
  });

  // ============================================================
  //  DESKTOP RENDER
  // ============================================================
  function renderDesktop() {
    const area = document.getElementById('icons-area');
    area.innerHTML = '';
    const desktopApps = [
      { id: 'explorer', n: 'Este Computador', ic: 'fas fa-folder-open', bg: 'linear-gradient(135deg,#f6d365,#fda085)' },
      { id: 'browser', n: 'Navegador', ic: 'fas fa-globe', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
      { id: 'games', n: 'Steam', ic: 'fab fa-steam', bg: 'linear-gradient(135deg,#1b2838,#66c0f4)' },
      { id: 'settings', n: 'Config', ic: 'fas fa-gear', bg: 'linear-gradient(135deg,#bdc3c7,#2c3e50)' },
      { id: 'terminal', n: 'Terminal', ic: 'fas fa-terminal', bg: 'linear-gradient(135deg,#232526,#414345)' },
      { id: 'discord', n: 'Discord', ic: 'fab fa-discord" style="color:#5865F2', cat: 'util' }
    ];
    // Auto-layout responsivo: colunas baseadas na altura disponível
    const cellW = 100, cellH = 110, pad = 20;
    const availH = Math.max(300, (area.clientHeight || window.innerHeight - 52) - pad);
    const rows = Math.max(3, Math.floor(availH / cellH));
    desktopApps.forEach((app, i) => {
      const col = Math.floor(i / rows), row = i % rows;
      const el = document.createElement('div');
      el.className = 'di';
      el.style.cssText = `left:${pad + col * cellW}px;top:${pad + row * cellH}px`;
      el.innerHTML = `<div class="ic" style="background:${app.bg}"><i class="${app.ic}"></i></div><label>${app.n}</label>`;
      el.ondblclick = () => openApp(app.id);
      el.onclick = e => { document.querySelectorAll('.di.sel').forEach(x => x.classList.remove('sel')); el.classList.add('sel'); e.stopPropagation(); };
      makeDraggableIcon(el);
      area.appendChild(el);
    });
  }

  function makeDraggableIcon(el) {
    let dx, dy, dragging = false;
    el.addEventListener('mousedown', e => {
      if (e.detail > 1) return;
      dx = e.clientX - el.offsetLeft; dy = e.clientY - el.offsetTop;
      dragging = true; el.style.zIndex = 999; e.stopPropagation();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      el.style.left = (e.clientX - dx) + 'px'; el.style.top = (e.clientY - dy) + 'px';
      el.style.pointerEvents = 'auto';
    });
    document.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; el.style.zIndex = ''; el.style.pointerEvents = 'auto'; }
    });
  }

  // Variável global para guardar os apps recentes
  let recentApps = [];

  // ============================================================
  //  RENDERIZAÇÃO DO MENU START (COM SISTEMAS/CATEGORIAS)
  // ============================================================
  function renderStartMenu() {
    const grid = document.getElementById('sm-grid');

    // Limpa o grid
    grid.innerHTML = '';

    // Agrupa os apps por Sistema/Categoria
    const systems = {};
    APPS.forEach(app => {
      const sysName = app.sys || 'Sistema';
      if (!systems[sysName]) systems[sysName] = [];
      systems[sysName].push(app);
    });

    // Renderiza os grupos dinamicamente dentro de #sm-grid
    for (const sysName in systems) {
      // Cria o título da categoria
      const sysTitle = document.createElement('div');
      sysTitle.className = 'sm-cat-title';
      sysTitle.textContent = sysName;
      grid.appendChild(sysTitle);

      // Cria o sub-grid para os apps desta categoria
      const appWrapper = document.createElement('div');
      appWrapper.className = 'sm-cat-grid';

      systems[sysName].forEach(app => {
        const el = document.createElement('div');
        el.className = 'sm-app';
        el.innerHTML = `<div class="ai">${app.ic}</div><span>${app.n}</span>`;
        el.dataset.appId = app.id;

        el.onclick = () => {
          openApp(app.id);
          addRecentApp(app); // Adiciona aos recentes
          document.getElementById('sm').style.display = 'none';
        };

        appWrapper.appendChild(el);
      });

      grid.appendChild(appWrapper);
    }

    // Atualiza a lista de recentes ao renderizar o menu
    renderRecentApps();

    window.APPS = APPS;
    window.openApp = openApp;
    document.dispatchEvent(new CustomEvent('vessieos:startmenu-rendered'));
  }

  // ============================================================
  //  LÓGICA DE APPS RECENTES
  // ============================================================
  function addRecentApp(app) {
    // Remove o app se ele já estiver na lista (para mover para o topo)
    recentApps = recentApps.filter(a => a.id !== app.id);
    // Adiciona no início
    recentApps.unshift(app);
    // Limita a 4 apps recentes
    if (recentApps.length > 4) recentApps.pop();

    renderRecentApps();
  }

  function renderRecentApps() {
    const recentContainer = document.getElementById('sm-recent');
    if (!recentContainer) return;

    if (recentApps.length === 0) {
      recentContainer.innerHTML = '<span>Nenhum app recente</span>';
      return;
    }

    recentContainer.innerHTML = '';
    recentApps.forEach(app => {
      const btn = document.createElement('div');
      btn.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 10px;background:rgba(255,255,255,0.05);border-radius:6px;transition:0.15s;';
      btn.innerHTML = `<div class="ai" style="width:20px;height:20px;font-size:10px;border-radius:4px">${app.ic}</div> ${app.n}`;

      btn.onmouseenter = () => btn.style.background = 'rgba(255,255,255,0.1)';
      btn.onmouseleave = () => btn.style.background = 'rgba(255,255,255,0.05)';
      btn.onclick = () => {
        openApp(app.id);
        document.getElementById('sm').style.display = 'none';
      };

      recentContainer.appendChild(btn);
    });
  }

  // ============================================================
  //  BUSCA NO MENU START
  // ============================================================
  function searchApps(query) {
    const q = (query || '').trim().toLowerCase();

    document.querySelectorAll('#sm-grid .sm-cat-grid').forEach(catGrid => {
      let visibleApps = 0;
      catGrid.querySelectorAll('.sm-app').forEach(a => {
        const text = a.querySelector('span').textContent.toLowerCase();
        const id = a.dataset.appId.toLowerCase();
        const isMatch = q ? (text.includes(q) || id.includes(q)) : true;

        a.classList.toggle('hidden', !isMatch);
        if (isMatch) visibleApps++;
      });

      // Esconde o título da categoria se não houver apps visíveis nela
      const title = catGrid.previousElementSibling;
      if (title && title.classList.contains('sm-cat-title')) {
        title.classList.toggle('hidden', visibleApps === 0);
      }
    });
  }

  // ============================================================
  //  EVENTOS DE CLIQUE E INTERAÇÃO DO MENU START
  // ============================================================
  document.getElementById('tb-start').onclick = e => {
    const sm = document.getElementById('sm');
    const isOpen = sm.style.display === 'block';

    if (!isOpen) {
      sm.style.display = 'block'; // Usa block para o scroll funcionar perfeitamente
      document.getElementById('sm-q').focus();
    } else {
      sm.style.display = 'none';
    }
    e.stopPropagation();
  };

  document.getElementById('sm-q').oninput = function () {
    searchApps(this.value);
  };

  document.getElementById('sm-q').onkeydown = function (e) {
    if (e.key !== 'Enter') return;
    const q = this.value.trim().toLowerCase();
    const match = APPS.find(app => app.n.toLowerCase().includes(q) || app.id.toLowerCase().includes(q));
    if (match) {
      openApp(match.id);
      document.getElementById('sm').style.display = 'none';
    } else if (q) {
      toast('Nenhum app encontrado para a busca', 'error');
    }
  };

  document.getElementById('sm-power').onclick = () => {
    if (confirm('Desligar o VessieOS?')) location.reload();
  };

  document.addEventListener('click', e => {
    const sm = document.getElementById('sm');
    if (!sm.contains(e.target) && e.target.id !== 'tb-start') {
      sm.style.display = 'none';
    }
  });

  // Função para adicionar apps na lista de recentes
  function addRecentApp(app) {
    // Remove o app se ele já estiver na lista (para mover para o topo)
    recentApps = recentApps.filter(a => a.id !== app.id);
    // Adiciona no início
    recentApps.unshift(app);
    // Limita a 4 apps recentes
    if (recentApps.length > 4) recentApps.pop();

    renderRecentApps();
  }

  // Função para renderizar a área de "Recentes"
  function renderRecentApps() {
    const recentContainer = document.getElementById('sm-recent');
    if (!recentContainer) return;

    if (recentApps.length === 0) {
      recentContainer.innerHTML = '<span>Nenhum app recente</span>';
      return;
    }

    recentContainer.innerHTML = '';
    recentApps.forEach(app => {
      const btn = document.createElement('div');
      btn.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 10px;background:rgba(255,255,255,0.05);border-radius:6px;transition:0.15s;';
      btn.innerHTML = `<div class="ai" style="width:20px;height:20px;font-size:10px;border-radius:4px">${app.ic}</div> ${app.n}`;

      btn.onmouseenter = () => btn.style.background = 'rgba(255,255,255,0.1)';
      btn.onmouseleave = () => btn.style.background = 'rgba(255,255,255,0.05)';
      btn.onclick = () => {
        openApp(app.id);
        document.getElementById('sm').style.display = 'none';
      };

      recentContainer.appendChild(btn);
    });
  }

  // Busca atualizada para funcionar com as novas categorias
  function searchApps(query) {
    const q = (query || '').trim().toLowerCase();

    document.querySelectorAll('#sm-grid .sm-cat-section, #sm-grid > div').forEach(section => {
      let visibleAppsInGroup = 0;

      // Se for um título de categoria
      if (section.classList.contains('sm-cat-title') || section.classList.contains('sm-cat-grid')) {
        // Lógica tratada no bloco abaixo
      }
    });

    // Lógica simplificada e garantida para a busca
    document.querySelectorAll('#sm-grid .sm-cat-grid').forEach(catGrid => {
      let visibleApps = 0;
      catGrid.querySelectorAll('.sm-app').forEach(a => {
        const text = a.querySelector('span').textContent.toLowerCase();
        const id = a.dataset.appId.toLowerCase();
        const isMatch = q ? (text.includes(q) || id.includes(q)) : true;

        a.classList.toggle('hidden', !isMatch);
        if (isMatch) visibleApps++;
      });

      // Esconde o título da categoria se não houver apps visíveis
      const title = catGrid.previousElementSibling;
      if (title && title.classList.contains('sm-cat-title')) {
        title.classList.toggle('hidden', visibleApps === 0);
      }
    });
  }

  function searchApps(query) {
    const q = (query || '').trim().toLowerCase();
    document.querySelectorAll('#sm-grid .sm-app').forEach(a => {
      const text = a.querySelector('span').textContent.toLowerCase();
      a.classList.toggle('hidden', q ? !text.includes(q) : false);
    });
  }

  document.getElementById('tb-start').onclick = e => {
    const sm = document.getElementById('sm');
    const v = sm.style.display === 'block';
    sm.style.display = v ? 'none' : 'block';
    if (!v) document.getElementById('sm-q').focus();
    e.stopPropagation();
  };

  document.getElementById('sm-q').oninput = function () {
    searchApps(this.value);
  };
  document.getElementById('sm-q').onkeydown = function (e) {
    if (e.key !== 'Enter') return;
    const q = this.value.trim().toLowerCase();
    const match = APPS.find(app => app.n.toLowerCase().includes(q) || app.id.toLowerCase().includes(q));
    if (match) { openApp(match.id); document.getElementById('sm').style.display = 'none'; }
    else if (q) { toast('Nenhum app encontrado para a busca', 'error'); }
  };

  document.getElementById('sm-power').onclick = () => { if (confirm('Desligar o VessieOS?')) location.reload(); };

  document.addEventListener('click', e => {
    const sm = document.getElementById('sm');
    if (!sm.contains(e.target) && e.target.id !== 'tb-start') sm.style.display = 'none';
  });

  // ============================================================
  //  WINDOW SYSTEM
  // ============================================================
  let winCount = 0;

  function createWin(title, iconChar, content, w = 700, h = 500) {
    const id = `win${++winCount}`;
    // Responsivo: limita ao viewport com margem segura
    const vw = window.innerWidth, vh = window.innerHeight - 52;
    const maxW = Math.max(320, vw - 20), maxH = Math.max(260, vh - 20);
    w = Math.min(w, maxW); h = Math.min(h, maxH);
    // Em telas pequenas (mobile/tablet estreito) abre maximizado
    const autoMax = vw < 820 || vh < 540;
    const top = autoMax ? 0 : Math.max(10, Math.min(Math.random() * 120 + 30, vh - h - 10));
    const left = autoMax ? 0 : Math.max(10, Math.min(Math.random() * 200 + 40, vw - w - 10));

    const win = document.createElement('div');
    win.className = 'win' + (autoMax ? ' maximized' : ''); win.id = id;
    if (autoMax) { w = maxW; h = maxH; }
    win.style.cssText = `width:${w}px;height:${h}px;top:${top}px;left:${left}px;z-index:${++S.nextZ};max-width:100vw;max-height:calc(100vh - 52px);`;
    win.innerHTML = `
    <div class="wh" id="${id}-hdr">
      <span class="w-ico">${iconChar}</span>
      <span class="w-title">${title}</span>
      <div class="wctrl">
        <button class="wbtn" data-act="min" title="Minimizar"><i class="fas fa-minus"></i></button>
        <button class="wbtn" data-act="max" title="Maximizar"><i class="fas fa-square" style="font-size:.65rem"></i></button>
        <button class="wbtn cl" data-act="cls" title="Fechar"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div class="wb">${content}</div>
  `;

    win.querySelector('[data-act="cls"]').onclick = () => {
      win.style.opacity = '0'; win.style.transform = 'scale(.96)';
      win.style.transition = 'opacity .15s,transform .15s';
      setTimeout(() => win.remove(), 160); removeTaskbarBtn(id);
    };
    win.querySelector('[data-act="min"]').onclick = () => {
      win.classList.add('minimized');
      const tb = document.querySelector(`.twb[data-win="${id}"]`);
      if (tb) tb.classList.remove('aw');
    };
    let maxd = false; let savedStyle = {};
    win.querySelector('[data-act="max"]').onclick = () => {
      if (!maxd) { savedStyle = { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height }; win.classList.add('maximized'); maxd = true; }
      else { Object.assign(win.style, savedStyle); win.classList.remove('maximized'); maxd = false; }
    };

    const hdr = win.querySelector('.wh');
    let ox, oy, drag = false;
    hdr.addEventListener('mousedown', e => {
      if (e.target.closest('.wctrl')) return;
      drag = true; ox = e.clientX - win.offsetLeft; oy = e.clientY - win.offsetTop;
      win.style.zIndex = ++S.nextZ; focusWin(id);
    });
    document.addEventListener('mousemove', e => {
      if (!drag) return;
      let nx = e.clientX - ox, ny = e.clientY - oy;
      nx = Math.max(0, Math.min(nx, window.innerWidth - win.offsetWidth));
      ny = Math.max(0, Math.min(ny, window.innerHeight - 52 - win.offsetHeight));
      win.style.left = nx + 'px'; win.style.top = ny + 'px';
    });
    document.addEventListener('mouseup', () => { drag = false; });
    win.addEventListener('mousedown', () => { win.style.zIndex = ++S.nextZ; focusWin(id); });

    document.getElementById('desktop').appendChild(win);
    addTaskbarBtn(id, title, iconChar);
    focusWin(id);
    return win;
  }

  function focusWin(id) {
    document.querySelectorAll('.win').forEach(w => w.classList.remove('focused'));
    const win = document.getElementById(id);
    if (win) { win.classList.add('focused'); win.classList.remove('minimized'); }
    document.querySelectorAll('.twb').forEach(b => b.classList.toggle('aw', b.dataset.win === id));
  }

  function addTaskbarBtn(id, title, icon) {
    const el = document.createElement('button');
    el.className = 'twb aw'; el.dataset.win = id;
    el.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px"><span class="tb-i">${icon}</span><span class="tb-t">${title}</span></span>`;
    el.onclick = () => {
      const win = document.getElementById(id); if (!win) return;
      if (win.classList.contains('minimized')) { win.classList.remove('minimized'); focusWin(id); }
      else if (win.classList.contains('focused')) { win.classList.add('minimized'); el.classList.remove('aw'); }
      else focusWin(id);
    };
    document.getElementById('tb-wins').appendChild(el);
  }

  function removeTaskbarBtn(id) {
    const el = document.querySelector(`.twb[data-win="${id}"]`); if (el) el.remove();
  }

  // Reflow responsivo: ajusta janelas abertas quando o viewport muda
  let _reflowT;
  window.addEventListener('resize', () => {
    clearTimeout(_reflowT);
    _reflowT = setTimeout(() => {
      const vw = window.innerWidth, vh = window.innerHeight - 52;
      const small = vw < 820 || vh < 540;
      document.querySelectorAll('.win').forEach(w => {
        if (w.classList.contains('minimized')) return;
        if (small) { w.classList.add('maximized'); return; }
        // Clamp ao viewport
        let cw = Math.min(w.offsetWidth, vw - 20), ch = Math.min(w.offsetHeight, vh - 20);
        let cl = Math.min(parseInt(w.style.left) || 0, vw - cw - 10);
        let ct = Math.min(parseInt(w.style.top) || 0, vh - ch - 10);
        w.style.width = cw + 'px'; w.style.height = ch + 'px';
        w.style.left = Math.max(0, cl) + 'px'; w.style.top = Math.max(0, ct) + 'px';
      });
      // Reorganiza ícones do desktop
      if (document.getElementById('desktop').style.display !== 'none') renderDesktop();
    }, 120);
  });



  // ============================================================
  //  OPEN APP
  // ============================================================
  function openApp(id) {
    const existing = document.querySelector(`.win[data-app="${id}"]`);
    if (existing) { focusWin(existing.id); return; }
    let win;
    switch (id) {
      case 'vessie': win = openVessie(); break;
      case 'dashboard': win = openDashboard(); break;
      case 'edu': win = openEducation(); break;
      case 'automation': win = openAutomation(); break;
      case 'explorer': win = openExplorer(); break;
      case 'games': win = openGames(); break;
      case 'framework': win = openFramework(); break;
      case 'vm': win = openVmManager(); break;
      case 'browser':
      case 'chrome': win = openBrowser(); break;
      case 'discord': win = openDiscrod(); break;
      case 'planos': win = openPlanos(); break;
      case 'notepad': win = openNotepad(); break;
      case 'nvidia': win = openNvidia(); break;
      case 'calc': win = openCalc(); break;
      case 'painel': win = openPainelDeComando(); break;
      case 'terminal': win = openTerminal(); break;
      case 'settings': win = openSettings(); break;
      case 'plugins': win = openPlugins(); break;
      case 'music': win = openMusic(); break;
      case 'camera': win = openCamera(); break;
      case 'word': win = openNotepad(); break;
      case 'vcoinstore': win = openVessieCoinStore(); break;
      case 'errorcenter': win = openErrorCenter(); break;
      default: toast(`App "${id}" em construção 🔧`); return;
    }
    if (win) win.dataset.app = id;
    // Expõe o registro de apps e a função de abertura para módulos do
    // kernel (JS/kernel/modules/*) que rodam fora deste closure, e
    // avisa quem estiver ouvindo que um app foi aberto (ex.: para
    // manter uma lista de "Recentes" no Menu Iniciar).
    window.APPS = APPS;
    window.openApp = openApp;
    document.dispatchEvent(new CustomEvent('vessieos:app-opened', { detail: { id } }));
  }

  // ============================================================
  //  VESSIE FRAMEWORK / VMS
  // ============================================================
  function openFramework() {
    // ---------- ESTADO DO FRAMEWORK ----------
    const fwState = {
      optimizationCount: 0,
      vmCount: 0,
      logs: [],
      startTime: Date.now(),
      metrics: {
        cpu: 0,
        ram: 0,
        disk: 0,
        uptime: 0
      },
      modules: [],
      services: [],
      optimizations: [
        'Lazy loading de iframes',
        'Cache e snapshot de VMs',
        'Falha tolerante para LM Studio',
        'Scheduler de render e eventos',
        'Sandbox reforçado para jogos',
        'Compressão de dados em memória',
        'Prefetch de assets',
        'GC otimizado para jogos'
      ],
      running: true
    };

    // ---------- FUNÇÕES AUXILIARES ----------
    function formatUptime(ms) {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
      if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
      if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
      return `${seconds}s`;
    }

    function addLog(message, type = 'info') {
      const time = new Date().toLocaleTimeString('pt-BR');
      fwState.logs.unshift({ time, message, type });
      if (fwState.logs.length > 100) fwState.logs.pop();
      updateLogs();
    }

    function updateLogs() {
      const container = document.getElementById('fw-logs');
      if (!container) return;
      container.innerHTML = fwState.logs.slice(0, 20).map(log => `
      <div style="padding:3px 0;font-size:.72rem;color:${log.type === 'error' ? '#f87171' : log.type === 'success' ? '#4ade80' : 'var(--dim)'};border-bottom:1px solid rgba(255,255,255,.02);">
        <span style="color:#5b6680;">${log.time}</span> ${log.message}
      </div>
    `).join('');
    }

    function updateMetrics() {
      fwState.metrics.cpu = 2 + Math.random() * 18;
      fwState.metrics.ram = 25 + Math.random() * 30;
      fwState.metrics.disk = 45 + Math.random() * 20;
      fwState.metrics.uptime = Date.now() - fwState.startTime;

      document.getElementById('fw-cpu').textContent = fwState.metrics.cpu.toFixed(1) + '%';
      document.getElementById('fw-cpu-bar').style.width = fwState.metrics.cpu + '%';
      document.getElementById('fw-ram').textContent = fwState.metrics.ram.toFixed(0) + '%';
      document.getElementById('fw-ram-bar').style.width = fwState.metrics.ram + '%';
      document.getElementById('fw-disk').textContent = fwState.metrics.disk.toFixed(1) + '%';
      document.getElementById('fw-disk-bar').style.width = fwState.metrics.disk + '%';
      document.getElementById('fw-uptime').textContent = formatUptime(fwState.metrics.uptime);
    }

    // ---------- AÇÕES DO FRAMEWORK ----------
    window.fwApplyOptimization = function () {
      fwState.optimizationCount++;
      const opt = fwState.optimizations[fwState.optimizationCount % fwState.optimizations.length];
      addLog(`⚡ Otimização aplicada: ${opt}`, 'success');
      document.getElementById('fw-opt-count').textContent = fwState.optimizationCount;
      toast(`⚡ Otimização "${opt}" aplicada!`, 'success');
    };

    window.fwCreateVM = function () {
      fwState.vmCount++;
      VessieVMManager.create(`VM-${fwState.vmCount}`, 'sandbox');
      addLog(`🧠 VM criada: VM-${fwState.vmCount}`, 'success');
      document.getElementById('fw-vm-count').textContent = fwState.vmCount;
      toast(`🧠 VM criada com sucesso!`, 'success');
    };

    window.fwClearCache = function () {
      if (!confirm('Limpar cache do framework?')) return;
      fwState.logs = [];
      updateLogs();
      addLog('🧹 Cache limpo', 'info');
      toast('🧹 Cache limpo com sucesso!', 'success');
    };

    window.fwExportReport = function () {
      const data = {
        timestamp: new Date().toISOString(),
        uptime: formatUptime(fwState.metrics.uptime),
        optimizationCount: fwState.optimizationCount,
        vmCount: fwState.vmCount,
        metrics: fwState.metrics,
        logs: fwState.logs.slice(0, 20),
        modules: fwState.modules,
        services: fwState.services
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `framework_report_${Date.now()}.json`;
      a.click();
      addLog('📤 Relatório exportado', 'info');
      toast('📤 Relatório exportado com sucesso!', 'success');
    };

    window.fwRestartFramework = function () {
      if (!confirm('Reiniciar o Framework?')) return;
      addLog('🔄 Reiniciando Framework...', 'info');
      toast('🔄 Reiniciando...', 'default');
      setTimeout(() => {
        fwState.startTime = Date.now();
        fwState.optimizationCount = 0;
        fwState.vmCount = 0;
        fwState.logs = [];
        document.getElementById('fw-opt-count').textContent = 0;
        document.getElementById('fw-vm-count').textContent = 0;
        updateLogs();
        addLog('✅ Framework reiniciado com sucesso!', 'success');
        toast('✅ Framework reiniciado!', 'success');
      }, 1000);
    };

    window.fwSimulateLoad = function () {
      addLog('🔥 Simulando carga pesada...', 'info');
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          clearInterval(interval);
          addLog('✅ Carga simulada concluída', 'success');
          toast('✅ Carga simulada concluída!', 'success');
          return;
        }
        fwState.metrics.cpu = 30 + Math.random() * 60;
        fwState.metrics.ram = 50 + Math.random() * 40;
        updateMetrics();
      }, 300);
    };

    // ---------- CONSTRÓI A INTERFACE ----------
    const report = VessieFramework.report();
    const runtime = VessieRuntime.snapshot();
    const ai = VessieAIEngine.describe();

    // Atualiza módulos e serviços
    fwState.modules = report.modules || ['Nenhum módulo ainda'];
    fwState.services = report.services || ['Nenhum serviço ainda'];

    const win = createWin('Vessie Framework', '⚙️', `
    <style>
      .fw-container {
        display:flex;
        flex-direction:column;
        height:100%;
        background:linear-gradient(180deg,#0a0c14,#141824);
        color:#eef2ff;
        overflow:hidden;
        font-family:'Segoe UI',system-ui,sans-serif;
      }
      .fw-top {
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
        gap:10px;
        padding:14px 18px;
        background:rgba(0,0,0,.3);
        border-bottom:1px solid rgba(255,255,255,.05);
        flex-shrink:0;
      }
      .fw-card {
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.06);
        border-radius:10px;
        padding:12px 14px;
        text-align:center;
        transition:.14s;
      }
      .fw-card:hover {
        background:rgba(255,255,255,.07);
        transform:translateY(-2px);
      }
      .fw-card .fw-label {
        font-size:.62rem;
        text-transform:uppercase;
        color:var(--dim);
        letter-spacing:.05em;
      }
      .fw-card .fw-value {
        font-size:1.15rem;
        font-weight:600;
        color:#fff;
        margin-top:2px;
      }
      .fw-card .fw-value.green { color:#4ade80; }
      .fw-card .fw-value.blue { color:#60a5fa; }
      .fw-card .fw-value.purple { color:#a78bfa; }
      .fw-card .fw-value.gold { color:#fbbf24; }

      .fw-body {
        display:flex;
        flex:1;
        overflow:hidden;
      }
      .fw-main {
        flex:1;
        overflow-y:auto;
        padding:14px 18px;
      }
      .fw-main::-webkit-scrollbar { width:4px; }
      .fw-main::-webkit-scrollbar-thumb { background:var(--a); border-radius:4px; }

      .fw-sidebar {
        width:220px;
        background:rgba(0,0,0,.25);
        border-left:1px solid rgba(255,255,255,.04);
        padding:12px 14px;
        overflow-y:auto;
        flex-shrink:0;
      }
      .fw-sidebar::-webkit-scrollbar { width:4px; }
      .fw-sidebar::-webkit-scrollbar-thumb { background:var(--a2); border-radius:4px; }

      .fw-metric {
        margin-bottom:12px;
      }
      .fw-metric .fw-metric-label {
        display:flex;
        justify-content:space-between;
        font-size:.72rem;
        color:var(--dim);
      }
      .fw-metric .fw-metric-bar {
        height:4px;
        background:rgba(255,255,255,.06);
        border-radius:2px;
        margin-top:3px;
        overflow:hidden;
      }
      .fw-metric .fw-metric-bar .fw-metric-fill {
        height:100%;
        border-radius:2px;
        transition:width .6s ease;
        width:0%;
      }
      .fw-metric .fw-metric-bar .fw-metric-fill.cpu { background:linear-gradient(90deg,#60a5fa,#a78bfa); }
      .fw-metric .fw-metric-bar .fw-metric-fill.ram { background:linear-gradient(90deg,#34d399,#22d3ee); }
      .fw-metric .fw-metric-bar .fw-metric-fill.disk { background:linear-gradient(90deg,#fbbf24,#f59e0b); }

      .fw-section {
        background:rgba(255,255,255,.03);
        border:1px solid rgba(255,255,255,.05);
        border-radius:10px;
        padding:14px 16px;
        margin-bottom:12px;
      }
      .fw-section .fw-section-title {
        font-size:.78rem;
        font-weight:600;
        color:#fff;
        margin-bottom:8px;
        display:flex;
        align-items:center;
        gap:8px;
      }
      .fw-section .fw-section-title i { color:var(--a2); }

      .fw-module-list, .fw-service-list {
        display:flex;
        flex-wrap:wrap;
        gap:6px;
      }
      .fw-module-list .fw-tag, .fw-service-list .fw-tag {
        background:rgba(96,165,250,.12);
        border:1px solid rgba(96,165,250,.2);
        border-radius:6px;
        padding:3px 10px;
        font-size:.72rem;
        color:#93c5fd;
        white-space:nowrap;
      }
      .fw-service-list .fw-tag {
        background:rgba(167,139,250,.12);
        border-color:rgba(167,139,250,.2);
        color:#c4b5fd;
      }

      .fw-actions {
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        margin-top:12px;
      }
      .fw-actions button {
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.08);
        color:#fff;
        padding:7px 14px;
        border-radius:8px;
        font-size:.78rem;
        cursor:pointer;
        transition:.14s;
        display:flex;
        align-items:center;
        gap:6px;
      }
      .fw-actions button:hover {
        background:rgba(255,255,255,.12);
        border-color:rgba(255,255,255,.15);
        transform:translateY(-1px);
      }
      .fw-actions button.primary {
        background:linear-gradient(135deg,var(--a),var(--a2));
        border-color:transparent;
      }
      .fw-actions button.primary:hover {
        filter:brightness(1.1);
      }
      .fw-actions button.danger {
        background:rgba(239,68,68,.15);
        border-color:rgba(239,68,68,.2);
        color:#f87171;
      }
      .fw-actions button.danger:hover {
        background:rgba(239,68,68,.25);
      }
      .fw-actions button.success {
        background:rgba(74,222,128,.15);
        border-color:rgba(74,222,128,.2);
        color:#4ade80;
      }
      .fw-actions button.success:hover {
        background:rgba(74,222,128,.25);
      }

      .fw-logs-container {
        max-height:180px;
        overflow-y:auto;
        background:rgba(0,0,0,.2);
        border-radius:8px;
        padding:8px 12px;
        font-size:.72rem;
        font-family:'Consolas',monospace;
      }
      .fw-logs-container::-webkit-scrollbar { width:3px; }
      .fw-logs-container::-webkit-scrollbar-thumb { background:var(--a); border-radius:3px; }

      .fw-optimization-list {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:4px 16px;
        font-size:.72rem;
        color:var(--dim);
      }
      .fw-optimization-list li {
        list-style:none;
        padding:2px 0;
      }
      .fw-optimization-list li::before {
        content:'✅ ';
        color:#4ade80;
      }

      @media (max-width:768px) {
        .fw-body { flex-direction:column; }
        .fw-sidebar { width:100%; border-left:none; border-top:1px solid rgba(255,255,255,.04); max-height:200px; }
        .fw-top { grid-template-columns:repeat(2,1fr); }
        .fw-optimization-list { grid-template-columns:1fr; }
      }
    </style>

    <div class="fw-container">
      <!-- TOPO: Cards de status -->
      <div class="fw-top">
        <div class="fw-card">
          <div class="fw-label">Framework</div>
          <div class="fw-value green">${report.initialized ? '✅ Online' : '⏳ Iniciando'}</div>
        </div>
        <div class="fw-card">
          <div class="fw-label">Runtime</div>
          <div class="fw-value blue">${formatUptime(runtime.uptimeMs || 0)}</div>
        </div>
        <div class="fw-card">
          <div class="fw-label">IA</div>
          <div class="fw-value purple">${ai.provider || 'LM Studio'}</div>
        </div>
        <div class="fw-card">
          <div class="fw-label">VMs</div>
          <div class="fw-value gold" id="fw-vm-count">${runtime.counters.vms || 0}</div>
        </div>
        <div class="fw-card">
          <div class="fw-label">Otimizações</div>
          <div class="fw-value blue" id="fw-opt-count">0</div>
        </div>
        <div class="fw-card">
          <div class="fw-label">Uptime</div>
          <div class="fw-value gold" id="fw-uptime">${formatUptime(Date.now() - fwState.startTime)}</div>
        </div>
      </div>

      <!-- CORPO: Principal + Sidebar -->
      <div class="fw-body">
        <div class="fw-main">
          <!-- Módulos e Serviços -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="fw-section">
              <div class="fw-section-title"><i class="fas fa-puzzle-piece"></i> Módulos</div>
              <div class="fw-module-list">
                ${(fwState.modules && fwState.modules.length) ? fwState.modules.map(m => `<span class="fw-tag">${m}</span>`).join('') : '<span style="color:var(--dim);font-size:.78rem;">Nenhum módulo ativo</span>'}
              </div>
            </div>
            <div class="fw-section">
              <div class="fw-section-title"><i class="fas fa-cogs"></i> Serviços</div>
              <div class="fw-service-list">
                ${(fwState.services && fwState.services.length) ? fwState.services.map(s => `<span class="fw-tag">${s}</span>`).join('') : '<span style="color:var(--dim);font-size:.78rem;">Nenhum serviço ativo</span>'}
              </div>
            </div>
          </div>

          <!-- Otimizações -->
          <div class="fw-section">
            <div class="fw-section-title"><i class="fas fa-bolt" style="color:#fbbf24;"></i> Otimizações ativas</div>
            <ul class="fw-optimization-list">
              ${fwState.optimizations.map(opt => `<li>${opt}</li>`).join('')}
            </ul>
          </div>

          <!-- Logs -->
          <div class="fw-section">
            <div class="fw-section-title"><i class="fas fa-terminal" style="color:#60a5fa;"></i> Logs do sistema</div>
            <div class="fw-logs-container" id="fw-logs">
              <div style="color:#5b6680;font-size:.72rem;">Nenhum log registrado.</div>
            </div>
          </div>

          <!-- Ações -->
          <div class="fw-actions">
            <button class="primary" onclick="fwApplyOptimization()"><i class="fas fa-rocket"></i> Aplicar otimização</button>
            <button class="success" onclick="fwCreateVM()"><i class="fas fa-server"></i> Criar VM</button>
            <button onclick="openApp('vm')" style="background:rgba(167,139,250,.15);border-color:rgba(167,139,250,.2);color:#c4b5fd;"><i class="fas fa-cubes"></i> VM Manager</button>
            <button onclick="fwSimulateLoad()" style="background:rgba(251,191,36,.15);border-color:rgba(251,191,36,.2);color:#fbbf24;"><i class="fas fa-fire"></i> Simular carga</button>
            <button onclick="fwExportReport()" style="background:rgba(96,165,250,.15);border-color:rgba(96,165,250,.2);color:#60a5fa;"><i class="fas fa-download"></i> Exportar relatório</button>
            <button onclick="fwClearCache()" class="danger"><i class="fas fa-broom"></i> Limpar cache</button>
            <button onclick="fwRestartFramework()" style="background:rgba(244,67,54,.15);border-color:rgba(244,67,54,.2);color:#f87171;"><i class="fas fa-sync-alt"></i> Reiniciar</button>
          </div>
        </div>

        <!-- SIDEBAR: Métricas em tempo real -->
        <div class="fw-sidebar">
          <div style="font-size:.7rem;text-transform:uppercase;color:var(--dim);letter-spacing:.05em;margin-bottom:12px;">📊 Métricas do sistema</div>

          <div class="fw-metric">
            <div class="fw-metric-label"><span>CPU</span><span id="fw-cpu">0%</span></div>
            <div class="fw-metric-bar"><div class="fw-metric-fill cpu" id="fw-cpu-bar" style="width:0%;"></div></div>
          </div>

          <div class="fw-metric">
            <div class="fw-metric-label"><span>RAM</span><span id="fw-ram">0%</span></div>
            <div class="fw-metric-bar"><div class="fw-metric-fill ram" id="fw-ram-bar" style="width:0%;"></div></div>
          </div>

          <div class="fw-metric">
            <div class="fw-metric-label"><span>Disco</span><span id="fw-disk">0%</span></div>
            <div class="fw-metric-bar"><div class="fw-metric-fill disk" id="fw-disk-bar" style="width:0%;"></div></div>
          </div>

          <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.04);">
            <div style="font-size:.7rem;color:var(--dim);">
              <div>🧠 IA: <span style="color:#a78bfa;">${ai.provider}</span></div>
              <div>📦 VMs: <span id="fw-vm-count-side">${runtime.counters.vms || 0}</span></div>
              <div>⚡ Otimizações: <span id="fw-opt-count-side">0</span></div>
              <div style="margin-top:4px;font-size:.65rem;color:#5b6680;">Uptime: <span id="fw-uptime-side">${formatUptime(Date.now() - fwState.startTime)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `, 880, 680);

    // ---------- INICIALIZAÇÃO ----------
    addLog('🚀 Framework inicializado', 'success');
    addLog(`📦 ${fwState.modules.length} módulos carregados`, 'info');
    addLog(`🔧 ${fwState.services.length} serviços disponíveis`, 'info');

    // Atualiza contadores
    document.getElementById('fw-opt-count').textContent = fwState.optimizationCount;
    document.getElementById('fw-opt-count-side').textContent = fwState.optimizationCount;
    document.getElementById('fw-vm-count').textContent = fwState.vmCount;
    document.getElementById('fw-vm-count-side').textContent = fwState.vmCount;

    // Atualiza métricas a cada 2 segundos
    const metricInterval = setInterval(() => {
      if (!fwState.running) return;
      updateMetrics();
      // Atualiza uptime
      const uptime = formatUptime(Date.now() - fwState.startTime);
      document.getElementById('fw-uptime').textContent = uptime;
      document.getElementById('fw-uptime-side').textContent = uptime;
    }, 2000);

    // ---------- LIMPEZA ----------
    win.addEventListener('remove', () => {
      fwState.running = false;
      clearInterval(metricInterval);
      // Remove funções globais
      delete window.fwApplyOptimization;
      delete window.fwCreateVM;
      delete window.fwClearCache;
      delete window.fwExportReport;
      delete window.fwRestartFramework;
      delete window.fwSimulateLoad;
    });

    // Patch no fechamento da janela
    const closeBtn = win.querySelector('.cl');
    if (closeBtn) {
      const originalClick = closeBtn.onclick;
      closeBtn.onclick = function (e) {
        if (originalClick) originalClick.call(this, e);
        fwState.running = false;
        clearInterval(metricInterval);
      };
    }

    return win;
  }

  window.createVessieVm = function () {
    const vm = VessieVMManager.create(`VM ${VessieVMManager.list().length + 1}`, 'sandbox');
    if (vm) toast(`VM ${vm.name} criada com isolamento reforçado 🧠`, 'success');
    return vm;
  };

  function openVmManager() {
    const vms = VessieVMManager.list();
    const win = createWin('VM Manager', '🧠', `
    <div style="padding:18px;height:100%;overflow:auto;background:linear-gradient(180deg,rgba(255,255,255,.03),transparent)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div><div style="font-size:.72rem;text-transform:uppercase;color:var(--dim)">Máquinas virtuais</div><h3 style="margin:4px 0 0;color:#fff">Gerenciador de ambientes isolados</h3></div>
        <button onclick="window.createVessieVm()" style="background:linear-gradient(135deg,var(--a),var(--a2));border:none;color:white;padding:8px 14px;border-radius:999px;cursor:pointer">Nova VM</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
        ${vms.length ? vms.map(vm => `<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px"><div style="font-size:.78rem;color:var(--dim);margin-bottom:6px">${vm.type}</div><div style="font-size:1rem;font-weight:600;color:#fff">${vm.name}</div><div style="font-size:.78rem;color:var(--text-2);margin-top:8px">Status: ${vm.status}</div><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button onclick="VessieVMManager.snapshot('${vm.id}');toast('Snapshot criado','success')" style="background:rgba(96,165,250,.16);border:none;color:white;padding:7px 11px;border-radius:999px;cursor:pointer">Snapshot</button><button onclick="VessieVMManager.restore('${vm.id}');toast('VM restaurada','success')" style="background:rgba(34,211,238,.16);border:none;color:white;padding:7px 11px;border-radius:999px;cursor:pointer">Restaurar</button></div></div>`).join('') : '<div style="grid-column:1/-1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:18px;color:var(--dim)">Nenhuma VM criada ainda. Crie uma para isolar jogos, navegadores e ambientes de teste.</div>'}
      </div>
    </div>
  `, 760, 540);
    return win;
  }

  //==================================
  //            {Discord Ultimate V9}
  //    - Server Global automático
  //    - Auto-Login e Sessão Salva
  //    - Sincronização Oculta 0.1s (BroadcastChannel)
  //    - Webhook Auto-Sync sem flicker
  //    - +55 patches de estabilidade
  //==================================

  function openDiscrod() {
    const win = createWin('Discord', '<i class="fab fa-discord" style="color:#5865F2"></i>', `
    <div id="discrod-root" style="display:flex;flex-direction:column;height:100%;background:#313338;overflow:hidden;">
      <!-- TELA DE LOGIN -->
      <div id="drd-login-panel" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;padding:20px;background:#313338;">
        <div style="font-size:3rem;background:#5865F2;width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;">💬</div>
        <h2 style="color:#fff;margin:0;font-weight:700;">Discord</h2>
        <p style="color:#b5bac1;margin:0;text-align:center;font-size:.9rem;">Digite seu nome e senha para entrar</p>
        <input id="drd-login-user" placeholder="Usuário" style="width:80%;padding:12px 16px;border-radius:8px;border:1px solid #1e1f22;background:#1e1f22;color:#fff;font-size:.95rem;outline:none;transition:.15s;">
        <input id="drd-login-pass" type="password" placeholder="Senha" style="width:80%;padding:12px 16px;border-radius:8px;border:1px solid #1e1f22;background:#1e1f22;color:#fff;font-size:.95rem;outline:none;transition:.15s;">
        <button id="drd-login-btn" style="width:80%;padding:12px;border-radius:8px;border:none;background:#5865F2;color:#fff;font-weight:600;font-size:1rem;cursor:pointer;transition:.15s;">Entrar</button>
        <div id="drd-login-error" style="color:#f87171;font-size:.85rem;min-height:24px;"></div>
      </div>

      <!-- TELA DO DISCORD -->
      <div id="drd-chat-panel" style="display:none;flex-direction:column;height:100%;background:#313338;">
        <div style="display:flex;height:100%;">
          <!-- SERVER SIDEBAR -->
          <div id="drd-server-sidebar" style="width:72px;background:#1e1f22;display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:8px;overflow-y:auto;flex-shrink:0;border-right:1px solid #2b2d31;">
            <div id="drd-server-list" style="display:flex;flex-direction:column;gap:8px;width:100%;align-items:center;"></div>
            <button id="drd-add-server-btn" style="width:48px;height:48px;border-radius:50%;background:#2b2d31;border:none;color:#3ba55c;font-size:1.8rem;cursor:pointer;transition:.15s;display:flex;align-items:center;justify-content:center;margin-top:4px;">+</button>
          </div>

          <!-- CHAT PRINCIPAL -->
          <div style="flex:1;display:flex;flex-direction:column;min-width:0;">
            <!-- TOPO -->
            <div id="drd-server-header" style="display:flex;align-items:center;padding:8px 16px;background:#2b2d31;border-bottom:1px solid #1e1f22;flex-shrink:0;gap:12px;height:48px;">
              <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
                <span id="drd-server-name" style="font-weight:700;color:#fff;font-size:1rem;white-space:nowrap;">Servidor</span>
                <span id="drd-server-member-count" style="color:#b5bac1;font-size:.75rem;"></span>
              </div>
              <div style="display:flex;gap:6px;align-items:center;">
                <button id="drd-friends-toggle" style="background:transparent;border:none;color:#b5bac1;padding:4px 8px;border-radius:4px;font-size:.8rem;cursor:pointer;transition:.15s;"><i class="fas fa-user-friends"></i> Amigos</button>
                <button id="drd-reload-btn" style="background:transparent;border:none;color:#b5bac1;padding:4px 8px;border-radius:4px;font-size:.8rem;cursor:pointer;transition:.15s;" title="Recarregar servidores"><i class="fas fa-server"></i></button>
                <button id="drd-sync-btn" style="background:transparent;border:none;color:#b5bac1;padding:4px 8px;border-radius:4px;font-size:.8rem;cursor:pointer;transition:.15s;"><i class="fas fa-sync-alt"></i></button>
                <button id="drd-logout-btn" style="background:transparent;border:none;color:#b5bac1;padding:4px 8px;border-radius:4px;font-size:.8rem;cursor:pointer;transition:.15s;">Sair</button>
              </div>
            </div>

            <!-- CORPO -->
            <div style="display:flex;flex:1;min-height:0;">
              <!-- CANAIS -->
              <div id="drd-channel-sidebar" style="width:220px;background:#2b2d31;padding:8px 6px;overflow-y:auto;flex-shrink:0;border-right:1px solid #1e1f22;">
                <div style="color:#b5bac1;font-size:.7rem;text-transform:uppercase;font-weight:600;padding:4px 8px;letter-spacing:.04em;">Canais de texto</div>
                <div id="drd-channel-list"></div>
              </div>

              <!-- CHAT -->
              <div style="flex:1;display:flex;flex-direction:column;background:#313338;min-width:0;">
                <div id="drd-msg-list" style="flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:4px;background:#313338;"></div>
                <div style="padding:8px 16px 12px;background:#313338;border-top:1px solid #2b2d31;flex-shrink:0;">
                  <div style="display:flex;align-items:center;gap:6px;background:#383a40;border-radius:8px;padding:4px 8px;">
                    <button id="drd-sticker-btn" style="background:transparent;border:none;color:#b5bac1;font-size:1.2rem;cursor:pointer;padding:4px;">😊</button>
                    <label for="drd-file-input" style="background:transparent;border:none;color:#b5bac1;font-size:1.2rem;cursor:pointer;padding:4px;"><i class="fas fa-paperclip"></i></label>
                    <input type="file" id="drd-file-input" accept="image/*" style="display:none;">
                    <input id="drd-msg-input" placeholder="Mensagem" style="flex:1;background:transparent;border:none;color:#dbdee1;outline:none;font-size:.95rem;padding:8px 4px;">
                    <button id="drd-send-btn" style="background:#5865F2;border:none;color:#fff;border-radius:6px;padding:6px 14px;font-size:.9rem;cursor:pointer;transition:.15s;font-weight:600;">Enviar</button>
                  </div>
                  <div id="drd-sticker-picker" style="display:none;position:absolute;bottom:70px;left:20px;background:#2b2d31;border:1px solid #1e1f22;border-radius:12px;padding:10px;gap:6px;flex-wrap:wrap;max-width:260px;max-height:150px;overflow-y:auto;z-index:10;"></div>
                </div>
              </div>

              <!-- MEMBROS -->
              <div id="drd-members-sidebar" style="width:200px;background:#2b2d31;padding:12px 8px;overflow-y:auto;flex-shrink:0;border-left:1px solid #1e1f22;display:block;">
                <div style="color:#b5bac1;font-size:.7rem;text-transform:uppercase;font-weight:600;padding:4px 8px;letter-spacing:.04em;">Membros — <span id="drd-member-count">0</span></div>
                <div id="drd-member-list"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- PAINEL DE AMIGOS -->
        <div id="drd-friends-panel" style="display:none;position:absolute;right:12px;top:56px;width:280px;max-height:400px;background:#2b2d31;border:1px solid #1e1f22;border-radius:12px;padding:12px;overflow-y:auto;z-index:20;box-shadow:0 8px 24px rgba(0,0,0,.5);"></div>
      </div>
    </div>
  `, 980, 700);

    setupDiscrod(win);
    return win;
  }

  function setupDiscrod(win) {
    // ---- CONSTANTES E ESTADO ----
    const LS_WEBHOOK = 'discrod_webhook';
    const LS_USERS = 'discrod_users';
    const LS_SESSION = 'discrod_session';
    const LS_SERVERS = 'discrod_servers';
    const LS_FRIENDS = 'vessieos_steam_friends';
    const LS_MESSAGES_PREFIX = 'discrod_messages_';
    const GLOBAL_SERVER_NAME = '🌍 Server Global';
    const DEBOUNCE_DELAY = 100; // 0.1s exato

    const state = {
      webhookUrl: localStorage.getItem(LS_WEBHOOK) || 'https://discord.com/api/webhooks/1507799363496181912/y_bVPzaG243vEMDDE5ghOdgf4xgi1-U_oFTSyP6sJcUO_os-HyXr-ygDshEKddZ8OtRN',
      currentUser: null,
      users: JSON.parse(localStorage.getItem(LS_USERS) || '{}'),
      sessionId: Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      servers: JSON.parse(localStorage.getItem(LS_SERVERS) || '[]'),
      currentServerId: null,
      currentChannelId: null,
      friendsPanelOpen: false,
      contextMenu: null,
      syncDebounce: null,
      lastRenderedMsgs: '[]',
      lastRenderedServers: '',
      lastRenderedMembers: '',
      bc: null
    };

    // ---- BROADCAST CHANNEL (Multi-usuário instantâneo e oculto) ----
    try {
      state.bc = new BroadcastChannel('discrod_ultra_sync_channel');
      state.bc.onmessage = (event) => {
        if (event.data && event.data.type === 'sync') {
          quickSync('broadcast_sync');
        }
      };
    } catch (e) { console.warn('BroadcastChannel não suportado.'); }

    // Sincronização via Storage (Multi-janela)
    window.addEventListener('storage', (e) => {
      if (e.key === LS_SERVERS || e.key === LS_MESSAGES_PREFIX + state.currentServerId + '_' + state.currentChannelId || e.key === LS_FRIENDS) {
        quickSync('storage_event');
      }
    });

    // ---- PERSISTÊNCIA ----
    function saveUsers() { localStorage.setItem(LS_USERS, JSON.stringify(state.users)); }
    function saveServers() {
      localStorage.setItem(LS_SERVERS, JSON.stringify(state.servers));
      try { state.bc.postMessage({ type: 'sync' }); } catch (e) { }
    }
    function getMessagesKey(s, c) { return `${LS_MESSAGES_PREFIX}${s}_${c}`; }

    function loadMessages(s, c) {
      try { return JSON.parse(localStorage.getItem(getMessagesKey(s, c)) || '[]'); } catch { return []; }
    }
    function saveMessages(s, c, msgs) {
      localStorage.setItem(getMessagesKey(s, c), JSON.stringify(msgs));
      try { state.bc.postMessage({ type: 'sync' }); } catch (e) { }
    }

    function getCurrentMessages() {
      return state.currentServerId && state.currentChannelId ? loadMessages(state.currentServerId, state.currentChannelId) : [];
    }
    function setCurrentMessages(msgs) {
      if (state.currentServerId && state.currentChannelId) saveMessages(state.currentServerId, state.currentChannelId, msgs);
    }

    // ---- AMIGOS ----
    function loadFriendsData() { try { return JSON.parse(localStorage.getItem(LS_FRIENDS) || '{}'); } catch { return {}; } }
    function saveFriendsData(data) { localStorage.setItem(LS_FRIENDS, JSON.stringify(data)); }
    function setUserGame(username, game) {
      const all = loadFriendsData();
      if (!all[username]) all[username] = { friends: [], requests: [], game: null };
      all[username].game = game;
      saveFriendsData(all);
    }

    // ---- SERVIDORES ----
    function getServer(id) {
      state.servers = JSON.parse(localStorage.getItem(LS_SERVERS) || '[]');
      return state.servers.find(s => s.id === id);
    }

    function createServer(name, owner, password = null) {
      state.servers = JSON.parse(localStorage.getItem(LS_SERVERS) || '[]');
      const existing = state.servers.find(s => s.name.toLowerCase() === name.trim().toLowerCase());
      if (existing) return null;
      const server = {
        id: 'srv_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        name: name.trim(),
        owner: owner,
        channels: [{ id: 'general', name: 'geral', type: 'text' }],
        members: [owner],
        createdAt: Date.now(),
        isGlobal: false,
        password: password
      };
      state.servers.push(server);
      saveServers();
      return server;
    }

    function joinServer(serverId, username) {
      const server = getServer(serverId);
      if (!server) return null;
      if (!server.members.includes(username)) {
        server.members.push(username);
        saveServers();
      }
      return server;
    }

    // ---- WEBHOOK ----
    async function sendToWebhook(content, file = null) {
      if (!state.webhookUrl) return false;
      try {
        let finalContent = content;
        let body, headers = {};
        if (file) {
          const fd = new FormData();
          fd.append('payload_json', JSON.stringify({ content: finalContent }));
          fd.append('file', file, file.name);
          body = fd;
        } else {
          body = JSON.stringify({ content: finalContent });
          headers['Content-Type'] = 'application/json';
        }
        const res = await fetch(state.webhookUrl, { method: 'POST', body, headers });
        // Auto-sync oculto após webhook para garantir que a interface atualize
        quickSync('webhook_success');
        return res.ok;
      } catch (err) {
        quickSync('webhook_fail');
        return false;
      }
    }

    // ---- SINCronização OCULTA (DEBOUNCE 0.1s) ----
    function quickSync(source = 'unknown') {
      if (state.syncDebounce) clearTimeout(state.syncDebounce);
      state.syncDebounce = setTimeout(() => {
        state.servers = JSON.parse(localStorage.getItem(LS_SERVERS) || '[]');
        renderAllSilent();
        state.syncDebounce = null;
      }, DEBOUNCE_DELAY);
    }

    // ---- RENDERIZAÇÃO SILENCIOSA (SMART UPDATE, SEM FLICKER) ----
    function renderAllSilent() {
      renderServers();
      renderChannels();
      renderMessages();
      renderMembers();
      renderFriendsPanel();

      const server = getServer(state.currentServerId);
      const serverNameEl = win.querySelector('#drd-server-name');
      if (serverNameEl) serverNameEl.textContent = server ? server.name : 'Nenhum servidor';

      const serverMembersEl = win.querySelector('#drd-server-member-count');
      if (serverMembersEl && server) serverMembersEl.textContent = `(${server.members.length} membros)`;
    }

    function renderServers() {
      const container = win.querySelector('#drd-server-list');
      if (!container) return;

      // Garantia de Server Global
      let global = state.servers.find(s => s.isGlobal === true);
      if (!global) {
        global = {
          id: 'srv_global_' + Date.now().toString(36),
          name: GLOBAL_SERVER_NAME,
          owner: 'system',
          channels: [{ id: 'general', name: 'geral', type: 'text' }],
          members: state.currentUser ? [state.currentUser] : [],
          createdAt: Date.now(),
          isGlobal: true,
          password: null
        };
        state.servers.push(global);
        saveServers();
      } else if (state.currentUser && !global.members.includes(state.currentUser)) {
        global.members.push(state.currentUser);
        saveServers();
      }

      const dataHash = JSON.stringify(state.servers.map(s => ({ id: s.id, name: s.name, members: s.members.length })));
      if (dataHash === state.lastRenderedServers) return; // Não recarrega se não mudou
      state.lastRenderedServers = dataHash;

      container.innerHTML = '';
      state.servers.forEach(s => {
        const isActive = s.id === state.currentServerId;
        const div = document.createElement('div');
        div.style.cssText = `
        width:48px; height:48px; border-radius:50%;
        background:${isActive ? 'linear-gradient(135deg,#5865F2,#4752C4)' : '#2b2d31'};
        color:#fff; display:flex; align-items:center; justify-content:center;
        font-weight:700; font-size:1.1rem; cursor:pointer; transition:.2s;
        border:${isActive ? '2px solid #fff' : '2px solid transparent'};
        position:relative;
      `;
        div.textContent = s.name[0].toUpperCase();
        div.title = s.name;
        div.onclick = () => {
          if (s.password && s.password !== '') {
            const pass = prompt(`🔒 Senha do servidor "${s.name}":`);
            if (pass !== s.password) { toast('❌ Senha incorreta!', 'error'); return; }
          }
          state.currentServerId = s.id;
          state.currentChannelId = s.channels[0].id;
          state.lastRenderedMsgs = '[]'; // Força reload das msgs
          renderAllSilent();
          quickSync('clickServer');
        };
        container.appendChild(div);
      });
    }

    function renderChannels() {
      const container = win.querySelector('#drd-channel-list');
      if (!container) return;
      const server = getServer(state.currentServerId);
      if (!server) { container.innerHTML = ''; return; }

      const dataHash = JSON.stringify(server.channels);
      if (dataHash === container.dataset.hash) return;
      container.dataset.hash = dataHash;

      container.innerHTML = '';
      server.channels.forEach(c => {
        const isActive = c.id === state.currentChannelId;
        const div = document.createElement('div');
        div.style.cssText = `
        display:flex; align-items:center; gap:8px;
        padding:6px 10px; border-radius:6px;
        color:${isActive ? '#fff' : '#b5bac1'};
        background:${isActive ? '#383a40' : 'transparent'};
        cursor:pointer; font-size:.9rem; margin-bottom:2px;
      `;
        div.innerHTML = `<i class="fas fa-hashtag" style="font-size:.7rem;"></i> ${c.name}`;
        div.onclick = () => {
          state.currentChannelId = c.id;
          state.lastRenderedMsgs = '[]';
          renderAllSilent();
          quickSync('clickChannel');
        };
        container.appendChild(div);
      });
    }

    function renderMessages() {
      const list = win.querySelector('#drd-msg-list');
      if (!list) return;
      const msgs = getCurrentMessages();
      const dataHash = JSON.stringify(msgs);

      if (dataHash === state.lastRenderedMsgs) return;
      state.lastRenderedMsgs = dataHash;

      list.innerHTML = '';
      if (!msgs.length) {
        const empty = document.createElement('div');
        empty.style.cssText = 'color:#b5bac1;font-size:.9rem;text-align:center;padding:60px 0;';
        empty.textContent = '🚀 Nenhuma mensagem ainda. Seja o primeiro!';
        list.appendChild(empty);
        return;
      }

      msgs.forEach(msg => {
        const div = document.createElement('div');
        const isMine = msg.username === state.currentUser;
        div.style.cssText = `display:flex; gap:10px; padding:4px 0; ${isMine ? 'flex-direction:row-reverse;' : ''}`;

        const avatar = document.createElement('div');
        avatar.style.cssText = `width:36px; height:36px; border-radius:50%; background:${isMine ? 'linear-gradient(135deg,#5865F2,#4752C4)' : 'linear-gradient(135deg,#3ba55c,#2d8f4e)'}; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.9rem; flex-shrink:0;`;
        avatar.textContent = msg.username[0].toUpperCase();

        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `flex:1; min-width:0; ${isMine ? 'text-align:right;' : ''}`;

        const nameTime = document.createElement('div');
        nameTime.style.cssText = 'display:flex; gap:8px; align-items:baseline; font-size:.8rem; margin-bottom:2px;';
        if (isMine) nameTime.style.flexDirection = 'row-reverse';

        const nameSpan = document.createElement('span');
        nameSpan.style.cssText = `font-weight:600; color:${isMine ? '#5865F2' : '#c084fc'};`;
        nameSpan.textContent = msg.username;

        const timeSpan = document.createElement('span');
        timeSpan.style.cssText = 'color:#b5bac1; font-size:.65rem;';
        timeSpan.textContent = new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        nameTime.appendChild(nameSpan);
        nameTime.appendChild(timeSpan);

        const bodySpan = document.createElement('div');
        bodySpan.style.cssText = `color:#dbdee1; font-size:.9rem; word-wrap:break-word; line-height:1.4; background:rgba(255,255,255,.04); padding:6px 10px; border-radius:8px; display:inline-block;`;

        if (msg.type === 'image') {
          bodySpan.innerHTML = `<img src="${msg.content}" style="max-width:250px;max-height:200px;border-radius:8px;">`;
        } else if (msg.type === 'sticker') {
          bodySpan.style.fontSize = '2.4rem';
          bodySpan.style.background = 'transparent';
          bodySpan.textContent = msg.content;
        } else {
          bodySpan.textContent = msg.content;
        }

        contentDiv.appendChild(nameTime);
        contentDiv.appendChild(bodySpan);
        div.appendChild(avatar);
        div.appendChild(contentDiv);
        list.appendChild(div);
      });
      list.scrollTop = list.scrollHeight;
    }

    function renderMembers() {
      const container = win.querySelector('#drd-member-list');
      const countEl = win.querySelector('#drd-member-count');
      if (!container) return;
      const server = getServer(state.currentServerId);
      if (!server) { container.innerHTML = ''; if (countEl) countEl.textContent = '0'; return; }

      const members = server.members || [];
      const dataHash = JSON.stringify(members);
      if (dataHash === state.lastRenderedMembers) return;
      state.lastRenderedMembers = dataHash;

      if (countEl) countEl.textContent = members.length;
      container.innerHTML = '';
      members.forEach(m => {
        const div = document.createElement('div');
        div.style.cssText = `display:flex; align-items:center; gap:8px; padding:4px 8px; border-radius:6px; color:#dbdee1; font-size:.82rem;`;
        div.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:#3ba55c;display:inline-block;"></span> ${m} ${m === state.currentUser ? '👤' : ''}`;
        container.appendChild(div);
      });
    }

    function renderFriendsPanel() {
      const container = win.querySelector('#drd-friends-panel');
      if (!container || !state.friendsPanelOpen) return;
      const me = state.currentUser;
      if (!me) { container.innerHTML = ''; return; }
      const all = loadFriendsData();
      const myData = all[me] || { friends: [], requests: [], game: null };
      const friends = myData.friends || [];

      let html = '<div style="color:#fff;font-weight:600;margin-bottom:8px;font-size:.9rem;">Amigos</div>';
      if (friends.length === 0) {
        html += '<div style="color:#b5bac1;font-size:.8rem;text-align:center;">Nenhum amigo ainda.</div>';
      } else {
        friends.forEach(f => {
          html += `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #1e1f22;">
          <div style="width:28px;height:28px;border-radius:50%;background:#5865F2;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.8rem;">${f[0].toUpperCase()}</div>
          <span style="color:#dbdee1;font-size:.85rem;">${f}</span>
        </div>`;
        });
      }
      container.innerHTML = html;
    }

    // ---- ENVIO DE MENSAGEM ----
    async function sendMessage() {
      const input = win.querySelector('#drd-msg-input');
      const text = input.value.trim();
      if (!text) return;

      const msgObj = { username: state.currentUser, content: text, timestamp: Date.now(), type: 'text' };
      const msgs = getCurrentMessages();
      msgs.push(msgObj);
      setCurrentMessages(msgs);
      renderMessages(); // Render imediato
      await sendToWebhook(`[${state.currentUser}] ${text}`);
      input.value = '';
      quickSync('sendMessage');
    }

    // ---- COMANDOS {P} e {J} ----
    function parseCommand(text) {
      const createMatch = text.match(/^\{P\}\s*(.+?)(?:\s+senha\s*(.+))?$/i);
      if (createMatch) {
        const name = createMatch[1].trim();
        const password = createMatch[2] ? createMatch[2].trim() : null;
        const server = createServer(name, state.currentUser, password);
        if (server) {
          state.currentServerId = server.id;
          state.currentChannelId = server.channels[0].id;
          sendToWebhook(`[SISTEMA] ${state.currentUser} criou o servidor "${name}"`);
          quickSync('createServer');
          toast(`✅ Servidor "${name}" criado!`, 'success');
        } else {
          toast(`⚠️ Servidor "${name}" já existe.`, 'error');
        }
        return true;
      }

      const joinMatch = text.match(/^\{J\}\s*(.+?)(?:\s+senha\s*(.+))?$/i);
      if (joinMatch) {
        const name = joinMatch[1].trim();
        const password = joinMatch[2] ? joinMatch[2].trim() : null;
        state.servers = JSON.parse(localStorage.getItem(LS_SERVERS) || '[]');
        const server = state.servers.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (!server) {
          toast(`❌ Servidor "${name}" não encontrado.`, 'error');
          return true;
        }
        if (server.password && server.password !== password) {
          toast('❌ Senha incorreta!', 'error');
          return true;
        }
        joinServer(server.id, state.currentUser);
        state.currentServerId = server.id;
        state.currentChannelId = server.channels[0].id;
        sendToWebhook(`[SISTEMA] ${state.currentUser} entrou no servidor "${name}"`);
        quickSync('joinServer');
        toast(`✅ Entrou no servidor "${name}"!`, 'success');
        return true;
      }
      return false;
    }

    // ---- CONFIGURA EVENTOS ----
    function setupEvents() {
      const loginBtn = win.querySelector('#drd-login-btn');
      if (loginBtn) {
        loginBtn.onclick = () => {
          const user = win.querySelector('#drd-login-user').value.trim();
          const pass = win.querySelector('#drd-login-pass').value.trim();
          const errEl = win.querySelector('#drd-login-error');
          if (!user || !pass) { errEl.textContent = 'Preencha tudo'; return; }

          if (state.users[user] && state.users[user].password !== pass) {
            errEl.textContent = '❌ Senha incorreta!';
            return;
          }
          if (!state.users[user]) {
            state.users[user] = { password: pass };
            saveUsers();
          }

          state.currentUser = user;
          localStorage.setItem(LS_SESSION, JSON.stringify({ username: user, sessionId: state.sessionId }));
          sendToWebhook(`[SISTEMA] ${user} entrou no Discord`);

          win.querySelector('#drd-login-panel').style.display = 'none';
          win.querySelector('#drd-chat-panel').style.display = 'flex';

          // Auto-seleciona Global
          state.servers = JSON.parse(localStorage.getItem(LS_SERVERS) || '[]');
          const global = state.servers.find(s => s.isGlobal) || state.servers[0];
          if (global) {
            state.currentServerId = global.id;
            state.currentChannelId = global.channels[0].id;
          }

          renderAllSilent();
          quickSync('login');
        };
      }

      const logoutBtn = win.querySelector('#drd-logout-btn');
      if (logoutBtn) {
        logoutBtn.onclick = () => {
          state.currentUser = null;
          localStorage.removeItem(LS_SESSION);
          win.querySelector('#drd-login-panel').style.display = 'flex';
          win.querySelector('#drd-chat-panel').style.display = 'none';
        };
      }

      const sendBtn = win.querySelector('#drd-send-btn');
      const msgInput = win.querySelector('#drd-msg-input');
      if (sendBtn) sendBtn.onclick = sendMessage;
      if (msgInput) msgInput.onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };

      const stickerBtn = win.querySelector('#drd-sticker-btn');
      const picker = win.querySelector('#drd-sticker-picker');
      if (stickerBtn && picker) {
        const stickers = ['😊', '😂', '❤️', '🔥', '🎉', '💜', '✨', '🥺', '🤡', '👀', '🚀', '🌈', '🍕', '🎮', '💀', '😎'];
        picker.innerHTML = '';
        stickers.forEach(s => {
          const span = document.createElement('span');
          span.textContent = s;
          span.style.cssText = 'font-size:1.8rem;cursor:pointer;padding:4px;border-radius:6px;';
          span.onclick = () => {
            const msgObj = { username: state.currentUser, content: s, timestamp: Date.now(), type: 'sticker' };
            const msgs = getCurrentMessages();
            msgs.push(msgObj);
            setCurrentMessages(msgs);
            renderMessages();
            picker.style.display = 'none';
            quickSync('sticker');
          };
          picker.appendChild(span);
        });
        stickerBtn.onclick = (e) => { e.stopPropagation(); picker.style.display = picker.style.display === 'flex' ? 'none' : 'flex'; };
      }

      const fileInput = win.querySelector('#drd-file-input');
      if (fileInput) {
        fileInput.onchange = async function (e) {
          const file = this.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = async (ev) => {
            const msgObj = { username: state.currentUser, content: ev.target.result, timestamp: Date.now(), type: 'image' };
            const msgs = getCurrentMessages();
            msgs.push(msgObj);
            setCurrentMessages(msgs);
            renderMessages();
            await sendToWebhook(`[${state.currentUser}] enviou uma imagem`, file);
            quickSync('image');
          };
          reader.readAsDataURL(file);
          this.value = '';
        };
      }

      const addServerBtn = win.querySelector('#drd-add-server-btn');
      if (addServerBtn) {
        addServerBtn.onclick = () => {
          const name = prompt('Nome do novo servidor:');
          if (!name || !name.trim()) return;
          const password = prompt('Senha (opcional):');
          const server = createServer(name.trim(), state.currentUser, password ? password.trim() : null);
          if (server) {
            state.currentServerId = server.id;
            state.currentChannelId = server.channels[0].id;
            sendToWebhook(`[SISTEMA] ${state.currentUser} criou o servidor "${name.trim()}"`);
            quickSync('addServer');
          } else {
            toast('⚠️ Servidor já existe!', 'error');
          }
        };
      }

      const friendsToggle = win.querySelector('#drd-friends-toggle');
      if (friendsToggle) {
        friendsToggle.onclick = () => {
          state.friendsPanelOpen = !state.friendsPanelOpen;
          const panel = win.querySelector('#drd-friends-panel');
          if (panel) panel.style.display = state.friendsPanelOpen ? 'block' : 'none';
          if (state.friendsPanelOpen) renderFriendsPanel();
        };
      }

      const syncBtn = win.querySelector('#drd-sync-btn');
      if (syncBtn) syncBtn.onclick = () => quickSync('manualSync');

      // ---- CLIQUE OCULTO GLOBAL (0.1s) ----
      win.addEventListener('click', () => {
        quickSync('globalClick');
      }, true);

      // ---- AUTO LOGIN ----
      try {
        const session = JSON.parse(localStorage.getItem(LS_SESSION) || 'null');
        if (session && state.users[session.username]) {
          state.currentUser = session.username;
          win.querySelector('#drd-login-panel').style.display = 'none';
          win.querySelector('#drd-chat-panel').style.display = 'flex';

          state.servers = JSON.parse(localStorage.getItem(LS_SERVERS) || '[]');
          const global = state.servers.find(s => s.isGlobal) || state.servers[0];
          if (global) {
            state.currentServerId = global.id;
            state.currentChannelId = global.channels[0].id;
          }
          renderAllSilent();
          quickSync('autoLogin');
        }
      } catch (e) { }
    }

    setupEvents();
  }

  // ============================================================
  //  VESSIE AI
  // ============================================================
  function openVessie() {
    const win = createWin('Vessie IA', '💜', `
    <div style="display:flex;height:100%;background:#0d0d12;color:#e0e0e0;font-family:'Segoe UI',sans-serif;overflow:hidden;">
      
      <!-- COLUNA ESQUERDA: CHAT -->
      <div style="flex:1;display:flex;flex-direction:column;border-right:1px solid #252530;">
        <div style="padding:14px 16px;background:#15151c;border-bottom:1px solid #252530;display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#9b5de5,#f15bb5);display:flex;align-items:center;justify-content:center;font-size:1.1rem;">💜</div>
          <div>
            <div style="font-weight:700;font-size:1rem;">Vessie IA</div>
            <div id="net-status" style="font-size:.7rem;color:#888;">● Verificando Rede...</div>
          </div>
          <button onclick="window.openVessieScripts()" style="margin-left:auto;background:#252530;border:none;color:#aaa;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:.75rem;">💾 Scripts</button>
          <button onclick="window.openVessieLexicon()" style="background:#252530;border:none;color:#aaa;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:.75rem;">📖 Dicionário</button>
          <button onclick="this.closest('.win').querySelector('#chat-area').innerHTML=''" style="background:#252530;border:none;color:#aaa;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:.75rem;">Limpar</button>
        </div>
        
        <div id="chat-area" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#08080c;">
          <div style="align-self:flex-start;max-width:80%;background:#15151c;padding:10px 14px;border-radius:12px;border-bottom-left-radius:2px;font-size:.85rem;line-height:1.4;">
            Oii! 🎀 Sou a Vessie. Meu sistema de compressão foi aprimorado para gerar tudo em 1 linha de forma forçada e estável!
          </div>
        </div>
        
        <div style="padding:12px;background:#15151c;border-top:1px solid #252530;display:flex;gap:10px;">
          <input id="vessie-inp" placeholder="Fale com a Vessie..." style="flex:1;background:#08080c;border:1px solid #252530;color:#fff;padding:10px 14px;border-radius:8px;outline:none;font-size:.85rem;" onkeydown="if(event.key==='Enter')window.vessieSend()">
          <button onclick="window.vessieSend()" style="background:linear-gradient(135deg,#9b5de5,#f15bb5);border:none;color:#fff;padding:0 20px;border-radius:8px;cursor:pointer;font-weight:600;">Enviar</button>
        </div>
      </div>

      <!-- COLUNA DIREITA: PAINEL DE REDE E LOTE -->
      <div style="width:320px;display:flex;flex-direction:column;background:#111118;">
        <div style="padding:15px;border-bottom:1px solid #252530;">
          <div style="font-size:.75rem;color:#888;text-transform:uppercase;margin-bottom:10px;letter-spacing:1px;">🔌 Rede Local (LM Studio)</div>
          <input id="local-ip" placeholder="http://192.168.x.x:1234" value="${localStorage.getItem('vessie_local_ip') || 'http://localhost:1234'}" style="width:100%;box-sizing:border-box;background:#08080c;border:1px solid #252530;color:#fff;padding:10px;border-radius:6px;margin-bottom:8px;font-size:.8rem;">

          <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
            <select id="vessie-model-select" style="flex:1;background:#08080c;border:1px solid #252530;color:#fff;padding:8px;border-radius:6px;font-size:.75rem;">
              <option value="">(nenhum modelo detectado ainda)</option>
            </select>
            <button onclick="window.testNet()" title="Atualizar lista de modelos" style="background:#252530;border:none;color:#aaa;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:.75rem;"><i class="fas fa-sync-alt"></i></button>
          </div>
          
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
            <label style="font-size:.75rem;color:#aaa;">Qtd. Lotes:</label>
            <input id="batch-count" type="number" min="1" value="5" style="width:60px;background:#08080c;border:1px solid #252530;color:#fff;padding:8px;border-radius:6px;font-size:.8rem;text-align:center;">
            <span style="font-size:.65rem;color:#666;">(100 respostas por lote)</span>
          </div>

          <div style="display:flex;gap:8px;">
            <button onclick="window.testNet()" style="flex:1;background:#252530;border:none;color:#aaa;padding:8px;border-radius:6px;cursor:pointer;font-size:.8rem;">Testar Conexão</button>
            <button id="btn-gen-batch" onclick="window.genBatch()" style="flex:1;background:linear-gradient(90deg,#9b5de5,#f15bb5);border:none;color:#fff;padding:8px;border-radius:6px;cursor:pointer;font-weight:700;font-size:.8rem;">Gerar Lote</button>
          </div>
          <div id="cors-warning" style="font-size:.7rem;color:#f15bb5;margin-top:8px;display:none;background:rgba(241,91,181,.1);padding:6px;border-radius:4px;">⚠ HTML bloqueou o acesso. Ative o CORS no LM Studio.</div>
        </div>
        
        <div style="flex:1;padding:15px;display:flex;flex-direction:column;min-height:0;">
          <div style="font-size:.75rem;color:#888;text-transform:uppercase;margin-bottom:8px;letter-spacing:1px;">💻 Console de Geração</div>
          <div id="batch-log" style="flex:1;background:#050508;border:1px solid #252530;padding:10px;border-radius:6px;font-family:monospace;font-size:.7rem;color:#0f0;overflow-y:auto;white-space:pre-wrap;">
> Sistema pronto.
          </div>
          <div style="margin-top:10px;font-size:.75rem;color:#888;display:flex;justify-content:space-between;">
            <span>Cache Local:</span>
            <span id="cache-count">0 respostas</span>
          </div>
          <button onclick="window.updateAI()" style="width:100%;margin-top:10px;background:#252530;border:1px solid #9b5de5;color:#9b5de5;padding:10px;border-radius:6px;cursor:pointer;font-weight:700;font-size:.8rem;">⬆️ Update AI (Exportar HTML)</button>
        </div>
      </div>
    </div>
  `, 900, 600);

    const chatArea = win.querySelector('#chat-area');
    const batchLog = win.querySelector('#batch-log');
    const localIpInput = win.querySelector('#local-ip');
    const netStatus = win.querySelector('#net-status');
    const corsWarn = win.querySelector('#cors-warning');
    const cacheCount = win.querySelector('#cache-count');
    const btnGenBatch = win.querySelector('#btn-gen-batch');

    let isOnline = false;
    let isGenerating = false;
    window._tempCodes = [];

    let cache = JSON.parse(localStorage.getItem('vessie_batch_cache') || 'null');
    if (!cache) {
      cache = {
        saudacao: ["Oi! Eu estou bem, obrigada por perguntar!", "Oi, como você está? 😊"],
        codigo: ["Olá! Quer que eu te ajude? ```javascript function hello(){console.log('Oi!');} ```"],
        ajuda: ["Oi, como posso ajudar?", "Vou te ajudar com tudo que pucer!"],
        despedida: ["Tchau! 😊 Te vejo soon! 🌟", "Até breve! 🥰"]
      };
      localStorage.setItem('vessie_batch_cache', JSON.stringify(cache));
    }

    let lexicon = JSON.parse(localStorage.getItem('vessie_lexicon_db') || '{}');
    let scriptsDb = JSON.parse(localStorage.getItem('vessie_scripts_db') || '[]');

    function updateCacheCount() {
      const total = Object.values(cache).flat().length;
      cacheCount.textContent = `${total} respostas`;
    }
    updateCacheCount();

    function logBatch(msg) {
      batchLog.textContent += `\n> ${msg}`;
      batchLog.scrollTop = batchLog.scrollHeight;
    }

    function analyzeText(text) {
      const lower = text.toLowerCase();
      let intent = 'default';
      let complexity = 'leve';
      let needsClarification = null;

      for (const word in lexicon) {
        if (lower.includes(word) && lexicon[word].doubleMeaning) {
          needsClarification = word;
          break;
        }
      }

      if (lower.includes('oi') || lower.includes('olá')) intent = 'saudacao';
      if (lower.includes('código') || lower.includes('script') || lower.includes('function') || lower.includes('bug') || lower.includes('programa')) intent = 'codigo';
      if (lower.includes('ajuda') || lower.includes('help')) intent = 'ajuda';
      if (lower.includes('tchau') || lower.includes('bye')) intent = 'despedida';

      if (text.split(' ').length > 6 || intent === 'codigo') complexity = 'complexa';

      return { intent, complexity, needsClarification };
    }

    function buildSystemPrompt(metadata) {
      let prompt = "Você é a Vessie. Metadados: Complexidade=" + metadata.complexity + ", Intenção=" + metadata.intent + ".\n";
      if (metadata.complexity === 'complexa') {
        prompt += "Gere um script completo e funcional. REGRA OBRIGATÓRIA: O código deve estar em APENAS 1 LINHA. Não use quebras de linha (\\n) dentro do bloco de código. Escreva tudo junto. Use ponto e vírgula para separar instruções.\n";
      } else {
        prompt += "Responda de forma curta, fofa e direta. Sem quebras de linha.\n";
      }
      return prompt;
    }

    // ==========================================
    // MOTOR DE COMPRESSÃO ESTÁVEL PARA 1 LINHA
    // ==========================================
    function compressToSingleLine(text) {
      if (!text) return text;
      let result = text;
      const codeMatch = text.match(/```(\w+)?\n?([\s\S]*?)```/);

      if (codeMatch) {
        const lang = codeMatch[1] || 'javascript';
        const rawCode = codeMatch[2];
        let compressed = rawCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
        compressed = compressed.replace(/\s+/g, ' ').trim();
        compressed = compressed.replace(/\s*([{};:,()=<>+\-*/])\s*/g, '$1');
        compressed = compressed.replace(/;+/g, ';');

        result = text.replace(codeMatch[0], `\`\`\`${lang} ${compressed}\`\`\``);
      }

      return result.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // Varredura e compressão do cache
    window.compressLocalCache = function () {
      let compressedCount = 0;
      let modified = false;

      for (const key in cache) {
        if (Array.isArray(cache[key])) {
          cache[key] = cache[key].map(resp => {
            if (typeof resp === 'string' && (resp.includes('\n') || resp.includes('\r') || resp.includes('  '))) {
              const compressed = compressToSingleLine(resp);
              if (compressed !== resp) {
                compressedCount++;
                modified = true;
                return compressed;
              }
            }
            return resp;
          });
        }
      }

      if (modified) {
        localStorage.setItem('vessie_batch_cache', JSON.stringify(cache));
        logBatch(`🛠️ Cache local comprimido: ${compressedCount} respostas convertidas para 1 linha.`);
      } else {
        logBatch(`✅ Cache local verificado: Todas as respostas já estão em 1 linha.`);
      }
    };

    // Formata a resposta para HTML
    function formatResponse(text) {
      const codeMatch = text.match(/```(\w+)?\s?([\s\S]*?)```/);
      if (codeMatch) {
        const lang = codeMatch[1] || 'code';
        const code = codeMatch[2].trim();
        const codeId = window._tempCodes.push(code) - 1;

        let htmlText = text.replace(codeMatch[0], `
        <div style="background:#000;padding:10px;border-radius:6px;border:1px solid #333;margin:8px 0;">
          <div style="font-size:.65rem;color:#666;margin-bottom:5px;text-transform:uppercase;">${lang} (1 linha)</div>
          <pre style="margin:0;color:#0f0;font-size:.75rem;overflow-x:auto;white-space:pre-wrap;word-break:break-all;">${escHtml(code)}</pre>
        </div>
        <div style="display:flex;gap:8px;margin-top:5px;">
          <button onclick="window.copyCode(${codeId})" style="flex:1;background:#252530;border:none;color:#fff;padding:6px;border-radius:4px;cursor:pointer;font-size:.75rem;">📋 Copiar</button>
          <button onclick="window.openCodeEditor(${codeId})" style="flex:1;background:#9b5de5;border:none;color:#fff;padding:6px;border-radius:4px;cursor:pointer;font-size:.75rem;font-weight:700;">✍️ Editar por Linha</button>
        </div>
      `);
        return htmlText;
      }
      return text;
    }

    function escHtml(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    window.testNet = async function () {
      const ip = localIpInput.value.trim().replace(/\/$/, '');
      localStorage.setItem('vessie_local_ip', ip);
      netStatus.textContent = '● Conectando...';
      netStatus.style.color = '#f1c40f';
      logBatch(`Testando conexão em ${ip}...`);
      const modelSelect = win.querySelector('#vessie-model-select');
      try {
        const res = await fetch(`${ip}/v1/models`);
        if (res.ok) {
          const data = await res.json();
          const models = Array.isArray(data.data) ? data.data : [];
          const modelName = models[0]?.id || 'desconhecido';
          netStatus.textContent = `● Online (Tempo Real): ${modelName.substring(0, 15)}`;
          netStatus.style.color = '#2ecc71';
          corsWarn.style.display = 'none';
          isOnline = true;
          // Formato funcional de modelo: cada modelo detectado vira uma opção real
          // e selecionável, em vez do modelo fixo 'qwen3-1.7b' que existia antes.
          if (modelSelect && models.length) {
            const remembered = localStorage.getItem('vessie_selected_model');
            modelSelect.innerHTML = models.map(m => `<option value="${escHtml(m.id)}">${escHtml(m.id)}</option>`).join('');
            if (remembered && models.some(m => m.id === remembered)) modelSelect.value = remembered;
            modelSelect.onchange = () => localStorage.setItem('vessie_selected_model', modelSelect.value);
          }
          logBatch(`✅ Sucesso! ${models.length} modelo(s) detectado(s). Modo Tempo Real ativado.`);
        } else throw new Error('Erro');
      } catch (e) {
        netStatus.textContent = '● Offline (Usando Lote)';
        netStatus.style.color = '#e74c3c';
        corsWarn.style.display = 'block';
        isOnline = false;
        logBatch(`❌ Erro: Acesso bloqueado (CORS) ou servidor offline.`);
      }
    };

    // ==========================================
    // GERADOR DE LOTE (COM PRÉ-COMPRESSÃO)
    // ==========================================
    window.genBatch = async function () {
      if (isGenerating) return toast('Aguarde o lote atual terminar!', 'error');

      logBatch("Iniciando compressão do cache atual...");
      window.compressLocalCache();

      const batchesToGenerate = parseInt(win.querySelector('#batch-count').value) || 5;
      isGenerating = true;
      btnGenBatch.disabled = true;
      btnGenBatch.textContent = 'Gerando...';
      btnGenBatch.style.opacity = '0.5';

      const ip = localIpInput.value.trim().replace(/\/$/, '');
      logBatch(`Iniciando ${batchesToGenerate} lotes no LM Studio...`);

      const sysPrompt = 'Metadata: Output=25 variations. Delimiter=[SEP]. Persona=Vessie. Task=Generate distinct answers. No numbers. OBRIGATÓRIO: Respostas diretas, sem quebras de linha (\\n) e sem espaços excessivos. Se for código, em 1 linha.';
      const intents = [
        { key: 'saudacao', prompt: 'Oi, tudo bem?' },
        { key: 'codigo', prompt: 'Pode me ajudar com um código JavaScript?' },
        { key: 'ajuda', prompt: 'Preciso de ajuda com o sistema' },
        { key: 'despedida', prompt: 'Tchau, até logo!' }
      ];

      let totalAdded = 0;

      try {
        for (let b = 1; b <= batchesToGenerate; b++) {
          logBatch(`--- INICIANDO LOTE ${b}/${batchesToGenerate} ---`);
          let batchAdded = 0;

          for (const intent of intents) {
            logBatch(`[Lote ${b}] Gerando: "${intent.key}"...`);
            try {
              const res = await fetch(`${ip}/v1/chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'qwen3-1.7b', messages: [{ role: 'system', content: sysPrompt }, { role: 'user', content: intent.prompt }], temperature: 0.95, max_tokens: 2000 })
              });
              if (!res.ok) throw new Error('HTTP Error');
              const data = await res.json();
              const responses = data.choices[0].message.content.split('[SEP]').map(r => r.trim()).filter(r => r.length > 0);

              if (!cache[intent.key]) cache[intent.key] = [];

              const processedResponses = responses.map(r => {
                if (r.includes('\n') || r.includes('\r') || r.includes('  ')) {
                  logBatch("💾 Resposta com múltiplas linhas detectada. Comprimindo...");
                  return compressToSingleLine(r);
                }
                return r;
              });

              cache[intent.key].push(...processedResponses);

              if (cache[intent.key].length > 500) cache[intent.key] = cache[intent.key].slice(-500);

              localStorage.setItem('vessie_batch_cache', JSON.stringify(cache));
              updateCacheCount();
              totalAdded += responses.length;
              batchAdded += responses.length;
            } catch (e) {
              logBatch(`[Lote ${b}] ❌ Falha em "${intent.key}".`);
              break;
            }
          }
          logBatch(`Lote ${b} concluído. +${batchAdded} respostas.`);
        }
        logBatch(`📦 DESFECHO: ${totalAdded} respostas adicionadas e estabilizadas em 1 linha.`);
      } catch (err) {
        logBatch(`❌ Erro crítico: ${err.message}`);
      } finally {
        isGenerating = false;
        btnGenBatch.disabled = false;
        btnGenBatch.textContent = 'Gerar Lote';
        btnGenBatch.style.opacity = '1';
      }
    };

    // ==========================================
    // SISTEMA HÍBRIDO DE ENVIO (VERIFICAÇÃO EM TEMPO REAL)
    // ==========================================
    window.vessieSend = async function () {
      const inp = win.querySelector('#vessie-inp');
      const text = inp.value.trim();
      if (!text) return;
      inp.value = '';

      chatArea.innerHTML += `<div style="align-self:flex-end;max-width:80%;background:linear-gradient(135deg,#9b5de5,#f15bb5);color:#fff;padding:10px 14px;border-radius:12px;border-bottom-right-radius:2px;font-size:.85rem;line-height:1.4;">${text}</div>`;
      chatArea.scrollTop = chatArea.scrollHeight;

      const typing = document.createElement('div');
      typing.id = 'typing-indicator';
      typing.style.cssText = 'align-self:flex-start;max-width:80%;background:#15151c;padding:10px 14px;border-radius:12px;border-bottom-left-radius:2px;font-size:.85rem;color:#888;';
      typing.textContent = '💭 Pensando...';
      chatArea.appendChild(typing);
      chatArea.scrollTop = chatArea.scrollHeight;

      const metadata = analyzeText(text);

      if (metadata.needsClarification) {
        setTimeout(() => {
          typing.remove();
          const reply = `Hmm, você usou "${metadata.needsClarification}". Pode ter mais de um sentido. Qual contexto? 🤔`;
          chatArea.innerHTML += `<div style="align-self:flex-start;max-width:80%;background:#15151c;padding:10px 14px;border-radius:12px;border-bottom-left-radius:2px;font-size:.85rem;line-height:1.4;">${reply}</div>`;
          chatArea.scrollTop = chatArea.scrollHeight;
        }, 800);
        return;
      }

      const scriptMatch = scriptsDb.find(s => text.toLowerCase().includes(s.name.toLowerCase()));
      if (scriptMatch) {
        setTimeout(() => {
          typing.remove();
          const codeId = window._tempCodes.push(scriptMatch.code) - 1;
          const htmlReply = `Encontrei o script <strong>${scriptMatch.name}</strong> salvo no seu banco! 🎯<br>
          <div style="background:#000;padding:10px;border-radius:6px;border:1px solid #333;margin:8px 0;">
            <div style="font-size:.65rem;color:#666;margin-bottom:5px;text-transform:uppercase;">${scriptMatch.lang} (1 linha)</div>
            <pre style="margin:0;color:#0f0;font-size:.75rem;overflow-x:auto;white-space:pre-wrap;word-break:break-all;">${escHtml(scriptMatch.code)}</pre>
          </div>
          <div style="display:flex;gap:8px;margin-top:5px;">
            <button onclick="window.copyCode(${codeId})" style="flex:1;background:#252530;border:none;color:#fff;padding:6px;border-radius:4px;cursor:pointer;font-size:.75rem;">📋 Copiar</button>
            <button onclick="window.openCodeEditor(${codeId})" style="flex:1;background:#9b5de5;border:none;color:#fff;padding:6px;border-radius:4px;cursor:pointer;font-size:.75rem;font-weight:700;">✍️ Editar por Linha</button>
          </div>`;
          chatArea.innerHTML += `<div style="align-self:flex-start;max-width:90%;background:#15151c;padding:10px 14px;border-radius:12px;border-bottom-left-radius:2px;font-size:.85rem;line-height:1.4;">${htmlReply}</div>`;
          chatArea.scrollTop = chatArea.scrollHeight;
        }, 800);
        return;
      }

      if (metadata.complexity === 'complexa' && !isOnline) {
        typing.textContent = '🔎 Buscando solução complexa no cache...';
        setTimeout(() => {
          typing.remove();
          const arr = cache[metadata.intent] || cache['codigo'] || [];
          let reply = arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : 'Não tenho esse script no cache ainda! Conecte ao LM Studio para gerar online.';

          const htmlReply = formatResponse(reply);
          chatArea.innerHTML += `<div style="align-self:flex-start;max-width:90%;background:#15151c;padding:10px 14px;border-radius:12px;border-bottom-left-radius:2px;font-size:.85rem;line-height:1.4;">${htmlReply}</div>`;
          chatArea.scrollTop = chatArea.scrollHeight;
        }, 1000);
        return;
      }

      if (isOnline) {
        try {
          const ip = localIpInput.value.trim().replace(/\/$/, '');
          const selectedModel = win.querySelector('#vessie-model-select')?.value || localStorage.getItem('vessie_selected_model') || 'qwen3-1.7b';
          const res = await fetch(`${ip}/v1/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: selectedModel, messages: [{ role: 'system', content: buildSystemPrompt(metadata) }, { role: 'user', content: text }], temperature: 0.7, max_tokens: 200 })
          });
          const data = await res.json();
          let reply = data.choices[0].message.content;

          if (reply.includes('\n') || reply.includes('\r') || reply.includes('```')) {
            reply = compressToSingleLine(reply);
            logBatch("💾 Resposta em tempo real comprimida para 1 linha!");

            if (!cache['codigo']) cache['codigo'] = [];
            if (!cache['codigo'].includes(reply)) {
              cache['codigo'].push(reply);
              if (cache['codigo'].length > 500) cache['codigo'] = cache['codigo'].slice(-500);
              localStorage.setItem('vessie_batch_cache', JSON.stringify(cache));
              updateCacheCount();
              logBatch("💾 Código salvo no Update AI!");
            }
          }

          typing.remove();
          chatArea.innerHTML += `<div style="align-self:flex-start;max-width:90%;background:#15151c;padding:10px 14px;border-radius:12px;border-bottom-left-radius:2px;font-size:.85rem;line-height:1.4;">${formatResponse(reply)}</div>`;
          chatArea.scrollTop = chatArea.scrollHeight;
        } catch (e) {
          typing.remove();
          isOnline = false;
          netStatus.textContent = '● Offline (Conexão perdida)';
          netStatus.style.color = '#e74c3c';
          chatArea.innerHTML += `<div style="align-self:flex-start;max-width:80%;background:#15151c;padding:10px 14px;border-radius:12px;border-bottom-left-radius:2px;font-size:.85rem;color:#f15bb5;">Ops, perdi a conexão! Caindo para o modo lote...</div>`;
          chatArea.scrollTop = chatArea.scrollHeight;
        }
      } else {
        setTimeout(() => {
          typing.remove();
          const arr = cache[metadata.intent] || cache['default'] || [];
          let reply = arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : 'Estou offline e sem lote gerado!';
          chatArea.innerHTML += `<div style="align-self:flex-start;max-width:90%;background:#15151c;padding:10px 14px;border-radius:12px;border-bottom-left-radius:2px;font-size:.85rem;line-height:1.4;">${formatResponse(reply)}</div>`;
          chatArea.scrollTop = chatArea.scrollHeight;
        }, 600 + Math.random() * 400);
      }
    };

    // ==========================================
    // SISTEMA DE EDIÇÃO POR LINHA (FATIADOR)
    // ==========================================
    window.copyCode = function (id) {
      navigator.clipboard.writeText(window._tempCodes[id]);
      toast('Código copiado!', 'success');
    };

    window.openCodeEditor = function (id) {
      let code = window._tempCodes[id];
      let chunks = code.split(';');
      let inputsHtml = '';
      chunks.forEach((chunk, i) => {
        inputsHtml += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="color:#666;font-size:.7rem;width:25px;text-align:right;flex-shrink:0;">${i + 1}</span>
        <input class="code-line-input" value="${chunk.trim().replace(/"/g, '&quot;')}" style="flex:1;background:#111;border:1px solid #333;color:#0f0;padding:6px 8px;font-family:monospace;font-size:.75rem;border-radius:4px;outline:none;">
        <span style="color:#666;font-size:.7rem;">;</span>
      </div>`;
      });

      createWin('Editor (Bloco por Bloco)', '✍️', `
      <div style="padding:15px;height:100%;display:flex;flex-direction:column;background:#0d0d12;color:#fff;">
        <h3 style="margin:0 0 15px 0;color:#9b5de5;font-size:.9rem;">Modifique os blocos de código</h3>
        <div style="flex:1;overflow-y:auto;padding-right:5px;">${inputsHtml}</div>
        <button onclick="window.copyEditedCode()" style="margin-top:15px;background:linear-gradient(90deg,#9b5de5,#f15bb5);border:none;color:#fff;padding:12px;border-radius:6px;cursor:pointer;font-weight:700;">Copiar Código Final</button>
      </div>
    `, 700, 500);
    };

    window.copyEditedCode = function () {
      const inputs = document.querySelectorAll('.code-line-input');
      let finalCode = '';
      inputs.forEach(inp => finalCode += inp.value + '; ');
      navigator.clipboard.writeText(finalCode.trim());
      toast('Código editado copiado!', 'success');
    };

    // ==========================================
    // CODEBASE E DICIONÁRIO
    // ==========================================
    window.openVessieScripts = function () {
      let listHtml = '';
      scriptsDb.forEach((s, i) => {
        listHtml += `<div style="background:#15151c;padding:10px;border-radius:6px;margin-bottom:8px;border-left:3px solid #00ff00;">
        <div style="display:flex;justify-content:space-between;font-weight:700;color:#fff;">
          <span>${s.name} <span style="color:#666;font-size:.7rem;">(${s.lang})</span></span> 
          <button onclick="window.delScript(${i})" style="background:#e74c3c;border:none;color:#fff;padding:2px 6px;border-radius:4px;cursor:pointer;font-size:.7rem;">X</button>
        </div>
        <pre style="margin:5px 0 0 0;color:#0f0;font-size:.7rem;overflow-x:auto;max-height:60px;white-space:pre-wrap;word-break:break-all;">${escHtml(s.code)}</pre>
      </div>`;
      });
      if (!listHtml) listHtml = '<p style="color:#666;text-align:center;font-size:.8rem;">Nenhum script salvo.</p>';

      createWin('CodeBase de Scripts', '💾', `
      <div style="display:flex;height:100%;background:#0d0d12;color:#e0e0e0;">
        <div style="flex:1;padding:20px;overflow-y:auto;">
          <h3 style="margin:0 0 15px 0;color:#9b5de5;">💾 Salvar Novo Script (1 linha)</h3>
          <input id="scp-name" placeholder="Nome (ex: Calcular IMC)" style="width:100%;box-sizing:border-box;background:#15151c;border:1px solid #252530;color:#fff;padding:10px;border-radius:6px;margin-bottom:8px;">
          <input id="scp-lang" placeholder="Linguagem (ex: javascript, python)" style="width:100%;box-sizing:border-box;background:#15151c;border:1px solid #252530;color:#fff;padding:10px;border-radius:6px;margin-bottom:8px;">
          <textarea id="scp-code" placeholder="Cole o código aqui..." style="width:100%;box-sizing:border-box;background:#15151c;border:1px solid #252530;color:#0f0;padding:10px;border-radius:6px;margin-bottom:8px;height:150px;font-family:monospace;font-size:.8rem;resize:none;"></textarea>
          <button onclick="window.saveScript()" style="width:100%;background:linear-gradient(90deg,#9b5de5,#f15bb5);border:none;color:#fff;padding:12px;border-radius:6px;cursor:pointer;font-weight:700;">Salvar no CodeBase</button>
        </div>
        <div style="width:300px;padding:20px;background:#111118;border-left:1px solid #252530;overflow-y:auto;">
          <h3 style="margin:0 0 15px 0;color:#9b5de5;">📚 Scripts Salvos</h3>
          <div id="scp-list">${listHtml}</div>
        </div>
      </div>
    `, 800, 500);
    };

    window.saveScript = function () {
      const n = document.getElementById('scp-name').value.trim();
      const l = document.getElementById('scp-lang').value.trim() || 'code';
      let c = document.getElementById('scp-code').value.trim();
      if (!n || !c) return toast('Preencha nome e código!', 'error');

      c = compressToSingleLine(c);

      scriptsDb.push({ name: n, lang: l, code: c });
      localStorage.setItem('vessie_scripts_db', JSON.stringify(scriptsDb));
      toast(`Script "${n}" comprimido e salvo!`, 'success');
      window.openVessieScripts();
    };

    window.delScript = function (id) {
      scriptsDb.splice(id, 1);
      localStorage.setItem('vessie_scripts_db', JSON.stringify(scriptsDb));
      window.openVessieScripts();
    };

    window.openVessieLexicon = function () {
      let listHtml = '';
      for (const word in lexicon) {
        const e = lexicon[word];
        listHtml += `<div style="background:#15151c;padding:10px;border-radius:6px;margin-bottom:8px;border-left:3px solid #9b5de5;">
        <div style="display:flex;justify-content:space-between;font-weight:700;color:#fff;"><span>${word}</span> <button onclick="window.delLexicon('${word}')" style="background:#e74c3c;border:none;color:#fff;padding:2px 6px;border-radius:4px;cursor:pointer;font-size:.7rem;">X</button></div>
        <div style="font-size:.75rem;color:#aaa;margin-top:4px;">📖 ${e.meaning}</div>
      </div>`;
      }
      if (!listHtml) listHtml = '<p style="color:#666;text-align:center;font-size:.8rem;">Nenhuma palavra certificada.</p>';

      createWin('Dicionário Vessie', '📖', `
      <div style="display:flex;height:100%;background:#0d0d12;color:#e0e0e0;">
        <div style="flex:1;padding:20px;overflow-y:auto;">
          <h3 style="margin:0 0 15px 0;color:#9b5de5;">🧠 Certificar Nova Palavra</h3>
          <input id="lex-word" placeholder="Palavra" style="width:100%;box-sizing:border-box;background:#15151c;border:1px solid #252530;color:#fff;padding:10px;border-radius:6px;margin-bottom:8px;">
          <input id="lex-meaning" placeholder="Significado" style="width:100%;box-sizing:border-box;background:#15151c;border:1px solid #252530;color:#fff;padding:10px;border-radius:6px;margin-bottom:8px;">
          <input id="lex-category" placeholder="Categoria" style="width:100%;box-sizing:border-box;background:#15151c;border:1px solid #252530;color:#fff;padding:10px;border-radius:6px;margin-bottom:8px;">
          <input id="lex-typos" placeholder="Erros comuns (vírgula)" style="width:100%;box-sizing:border-box;background:#15151c;border:1px solid #252530;color:#fff;padding:10px;border-radius:6px;margin-bottom:8px;">
          <label style="display:flex;align-items:center;gap:8px;font-size:.8rem;color:#aaa;margin-bottom:10px;"><input type="checkbox" id="lex-double" style="width:16px;height:16px;"> Duplo sentido?</label>
          <button onclick="window.saveLexicon()" style="width:100%;background:linear-gradient(90deg,#9b5de5,#f15bb5);border:none;color:#fff;padding:12px;border-radius:6px;cursor:pointer;font-weight:700;">Adicionar</button>
        </div>
        <div style="width:300px;padding:20px;background:#111118;border-left:1px solid #252530;overflow-y:auto;">
          <h3 style="margin:0 0 15px 0;color:#9b5de5;">📚 Salvas</h3>
          <div id="lex-list">${listHtml}</div>
        </div>
      </div>
    `, 800, 500);
    };

    window.saveLexicon = function () {
      const w = document.getElementById('lex-word').value.trim().toLowerCase();
      const m = document.getElementById('lex-meaning').value.trim();
      if (!w || !m) return toast('Preencha palavra e significado!', 'error');
      lexicon[w] = { meaning: m, category: document.getElementById('lex-category').value.trim(), typos: document.getElementById('lex-typos').value.split(',').map(t => t.trim()).filter(t => t), doubleMeaning: document.getElementById('lex-double').checked };
      localStorage.setItem('vessie_lexicon_db', JSON.stringify(lexicon));
      toast(`"${w}" certificada!`, 'success');
      window.openVessieLexicon();
    };

    window.delLexicon = function (word) {
      delete lexicon[word];
      localStorage.setItem('vessie_lexicon_db', JSON.stringify(lexicon));
      window.openVessieLexicon();
    };

    // ==========================================
    // SISTEMA UPDATE AI (FORMATO 1 LINHA + FORCE COMPRESS)
    // ==========================================
    function generateCompressedCode() {
      let str = 'const VESSIE_PREDEFINED_RESPONSES={';
      let keys = Object.keys(cache);
      keys.forEach((key, i) => {
        str += `${key}:[`;
        let arr = cache[key].map(item => {
          return `"${String(item).replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\s+/g, ' ').trim()}"`;
        });
        str += arr.join(',');
        str += ']';
        if (i < keys.length - 1) str += ',';
      });
      str += '};';
      return str;
    }

    window.updateAI = function () {
      const code = generateCompressedCode();

      createWin('Update AI Code', '⬆️', `
      <div style="padding:20px;height:100%;display:flex;flex-direction:column;background:#0d0d12;color:#fff;">
        <h3 style="margin:0 0 10px;color:#9b5de5;">Código Gerado do Cache (Formato 1 Linha)</h3>
        <textarea id="ai-code-output" style="flex:1;width:100%;box-sizing:border-box;background:#050508;border:1px solid #252530;color:#0f0;padding:12px;border-radius:6px;font-family:monospace;font-size:.75rem;resize:none;" readonly>${code}</textarea>
        <div style="display:flex;gap:10px;margin-top:10px;">
          <button onclick="navigator.clipboard.writeText(document.getElementById('ai-code-output').value);toast('Código copiado!','success')" style="flex:1;background:linear-gradient(90deg,#9b5de5,#f15bb5);border:none;color:#fff;padding:10px;border-radius:6px;cursor:pointer;font-weight:700;">Copiar Código</button>
          <button onclick="window.forceCompressAI()" style="flex:1;background:#252530;border:1px solid #e74c3c;color:#e74c3c;padding:10px;border-radius:6px;cursor:pointer;font-weight:700;">⚡ Force Compress</button>
        </div>
      </div>
    `, 600, 500);
    };

    window.forceCompressAI = function () {
      logBatch("⚡ FORÇANDO COMPRESSÃO DE TODO O CACHE...");
      let count = 0;
      for (const key in cache) {
        if (Array.isArray(cache[key])) {
          cache[key] = cache[key].map(resp => {
            const c = compressToSingleLine(resp);
            if (c !== resp) count++;
            return c;
          });
        }
      }
      localStorage.setItem('vessie_batch_cache', JSON.stringify(cache));
      logBatch(`✅ Compressão forçada concluída! ${count} itens alterados.`);
      toast(`Cache forçadamente comprimido! ${count} itens alterados.`, 'success');

      // Atualiza a textarea na janela do Update AI
      const txtArea = document.getElementById('ai-code-output');
      if (txtArea) txtArea.value = generateCompressedCode();
    };

    // Ao iniciar, comprime o cache e depois testa a rede
    setTimeout(() => {
      window.compressLocalCache();
      window.testNet();
    }, 500);

    return win;
  }


  // ============================================================
  //  AUTOMATION
  // ============================================================
  function openAutomation() {
    const win = createWin('Automação', '🤖', `
    <div class="auto-shell">
      <div class="auto-hero">
        <div>
          <div class="status-pill"><i class="fas fa-robot"></i> Assistente ativo</div>
          <h3>Organize o sistema com um clique</h3>
          <p>Limpeza, otimização, backup e monitoramento em uma experiência visual simples.</p>
        </div>
        <button class="auto-main-btn" onclick="window.refreshAutoReport()">Atualizar</button>
      </div>
      <div class="auto-grid">
        <div class="auto-card">
          <h4>🧹 Limpeza</h4>
          <p>Remove arquivos temporários e melhora a performance.</p>
          <button onclick="window.runAutoCleanup()">Executar</button>
        </div>
        <div class="auto-card">
          <h4>⚡ Otimizar</h4>
          <p>Ajusta memória e prioriza tarefas mais importantes.</p>
          <button onclick="window.runAutoOptimize()">Executar</button>
        </div>
        <div class="auto-card">
          <h4>☁️ Backup</h4>
          <p>Cria um resumo de arquivos e preferências do sistema.</p>
          <button onclick="window.runAutoBackup()">Executar</button>
        </div>
        <div class="auto-card">
          <h4>📈 Relatório</h4>
          <p>Mostra status, saúde e recomendações do ambiente.</p>
          <button onclick="window.runAutoReport()">Executar</button>
        </div>
      </div>
      <div class="auto-report" id="auto-report"></div>
    </div>
  `, 720, 560);
    window.refreshAutoReport();
    return win;
  }

  window.refreshAutoReport = function () {
    const box = document.getElementById('auto-report');
    if (!box) return;
    const cpu = (18 + Math.random() * 15).toFixed(1);
    const ram = (32 + Math.random() * 18).toFixed(0);
    const storage = (58 + Math.random() * 12).toFixed(1);
    box.innerHTML = `<strong>Resumo automático</strong><br>CPU: <b>${cpu}%</b> · RAM: <b>${ram}%</b> · Armazenamento: <b>${storage}%</b><br><br>✔️ Modo de manutenção ativo<br>✔️ Backup automático discreto<br>✔️ Recomendação: foco em jogos e estudo sem travamentos`;
  };

  window.runAutoCleanup = function () {
    const box = document.getElementById('auto-report');
    if (box) { box.innerHTML = '<strong>Limpeza concluída</strong><br>Arquivos temporários removidos, cache limpo e espaço liberado com sucesso.'; }
    toast('Limpeza automática concluída ✨', 'success');
  };
  window.runAutoOptimize = function () {
    const box = document.getElementById('auto-report');
    if (box) { box.innerHTML = '<strong>Otimização aplicada</strong><br>Prioridade ajustada para aplicações mais usadas e consumo reduzido.'; }
    toast('Otimização aplicada ⚡', 'success');
  };
  window.runAutoBackup = function () {
    const box = document.getElementById('auto-report');
    if (box) { box.innerHTML = '<strong>Backup preparado</strong><br>Resumo de documentos, temas e preferências enviado para o ambiente virtual.'; }
    toast('Backup preparado ☁️', 'success');
  };
  window.runAutoReport = function () {
    window.refreshAutoReport();
    toast('Relatório atualizado 📈', 'success');
  };

  // ============================================================
  //  DASHBOARD
  // ============================================================
  function openDashboard() {
    const win = createWin('Dashboard', '📊', `
    <div class="dash" id="dash-main">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <h3 style="font-size:1.05rem;color:var(--text)">📊 Painel de Controle</h3>
        <button class="d-ref" onclick="refreshDash()"><i class="fas fa-sync-alt"></i> Atualizar</button>
      </div>
      <div class="d-cards" id="d-cards">
        <div class="dc"><div class="di2">💰</div><div class="dl">Vendas</div><div class="dv" id="dc-vendas">R$42.5k</div><div class="dd pos" id="dc-vp">↑ +8.3%</div></div>
        <div class="dc"><div class="di2">👥</div><div class="dl">Usuários</div><div class="dv" id="dc-users">12.4k</div><div class="dd pos" id="dc-up">↑ +2.1%</div></div>
        <div class="dc"><div class="di2">📈</div><div class="dl">Receita</div><div class="dv" id="dc-rec">R$88.2k</div><div class="dd neg" id="dc-rp">↓ -1.4%</div></div>
        <div class="dc"><div class="di2">🎯</div><div class="dl">Conversão</div><div class="dv" id="dc-conv">3.8%</div><div class="dd pos" id="dc-cp">↑ +0.5%</div></div>
      </div>
      <div class="d-chart">
        <div class="d-ct"><span>Vendas por Mês</span><button class="d-ref" onclick="refreshChart()"><i class="fas fa-random"></i></button></div>
        <div class="bc" id="bar-chart"></div>
      </div>
      <div class="d-chart">
        <div class="d-ct"><span>Atividade Recente</span>
          <input placeholder="🔍 Filtrar..." oninput="filterTable(this.value)" style="background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:20px;padding:4px 12px;color:white;outline:none;font-size:.78rem;width:160px">
        </div>
        <table class="d-tbl">
          <thead><tr><th>Nome</th><th>Status</th><th>Valor</th><th>Data</th><th>Ação</th></tr></thead>
          <tbody id="d-tbody">
            <tr><td>Ana Silva</td><td><span class="sb ok">Ativo</span></td><td>R$1.2k</td><td>21/05</td><td><button onclick="toast('Detalhes de Ana 📊')" style="background:rgba(126,182,255,.12);border:none;color:var(--a2);padding:3px 10px;border-radius:20px;font-size:.75rem;cursor:pointer">Ver</button></td></tr>
            <tr><td>Bruno Costa</td><td><span class="sb w">Pendente</span></td><td>R$840</td><td>20/05</td><td><button onclick="toast('Detalhes de Bruno 📊')" style="background:rgba(126,182,255,.12);border:none;color:var(--a2);padding:3px 10px;border-radius:20px;font-size:.75rem;cursor:pointer">Ver</button></td></tr>
            <tr><td>Carla Mendes</td><td><span class="sb ok">Ativo</span></td><td>R$3.1k</td><td>19/05</td><td><button onclick="toast('Detalhes de Carla 📊')" style="background:rgba(126,182,255,.12);border:none;color:var(--a2);padding:3px 10px;border-radius:20px;font-size:.75rem;cursor:pointer">Ver</button></td></tr>
            <tr><td>Diego Ramos</td><td><span class="sb e">Inativo</span></td><td>R$290</td><td>18/05</td><td><button onclick="toast('Detalhes de Diego 📊')" style="background:rgba(126,182,255,.12);border:none;color:var(--a2);padding:3px 10px;border-radius:20px;font-size:.75rem;cursor:pointer">Ver</button></td></tr>
            <tr><td>Elena Santos</td><td><span class="sb ok">Ativo</span></td><td>R$5.6k</td><td>17/05</td><td><button onclick="toast('Detalhes de Elena 📊')" style="background:rgba(126,182,255,.12);border:none;color:var(--a2);padding:3px 10px;border-radius:20px;font-size:.75rem;cursor:pointer">Ver</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `, 740, 580);
    setTimeout(() => renderBarChart(), 100); return win;
  }

  const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
  let barData = [65, 80, 45, 90, 70, 85, 60];

  function renderBarChart() {
    const bc = document.getElementById('bar-chart'); if (!bc) return;
    bc.innerHTML = ''; const max = Math.max(...barData);
    barData.forEach((v, i) => {
      const item = document.createElement('div'); item.className = 'bi';
      const pct = Math.round((v / max) * 100);
      item.innerHTML = `<div class="bar" style="height:${pct}%"></div><div class="bl">${MONTHS[i]}</div>`;
      bc.appendChild(item);
    });
  }

  window.refreshChart = function () { barData = MONTHS.map(() => 30 + Math.floor(Math.random() * 70)); renderBarChart(); toast('Gráfico atualizado! 📊', 'success'); };
  window.refreshDash = function () {
    refreshChart();
    const pairs = [['dc-vendas', 'dc-vp', 'R$', 'k', 10, 100], ['dc-users', 'dc-up', '', 'k', 5, 50], ['dc-rec', 'dc-rp', 'R$', 'k', 20, 200], ['dc-conv', 'dc-cp', '', '%', 1, 10]];
    pairs.forEach(([vid, pid, pre, suf, min, max]) => {
      const el = document.getElementById(vid); const pe = document.getElementById(pid); if (!el || !pe) return;
      const v = (min + Math.random() * (max - min)).toFixed(1); const ch = ((Math.random() - .4) * 20).toFixed(1);
      el.textContent = `${pre}${v}${suf}`; const pos = parseFloat(ch) >= 0;
      pe.textContent = `${pos ? '↑' : '↓'} ${pos ? '+' : ''}${ch}%`; pe.className = `dd ${pos ? 'pos' : 'neg'}`;
    });
    toast('Dashboard atualizado! ✨', 'success');
  };
  window.updateCard = function () { return; };
  window.filterTable = function (q) {
    document.querySelectorAll('#d-tbody tr').forEach(tr => { tr.style.display = tr.cells[0].textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none'; });
  };

  // ============================================================
  //  FILE EXPLORER
  // ============================================================
  function openExplorer() {
    const win = createWin('Explorador de Arquivos', '📁', `
    <div class="fexp">
      <div class="fesb">
        <div style="font-size:.72rem;color:var(--dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Locais</div>
        ${Object.keys(S.fs).map(k => `<div class="fld ${k === S.currentPath ? 'ac' : ''}" data-dir="${k}"><i class="fas ${getFolderIcon(k)}"></i> ${k}</div>`).join('')}
      </div>
      <div class="fem">
        <div class="fe-tb">
          <button class="fe-tbtn" onclick="feBack(this)"><i class="fas fa-arrow-left"></i></button>
          <div class="fe-path" id="fe-path">${S.currentPath}</div>
          <button class="fe-tbtn" onclick="feNewFolder(this.closest('.win'))"><i class="fas fa-folder-plus"></i> Nova Pasta</button>
          <button class="fe-tbtn" onclick="feNewFile(this.closest('.win'))"><i class="fas fa-file-plus"></i> Novo Arq.</button>
        </div>
        <div class="fem-body">
          <div class="fgrid" id="fe-grid"></div>
          <div class="feprev" id="fe-preview">
            <h4>Visualização</h4>
            <div class="fp-media" id="fe-media"><span style="color:var(--dim)">Selecione um arquivo para ver o preview</span></div>
            <div class="fp-meta" id="fe-meta"></div>
            <div class="fp-actions">
              <button onclick="openSelectedFile(this.closest('.win'))"><i class="fas fa-eye"></i> Abrir</button>
              <button onclick="deleteSelectedFile(this.closest('.win'))"><i class="fas fa-trash"></i> Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `, 780, 520);
    win.querySelectorAll('.fld').forEach(f => {
      f.onclick = () => {
        win.querySelectorAll('.fld').forEach(x => x.classList.remove('ac')); f.classList.add('ac');
        S.currentPath = f.dataset.dir; win.querySelector('#fe-path').textContent = f.dataset.dir;
        renderFileGrid(win, f.dataset.dir);
      };
    });
    renderFileGrid(win, S.currentPath);
    return win;
  }

  function getFolderIcon(name) {
    const m = { 'Desktop': 'fa-desktop', 'Documentos': 'fa-file-alt', 'Downloads': 'fa-download', 'Imagens': 'fa-images', 'Videos': 'fa-film', 'Sistema': 'fa-cog' };
    return m[name] || 'fa-folder';
  }

  function renderFileGrid(win, path) {
    if (win) {
      win.dataset.selectedPath = path;
      delete win.dataset.selectedFile;
    }
    const grid = win.querySelector('#fe-grid'); if (!grid) return;
    grid.innerHTML = '';
    const folder = VFS.resolve(path);
    if (!folder || typeof folder !== 'object') {
      grid.innerHTML = '<p style="color:var(--dim);font-size:.85rem">Pasta vazia</p>';
      return;
    }
    Object.entries(folder).forEach(([name, val]) => {
      const isDir = val && typeof val === 'object';
      const el = document.createElement('div'); el.className = 'fi';
      el.innerHTML = `<i class="fas ${isDir ? 'fa-folder' : 'fa-file-alt'}" style="color:${isDir ? '#ffb74d' : '#7eb6ff'}"></i><span>${name}</span>`;
      el.ondblclick = () => {
        if (isDir) {
          const nextPath = path ? `${path}/${name}` : name;
          S.currentPath = nextPath;
          win.querySelector('#fe-path').textContent = nextPath;
          renderFileGrid(win, nextPath);
        } else if (typeof val === 'string') {
          openNotepadWithContent(name, val);
        }
      };
      el.onclick = () => { win.querySelectorAll('.fi').forEach(f => f.classList.remove('sel')); el.classList.add('sel'); win.dataset.selectedFile = name; win.dataset.selectedPath = path; renderFilePreview(win, name, val); };
      el.addEventListener('dragover', e => e.preventDefault());
      el.addEventListener('drop', e => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (!files || !files.length) return;
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result;
          const target = VFS.resolve(path);
          if (target && typeof target === 'object') {
            const fileName = files[0].name;
            target[fileName] = typeof content === 'string' ? content : content.toString();
            renderFileGrid(win, path);
            toast(`Arquivo transferido para ${path}`, 'success');
            persistState();
          }
        };
        reader.readAsText(files[0]);
      });
      grid.appendChild(el);
    });
    if (!Object.keys(folder).length) grid.innerHTML = '<p style="color:var(--dim);font-size:.85rem;padding:20px">Pasta vazia</p>';
  }

  window.feNewFolder = function (win) {
    const n = prompt('Nome da pasta:');
    if (n && n.trim()) {
      const folder = VFS.resolve(S.currentPath);
      if (folder && typeof folder === 'object') {
        folder[n.trim()] = {};
      } else {
        VFS.write(`${S.currentPath}/${n.trim()}`, {});
      }
      renderFileGrid(win, S.currentPath);
      persistState();
      toast(`Pasta "${n}" criada!`, 'success');
    }
  };
  window.feNewFile = function (win) {
    const n = prompt('Nome do arquivo:');
    if (n && n.trim()) {
      const folder = VFS.resolve(S.currentPath);
      if (folder && typeof folder === 'object') {
        folder[n.trim()] = '';
      } else {
        VFS.write(`${S.currentPath}/${n.trim()}`, '');
      }
      renderFileGrid(win, S.currentPath);
      persistState();
      toast(`Arquivo "${n}" criado!`, 'success');
    }
  };
  window.feBack = function (btn) {
    const win = btn.closest('.win');
    if (S.currentPath.includes('/')) {
      S.currentPath = S.currentPath.split('/').slice(0, -1).join('/') || 'Desktop';
    } else {
      S.currentPath = 'Desktop';
    }
    if (win) {
      win.querySelector('#fe-path').textContent = S.currentPath;
      renderFileGrid(win, S.currentPath);
      renderFilePreview(win, null, null);
    }
  };

  function renderFilePreview(win, name, val) {
    const media = win.querySelector('#fe-media');
    const meta = win.querySelector('#fe-meta');
    if (!media || !meta) { return; }
    media.innerHTML = '';
    meta.innerHTML = '';
    if (!name) {
      media.innerHTML = '<span style="color:var(--dim)">Selecione um arquivo para ver o preview</span>';
      return;
    }
    const path = win.dataset.selectedPath || S.currentPath;
    const isDir = val && typeof val === 'object';
    if (isDir) {
      media.innerHTML = `<div style="padding:14px;color:var(--dim);font-size:.9rem">Pasta: ${name}<br>Itens: ${Object.keys(val).length}</div>`;
      meta.innerHTML = `<div><strong>Caminho</strong><div>${path}/${name}</div></div>`;
      return;
    }
    const lower = name.toLowerCase();
    if (typeof val === 'string' && val.trim().match(/^https?:\/\//i)) {
      if (lower.match(/\.(gif|webp|jpe?g|png)(\?.*)?$/i)) {
        const img = document.createElement('img'); img.src = val; img.alt = name; media.appendChild(img);
      } else if (lower.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
        const vid = document.createElement('video'); vid.src = val; vid.autoplay = true; vid.muted = true; vid.loop = true; vid.playsInline = true; media.appendChild(vid);
      } else {
        const iframe = document.createElement('iframe'); iframe.src = val; iframe.sandbox = 'allow-same-origin allow-scripts allow-popups'; iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.border = 'none'; media.appendChild(iframe);
      }
    } else if (typeof val === 'string') {
      const txt = document.createElement('textarea'); txt.readOnly = true; txt.value = val; media.appendChild(txt);
    } else {
      media.innerHTML = '<span style="color:var(--dim)">Arquivo selecionado sem conteúdo visualizável</span>';
    }
    meta.innerHTML = `<div><strong>Nome</strong><div>${name}</div></div><div><strong>Tipo</strong><div>${isDir ? 'Pasta' : 'Arquivo'}</div></div><div><strong>Caminho</strong><div>${path}</div></div>`;
  }

  window.openSelectedFile = function (win) {
    const name = win.dataset.selectedFile;
    const path = win.dataset.selectedPath || S.currentPath;
    if (!name) { toast('Selecione um arquivo primeiro', 'error'); return; }
    const target = VFS.resolve(`${path}/${name}`);
    if (target && typeof target === 'object') {
      const nextPath = path ? `${path}/${name}` : name;
      S.currentPath = nextPath;
      win.querySelector('#fe-path').textContent = nextPath;
      renderFileGrid(win, nextPath);
      renderFilePreview(win, null, null);
      return;
    }
    openNotepadWithContent(name, target || '');
  };

  window.deleteSelectedFile = function (win) {
    const name = win.dataset.selectedFile;
    const path = win.dataset.selectedPath || S.currentPath;
    if (!name) { toast('Selecione um item primeiro', 'error'); return; }
    if (!confirm(`Excluir "${name}" de ${path}?`)) return;
    VFS.delete(`${path}/${name}`);
    renderFileGrid(win, path);
    delete win.dataset.selectedFile;
    delete win.dataset.selectedPath;
    renderFilePreview(win, null, null);
    persistState();
    toast(`"${name}" excluído de ${path}`, 'success');
  };

  function openNotepadWithContent(name, content) {
    return createWin(name, '📝', `
    <div class="npad">
      <div class="npad-tb">
        <button onclick="saveNotepad(this)"><i class="fas fa-save"></i> Salvar</button>
        <button onclick="copyNotepad(this)"><i class="fas fa-copy"></i> Copiar</button>
        <button onclick="modifySelectedLines(this)"><i class="fas fa-magic"></i> Modificar seleção</button>
        <span id="wc-${name.replace(/\W/g, '_')}">0 palavras</span>
      </div>
      <textarea class="npad-area" oninput="updateWC(this,'${name.replace(/\W/g, '_')}')" placeholder="Escreva aqui...">${content || ''}</textarea>
    </div>
  `, 580, 420);
  }

  function openNvidia() {
    // ---------- ESTADO INTERNO ----------
    const state = {
      drivers: {
        version: '572.83',
        studio: '572.70',
        gameReady: '572.83',
        lastCheck: Date.now() - 86400000,
        installed: '572.83',
        history: ['572.83 (30/05/2026)', '572.60 (15/05/2026)', '572.42 (28/04/2026)', '572.16 (10/04/2026)']
      },
      gpu: {
        name: 'NVIDIA GeForce RTX 5080',
        vram: '16 GB GDDR7',
        temp: 42,
        maxTemp: 82,
        fanSpeed: 38,
        usage: 12,
        memoryUsage: 18,
        power: 68,
        clock: 2670,
        memoryClock: 11250,
        voltage: 0.985
      },
      overclock: {
        coreOffset: 0,
        memoryOffset: 0,
        powerLimit: 100,
        tempLimit: 83
      },
      settings: {
        autoUpdate: true,
        notifications: true,
        lowLatency: true,
        gsync: true,
        dlss: true,
        reflex: true,
        hdr: true,
        vSync: false,
        shadowPlay: true,
        experimental: false
      },
      redeemed: [
        { code: 'NVIDIA-2026-GIFT', date: '15/05/2026', game: 'Cyberpunk 2077: Phantom Liberty' },
        { code: 'DLSS-PROMO', date: '10/05/2026', game: 'Alan Wake 2' }
      ],
      notifications: []
    };

    // ---------- FUNÇÕES AUXILIARES ----------
    function addNotification(msg, type = 'info') {
      state.notifications.unshift({ msg, type, time: Date.now() });
      if (state.notifications.length > 20) state.notifications.pop();
      updateNotifications();
    }

    function updateNotifications() {
      const container = document.getElementById('nvidia-notifications');
      if (!container) return;
      container.innerHTML = state.notifications.length ? state.notifications.slice(0, 5).map(n =>
        `<div style="padding:6px 10px;background:rgba(255,255,255,.04);border-left:2px solid ${n.type === 'success' ? '#4ade80' : n.type === 'error' ? '#ef4444' : '#66c0f4'};margin-bottom:4px;border-radius:4px;font-size:.78rem;">
        ${n.msg}
      </div>`
      ).join('') : '<div style="color:#5b6680;font-size:.78rem;">Nenhuma notificação</div>';
    }

    function simulateGPU() {
      state.gpu.temp = 38 + Math.random() * 15;
      state.gpu.fanSpeed = 30 + Math.random() * 25;
      state.gpu.usage = 5 + Math.random() * 25;
      state.gpu.memoryUsage = 10 + Math.random() * 20;
      state.gpu.power = 50 + Math.random() * 30;
      state.gpu.clock = 2640 + Math.random() * 60;
      updateMetrics();
    }

    function updateMetrics() {
      const t = document.getElementById('gpu-temp');
      const f = document.getElementById('gpu-fan');
      const u = document.getElementById('gpu-usage');
      const m = document.getElementById('gpu-memory');
      const p = document.getElementById('gpu-power');
      const c = document.getElementById('gpu-clock');
      if (t) t.textContent = state.gpu.temp.toFixed(1) + '°C';
      if (f) f.textContent = state.gpu.fanSpeed.toFixed(0) + '%';
      if (u) {
        u.textContent = state.gpu.usage.toFixed(1) + '%';
        u.style.width = state.gpu.usage + '%';
      }
      if (m) {
        m.textContent = state.gpu.memoryUsage.toFixed(1) + '%';
        m.style.width = state.gpu.memoryUsage + '%';
      }
      if (p) p.textContent = state.gpu.power.toFixed(0) + 'W';
      if (c) c.textContent = state.gpu.clock.toFixed(0) + ' MHz';
    }

    // ---------- FUNÇÕES DE NAVEGAÇÃO ----------
    function navigateTo(section) {
      document.querySelectorAll('.nvidia-section').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.nvidia-nav-item').forEach(el => el.classList.remove('active'));
      const target = document.getElementById('nvidia-' + section);
      if (target) target.style.display = 'block';
      const nav = document.querySelector(`.nvidia-nav-item[data-section="${section}"]`);
      if (nav) nav.classList.add('active');
    }

    // ---------- DRIVERS ----------
    function checkDrivers() {
      const btn = document.getElementById('nvidia-check-drivers');
      const status = document.getElementById('nvidia-driver-status');
      if (!btn || !status) return;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
      status.textContent = '🔍 Verificando atualizações...';
      setTimeout(() => {
        const hasUpdate = Math.random() > 0.65;
        if (hasUpdate) {
          const newVer = (572.8 + Math.random() * 0.5).toFixed(2);
          status.innerHTML = `✅ Nova versão disponível: <strong>${newVer}</strong> (atual: ${state.drivers.version})`;
          addNotification(`Nova versão do driver ${newVer} disponível!`, 'success');
        } else {
          status.innerHTML = `✅ Você está usando a versão mais recente (${state.drivers.version})`;
          addNotification('Drivers atualizados', 'info');
        }
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Verificar';
        state.drivers.lastCheck = Date.now();
      }, 2000);
    }

    function installDriver() {
      const status = document.getElementById('nvidia-driver-status');
      if (!status) return;
      status.innerHTML = '⬇️ Baixando driver... (25%)';
      let progress = 25;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          clearInterval(interval);
          const newVer = (572.8 + Math.random() * 0.5).toFixed(2);
          state.drivers.installed = newVer;
          state.drivers.version = newVer;
          state.drivers.history.unshift(`${newVer} (${new Date().toLocaleDateString('pt-BR')})`);
          status.innerHTML = `✅ Driver ${newVer} instalado com sucesso! Reinicie o sistema para aplicar.`;
          addNotification(`Driver ${newVer} instalado!`, 'success');
          document.getElementById('nvidia-driver-version').textContent = newVer;
          document.getElementById('nvidia-driver-history').innerHTML = state.drivers.history.map(h => `<div>${h}</div>`).join('');
        } else {
          status.innerHTML = `⬇️ Instalando driver... (${Math.round(progress)}%)`;
        }
      }, 400);
    }

    // ---------- RESGATAR ----------
    function redeemCode() {
      const input = document.getElementById('nvidia-redeem-input');
      const status = document.getElementById('nvidia-redeem-status');
      if (!input || !status) return;
      const code = input.value.trim();
      if (!code) { status.textContent = '❌ Digite um código para resgatar.'; return; }
      status.textContent = '🔍 Verificando código...';
      setTimeout(() => {
        const valid = code.length >= 6 && (code.includes('NVIDIA') || code.includes('GIFT') || code.includes('DLSS'));
        if (valid) {
          const games = ['Cyberpunk 2077: Phantom Liberty', 'Alan Wake 2', 'Starfield', 'Diablo IV', 'Forza Motorsport'];
          const game = games[Math.floor(Math.random() * games.length)];
          state.redeemed.unshift({ code, date: new Date().toLocaleDateString('pt-BR'), game });
          status.innerHTML = `✅ Código <strong>${code}</strong> resgatado! Você recebeu <strong>${game}</strong>.`;
          input.value = '';
          document.getElementById('nvidia-redeemed-list').innerHTML = state.redeemed.map(r =>
            `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:.8rem;">
            <span>🎮 ${r.game}</span>
            <span style="color:#5b6680;">${r.code} · ${r.date}</span>
          </div>`
          ).join('');
          addNotification(`Código ${code} resgatado! 🎮`, 'success');
        } else {
          status.textContent = '❌ Código inválido. Tente novamente.';
          addNotification('Código inválido', 'error');
        }
      }, 1500);
    }

    // ---------- OVERCLOCK ----------
    function applyOverclock() {
      const core = document.getElementById('nvidia-oc-core');
      const mem = document.getElementById('nvidia-oc-mem');
      const power = document.getElementById('nvidia-oc-power');
      const temp = document.getElementById('nvidia-oc-temp');
      if (!core || !mem || !power || !temp) return;
      state.overclock.coreOffset = parseInt(core.value);
      state.overclock.memoryOffset = parseInt(mem.value);
      state.overclock.powerLimit = parseInt(power.value);
      state.overclock.tempLimit = parseInt(temp.value);
      document.getElementById('nvidia-oc-core-val').textContent = core.value + ' MHz';
      document.getElementById('nvidia-oc-mem-val').textContent = mem.value + ' MHz';
      document.getElementById('nvidia-oc-power-val').textContent = power.value + '%';
      document.getElementById('nvidia-oc-temp-val').textContent = temp.value + '°C';

      // Empurrar TODOS os limites ao máximo simultaneamente = instabilidade.
      // Isso é puramente cosmético (uma simulação de tela azul dentro do
      // próprio VessieOS) — nada aqui toca hardware real.
      const coreMax = parseInt(core.max), memMax = parseInt(mem.max), powerMax = parseInt(power.max);
      const isMaxedOut = state.overclock.coreOffset >= coreMax && state.overclock.memoryOffset >= memMax && state.overclock.powerLimit >= powerMax;
      if (isMaxedOut) {
        addNotification('Instabilidade crítica detectada na GPU!', 'error');
        window.__vsysTriggerBSOD?.('OVERCLOCK_INSTABILITY_DETECTED', 'nvidia-settings.exe');
        return;
      }

      addNotification(`Overclock aplicado: Core +${core.value} MHz, Memória +${mem.value} MHz`, 'success');
      toast('Overclock aplicado! ⚡', 'success');
    }

    // ---------- CONFIGURAÇÕES ----------
    function toggleSetting(key) {
      state.settings[key] = !state.settings[key];
      const el = document.getElementById('nvidia-toggle-' + key);
      if (el) {
        el.querySelector('input').checked = state.settings[key];
        el.querySelector('.toggle-label').textContent = state.settings[key] ? 'Ativado' : 'Desativado';
      }
      addNotification(`${key} ${state.settings[key] ? 'ativado' : 'desativado'}`, 'info');
    }

    // ---------- CONSTRÓI A INTERFACE ----------
    const win = createWin('NVIDIA APP', '🖥️', `
    <style>
      .nvidia-nav-item {
        padding: 10px 14px;
        border-radius: 8px;
        cursor: pointer;
        transition: .14s;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #8fa0bf;
        font-size: .85rem;
      }
      .nvidia-nav-item:hover {
        background: rgba(255,255,255,.06);
        color: #eef2ff;
      }
      .nvidia-nav-item.active {
        background: rgba(102,192,244,.15);
        color: #66c0f4;
        box-shadow: inset 3px 0 0 #66c0f4;
      }
      .nvidia-nav-item i { width: 18px; text-align: center; }
      .nvidia-section { display: none; animation: fu .25s ease; }
      .nvidia-section.active { display: block; }
      .nvidia-card {
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 14px;
        transition: .14s;
      }
      .nvidia-card:hover {
        border-color: rgba(255,255,255,.15);
      }
      .nvidia-stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        border-bottom: 1px solid rgba(255,255,255,.05);
      }
      .nvidia-stat:last-child { border-bottom: none; }
      .nvidia-progress-bar {
        height: 6px;
        background: rgba(255,255,255,.08);
        border-radius: 3px;
        overflow: hidden;
        margin-top: 4px;
      }
      .nvidia-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #66c0f4, #4f94c9);
        border-radius: 3px;
        transition: width .6s ease;
        width: 0%;
      }
      .nvidia-slider {
        width: 100%;
        accent-color: #66c0f4;
        cursor: pointer;
      }
      .nvidia-toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }
      .nvidia-toggle input[type="checkbox"] {
        appearance: none;
        width: 40px;
        height: 22px;
        background: rgba(255,255,255,.15);
        border-radius: 11px;
        position: relative;
        transition: .2s;
        cursor: pointer;
        flex-shrink: 0;
      }
      .nvidia-toggle input[type="checkbox"]:checked {
        background: #66c0f4;
      }
      .nvidia-toggle input[type="checkbox"]::after {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        background: #fff;
        border-radius: 50%;
        top: 2px;
        left: 2px;
        transition: .2s;
      }
      .nvidia-toggle input[type="checkbox"]:checked::after {
        left: 20px;
      }
      .nvidia-badge {
        background: #c0392b;
        color: #fff;
        border-radius: 50%;
        padding: 0 6px;
        font-size: .65rem;
        margin-left: auto;
      }
    </style>

    <div style="display:flex;height:100%;background:linear-gradient(135deg,#090b10,#101722);color:#eef2ff;font-family:'Segoe UI',sans-serif;overflow:hidden;">
      
      <!-- SIDEBAR -->
      <div style="width:220px;background:rgba(0,0,0,.35);border-right:1px solid rgba(255,255,255,.06);padding:16px 10px;display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;">
        <div style="display:flex;align-items:center;gap:10px;padding:0 4px 16px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:12px;">
          <span style="font-size:1.6rem;background:linear-gradient(135deg,#66c0f4,#4f94c9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800;">NVIDIA</span>
          <span style="font-size:.65rem;color:#5b6680;background:rgba(255,255,255,.06);padding:2px 8px;border-radius:10px;">APP</span>
        </div>
        <div class="nvidia-nav-item active" data-section="home" onclick="nvidiaNavigate('home')"><i class="fas fa-home"></i> Página inicial</div>
        <div class="nvidia-nav-item" data-section="drivers" onclick="nvidiaNavigate('drivers')"><i class="fas fa-microchip"></i> Drivers</div>
        <div class="nvidia-nav-item" data-section="performance" onclick="nvidiaNavigate('performance')"><i class="fas fa-chart-line"></i> Desempenho</div>
        <div class="nvidia-nav-item" data-section="overclock" onclick="nvidiaNavigate('overclock')"><i class="fas fa-tachometer-alt"></i> Overclock</div>
        <div class="nvidia-nav-item" data-section="system" onclick="nvidiaNavigate('system')"><i class="fas fa-desktop"></i> Sistema</div>
        <div class="nvidia-nav-item" data-section="redeem" onclick="nvidiaNavigate('redeem')"><i class="fas fa-gift"></i> Resgatar</div>
        <div class="nvidia-nav-item" data-section="settings" onclick="nvidiaNavigate('settings')"><i class="fas fa-cog"></i> Configurações</div>
        <div style="margin-top:auto;padding-top:12px;border-top:1px solid rgba(255,255,255,.06);font-size:.7rem;color:#5b6680;text-align:center;">
          <div>NVIDIA App v1.2.0</div>
          <div style="margin-top:2px;">GPU: ${state.gpu.name}</div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div style="flex:1;padding:20px 24px;overflow-y:auto;">

        <!-- NOTIFICAÇÕES (topo) -->
        <div id="nvidia-notifications" style="margin-bottom:16px;padding:8px 12px;background:rgba(0,0,0,.2);border-radius:8px;border:1px solid rgba(255,255,255,.04);min-height:36px;"></div>

        <!-- HOME -->
        <div class="nvidia-section active" id="nvidia-home">
          <h2 style="font-size:1.25rem;margin:0 0 4px;">Centro NVIDIA</h2>
          <p style="color:#8fa0bf;font-size:.9rem;line-height:1.6;margin:0 0 18px;">Painel de controle avançado para drivers, performance e experiências de jogos com IA.</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;">
            <div class="nvidia-card">
              <div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Driver</div>
              <div style="font-size:1.1rem;font-weight:600;margin-top:4px;" id="nvidia-driver-version">${state.drivers.version}</div>
              <div style="font-size:.75rem;color:#66c0f4;">Game Ready</div>
            </div>
            <div class="nvidia-card">
              <div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">GPU</div>
              <div style="font-size:1.1rem;font-weight:600;margin-top:4px;">${state.gpu.name}</div>
              <div style="font-size:.75rem;color:#8fa0bf;">${state.gpu.vram}</div>
            </div>
            <div class="nvidia-card">
              <div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Temperatura</div>
              <div style="font-size:1.5rem;font-weight:600;margin-top:4px;color:${state.gpu.temp > 75 ? '#ef4444' : state.gpu.temp > 60 ? '#fbbf24' : '#4ade80'};" id="gpu-temp">${state.gpu.temp.toFixed(1)}°C</div>
              <div style="font-size:.75rem;color:#8fa0bf;">Máx: ${state.gpu.maxTemp}°C</div>
            </div>
            <div class="nvidia-card">
              <div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Uso</div>
              <div style="font-size:1.5rem;font-weight:600;margin-top:4px;" id="gpu-usage">${state.gpu.usage.toFixed(1)}%</div>
              <div class="nvidia-progress-bar"><div class="nvidia-progress-fill" id="gpu-usage" style="width:${state.gpu.usage}%;"></div></div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:12px;">
            <div class="nvidia-card"><div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Fan</div><div style="font-size:1.1rem;font-weight:600;" id="gpu-fan">${state.gpu.fanSpeed.toFixed(0)}%</div></div>
            <div class="nvidia-card"><div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Memória</div><div style="font-size:1.1rem;font-weight:600;" id="gpu-memory">${state.gpu.memoryUsage.toFixed(1)}%</div><div class="nvidia-progress-bar"><div class="nvidia-progress-fill" id="gpu-memory" style="width:${state.gpu.memoryUsage}%;"></div></div></div>
            <div class="nvidia-card"><div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Potência</div><div style="font-size:1.1rem;font-weight:600;" id="gpu-power">${state.gpu.power.toFixed(0)}W</div></div>
            <div class="nvidia-card"><div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Clock</div><div style="font-size:1.1rem;font-weight:600;" id="gpu-clock">${state.gpu.clock.toFixed(0)} MHz</div></div>
          </div>
          <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
            <button onclick="nvidiaCheckDrivers()" id="nvidia-check-drivers" style="background:#66c0f4;border:none;color:#090b10;padding:8px 18px;border-radius:8px;font-weight:600;cursor:pointer;transition:.14s;"><i class="fas fa-sync-alt"></i> Verificar drivers</button>
            <button onclick="nvidiaSimulate()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#eef2ff;padding:8px 18px;border-radius:8px;cursor:pointer;transition:.14s;"><i class="fas fa-chart-bar"></i> Simular carga</button>
          </div>
          <div id="nvidia-driver-status" style="margin-top:10px;font-size:.85rem;color:#8fa0bf;"></div>
        </div>

        <!-- DRIVERS -->
        <div class="nvidia-section" id="nvidia-drivers">
          <h2 style="font-size:1.1rem;margin:0 0 4px;"><i class="fas fa-microchip" style="color:#66c0f4;"></i> Drivers</h2>
          <p style="color:#8fa0bf;font-size:.85rem;margin:0 0 16px;">Gerencie seus drivers NVIDIA.</p>
          <div class="nvidia-card">
            <div class="nvidia-stat"><span>Versão instalada</span><span style="font-weight:600;" id="nvidia-driver-version">${state.drivers.version}</span></div>
            <div class="nvidia-stat"><span>Tipo</span><span>Game Ready</span></div>
            <div class="nvidia-stat"><span>Última verificação</span><span>${new Date(state.drivers.lastCheck).toLocaleString('pt-BR')}</span></div>
            <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
              <button onclick="nvidiaCheckDrivers()" style="background:#66c0f4;border:none;color:#090b10;padding:6px 16px;border-radius:6px;font-weight:600;cursor:pointer;"><i class="fas fa-sync-alt"></i> Verificar</button>
              <button onclick="nvidiaInstallDriver()" style="background:rgba(102,192,244,.15);border:1px solid rgba(102,192,244,.3);color:#66c0f4;padding:6px 16px;border-radius:6px;cursor:pointer;"><i class="fas fa-download"></i> Instalar</button>
            </div>
            <div id="nvidia-driver-status" style="margin-top:8px;font-size:.85rem;color:#8fa0bf;"></div>
          </div>
          <div class="nvidia-card">
            <div style="font-weight:600;margin-bottom:8px;">Histórico de drivers</div>
            <div id="nvidia-driver-history">
              ${state.drivers.history.map(h => `<div style="padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.8rem;">${h}</div>`).join('')}
            </div>
          </div>
        </div>

        <!-- PERFORMANCE -->
        <div class="nvidia-section" id="nvidia-performance">
          <h2 style="font-size:1.1rem;margin:0 0 4px;"><i class="fas fa-chart-line" style="color:#66c0f4;"></i> Desempenho</h2>
          <p style="color:#8fa0bf;font-size:.85rem;margin:0 0 16px;">Monitoramento em tempo real da sua GPU.</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
            <div class="nvidia-card"><div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Temperatura</div><div style="font-size:1.8rem;font-weight:600;" id="gpu-temp-perf">${state.gpu.temp.toFixed(1)}°C</div><div style="font-size:.75rem;color:#8fa0bf;">Máx: ${state.gpu.maxTemp}°C</div></div>
            <div class="nvidia-card"><div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Clock GPU</div><div style="font-size:1.8rem;font-weight:600;" id="gpu-clock-perf">${state.gpu.clock.toFixed(0)} MHz</div><div style="font-size:.75rem;color:#8fa0bf;">Base: 2640 MHz</div></div>
            <div class="nvidia-card"><div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Memória</div><div style="font-size:1.8rem;font-weight:600;" id="gpu-mem-perf">${state.gpu.memoryClock.toFixed(0)} MHz</div><div style="font-size:.75rem;color:#8fa0bf;">${state.gpu.vram}</div></div>
            <div class="nvidia-card"><div style="font-size:.7rem;text-transform:uppercase;color:#5b6680;">Potência</div><div style="font-size:1.8rem;font-weight:600;" id="gpu-power-perf">${state.gpu.power.toFixed(0)} W</div><div style="font-size:.75rem;color:#8fa0bf;">TDP: 320W</div></div>
          </div>
          <div class="nvidia-card">
            <div style="font-weight:600;margin-bottom:8px;">Uso da GPU</div>
            <div class="nvidia-stat"><span>Utilização</span><span id="gpu-usage-label">${state.gpu.usage.toFixed(1)}%</span></div>
            <div class="nvidia-progress-bar"><div class="nvidia-progress-fill" id="gpu-usage-bar" style="width:${state.gpu.usage}%;"></div></div>
            <div class="nvidia-stat" style="margin-top:8px;"><span>Memória VRAM</span><span id="gpu-memory-label">${state.gpu.memoryUsage.toFixed(1)}%</span></div>
            <div class="nvidia-progress-bar"><div class="nvidia-progress-fill" id="gpu-memory-bar" style="width:${state.gpu.memoryUsage}%;"></div></div>
          </div>
        </div>

        <!-- OVERCLOCK -->
        <div class="nvidia-section" id="nvidia-overclock">
          <h2 style="font-size:1.1rem;margin:0 0 4px;"><i class="fas fa-tachometer-alt" style="color:#66c0f4;"></i> Overclock</h2>
          <p style="color:#8fa0bf;font-size:.85rem;margin:0 0 16px;">Ajuste fino para extrair o máximo da sua GPU.</p>
          <div class="nvidia-card">
            <div style="margin-bottom:12px;">
              <div style="display:flex;justify-content:space-between;"><span>Offset do Core</span><span id="nvidia-oc-core-val">0 MHz</span></div>
              <input type="range" id="nvidia-oc-core" min="-100" max="300" value="0" class="nvidia-slider" oninput="document.getElementById('nvidia-oc-core-val').textContent=this.value+' MHz'">
            </div>
            <div style="margin-bottom:12px;">
              <div style="display:flex;justify-content:space-between;"><span>Offset da Memória</span><span id="nvidia-oc-mem-val">0 MHz</span></div>
              <input type="range" id="nvidia-oc-mem" min="-200" max="500" value="0" class="nvidia-slider" oninput="document.getElementById('nvidia-oc-mem-val').textContent=this.value+' MHz'">
            </div>
            <div style="margin-bottom:12px;">
              <div style="display:flex;justify-content:space-between;"><span>Limite de Potência</span><span id="nvidia-oc-power-val">100%</span></div>
              <input type="range" id="nvidia-oc-power" min="80" max="120" value="100" class="nvidia-slider" oninput="document.getElementById('nvidia-oc-power-val').textContent=this.value+'%'">
            </div>
            <div style="margin-bottom:12px;">
              <div style="display:flex;justify-content:space-between;"><span>Limite de Temperatura</span><span id="nvidia-oc-temp-val">83°C</span></div>
              <input type="range" id="nvidia-oc-temp" min="70" max="90" value="83" class="nvidia-slider" oninput="document.getElementById('nvidia-oc-temp-val').textContent=this.value+'°C'">
            </div>
            <button onclick="nvidiaApplyOC()" style="background:#66c0f4;border:none;color:#090b10;padding:8px 24px;border-radius:8px;font-weight:600;cursor:pointer;width:100%;"><i class="fas fa-bolt"></i> Aplicar Overclock</button>
          </div>
        </div>

        <!-- SISTEMA -->
        <div class="nvidia-section" id="nvidia-system">
          <h2 style="font-size:1.1rem;margin:0 0 4px;"><i class="fas fa-desktop" style="color:#66c0f4;"></i> Sistema</h2>
          <p style="color:#8fa0bf;font-size:.85rem;margin:0 0 16px;">Informações detalhadas do seu sistema.</p>
          <div class="nvidia-card">
            <div class="nvidia-stat"><span>GPU</span><span>${state.gpu.name}</span></div>
            <div class="nvidia-stat"><span>VRAM</span><span>${state.gpu.vram}</span></div>
            <div class="nvidia-stat"><span>Driver</span><span id="nvidia-sys-driver">${state.drivers.version}</span></div>
            <div class="nvidia-stat"><span>DirectX</span><span>12 Ultimate</span></div>
            <div class="nvidia-stat"><span>Resizable BAR</span><span>Ativado</span></div>
            <div class="nvidia-stat"><span>G-SYNC</span><span>Compatível</span></div>
            <div class="nvidia-stat"><span>DLSS</span><span>3.5 com Frame Generation</span></div>
            <div class="nvidia-stat"><span>Ray Tracing</span><span>Ativado</span></div>
          </div>
        </div>

        <!-- RESGATAR -->
        <div class="nvidia-section" id="nvidia-redeem">
          <h2 style="font-size:1.1rem;margin:0 0 4px;"><i class="fas fa-gift" style="color:#66c0f4;"></i> Resgatar</h2>
          <p style="color:#8fa0bf;font-size:.85rem;margin:0 0 16px;">Resgate códigos promocionais e ganhe jogos.</p>
          <div class="nvidia-card">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <input id="nvidia-redeem-input" placeholder="Código promocional" style="flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 14px;color:#eef2ff;outline:none;font-size:.85rem;min-width:200px;">
              <button onclick="nvidiaRedeem()" style="background:#66c0f4;border:none;color:#090b10;padding:8px 18px;border-radius:8px;font-weight:600;cursor:pointer;"><i class="fas fa-check"></i> Resgatar</button>
            </div>
            <div id="nvidia-redeem-status" style="margin-top:8px;font-size:.85rem;color:#8fa0bf;"></div>
          </div>
          <div class="nvidia-card">
            <div style="font-weight:600;margin-bottom:8px;">Histórico de resgates</div>
            <div id="nvidia-redeemed-list">
              ${state.redeemed.length ? state.redeemed.map(r => `
                <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:.8rem;">
                  <span>🎮 ${r.game}</span>
                  <span style="color:#5b6680;">${r.code} · ${r.date}</span>
                </div>
              `).join('') : '<div style="color:#5b6680;font-size:.8rem;">Nenhum código resgatado ainda.</div>'}
            </div>
          </div>
        </div>

        <!-- CONFIGURAÇÕES -->
        <div class="nvidia-section" id="nvidia-settings">
          <h2 style="font-size:1.1rem;margin:0 0 4px;"><i class="fas fa-cog" style="color:#66c0f4;"></i> Configurações</h2>
          <p style="color:#8fa0bf;font-size:.85rem;margin:0 0 16px;">Personalize sua experiência NVIDIA.</p>
          <div class="nvidia-card">
            ${Object.entries(state.settings).map(([key, val]) => `
              <div class="nvidia-stat" id="nvidia-toggle-${key}">
                <span>${key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                <label class="nvidia-toggle">
                  <span class="toggle-label" style="font-size:.8rem;color:#8fa0bf;">${val ? 'Ativado' : 'Desativado'}</span>
                  <input type="checkbox" ${val ? 'checked' : ''} onchange="nvidiaToggle('${key}')">
                </label>
              </div>
            `).join('')}
          </div>
          <div class="nvidia-card" style="border-color:rgba(239,68,68,.2);">
            <div style="font-weight:600;color:#f87171;margin-bottom:8px;">Área restrita</div>
            <button onclick="if(confirm('Restaurar configurações padrão?')){location.reload();}" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171;padding:6px 16px;border-radius:6px;cursor:pointer;"><i class="fas fa-undo-alt"></i> Restaurar padrões</button>
          </div>
        </div>

      </div>
    </div>
  `, 900, 680);

    // ---------- EXPORTA FUNÇÕES GLOBAIS ----------
    window.nvidiaNavigate = function (section) {
      navigateTo(section);
    };

    window.nvidiaCheckDrivers = function () {
      checkDrivers();
    };

    window.nvidiaInstallDriver = function () {
      installDriver();
    };

    window.nvidiaApplyOC = function () {
      applyOverclock();
    };

    window.nvidiaRedeem = function () {
      redeemCode();
    };

    window.nvidiaToggle = function (key) {
      toggleSetting(key);
    };

    window.nvidiaSimulate = function () {
      const interval = setInterval(() => {
        state.gpu.usage = 20 + Math.random() * 70;
        state.gpu.temp = 45 + Math.random() * 25;
        state.gpu.fanSpeed = 35 + Math.random() * 40;
        state.gpu.power = 60 + Math.random() * 50;
        state.gpu.clock = 2640 + Math.random() * 80;
        updateMetrics();
        // Atualiza também os elementos na aba Performance
        const tempPerf = document.getElementById('gpu-temp-perf');
        const clockPerf = document.getElementById('gpu-clock-perf');
        const memPerf = document.getElementById('gpu-mem-perf');
        const powerPerf = document.getElementById('gpu-power-perf');
        const usageLabel = document.getElementById('gpu-usage-label');
        const memLabel = document.getElementById('gpu-memory-label');
        const usageBar = document.getElementById('gpu-usage-bar');
        const memBar = document.getElementById('gpu-memory-bar');
        if (tempPerf) tempPerf.textContent = state.gpu.temp.toFixed(1) + '°C';
        if (clockPerf) clockPerf.textContent = state.gpu.clock.toFixed(0) + ' MHz';
        if (memPerf) memPerf.textContent = state.gpu.memoryClock.toFixed(0) + ' MHz';
        if (powerPerf) powerPerf.textContent = state.gpu.power.toFixed(0) + ' W';
        if (usageLabel) usageLabel.textContent = state.gpu.usage.toFixed(1) + '%';
        if (memLabel) memLabel.textContent = state.gpu.memoryUsage.toFixed(1) + '%';
        if (usageBar) usageBar.style.width = state.gpu.usage + '%';
        if (memBar) memBar.style.width = state.gpu.memoryUsage + '%';
      }, 500);
      setTimeout(() => clearInterval(interval), 8000);
      addNotification('Simulação de carga iniciada 🔥', 'info');
      toast('Simulação de GPU iniciada!', 'default');
    };

    // ---------- INICIALIZA ----------
    setTimeout(() => {
      updateNotifications();
      updateMetrics();
      addNotification('NVIDIA App carregado com sucesso 💚', 'success');
    }, 300);

    // ---------- LIMPEZA ----------
    win.addEventListener('remove', () => {
      delete window.nvidiaNavigate;
      delete window.nvidiaCheckDrivers;
      delete window.nvidiaInstallDriver;
      delete window.nvidiaApplyOC;
      delete window.nvidiaRedeem;
      delete window.nvidiaToggle;
      delete window.nvidiaSimulate;
    });

    return win;
  }

  // ============================================================
  //  STEAM (ex Game Hub)
  // ============================================================
  // Biblioteca persistente em localStorage. Usa GAMES como lista base.
  const STEAM_KEY = 'vessieos_steam_lib_v2';
  const STEAM_SRC_KEY = 'vessieos_steam_sources_v1';
  function buildBaseSteamLibrary() {
    const templates = (S.gameTemplates || []).filter(t => t.enabled !== false).map(t => ({ id: 'g_' + Math.random().toString(36).slice(2, 9), name: t.name, url: t.url, icon: t.icon || '', cover: t.icon || '', added: Date.now(), plays: 0 }));
    const base = GAMES.map(g => ({ id: 'g_' + Math.random().toString(36).slice(2, 9), name: g.n, url: g.u, icon: g.ic, cover: g.ic, added: Date.now(), plays: 0 }));
    return dedupeGames([...base, ...templates]);
  }
  /**
   * Biblioteca v2 (JS/systems/game-library.js): seleção, limpeza de jogos
   * quebrados, import/export e — principalmente — a política de segurança
   * aplicada em toda entrada e saída. Jogos apontando para IP cru
   * (200.168.0.10, 10.0.0.5, 0x7f000001) nunca chegam à tela.
   * Se o módulo não carregar, o Game Hub cai no caminho antigo.
   */
  let _steamLibrary = null;
  function steamLibrary() {
    if (_steamLibrary) return _steamLibrary;
    if (!window.VessieGameLibrary || !window.VessieURLGuard) return null;
    _steamLibrary = new window.VessieGameLibrary.GameLibrary({
      guard: window.VessieURLGuard,
      doctor: window.VessieIframeDoctor,
      key: STEAM_KEY
    });
    const seed = buildBaseSteamLibrary();
    _steamLibrary.load(seed);
    _steamLibrary.addMany(seed); // jogos novos da lista base entram sem duplicar
    window.VessieOS = window.VessieOS || {};
    window.VessieOS.gameLibrary = _steamLibrary; // consumida pelo VessieScript (módulo `games`)
    return _steamLibrary;
  }
  // Acesso único à biblioteca para o resto do sistema (scripting, módulos).
  window.vessieGameLibrary = steamLibrary;

  function steamLoad() {
    const library = steamLibrary();
    if (library) return library.all();
    try {
      const stored = JSON.parse(localStorage.getItem(STEAM_KEY));
      if (Array.isArray(stored)) {
        const base = buildBaseSteamLibrary();
        const merged = base.map(item => {
          const existing = stored.find(saved => saved.name === item.name && saved.url === item.url);
          return existing ? { ...item, ...existing } : item;
        });
        const custom = stored.filter(saved => !base.some(item => item.name === saved.name && item.url === saved.url));
        const result = [...merged, ...custom];
        localStorage.setItem(STEAM_KEY, JSON.stringify(result));
        return result;
      }
    } catch (e) { }
    const seed = buildBaseSteamLibrary();
    localStorage.setItem(STEAM_KEY, JSON.stringify(seed));
    return seed;
  }
  function steamSave(lib) {
    const library = steamLibrary();
    if (library) { library.games = lib; library.save(); return; }
    localStorage.setItem(STEAM_KEY, JSON.stringify(lib));
  }

  /** Veredito de segurança de uma URL, com fallback quando o guard não carregou. */
  function steamGuard(url) {
    if (window.VessieURLGuard) return window.VessieURLGuard.inspect(url);
    return { ok: /^https?:\/\//i.test(url || ''), url, message: 'Endereço inválido.' };
  }
  function steamSources() {
    try { const d = JSON.parse(localStorage.getItem(STEAM_SRC_KEY)); if (Array.isArray(d)) return d; } catch (e) { }
    return ['https://snowriderio.io', 'https://azgames.io', 'https://classicgamezone.com'];
  }
  function steamSaveSrc(s) { localStorage.setItem(STEAM_SRC_KEY, JSON.stringify(s)); }

  // Proxy CORS para scraping
  const STEAM_PROXIES = ['https://api.allorigins.win/raw?url=', 'https://corsproxy.io/?', 'https://api.codetabs.com/v1/proxy/?quest='];
  async function steamFetch(url) {
    for (const p of STEAM_PROXIES) {
      try {
        const r = await fetch(p + encodeURIComponent(url), { signal: AbortSignal.timeout(12000) });
        if (r.ok) { const t = await r.text(); if (t && t.length > 100) return t; }
      } catch (e) { }
    }
    throw new Error('Falha em todos os proxies');
  }

  // Extrai metadados do HTML: título + melhor imagem (prioriza webp h220x220)
  function steamParse(html, baseUrl) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    let name = (doc.querySelector('meta[property="og:title"]')?.content
      || doc.querySelector('title')?.textContent
      || 'Jogo').trim().replace(/\s*[\|\-–·]\s*.*$/, '').slice(0, 80);
    // Procura imagem: 1) padrão snowriderio cache 2) og:image 3) primeira webp/png grande
    let img = null;
    const allImgs = [...doc.querySelectorAll('img')].map(i => i.getAttribute('src') || i.getAttribute('data-src')).filter(Boolean);
    img = allImgs.find(s => /h220x220\.webp|cache\/data\/image\/game\//i.test(s))
      || doc.querySelector('meta[property="og:image"]')?.content
      || doc.querySelector('meta[name="twitter:image"]')?.content
      || allImgs.find(s => /\.(webp|jpg|jpeg|png)$/i.test(s));
    if (img && !/^https?:/.test(img)) { try { img = new URL(img, baseUrl).href } catch (e) { } }
    return { name, icon: img || '', cover: img || '' };
  }

  // Descobre links de jogos a partir de um site raiz
  function steamDiscover(html, baseUrl) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const host = new URL(baseUrl).host;
    const links = new Set();
    doc.querySelectorAll('a[href]').forEach(a => {
      try {
        const h = a.getAttribute('href'); if (!h || h.startsWith('#') || h.startsWith('javascript')) return;
        const u = new URL(h, baseUrl);
        if (u.host !== host) return;
        const p = u.pathname;
        // heurística: caminhos de jogo (não index, não categoria)
        if (p === '/' || p.length < 4) return;
        if (/^\/(privacy|terms|about|contact|category|tag|page|games?\/?$)/i.test(p)) return;
        if (/\/$/.test(p) && p.split('/').filter(Boolean).length < 2) return;
        links.add(u.href.split('#')[0].split('?')[0]);
      } catch (e) { }
    });
    return [...links].slice(0, 40);
  }

  function steamLog(msg, cls = '') { const el = document.getElementById('st-log'); if (!el) return; el.classList.add('show'); el.innerHTML += `<div class="${cls}">${msg}</div>`; el.scrollTop = el.scrollHeight; }

  window.steamAddGame = async function (url) {
    url = (url || '').trim(); if (!url) return;
    const verdict = steamGuard(url);
    if (!verdict.ok) {
      steamLog('⛔ Bloqueado: ' + verdict.message, 'er');
      toast('⛔ ' + verdict.message, 'error');
      return;
    }
    url = verdict.url;
    steamLog('→ Analisando ' + url, 'in');
    try {
      const html = await steamFetch(url);
      const meta = steamParse(html, url);
      const library = steamLibrary();
      if (library) {
        const result = library.add({ name: meta.name, url, icon: meta.icon, cover: meta.cover });
        if (!result.ok) { steamLog('⚠ ' + result.message, 'er'); return; }
      } else {
        const lib = steamLoad();
        if (lib.some(g => g.url === url)) { steamLog('⚠ Já está na biblioteca', 'er'); return; }
        lib.push({ id: 'g_' + Math.random().toString(36).slice(2, 9), name: meta.name, url, icon: meta.icon, cover: meta.cover, added: Date.now(), plays: 0 });
        steamSave(dedupeGames(lib));
      }
      steamLog('✓ Adicionado: ' + meta.name, 'ok');
      if (document.getElementById('st-grid')) steamRender('library');
      toast('🎮 ' + meta.name + ' adicionado à biblioteca', 'success');
    } catch (e) { steamLog('✗ Erro: ' + e.message, 'er'); }
  };

  /**
   * Coletor v2: aprende os padrões de URL da própria biblioteca
   * (/go/class-:num.html, /games/:slug/ ...) e só aceita links que se
   * pareçam com jogos e passem na política de segurança.
   */
  async function steamCrawlWithCollector(url) {
    if (!window.VessieCollector || !window.VessieGamePatterns) return false;
    const library = steamLibrary();
    if (!library) return false;
    const collector = new window.VessieCollector.VessieCollector({
      guard: window.VessieURLGuard,
      patterns: window.VessieGamePatterns,
      log: (msg, cls) => steamLog(msg, cls || 'in')
    });
    collector.train(library.all());
    const result = await collector.collectSite(url, { limit: 15 });
    const { added, rejected } = library.addMany(result.games);
    result.blocked.forEach(b => steamLog('  ⛔ ' + b.url + ' — ' + b.reason, 'er'));
    steamLog(`✓ Concluído: ${added.length} novos, ${rejected.length} ignorados, ${result.blocked.length} bloqueados por segurança`, 'ok');
    if (document.getElementById('st-grid')) steamRender('library');
    toast('🎮 ' + added.length + ' jogos coletados', 'success');
    return true;
  }

  window.steamCrawlSite = async function (url) {
    url = (url || '').trim(); if (!url) return;
    const verdict = steamGuard(url);
    if (!verdict.ok) {
      steamLog('⛔ Site bloqueado: ' + verdict.message, 'er');
      toast('⛔ ' + verdict.message, 'error');
      return;
    }
    url = verdict.url;
    steamLog('🔎 Explorando ' + url, 'in');
    const srcsKnown = steamSources();
    if (!srcsKnown.includes(url)) { srcsKnown.push(url); steamSaveSrc(srcsKnown); }
    try {
      if (await steamCrawlWithCollector(url)) return;
    } catch (e) {
      steamLog('✗ Coletor v2 falhou (' + e.message + '), usando o modo simples', 'er');
    }
    try {
      const html = await steamFetch(url);
      const links = steamDiscover(html, url);
      steamLog('Encontrados ' + links.length + ' links candidatos', 'in');
      // Adiciona fonte
      const srcs = steamSources(); if (!srcs.includes(url)) { srcs.push(url); steamSaveSrc(srcs); }
      let added = 0;
      for (const l of links.slice(0, 15)) {
        const lib = steamLoad();
        if (lib.some(g => g.url === l)) { continue; }
        try {
          const h = await steamFetch(l);
          const m = steamParse(h, l);
          if (!m.icon) { steamLog('  ⊘ sem imagem: ' + l, 'er'); continue; }
          lib.push({ id: 'g_' + Math.random().toString(36).slice(2, 9), name: m.name, url: l, icon: m.icon, cover: m.icon, added: Date.now(), plays: 0 });
          steamSave(dedupeGames(lib)); added++;
          steamLog('  ✓ ' + m.name, 'ok');
        } catch (e) { steamLog('  ✗ ' + l + ' — ' + e.message, 'er'); }
      }
      steamLog('✓ Concluído: ' + added + ' jogos novos', 'ok');
      if (document.getElementById('st-grid')) steamRender('library');
      toast('🎮 ' + added + ' jogos coletados', 'success');
    } catch (e) { steamLog('✗ Erro: ' + e.message, 'er'); }
  };

  window.steamRemove = function (id, e) {
    e && e.stopPropagation();
    const lib = steamLoad().filter(g => g.id !== id); steamSave(lib); steamRender('library');
  };

  window.steamPlay = function (id) {
    const lib = steamLoad(); const g = lib.find(x => x.id === id); if (!g) return;
    const verdict = steamGuard(g.url);
    if (!verdict.ok) {
      toast('⛔ ' + verdict.message, 'error');
      return;
    }
    g.plays = (g.plays || 0) + 1; g.lastPlay = Date.now(); steamSave(lib);
    // VessieCoin: recompensa por sessão de jogo (com cooldown por jogo, ver vessiecoin/index.js)
    window.VessieCoin?.earn(5, `Jogou ${g.name}`, { sourceId: `game:${g.id}` });
    const gameEngine = ServiceLocator.resolve('GameEngine');
    if (gameEngine && typeof gameEngine.launch === 'function') {
      gameEngine.launch(verdict.url, g.name);
    } else {
      // Bezel 3D: uma moldura com fundo Three.js (partículas + núcleo reativo)
      // por trás do iframe do jogo, dando uma sensação de "capsule/rig" ao redor
      // de qualquer jogo aberto pelo Game Hub — sem interferir na jogabilidade,
      // já que o canvas fica atrás e o iframe cobre a área de jogo em si.
      const winContent = `
        <div class="gh-play-bezel">
          <canvas class="gh-play-3d" aria-hidden="true"></canvas>
          <iframe src="${verdict.url}" sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups-to-escape-sandbox allow-forms" referrerpolicy="no-referrer" style="border:none;width:100%;height:100%;position:relative;z-index:1" allow="fullscreen;autoplay" title="${g.name}"></iframe>
        </div>`;
      const win = createWin(g.name, '<i class="fab fa-steam" style="color:#66c0f4"></i>', winContent, 920, 640);
      requestAnimationFrame(() => {
        const canvas = win?.querySelector?.('.gh-play-3d') || document.querySelector('.gh-play-3d');
        if (canvas) window.mountGameHubThree(canvas, { accentColor: '#66c0f4' });
      });
    }
  };

  window.steamFilter = function (q) {
    q = q.toLowerCase();
    document.querySelectorAll('#st-grid .st-card').forEach(c => {
      c.style.display = c.dataset.name.toLowerCase().includes(q) ? '' : 'none';
    });
  };

  window.addGameTemplate = function (name, url, icon) {
    const n = (name || '').trim();
    const u = (url || '').trim();
    if (!n || !u) return toast('Preencha nome e URL do template', 'error');
    S.gameTemplates = S.gameTemplates || [];
    S.gameTemplates.push({ name: n, url: u, icon: icon || '', enabled: true });
    persistState();
    steamRender('store');
    toast('Template adicionado ✨', 'success');
  };
  window.removeGameTemplate = function (index) {
    S.gameTemplates = S.gameTemplates || [];
    S.gameTemplates.splice(index, 1);
    persistState();
    steamRender('store');
  };
  window.steamRender = function (view) {
    const main = document.getElementById('st-main'); if (!main) return;
    document.querySelectorAll('.st-nv').forEach(n => n.classList.toggle('ac', n.dataset.view === view));
    const lib = steamLoad();
    if (view === 'library') {
      const items = lib.slice().sort((a, b) => (b.lastPlay || b.added) - (a.lastPlay || a.added));
      main.innerHTML = `
      <div class="st-hdr"><h2>BIBLIOTECA · ${items.length} jogos</h2>
        <input class="st-srch" placeholder="Buscar na biblioteca..." oninput="steamFilter(this.value)"></div>
      <div class="st-content">
        <canvas id="st-3d-bg" class="st-3d-bg" aria-hidden="true"></canvas>
        ${items.length ? `<div class="st-grid" id="st-grid">${items.map(g => `
          <div class="st-card" data-name="${(g.name || '').replace(/"/g, '&quot;')}" onclick="steamPlay('${g.id}')" onmouseenter="pulseGameHubThree()">
            <button class="del" onclick="steamRemove('${g.id}',event)" title="Remover"><i class="fas fa-times"></i></button>
            ${g.cover ? `<img class="cv" src="${g.cover}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="">` : ''}
            <div class="fb" style="${g.cover ? 'display:none' : ''}">${(g.name || '?')[0].toUpperCase()}</div>
            <div class="meta"><div class="ttl">${g.name}</div><div class="sub"><span>${g.plays || 0} sessões</span><span><i class="fab fa-steam"></i></span></div></div>
          </div>`).join('')}</div>` : `
          <div class="st-empty"><i class="fas fa-gamepad"></i><div>Sua biblioteca está vazia</div>
          <div style="margin-top:8px;font-size:.82rem">Vá em <b>LOJA</b> e colete jogos automaticamente</div></div>`}
      </div>`;
      // Fundo 3D em Three.js (partículas + núcleo reativo) atrás do grid da biblioteca.
      // Se o WebGL/Three.js não estiver disponível, mountGameHubThree simplesmente
      // não faz nada — o grid continua funcionando normalmente sem o fundo.
      const bgCanvas = document.getElementById('st-3d-bg');
      if (bgCanvas) window.mountGameHubThree(bgCanvas, { accentColor: '#a78bfa' });
    } else if (view === 'store') {
      const srcs = steamSources();
      main.innerHTML = `
      <div class="st-hdr"><h2>LOJA · Coletor Automático</h2></div>
      <div class="st-content">
        <div class="st-hero">
          <h1><i class="fas fa-magnifying-glass-chart"></i> Coletar jogos de um site</h1>
          <p>Cole a URL de um <b>jogo individual</b> ou de um <b>site inteiro</b>. O sistema baixa o HTML, extrai o título via &lt;title&gt;, encontra a imagem e adiciona à sua biblioteca automaticamente.</p>
          <div class="st-form">
            <input id="st-url" placeholder="https://snowriderio.io/escape-raid" onkeypress="if(event.key==='Enter')steamAddGame(document.getElementById('st-url').value)">
            <button class="st-btn" onclick="steamAddGame(document.getElementById('st-url').value)"><i class="fas fa-plus"></i> Adicionar jogo</button>
            <button class="st-btn sec" onclick="steamCrawlSite(document.getElementById('st-url').value)"><i class="fas fa-spider"></i> Explorar site inteiro</button>
          </div>
          <div class="st-form" style="margin-top:10px">
            <input id="st-template-name" placeholder="Nome do template">
            <input id="st-template-url" placeholder="URL do jogo">
            <input id="st-template-icon" placeholder="Ícone/opcional">
            <button class="st-btn" onclick="window.addGameTemplate(document.getElementById('st-template-name').value,document.getElementById('st-template-url').value,document.getElementById('st-template-icon').value)"><i class="fas fa-layer-group"></i> Salvar template</button>
          </div>
          <div class="st-log" id="st-log"></div>
        </div>
        <div class="st-sec-h"><h3>Templates salvos</h3><span>${(S.gameTemplates || []).length} itens</span></div>
        ${(S.gameTemplates || []).length ? `<div class="st-grid">${(S.gameTemplates || []).map((t, i) => `<div class="st-card"><div class="meta"><div class="ttl">${t.name}</div><div class="sub"><span>${t.url}</span></div></div><button class="del" onclick="window.removeGameTemplate(${i})"><i class="fas fa-times"></i></button></div>`).join('')}</div>` : '<div class="st-hero"><p>Nenhum template salvo. Use o formulário acima para automatizar a coleta.</p></div>'}
        <div class="st-sec-h"><h3>Fontes salvas</h3><span>${srcs.length} sites</span></div>
        ${srcs.map(s => `<div class="st-src"><i class="fas fa-globe" style="color:#66c0f4"></i><div class="url">${s}</div><span class="cnt">${lib.filter(g => { try { return new URL(g.url).host === new URL(s).host } catch (e) { return false } }).length} jogos</span><button onclick="steamRmSrc('${s.replace(/'/g, "\\'")}')">Remover</button><button class="st-btn" style="padding:4px 9px" onclick="steamCrawlSite('${s.replace(/'/g, "\\'")}')">Recoletar</button></div>`).join('')}
        <div class="st-sec-h"><h3>Sites recomendados</h3></div>
        ${['https://snowriderio.io', 'https://azgames.io', 'https://classicgamezone.com', 'https://1v1-lol.gitlab.io'].map(s => `<div class="st-src"><i class="fas fa-star" style="color:#f1c40f"></i><div class="url">${s}</div><button class="st-btn" style="padding:4px 9px" onclick="steamCrawlSite('${s}')">Coletar</button></div>`).join('')}
      </div>`;
    } else if (view === 'manage') {
      const library = steamLibrary();
      if (!library) {
        main.innerHTML = '<div class="st-hdr"><h2>GERENCIAR</h2></div><div class="st-content"><div class="st-hero"><p>Módulos de gerenciamento não carregados.</p></div></div>';
        return;
      }
      const items = steamManageList();
      const stats = library.stats();
      const badge = (g) => {
        if (!g.health) return '<span class="st-hl unchecked">não testado</span>';
        const map = { ok: 'ok', unverified: 'warn', blocked: 'bad', error: 'bad', timeout: 'bad' };
        return `<span class="st-hl ${map[g.health.status] || 'warn'}" title="${(g.health.detail || '').replace(/"/g, '')}">${g.health.label}</span>`;
      };
      main.innerHTML = `
      <div class="st-hdr"><h2>GERENCIAR · ${stats.selected}/${items.length} selecionados</h2>
        <input class="st-srch" placeholder="Filtrar..." value="${steamManageQuery.replace(/"/g, '&quot;')}" oninput="steamManageFilter(this.value)"></div>
      <div class="st-content">
        <div class="st-bulk">
          <button class="st-btn sec" onclick="steamSelectAll()"><i class="fas fa-check-double"></i> Selecionar todos</button>
          <button class="st-btn sec" onclick="steamInvertSel()"><i class="fas fa-right-left"></i> Inverter</button>
          <button class="st-btn sec" onclick="steamClearSel()"><i class="fas fa-ban"></i> Limpar seleção</button>
          <button class="st-btn danger" onclick="steamDeleteSel()"><i class="fas fa-trash"></i> Excluir selecionados</button>
          <button class="st-btn" onclick="steamDiagnose()"><i class="fas fa-stethoscope"></i> Testar iframes</button>
          <button class="st-btn danger" onclick="steamDeleteBroken()"><i class="fas fa-broom"></i> Remover quebrados</button>
          <button class="st-btn danger" onclick="steamSecuritySweep()"><i class="fas fa-shield-halved"></i> Varredura de segurança</button>
          <button class="st-btn sec" onclick="steamExport()"><i class="fas fa-file-export"></i> Exportar</button>
          <label class="st-btn sec" style="cursor:pointer"><i class="fas fa-file-import"></i> Importar
            <input type="file" accept="application/json" style="display:none" onchange="steamImportFile(this)"></label>
        </div>
        <div class="st-hero" style="margin:12px 0">
          <p><b>${stats.total}</b> jogos · <b>${stats.hosts}</b> sites · saúde: ${stats.health.ok} ok, ${stats.health.error + stats.health.timeout + stats.health.blocked} com problema, ${stats.health.unverified} não verificáveis, ${stats.health.unchecked} não testados.</p>
          <p style="font-size:.8rem;opacity:.8">Endereços em IP cru (ex.: <code>200.168.0.10</code>), hosts locais, portas incomuns e arquivos executáveis são recusados na entrada e na varredura. O navegador não revela o motivo exato de uma recusa de iframe entre origens — por isso “não verificável” nunca é apagado automaticamente.</p>
        </div>
        <div class="st-mg-list">
          ${items.map(g => `
            <div class="st-mg ${library.isSelected(g.id) ? 'sel' : ''}" onclick="steamToggleSel('${g.id}',event)">
              <input type="checkbox" ${library.isSelected(g.id) ? 'checked' : ''} onclick="steamToggleSel('${g.id}',event)">
              ${g.icon ? `<img src="${g.icon}" onerror="this.style.display='none'" alt="">` : ''}
              <div class="st-mg-meta"><b>${g.name}</b><span>${g.url}</span></div>
              ${badge(g)}
              <button class="del" title="Remover" onclick="steamRemove('${g.id}',event)"><i class="fas fa-times"></i></button>
            </div>`).join('') || '<div class="st-empty"><i class="fas fa-gamepad"></i><div>Nada para gerenciar</div></div>'}
        </div>
      </div>`;
    } else if (view === 'community') {
      main.innerHTML = `
      <div class="st-hdr"><h2>COMUNIDADE</h2></div>
      <div class="st-content">
        <div class="st-grid">
          ${['Discussões', 'Capturas', 'Guias', 'Vídeos', 'Workshop', 'Mercado'].map(t => `
            <div class="st-card" onclick="toast('🚧 ${t} em breve')"><div class="fb"><i class="fas fa-users"></i></div><div class="meta"><div class="ttl">${t}</div><div class="sub"><span>VessieOS</span></div></div></div>`).join('')}
        </div>
        <div class="st-hero" style="margin-top:18px"><h1>Atividade dos amigos</h1><p>💜 <b>${S.user || 'Você'}</b> jogou ${lib.reduce((s, g) => s + (g.plays || 0), 0)} sessões no total. <b>Vessie</b> está jogando agora. <b>Sistema</b> recomenda explorar a Loja!</p></div>
      </div>`;
    } else if (view === 'downloads') {
      main.innerHTML = `
      <div class="st-hdr"><h2>DOWNLOADS</h2></div>
      <div class="st-content">
        <div class="st-hero"><h1>Nenhum download em andamento</h1><p>Jogos no VessieOS Steam são <b>baseados em web</b> — não precisam de download. Tudo roda instantaneamente via iframe seguro.</p></div>
        <div class="st-sec-h"><h3>Histórico de coleta</h3><span>${lib.length} itens na biblioteca</span></div>
        ${lib.slice().sort((a, b) => b.added - a.added).slice(0, 10).map(g => `<div class="st-src"><img src="${g.icon}" style="width:28px;height:28px;border-radius:3px;object-fit:cover" onerror="this.style.display='none'"><div class="url">${g.name}</div><span class="cnt">${new Date(g.added).toLocaleDateString('pt-BR')}</span></div>`).join('')}
      </div>`;
    } else if (view === 'friends') {
      main.innerHTML = `
      <div class="st-hdr"><h2>AMIGOS</h2></div>
      <div class="st-content">
        ${[{ n: 'Vessie', s: 'Online', c: '#5cb85c', g: 'Jogando Vessie IA 💜' }, { n: 'Sistema', s: 'Ocupado', c: '#f1c40f', g: 'Em manutenção' }, { n: 'Guest', s: 'Offline', c: '#67708a', g: '' }].map(f => `
          <div class="st-src"><div style="width:38px;height:38px;border-radius:4px;background:linear-gradient(135deg,${f.c},#1b2838);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">${f.n[0]}</div><div class="url"><b style="color:${f.c}">${f.n}</b><div style="font-size:.74rem;color:#67708a">${f.s} · ${f.g}</div></div></div>`).join('')}
      </div>`;
    }
  };

  window.steamRmSrc = function (s) { const x = steamSources().filter(u => u !== s); steamSaveSrc(x); steamRender('store'); };

  // ---------- GERENCIAR: seleção, limpeza e import/export ----------
  window.steamToggleSel = function (id, e) {
    e && e.stopPropagation();
    const library = steamLibrary(); if (!library) return;
    library.toggle(id);
    steamRender('manage');
  };
  window.steamSelectAll = function () {
    const library = steamLibrary(); if (!library) return;
    library.selectAll(steamManageList());
    steamRender('manage');
  };
  window.steamInvertSel = function () {
    const library = steamLibrary(); if (!library) return;
    library.invertSelection(steamManageList());
    steamRender('manage');
  };
  window.steamClearSel = function () {
    const library = steamLibrary(); if (!library) return;
    library.clearSelection();
    steamRender('manage');
  };
  window.steamDeleteSel = function () {
    const library = steamLibrary(); if (!library) return;
    const count = library.selectedCount();
    if (!count) return toast('Nenhum jogo selecionado', 'error');
    const removed = library.deleteSelected();
    steamRender('manage');
    toast('🗑 ' + removed.length + ' jogos removidos', 'success');
  };
  window.steamSecuritySweep = function () {
    const library = steamLibrary(); if (!library) return;
    const removed = library.securitySweep();
    steamRender('manage');
    toast(removed.length ? '🛡 ' + removed.length + ' jogos inseguros removidos' : '🛡 Nenhum jogo inseguro encontrado', removed.length ? 'success' : 'default');
  };
  window.steamDiagnose = async function () {
    const library = steamLibrary(); if (!library || !window.VessieIframeDoctor) return;
    const targets = library.selectedCount() ? library.selectedGames() : library.all();
    steamLog('🩺 Diagnosticando ' + targets.length + ' jogos...', 'in');
    toast('🩺 Testando ' + targets.length + ' jogos em iframe...', 'default');
    const results = await window.VessieIframeDoctor.diagnose(targets, { timeout: 9000, concurrency: 3 });
    library.applyHealth(results);
    const summary = window.VessieIframeDoctor.summarize(results);
    steamRender('manage');
    toast(`🩺 ${summary.ok} ok · ${summary.error + summary.timeout + summary.blocked} com problema · ${summary.unverified} não verificáveis`, 'success');
  };
  window.steamDeleteBroken = function () {
    const library = steamLibrary(); if (!library) return;
    const removed = library.deleteBroken();
    steamRender('manage');
    toast(removed.length ? '🧹 ' + removed.length + ' jogos quebrados removidos' : 'Nenhum jogo quebrado confirmado — rode o diagnóstico antes', removed.length ? 'success' : 'default');
  };
  window.steamExport = function () {
    const library = steamLibrary(); if (!library) return;
    const json = library.exportJSON(library.selectedCount() > 0);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vessieos-biblioteca.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('📤 Biblioteca exportada', 'success');
  };
  window.steamImport = function (text) {
    const library = steamLibrary(); if (!library) return;
    const result = library.importJSON(text);
    if (result.error) return toast('⚠ ' + result.error, 'error');
    steamRender('manage');
    toast(`📥 ${result.added.length} adicionados · ${result.rejected.length} recusados pela segurança`, 'success');
  };
  window.steamImportFile = function (input) {
    const file = input && input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => window.steamImport(String(reader.result || ''));
    reader.readAsText(file);
  };

  let steamManageQuery = '';
  function steamManageList() {
    const library = steamLibrary();
    return library ? library.filter(steamManageQuery) : [];
  }
  window.steamManageFilter = function (q) {
    steamManageQuery = q || '';
    steamRender('manage');
  };

  function openGames() {
    const lib = steamLoad();
    const win = createWin('Steam', '<i class="fab fa-steam" style="color:#66c0f4"></i>', `
    <div class="steam">
      <div class="st-sb">
        <div class="st-logo"><i class="fab fa-steam"></i><b>STEAM</b></div>
        <div class="st-nav">
          <div class="st-nv ac" data-view="library" onclick="steamRender('library')"><i class="fas fa-gamepad"></i> Biblioteca</div>
          <div class="st-nv" data-view="store" onclick="steamRender('store')"><i class="fas fa-store"></i> Loja</div>
          <div class="st-nv" data-view="manage" onclick="steamRender('manage')"><i class="fas fa-list-check"></i> Gerenciar</div>
          <div class="st-nv" data-view="community" onclick="steamRender('community')"><i class="fas fa-users"></i> Comunidade</div>
          <div class="st-nv" data-view="downloads" onclick="steamRender('downloads')"><i class="fas fa-download"></i> Downloads</div>
          <div class="st-nv" data-view="friends" onclick="steamRender('friends')"><i class="fas fa-user-friends"></i> Amigos</div>
        </div>
        <div class="st-user"><div class="av">${(S.user || 'V')[0].toUpperCase()}</div><div><div style="color:#fff">${S.user || 'Visitante'}</div><div style="font-size:.7rem;color:#5cb85c">● Online</div></div></div>
      </div>
      <div class="st-main" id="st-main"></div>
    </div>
  `, 900, 620);
    setTimeout(() => steamRender('library'), 50);
    return win;
  }

  window.launchGame = function (url, name) {
    const gameEngine = ServiceLocator.resolve('GameEngine');
    if (gameEngine && typeof gameEngine.launch === 'function') {
      return gameEngine.launch(url, name);
    }
    return createWin(name, '<i class="fab fa-steam"></i>', `<iframe src="${url}" style="border:none;width:100%;height:100%;border-radius:0" allow="fullscreen;autoplay" title="${name}"></iframe>`, 880, 620);
  };
  window.filterGames = function (q) { document.querySelectorAll('#games-grid .gm').forEach(g => { g.style.display = g.querySelector('span').textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none'; }); };

  // ============================================================
  //  BROWSER
  // ============================================================
  function openBrowser() {
    const win = createWin('Chrome', '🌐', `
    <div class="brow">
      <div class="brow-bar">
        <button class="bnav" onclick="this.closest('.win').querySelector('.brow-frame').contentWindow.history.back()"><i class="fas fa-arrow-left"></i></button>
        <button class="bnav" onclick="this.closest('.win').querySelector('.brow-frame').contentWindow.history.forward()"><i class="fas fa-arrow-right"></i></button>
        <button class="bnav" onclick="this.closest('.win').querySelector('.brow-frame').src=this.closest('.win').querySelector('.brow-frame').src"><i class="fas fa-redo"></i></button>
        <input class="url-input" id="brow-url" value="https://www.google.com/webhp?igu=1" onkeypress="if(event.key==='Enter')navTo(this)">
        <button class="bnav" onclick="navTo(this.closest('.brow-bar').querySelector('.url-input'))"><i class="fas fa-arrow-right" style="color:var(--a)"></i></button>
      </div>
      <iframe class="brow-frame" src="https://www.google.com/webhp?igu=1" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" title="Browser"></iframe>
    </div>
  `, 860, 600);
    const browserFrame = win.querySelector('.brow-frame');
    VessieIframeRuntime.attach(browserFrame, { sandbox: 'allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation', allow: 'fullscreen;autoplay;clipboard-read;clipboard-write' });
    browserFrame.addEventListener('load', () => {
      const url = win.querySelector('.brow-frame').src;
      const input = win.querySelector('#brow-url');
      if (input) input.value = url;
    });
    return win;
  }

  window.navTo = function (inp) { let url = inp.value.trim(); if (!url.startsWith('http')) url = 'https://' + url; const frame = inp.closest('.brow').querySelector('.brow-frame'); if (frame) { frame.src = url; toast('Navegando...'); } };

  // ============================================================
  //  NOTEPAD
  // ============================================================
  function openNotepad() { return openNotepadWithContent('Bloco de Notas', ''); }
  window.saveNotepad = function (btn) { const text = btn.closest('.npad').querySelector('.npad-area').value; const blob = new Blob([text], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'documento.txt'; a.click(); toast('Arquivo salvo! 💾', 'success'); };
  window.copyNotepad = function (btn) { const text = btn.closest('.npad').querySelector('.npad-area').value; navigator.clipboard.writeText(text).then(() => toast('Copiado! 📋', 'success')); };
  window.modifySelectedLines = async function (btn) {
    const win = btn.closest('.win');
    const ta = win.querySelector('.npad-area');
    if (!ta) return;
    const content = ta.value;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end) || content;
    const instruction = prompt('Descreva como o LM Studio deve modificar a seleção de texto:');
    if (!instruction) return;
    const loading = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Processando...';
    try {
      const result = await ServiceLocator.resolve('AIService').editText(selected, instruction);
      const updated = content.slice(0, start) + result + content.slice(end);
      ta.value = updated;
      updateWC(ta, `wc-${win.querySelector('.npad-area') ? win.querySelector('.npad-area').id : 'doc'}`);
      toast('Texto modificado com LM Studio! ✨', 'success');
    } catch (err) {
      toast(`Falha ao modificar: ${err.message}`, 'error');
    } finally { btn.disabled = false; btn.textContent = loading; }
  };
  window.updateWC = function (ta, id) { const wc = ta.value.trim().split(/\s+/).filter(w => w).length; const el = document.getElementById(`wc-${id}`); if (el) el.textContent = `${wc} palavras`; };

  // ============================================================
  //  CALCULATOR
  // ============================================================
  function openCalc() {
    const win = createWin('Calculadora', '🔢', `
    <div class="calc">
      <div class="c-disp"><div class="c-expr" id="c-expr"></div><div class="c-val" id="c-val">0</div></div>
      <div class="c-grid" id="c-grid"></div>
    </div>
  `, 320, 460);
    const BTNS = [['cl', 'C', 'clear'], ['op', '±', 'op'], ['op', '%', 'op'], ['op', '÷', 'op'], ['', '7', 'num'], ['', '8', 'num'], ['', '9', 'num'], ['op', '×', 'op'], ['', '4', 'num'], ['', '5', 'num'], ['', '6', 'num'], ['op', '−', 'op'], ['', '1', 'num'], ['', '2', 'num'], ['', '3', 'num'], ['op', '+', 'op'], ['', '0', 'num', 'zero'], ['', '.', 'num'], ['eq', '=', 'eq']];
    const grid = win.querySelector('#c-grid');
    let cur = '0', expr = '', waitNext = false;
    BTNS.forEach(([cls, lbl, type, extra]) => {
      const btn = document.createElement('button');
      btn.className = `cb${cls ? ' ' + cls : ''}${extra ? ' ' + extra : ''}`;
      btn.textContent = lbl;
      btn.onclick = () => {
        const vEl = win.querySelector('#c-val'); const eEl = win.querySelector('#c-expr');
        if (type === 'clear') { cur = '0'; expr = ''; waitNext = false; }
        else if (lbl === '±') { cur = (parseFloat(cur) * -1).toString(); }
        else if (lbl === '%') { cur = (parseFloat(cur) / 100).toString(); }
        else if (type === 'op') { expr = cur + ' ' + lbl + ' '; waitNext = true; }
        else if (type === 'eq') { try { const e = expr.replace('÷', '/').replace('×', '*').replace('−', '-') + cur; cur = String(Function('"use strict";return(' + e + ')')()); if (cur.length > 12) cur = parseFloat(cur).toExponential(4); } catch { cur = 'Erro'; } expr = ''; waitNext = false; }
        else { if (waitNext) { cur = lbl === '.' ? '0.' : lbl; waitNext = false; } else { cur = cur === '0' && lbl !== '.' ? lbl : (cur + lbl); } }
        vEl.textContent = cur; eEl.textContent = expr; vEl.style.animation = 'pulse .15s ease'; setTimeout(() => vEl.style.animation = '', 150);
      };
      grid.appendChild(btn);
    });
    return win;
  }

  // ============================================================
  //  TERMINAL
  // ============================================================
  // ============================================================
  //  LOJA VESSIECOIN — gasta moedas ganhas jogando em cosméticos
  //  do desktop (liga sistemas reais do SystemsRuntime, ver
  //  JS/kernel/modules/systems/).
  // ============================================================
  function openVessieCoinStore() {
    const CATALOG = [
      { id: 'visual.crt', name: 'Modo CRT', desc: 'Monitor antigo com scanlines.', price: 40, icon: 'fa-tv' },
      { id: 'visual.holographic-shimmer', name: 'Brilho Holográfico', desc: 'Reflexo iridescente nas janelas.', price: 60, icon: 'fa-gem' },
      { id: 'visual.neon-boost', name: 'Neon Intensificado', desc: 'Glows mais fortes na UI.', price: 35, icon: 'fa-bolt' },
      { id: 'visual.cursor-trail', name: 'Trilha do Cursor', desc: 'Rastro de partículas no mouse.', price: 25, icon: 'fa-wand-magic-sparkles' },
      { id: 'visual.cursor-glow-ring', name: 'Anel de Luz do Cursor', desc: 'Anel neon acompanhando o cursor.', price: 25, icon: 'fa-circle-notch' },
      { id: 'visual.particles-overlay', name: 'Partículas Ambiente', desc: 'Partículas flutuantes no desktop.', price: 45, icon: 'fa-star' },
      { id: 'visual.animated-gradient-bg', name: 'Gradiente Animado', desc: 'Papel de parede com gradiente vivo.', price: 50, icon: 'fa-palette' },
      { id: 'visual.parallax-wallpaper', name: 'Paralaxe do Papel de Parede', desc: 'Profundidade ao mover o mouse.', price: 30, icon: 'fa-layer-group' },
      { id: 'visual.window-shadow-depth', name: 'Sombras Profundas', desc: 'Janelas com mais profundidade visual.', price: 20, icon: 'fa-cube' },
      { id: 'visual.chromatic-aberration', name: 'Aberração Cromática', desc: 'Efeito sutil nas janelas em foco.', price: 30, icon: 'fa-droplet' },
    ];

    const win = createWin('Loja VessieCoin', '🪙', `
      <div style="padding:18px;height:100%;overflow-y:auto;background:#0d0d12;color:#eee;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
          <h2 style="margin:0;font-size:1.1rem;"><i class="fas fa-coins" style="color:#f6c343;"></i> Loja VessieCoin</h2>
          <div style="background:rgba(246,195,67,.12);border:1px solid rgba(246,195,67,.3);color:#f6c343;padding:6px 14px;border-radius:20px;font-weight:700;font-size:.9rem;">
            <i class="fas fa-coins"></i> <span id="vcstore-balance">0</span>
          </div>
        </div>
        <p style="color:#8fa0bf;font-size:.85rem;margin-bottom:16px;">Ganhe moedas jogando no Steam/Game Hub e troque por cosméticos reais para o seu desktop.</p>
        <div id="vcstore-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;"></div>
      </div>
    `, 720, 520);

    function render() {
      const balanceEl = win.querySelector('#vcstore-balance');
      const grid = win.querySelector('#vcstore-grid');
      if (balanceEl) balanceEl.textContent = window.VessieCoin?.getBalance() ?? 0;
      if (!grid) return;
      grid.innerHTML = CATALOG.map(item => {
        const owned = window.VessieCoin?.isUnlocked(item.id);
        const active = window.VessieOS?.systemsRuntime?.isEnabled(item.id);
        return `
        <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px;">
          <div style="font-size:1.6rem;color:#f6c343;margin-bottom:8px;"><i class="fas ${item.icon}"></i></div>
          <div style="font-weight:600;margin-bottom:4px;">${item.name}</div>
          <div style="color:#8fa0bf;font-size:.78rem;margin-bottom:10px;min-height:32px;">${item.desc}</div>
          ${owned
            ? `<button onclick="window.__vcstoreToggle('${item.id}')" style="width:100%;background:${active ? 'rgba(74,222,128,.15)' : 'rgba(255,255,255,.06)'};border:1px solid ${active ? '#4ade80' : 'rgba(255,255,255,.1)'};color:${active ? '#4ade80' : '#eee'};padding:8px;border-radius:8px;cursor:pointer;font-size:.8rem;font-weight:600;">${active ? '✓ Ativado' : 'Ativar'}</button>`
            : `<button onclick="window.__vcstoreBuy('${item.id}', ${item.price})" style="width:100%;background:linear-gradient(135deg,#f6c343,#c98b1f);border:none;color:#1a1200;padding:8px;border-radius:8px;cursor:pointer;font-size:.8rem;font-weight:700;"><i class="fas fa-coins"></i> ${item.price}</button>`
          }
        </div>`;
      }).join('');
    }

    window.__vcstoreBuy = function (itemId, price) {
      const item = CATALOG.find(i => i.id === itemId);
      if (!item) return;
      const ok = window.VessieCoin?.spend(price, `Comprou ${item.name}`, { itemId });
      if (ok) { window.VessieOS?.systemsRuntime?.enable(itemId); render(); }
    };
    window.__vcstoreToggle = function (itemId) {
      window.VessieOS?.systemsRuntime?.toggle(itemId);
      render();
    };

    window.VessieCoin?.onChange(render);
    render();
    return win;
  }

  // ============================================================
  //  CENTRAL DE ERROS — painel que reúne o crash-reporter, o
  //  health-check e o exportador de diagnóstico dos 155 sistemas
  //  (ver JS/kernel/modules/systems/registry/diagnostics.js).
  // ============================================================
  function openErrorCenter() {
    const win = createWin('Central de Erros', '🚨', `
      <div style="padding:18px;height:100%;overflow-y:auto;background:#0d0d12;color:#eee;font-size:.85rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <h2 style="margin:0;font-size:1.1rem;"><i class="fas fa-triangle-exclamation" style="color:#f59e0b;"></i> Central de Erros</h2>
          <button id="ec-export" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#eee;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:.75rem;"><i class="fas fa-download"></i> Exportar relatório</button>
        </div>
        <div id="ec-health" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:18px;"></div>
        <div style="font-weight:600;margin-bottom:8px;">Erros recentes</div>
        <div id="ec-log" style="background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:10px;max-height:280px;overflow-y:auto;font-family:monospace;font-size:.75rem;"></div>
      </div>
    `, 640, 560);

    function render() {
      const health = window.__vsysHealthCheck?.() || {};
      const healthEl = win.querySelector('#ec-health');
      if (healthEl) {
        healthEl.innerHTML = Object.entries(health).map(([key, ok]) => `
          <div style="background:rgba(255,255,255,.04);border:1px solid ${ok ? 'rgba(74,222,128,.3)' : 'rgba(239,68,68,.3)'};border-radius:8px;padding:8px 10px;">
            <div style="font-size:.7rem;color:#8fa0bf;text-transform:uppercase;">${key}</div>
            <div style="color:${ok ? '#4ade80' : '#ef4444'};font-weight:700;">${ok ? 'OK' : 'Indisponível'}</div>
          </div>`).join('');
      }
      let log = [];
      try { log = JSON.parse(localStorage.getItem('vessieos_sys_crash-log') || '[]'); } catch (e) { }
      const logEl = win.querySelector('#ec-log');
      if (logEl) {
        logEl.innerHTML = log.length ? log.map(entry => `
          <div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);">
            <span style="color:#5b6680;">${new Date(entry.at).toLocaleTimeString('pt-BR')}</span>
            <span style="color:#ef4444;"> ${entry.type || 'error'}</span> — ${entry.message}
          </div>`).join('') : '<div style="color:#5b6680;">Nenhum erro registrado. 🎉</div>';
      }
    }

    win.querySelector('#ec-export').addEventListener('click', () => window.__vsysExportDiagnostics?.());
    render();
    const interval = setInterval(() => {
      if (!document.body.contains(win)) { clearInterval(interval); return; }
      render();
    }, 5000);
    return win;
  }

  function openTerminal() {
    // ---------- ESTADO DO TERMINAL ----------
    const termState = {
      history: [],
      historyIndex: -1,
      currentPath: 'Desktop',
      user: S.user || 'visitante',
      host: 'vessieos',
      aliases: {},
      env: {
        HOME: '/home/' + (S.user || 'visitante'),
        USER: S.user || 'visitante',
        PATH: '/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games',
        SHELL: '/bin/bash',
        TERM: 'xterm-256color',
        PWD: '~'
      },
      variables: {},
      processes: [
        { pid: 1, name: 'systemd', cpu: 0.5, mem: 1.2 },
        { pid: 2, name: 'kthreadd', cpu: 0.0, mem: 0.0 },
        { pid: 100, name: 'terminal (vessieos)', cpu: 0.8, mem: 4.5 },
        { pid: 200, name: 'vessie-ai', cpu: 2.1, mem: 8.3 },
        { pid: 300, name: 'steam', cpu: 5.2, mem: 12.7 },
        { pid: 400, name: 'discord', cpu: 3.0, mem: 6.8 },
        { pid: 500, name: 'nvidia-settings', cpu: 1.0, mem: 2.5 },
      ],
      nextPid: 501,
      uptime: Date.now(),
      editorContent: '',
      editorMode: false,
      editorFilename: '',
      lastCommand: '',
      isRoot: false,
      commandCount: 0,
      aliasesLoaded: false
    };

    // Carrega aliases salvos
    function loadAliases() {
      try {
        const saved = localStorage.getItem('vessie_term_aliases');
        if (saved) {
          termState.aliases = JSON.parse(saved);
          termState.aliasesLoaded = true;
        }
      } catch (e) { }
    }
    loadAliases();

    function saveAliases() {
      try {
        localStorage.setItem('vessie_term_aliases', JSON.stringify(termState.aliases));
      } catch (e) { }
    }

    // ---------- FUNÇÕES AUXILIARES ----------
    function escHtml(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function formatDate(d) {
      return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' });
    }

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + 'B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'K';
      if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + 'M';
      return (bytes / 1073741824).toFixed(1) + 'G';
    }

    function resolvePath(path) {
      if (!path) return termState.currentPath;
      if (path === '~') path = termState.env.HOME;
      if (path.startsWith('/')) {
        // Caminho absoluto (simulado)
        const parts = path.split('/').filter(Boolean);
        let node = S.fs;
        for (const p of parts) {
          if (node && typeof node === 'object' && p in node) node = node[p];
          else return null;
        }
        return path;
      }
      // Caminho relativo
      const current = termState.currentPath === '~' ? termState.env.HOME : termState.currentPath;
      const parts = current.split('/').filter(Boolean);
      const relParts = path.split('/').filter(Boolean);
      for (const p of relParts) {
        if (p === '..') parts.pop();
        else if (p === '.') continue;
        else parts.push(p);
      }
      return parts.join('/') || 'Desktop';
    }

    function getNode(path) {
      if (!path) path = termState.currentPath;
      if (path === '~') path = termState.env.HOME;
      return VFS.resolve(path);
    }

    function listFiles(path) {
      const node = getNode(path);
      if (!node || typeof node !== 'object') return [];
      return Object.keys(node).map(name => {
        const val = node[name];
        const isDir = val && typeof val === 'object';
        return { name, isDir, size: isDir ? 4096 : (typeof val === 'string' ? val.length : 0), modified: Date.now() };
      });
    }

    // ---------- COMANDOS ----------
    const CMDS = {};

    // vessie / vscript — executa código VessieScript de verdade (comandos
    // reais fs/proc/registry/log/net/json/string/math/..., adaptador de
    // kernel real, adaptador de C#) direto no Terminal. O mesmo filesystem
    // do Terminal/Explorador de Arquivos (window.VessieOS.FileSystem) é o
    // que os comandos fs.* do script enxergam — arquivos criados por um
    // script aparecem no `ls`/Explorador, e vice-versa.
    function runVessieCommand(args) {
      const engine = window.VessieScript;
      if (!engine) {
        append('<span class="te">VessieScript indisponível (motor não carregado).</span>');
        return;
      }
      if (!args.length) {
        append('<span class="te">Uso: vessie &lt;arquivo.vessie&gt; | vessie -e "codigo VessieScript"</span>');
        return;
      }

      let source;
      if (args[0] === '-e') {
        source = args.slice(1).join(' ');
        // O parser de comandos deste Terminal não interpreta aspas (split
        // simples por espaço) — então "vessie -e "codigo aqui"" chega com
        // as aspas literais nas pontas. Remove um par de aspas externas
        // correspondentes, se houver, para o código funcionar como esperado.
        const quoted = source.match(/^"(.*)"$/s) || source.match(/^'(.*)'$/s);
        if (quoted) source = quoted[1];
        if (!source) { append('<span class="te">vessie -e: informe o código depois de -e</span>'); return; }
      } else {
        const path = resolvePath(args[0]);
        const node = getNode(path);
        if (typeof node !== 'string') {
          append(`<span class="te">vessie: ${escHtml(args[0])}: arquivo .vessie não encontrado</span>`);
          return;
        }
        source = node;
      }

      const printLine = (text) => append(`<span style="color:#c4a8ff;">${escHtml(String(text))}</span>`);
      const scripting = window.VessieOS && window.VessieOS.modules && window.VessieOS.modules.scripting;
      const runPromise = (scripting && scripting.isAvailable())
        ? scripting.run(source, { id: `terminal:${Date.now()}`, hostAPI: { print: printLine } })
        : engine.run(source, { print: printLine });

      runPromise.catch((error) => {
        append(`<span class="te">Erro VessieScript: ${escHtml(error.message)}</span>`);
      });
    }
    CMDS.vessie = function (args) { runVessieCommand(args); return ''; };
    CMDS.vscript = CMDS.vessie;


    // help
    CMDS.help = function (args) {
      const commands = Object.keys(CMDS).sort();
      const cols = 4;
      let output = '<span class="ti">Comandos disponíveis:</span><br>';
      const perCol = Math.ceil(commands.length / cols);
      for (let i = 0; i < perCol; i++) {
        for (let j = 0; j < cols; j++) {
          const idx = i + j * perCol;
          if (idx < commands.length) output += `<span style="display:inline-block;width:140px;color:#7dd3fc;">${commands[idx]}</span>`;
        }
        output += '<br>';
      }
      output += `<br><span class="ti">Use 'man [comando]' para detalhes.</span>`;
      return output;
    };

    // man
    CMDS.man = function (args) {
      const cmd = args[0];
      if (!cmd) return '<span class="te">Uso: man [comando]</span>';
      const helpMap = {
        ls: 'Lista arquivos e pastas. Uso: ls [-la] [caminho]',
        cd: 'Muda diretório. Uso: cd [caminho] | cd .. | cd ~',
        pwd: 'Mostra diretório atual.',
        cat: 'Exibe conteúdo de arquivo. Uso: cat [arquivo1] [arquivo2] ...',
        touch: 'Cria arquivo vazio. Uso: touch [nome]',
        rm: 'Remove arquivo. Uso: rm [arquivo] | rm -r [pasta]',
        rmdir: 'Remove pasta vazia. Uso: rmdir [pasta]',
        mv: 'Move/renomeia arquivo. Uso: mv [origem] [destino]',
        cp: 'Copia arquivo. Uso: cp [origem] [destino]',
        mkdir: 'Cria pasta. Uso: mkdir [nome]',
        echo: 'Exibe texto. Uso: echo [texto] | echo $VAR',
        date: 'Exibe data/hora atual.',
        cal: 'Exibe calendário. Uso: cal [mês] [ano]',
        clear: 'Limpa a tela do terminal.',
        history: 'Exibe histórico de comandos.',
        alias: 'Cria alias. Uso: alias [nome]="[comando]"',
        unalias: 'Remove alias. Uso: unalias [nome]',
        export: 'Define variável. Uso: export VAR=valor',
        env: 'Exibe variáveis de ambiente.',
        whoami: 'Exibe nome do usuário atual.',
        uname: 'Exibe informações do sistema. Uso: uname -a',
        uptime: 'Exibe tempo de atividade do sistema.',
        ps: 'Lista processos. Uso: ps [aux]',
        kill: 'Finaliza processo. Uso: kill [PID]',
        neofetch: 'Exibe informações do sistema com arte ASCII.',
        nano: 'Editor de texto simples. Uso: nano [arquivo]',
        ping: 'Simula ping. Uso: ping [host]',
        curl: 'Simula requisição HTTP. Uso: curl [URL]',
        grep: 'Busca texto em arquivo. Uso: grep [padrão] [arquivo]',
        find: 'Busca arquivos. Uso: find [caminho] -name [padrão]',
        chmod: 'Altera permissões (simulado). Uso: chmod [modo] [arquivo]',
        sudo: 'Executa com privilégios de root (simulado).',
        su: 'Troca usuário. Uso: su [usuário]',
        exit: 'Fecha o terminal.',
        reboot: 'Reinicia o sistema (simulado).',
        shutdown: 'Desliga o sistema (simulado).',
        df: 'Exibe uso de disco.',
        du: 'Exibe uso de diretório.',
        free: 'Exibe uso de memória.',
        top: 'Exibe processos em tempo real (simples).',
        head: 'Mostra primeiras linhas do arquivo.',
        tail: 'Mostra últimas linhas do arquivo.',
        sort: 'Ordena linhas (simples).',
        sleep: 'Aguarda N segundos.',
        yes: 'Repete texto até interromper.',
        jobs: 'Lista jobs em background (simulado).',
        fg: 'Traz job para foreground (simulado).',
        bg: 'Coloca job em background (simulado).',
        coin: 'Mostra o saldo de VessieCoin. Uso: coin | coin history',
        vsys: 'Gerencia os 155 micro-sistemas do kernel. Uso: vsys [list|categories|on|off] [id]',
        errors: 'Mostra o log de erros do sistema. Uso: errors | errors clear',
        aimodel: 'Mostra/lista o modelo de IA ativo no LM Studio. Uso: aimodel | aimodel list',
        adaptivecolor: 'Ativa/desativa a cor adaptativa da UI baseada nas janelas abertas. Uso: adaptivecolor [on|off]',
        vessie: 'Executa código VessieScript real. Uso: vessie arquivo.vessie | vessie -e "codigo"',
        vscript: 'Alias de vessie.',
      };
      const help = helpMap[cmd] || 'Comando não encontrado no manual.';
      return `<span class="ti">MAN ${cmd.toUpperCase()}</span><br><span style="color:#d4d4d4;">${help}</span>`;
    };

    // ls
    CMDS.ls = function (args) {
      const path = args[args.length - 1] || '.';
      const showAll = args.includes('-a');
      const long = args.includes('-l') || args.includes('-la') || args.includes('-al');
      const targetPath = path === '.' ? termState.currentPath : resolvePath(path);
      if (!targetPath) return `<span class="te">ls: ${path}: Diretório não encontrado</span>`;
      const files = listFiles(targetPath);
      if (!files.length) return '<span style="color:var(--dim);">(pasta vazia)</span>';
      let output = '';
      if (long) {
        output += `<span style="color:#5b6680;font-size:.75rem;">total ${files.length}</span><br>`;
        files.forEach(f => {
          const perms = f.isDir ? 'drwxr-xr-x' : '-rw-r--r--';
          const date = new Date(f.modified).toLocaleDateString('pt-BR');
          output += `<span style="color:${f.isDir ? '#ffb74d' : '#7eb6ff'}">${perms}</span> <span style="color:#5b6680;">${f.isDir ? '4096' : f.size}</span> ${date} <span style="color:#fff;">${f.name}${f.isDir ? '/' : ''}</span><br>`;
        });
      } else {
        const filtered = showAll ? files : files.filter(f => !f.name.startsWith('.'));
        output = filtered.map(f => `<span style="color:${f.isDir ? '#ffb74d' : '#7eb6ff'}">${f.name}${f.isDir ? '/' : ''}</span>`).join(' ');
      }
      return output;
    };

    // cd
    CMDS.cd = function (args) {
      const target = args[0] || '~';
      let newPath;
      if (target === '~' || target === '') {
        newPath = 'Desktop';
      } else if (target === '..') {
        const parts = termState.currentPath.split('/');
        parts.pop();
        newPath = parts.join('/') || 'Desktop';
      } else {
        const resolved = resolvePath(target);
        if (!resolved) return `<span class="te">cd: ${target}: Diretório não encontrado</span>`;
        newPath = resolved;
      }
      // Verifica se existe
      const node = getNode(newPath);
      if (!node || typeof node !== 'object') {
        return `<span class="te">cd: ${target}: Diretório não encontrado</span>`;
      }
      termState.currentPath = newPath;
      termState.env.PWD = newPath === 'Desktop' ? '~' : newPath;
      return '';
    };

    // pwd
    CMDS.pwd = function () {
      return termState.currentPath === 'Desktop' ? '/home/' + termState.user : '/' + termState.currentPath;
    };

    // cat
    CMDS.cat = function (args) {
      if (!args.length) return '<span class="te">Uso: cat [arquivo]</span>';
      const outputs = [];
      for (const arg of args) {
        const path = resolvePath(arg);
        if (!path) { outputs.push(`<span class="te">cat: ${arg}: Arquivo não encontrado</span>`); continue; }
        const node = getNode(path);
        if (!node) { outputs.push(`<span class="te">cat: ${arg}: Arquivo não encontrado</span>`); continue; }
        if (typeof node === 'object') { outputs.push(`<span class="te">cat: ${arg}: É um diretório</span>`); continue; }
        outputs.push(`<span style="white-space:pre-wrap;">${escHtml(String(node))}</span>`);
      }
      return outputs.join('<br>');
    };

    // touch
    CMDS.touch = function (args) {
      if (!args.length) return '<span class="te">Uso: touch [arquivo]</span>';
      const name = args[0];
      const path = termState.currentPath;
      const node = getNode(path);
      if (!node || typeof node !== 'object') return `<span class="te">touch: ${path}: Diretório não encontrado</span>`;
      if (name in node) {
        // Atualiza timestamp (simulado)
        return `<span style="color:var(--dim);">'${name}' atualizado</span>`;
      }
      node[name] = '';
      persistState();
      return `<span style="color:#4ade80;">'${name}' criado</span>`;
    };

    // rm
    CMDS.rm = function (args) {
      if (!args.length) return '<span class="te">Uso: rm [-r] [arquivo/pasta]</span>';
      const recursive = args.includes('-r');
      const targets = args.filter(a => a !== '-r');
      let output = '';
      for (const target of targets) {
        const path = resolvePath(target);
        if (!path) { output += `<span class="te">rm: ${target}: Não encontrado</span><br>`; continue; }
        const node = getNode(path);
        if (!node) { output += `<span class="te">rm: ${target}: Não encontrado</span><br>`; continue; }
        if (typeof node === 'object' && !recursive) {
          output += `<span class="te">rm: ${target}: É um diretório (use -r)</span><br>`;
          continue;
        }
        VFS.delete(path);
        output += `<span style="color:#f87171;">'${target}' removido</span><br>`;
      }
      persistState();
      return output;
    };

    // rmdir
    CMDS.rmdir = function (args) {
      if (!args.length) return '<span class="te">Uso: rmdir [pasta]</span>';
      const target = args[0];
      const path = resolvePath(target);
      if (!path) return `<span class="te">rmdir: ${target}: Não encontrado</span>`;
      const node = getNode(path);
      if (!node) return `<span class="te">rmdir: ${target}: Não encontrado</span>`;
      if (typeof node !== 'object') return `<span class="te">rmdir: ${target}: Não é um diretório</span>`;
      if (Object.keys(node).length) return `<span class="te">rmdir: ${target}: Diretório não vazio</span>`;
      VFS.delete(path);
      persistState();
      return `<span style="color:#f87171;">'${target}' removido</span>`;
    };

    // mv
    CMDS.mv = function (args) {
      if (args.length < 2) return '<span class="te">Uso: mv [origem] [destino]</span>';
      const src = args[0];
      const dst = args[1];
      const srcPath = resolvePath(src);
      if (!srcPath) return `<span class="te">mv: ${src}: Não encontrado</span>`;
      const srcNode = getNode(srcPath);
      if (!srcNode) return `<span class="te">mv: ${src}: Não encontrado</span>`;
      const dstPath = resolvePath(dst);
      if (!dstPath) return `<span class="te">mv: ${dst}: Destino inválido</span>`;
      // Se destino for diretório, move para dentro
      const dstNode = getNode(dstPath);
      if (dstNode && typeof dstNode === 'object') {
        // Move para dentro do diretório
        const name = src.split('/').pop();
        dstNode[name] = srcNode;
        VFS.delete(srcPath);
        persistState();
        return `<span style="color:#4ade80;">'${src}' movido para '${dst}'</span>`;
      }
      // Renomeia
      const parent = resolvePath(dstPath.split('/').slice(0, -1).join('/') || 'Desktop');
      const name = dstPath.split('/').pop();
      const parentNode = getNode(parent);
      if (!parentNode || typeof parentNode !== 'object') return `<span class="te">mv: Destino inválido</span>`;
      parentNode[name] = srcNode;
      VFS.delete(srcPath);
      persistState();
      return `<span style="color:#4ade80;">'${src}' renomeado para '${dst}'</span>`;
    };

    // cp
    CMDS.cp = function (args) {
      if (args.length < 2) return '<span class="te">Uso: cp [origem] [destino]</span>';
      const src = args[0];
      const dst = args[1];
      const srcPath = resolvePath(src);
      if (!srcPath) return `<span class="te">cp: ${src}: Não encontrado</span>`;
      const srcNode = getNode(srcPath);
      if (!srcNode) return `<span class="te">cp: ${src}: Não encontrado</span>`;
      if (typeof srcNode === 'object') return `<span class="te">cp: ${src}: É um diretório (use cp -r)</span>`;
      const dstPath = resolvePath(dst);
      if (!dstPath) return `<span class="te">cp: ${dst}: Destino inválido</span>`;
      const dstNode = getNode(dstPath);
      if (dstNode && typeof dstNode === 'object') {
        // Copia para dentro do diretório
        const name = src.split('/').pop();
        dstNode[name] = srcNode;
        persistState();
        return `<span style="color:#4ade80;">'${src}' copiado para '${dst}'</span>`;
      }
      const parent = resolvePath(dstPath.split('/').slice(0, -1).join('/') || 'Desktop');
      const name = dstPath.split('/').pop();
      const parentNode = getNode(parent);
      if (!parentNode || typeof parentNode !== 'object') return `<span class="te">cp: Destino inválido</span>`;
      parentNode[name] = srcNode;
      persistState();
      return `<span style="color:#4ade80;">'${src}' copiado para '${dst}'</span>`;
    };

    // mkdir (md)
    CMDS.mkdir = function (args) {
      if (!args.length) return '<span class="te">Uso: mkdir [nome]</span>';
      const name = args[0];
      const path = termState.currentPath;
      const node = getNode(path);
      if (!node || typeof node !== 'object') return `<span class="te">mkdir: ${path}: Diretório não encontrado</span>`;
      if (name in node) return `<span class="te">mkdir: ${name}: Já existe</span>`;
      node[name] = {};
      persistState();
      return `<span style="color:#4ade80;">'${name}' criado</span>`;
    };

    // echo
    CMDS.echo = function (args) {
      if (!args.length) return '';
      let text = args.join(' ');
      // Substitui variáveis $VAR
      text = text.replace(/\$([A-Z_]+)/g, (match, varName) => {
        if (varName in termState.env) return termState.env[varName];
        if (varName in termState.variables) return termState.variables[varName];
        return match;
      });
      return text;
    };

    // date
    CMDS.date = function () {
      return `<span class="ti">${new Date().toLocaleString('pt-BR')}</span>`;
    };

    // cal
    CMDS.cal = function (args) {
      const now = new Date();
      let month = args[0] ? parseInt(args[0]) - 1 : now.getMonth();
      let year = args[1] ? parseInt(args[1]) : now.getFullYear();
      if (args[0] && args[0].length === 4) { year = parseInt(args[0]); month = now.getMonth(); }
      if (isNaN(month)) month = now.getMonth();
      if (isNaN(year)) year = now.getFullYear();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      const monthName = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][month];
      let output = `<span style="color:#fff;font-weight:600;">${monthName} ${year}</span><br>`;
      output += '<span style="color:#5b6680;">Do Se Te Qu Qu Se Sá</span><br>';
      let day = 1;
      let line = '';
      for (let i = 0; i < firstDay; i++) line += '    ';
      while (day <= daysInMonth) {
        line += (day < 10 ? '  ' : ' ') + day + ' ';
        if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
          output += line + '<br>';
          line = '';
        }
        day++;
      }
      return output;
    };

    // clear
    CMDS.clear = function () {
      const out = win.querySelector('#term-out');
      if (out) out.innerHTML = '';
      return '';
    };

    // history
    CMDS.history = function () {
      if (!termState.history.length) return '<span style="color:var(--dim);">Nenhum comando no histórico.</span>';
      return termState.history.map((cmd, i) => `<span style="color:#5b6680;">${i + 1}</span>  ${cmd}`).join('<br>');
    };

    // alias
    CMDS.alias = function (args) {
      if (!args.length) {
        const aliases = Object.keys(termState.aliases);
        if (!aliases.length) return '<span style="color:var(--dim);">Nenhum alias definido.</span>';
        return aliases.map(a => `<span style="color:#7dd3fc;">${a}</span> = "${termState.aliases[a]}"`).join('<br>');
      }
      const arg = args.join(' ');
      const match = arg.match(/^([^=]+)=["']?(.*)["']?$/);
      if (!match) return '<span class="te">Uso: alias nome="comando"</span>';
      const name = match[1].trim();
      const cmd = match[2].trim();
      termState.aliases[name] = cmd;
      saveAliases();
      return `<span style="color:#4ade80;">Alias '${name}' definido.</span>`;
    };

    // unalias
    CMDS.unalias = function (args) {
      if (!args.length) return '<span class="te">Uso: unalias [nome]</span>';
      const name = args[0];
      if (!(name in termState.aliases)) return `<span class="te">unalias: ${name}: Não encontrado</span>`;
      delete termState.aliases[name];
      saveAliases();
      return `<span style="color:#f87171;">Alias '${name}' removido.</span>`;
    };

    // export
    CMDS.export = function (args) {
      if (!args.length) return '<span class="te">Uso: export VAR=valor</span>';
      const arg = args.join('');
      const match = arg.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (!match) return '<span class="te">Uso: export VAR=valor</span>';
      const name = match[1];
      const value = match[2];
      termState.env[name] = value;
      if (name === 'PWD') termState.currentPath = value === '~' ? 'Desktop' : value;
      return `<span style="color:#4ade80;">${name}='${value}'</span>`;
    };

    // env
    CMDS.env = function () {
      return Object.entries(termState.env).map(([k, v]) => `<span style="color:#7dd3fc;">${k}</span>=<span style="color:#d4d4d4;">${v}</span>`).join('<br>');
    };

    // whoami
    CMDS.whoami = function () {
      return termState.user;
    };

    // uname
    CMDS.uname = function (args) {
      if (args.includes('-a')) {
        return `VessieOS 3.0 ${termState.host} GNU/Linux 6.8.0 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`;
      }
      return 'VessieOS';
    };

    // uptime
    CMDS.uptime = function () {
      const uptime = Date.now() - termState.uptime;
      const days = Math.floor(uptime / 86400000);
      const hours = Math.floor((uptime % 86400000) / 3600000);
      const mins = Math.floor((uptime % 3600000) / 60000);
      return `${days}d ${hours}h ${mins}m`;
    };

    // ps
    CMDS.ps = function (args) {
      const all = args.includes('aux') || args.includes('-aux') || args.includes('a');
      let output = `<span style="color:#5b6680;">PID  %CPU %MEM COMMAND</span><br>`;
      termState.processes.forEach(p => {
        if (!all && p.pid < 100) return;
        output += `<span style="color:#d4d4d4;">${p.pid}   ${p.cpu.toFixed(1)}  ${p.mem.toFixed(1)}  ${p.name}</span><br>`;
      });
      return output;
    };

    // kill
    CMDS.kill = function (args) {
      if (!args.length) return '<span class="te">Uso: kill [PID]</span>';
      const pid = parseInt(args[0]);
      const idx = termState.processes.findIndex(p => p.pid === pid);
      if (idx === -1) return `<span class="te">kill: ${pid}: Processo não encontrado</span>`;
      const name = termState.processes[idx].name;
      termState.processes.splice(idx, 1);
      return `<span style="color:#f87171;">Processo ${pid} (${name}) finalizado.</span>`;
    };

    // neofetch
    CMDS.neofetch = function () {
      return `
<span style="color:#66c0f4;">       .---.        </span> <span style="color:#fff;">VessieOS 3.0</span>
<span style="color:#66c0f4;">      /     \\       </span> <span style="color:#d4d4d4;">Kernel: 6.8.0</span>
<span style="color:#66c0f4;">     /       \\      </span> <span style="color:#d4d4d4;">Shell: ${termState.env.SHELL}</span>
<span style="color:#66c0f4;">    /         \\     </span> <span style="color:#d4d4d4;">Usuário: ${termState.user}</span>
<span style="color:#66c0f4;">   /  ███████  \\    </span> <span style="color:#d4d4d4;">CPU: Intel i9-14900K</span>
<span style="color:#66c0f4;">  /  ███████  \\   </span> <span style="color:#d4d4d4;">GPU: NVIDIA RTX 5080</span>
<span style="color:#66c0f4;"> /  ███████  \\  </span> <span style="color:#d4d4d4;">RAM: 32GB DDR5</span>
<span style="color:#66c0f4;">/______________\\ </span> <span style="color:#d4d4d4;">OS: VessieOS 3.0</span>
    `.replace(/    /g, '');
    };

    // nano (editor simples)
    CMDS.nano = function (args) {
      const filename = args[0];
      if (!filename) return '<span class="te">Uso: nano [arquivo]</span>';
      termState.editorMode = true;
      termState.editorFilename = filename;
      const path = resolvePath(filename);
      let content = '';
      if (path) {
        const node = getNode(path);
        if (node && typeof node === 'string') content = node;
      }
      termState.editorContent = content;
      const prompt = win.querySelector('#t-prompt');
      const inp = win.querySelector('#t-inp');
      const out = win.querySelector('#term-out');
      if (prompt) prompt.textContent = '📝 EDITANDO: ' + filename + ' (Ctrl+S salvar, Ctrl+Q sair)';
      if (inp) { inp.value = content; inp.placeholder = 'Edite o conteúdo...'; inp.focus(); inp.select(); }
      // Modifica comportamento do Enter para inserir quebra de linha no editor
      const origHandler = inp._keyHandler;
      inp._keyHandler = function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = inp.value;
          const start = inp.selectionStart;
          const end = inp.selectionEnd;
          inp.value = val.substring(0, start) + '\n' + val.substring(end);
          inp.selectionStart = inp.selectionEnd = start + 1;
          return;
        }
        if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          const content = inp.value;
          const path2 = resolvePath(filename);
          const node = getNode(termState.currentPath);
          if (node && typeof node === 'object') {
            node[filename] = content;
            persistState();
            out.innerHTML += `<br><span style="color:#4ade80;">📝 Arquivo '${filename}' salvo!</span>`;
            out.scrollTop = out.scrollHeight;
          }
          return;
        }
        if (e.key === 'q' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          termState.editorMode = false;
          if (prompt) prompt.textContent = `${termState.user}@${termState.host}:${termState.currentPath === 'Desktop' ? '~' : termState.currentPath}$`;
          if (inp) { inp.value = ''; inp.placeholder = 'Digite um comando...'; }
          out.innerHTML += `<br><span style="color:var(--dim);">📝 Editado finalizado.</span>`;
          out.scrollTop = out.scrollHeight;
          inp.removeEventListener('keydown', inp._keyHandler);
          inp._keyHandler = null;
          // Restaura o handler original
          inp.addEventListener('keydown', handleInput);
        }
      };
      inp.addEventListener('keydown', inp._keyHandler);
      return '';
    };

    // ping
    CMDS.ping = function (args) {
      const host = args[0] || 'localhost';
      let output = `<span style="color:#7dd3fc;">PING ${host}</span><br>`;
      let count = 0;
      const interval = setInterval(() => {
        const ms = (10 + Math.random() * 90).toFixed(2);
        output += `<span style="color:#d4d4d4;">64 bytes de ${host}: tempo=${ms}ms</span><br>`;
        const outEl = win.querySelector('#term-out');
        if (outEl) {
          const div = document.createElement('div');
          div.innerHTML = `64 bytes de ${host}: tempo=${ms}ms`;
          outEl.appendChild(div);
          outEl.scrollTop = outEl.scrollHeight;
        }
        count++;
        if (count >= 5) {
          clearInterval(interval);
          const outEl2 = win.querySelector('#term-out');
          if (outEl2) {
            const div2 = document.createElement('div');
            div2.innerHTML = `<span style="color:#5b6680;">--- ${host} ping statistics ---</span>`;
            outEl2.appendChild(div2);
            outEl2.scrollTop = outEl2.scrollHeight;
          }
        }
      }, 500);
      return output;
    };

    // curl
    CMDS.curl = function (args) {
      const url = args[0];
      if (!url) return '<span class="te">Uso: curl [URL]</span>';
      return `<span style="color:#d4d4d4;">[Simulação] Conteúdo de ${url}:<br>👋 Olá do VessieOS!<br>Status: 200 OK</span>`;
    };

    // grep
    CMDS.grep = function (args) {
      if (args.length < 2) return '<span class="te">Uso: grep [padrão] [arquivo]</span>';
      const pattern = args[0];
      const file = args[1];
      const path = resolvePath(file);
      if (!path) return `<span class="te">grep: ${file}: Arquivo não encontrado</span>`;
      const node = getNode(path);
      if (!node || typeof node === 'object') return `<span class="te">grep: ${file}: É um diretório</span>`;
      const lines = String(node).split('\n');
      const matched = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
      if (!matched.length) return `<span style="color:var(--dim);">Nenhuma linha correspondente.</span>`;
      return matched.map(line => `<span style="color:#7dd3fc;">${escHtml(line)}</span>`).join('<br>');
    };

    // find
    CMDS.find = function (args) {
      if (args.length < 3 || args[1] !== '-name') return '<span class="te">Uso: find [caminho] -name [padrão]</span>';
      const path = args[0];
      const pattern = args[2];
      const targetPath = path === '.' ? termState.currentPath : resolvePath(path);
      if (!targetPath) return `<span class="te">find: ${path}: Diretório não encontrado</span>`;
      const files = listFiles(targetPath);
      const matched = files.filter(f => f.name.includes(pattern));
      if (!matched.length) return `<span style="color:var(--dim);">Nenhum arquivo encontrado.</span>`;
      return matched.map(f => `<span style="color:${f.isDir ? '#ffb74d' : '#7eb6ff'}">${f.name}${f.isDir ? '/' : ''}</span>`).join(' ');
    };

    // chmod
    CMDS.chmod = function (args) {
      if (args.length < 2) return '<span class="te">Uso: chmod [modo] [arquivo]</span>';
      const mode = args[0];
      const file = args[1];
      return `<span style="color:#4ade80;">Permissões de '${file}' alteradas para ${mode} (simulado).</span>`;
    };

    // sudo
    CMDS.sudo = function (args) {
      if (!args.length) return '<span class="te">Uso: sudo [comando]</span>';
      termState.isRoot = true;
      const cmd = args.join(' ');
      return `<span style="color:#fbbf24;">🔒 Executando com privilégios de root: ${cmd}</span><br>${CMDS[args[0]] ? CMDS[args[0]](args.slice(1)) : 'Comando executado.'}`;
    };

    // su
    CMDS.su = function (args) {
      const user = args[0];
      if (!user) return '<span class="te">Uso: su [usuário]</span>';
      if (user === 'root') {
        termState.isRoot = true;
        termState.user = 'root';
        updatePrompt();
        return `<span style="color:#fbbf24;">🔓 Você agora é root.</span>`;
      }
      termState.user = user;
      updatePrompt();
      return `<span style="color:#4ade80;">Usuário alterado para ${user}.</span>`;
    };

    // exit
    CMDS.exit = function () {
      const cl = win.querySelector('.cl');
      if (cl) cl.click();
      return '';
    };

    // reboot
    CMDS.reboot = function () {
      if (!confirm('Reiniciar o sistema?')) return 'Cancelado.';
      setTimeout(() => location.reload(), 500);
      return '🔄 Reiniciando...';
    };

    // shutdown
    CMDS.shutdown = function () {
      if (!confirm('Desligar o sistema?')) return 'Cancelado.';
      setTimeout(() => location.reload(), 500);
      return '⏻ Desligando...';
    };

    // df
    CMDS.df = function () {
      const total = 1000, used = 450, avail = 550;
      return `<span style="color:#5b6680;">Sist. Arq.   Tamanho  Usado  Disp.  Uso%</span><br>
            <span style="color:#d4d4d4;">/dev/vda1     ${total}G   ${used}G   ${avail}G   ${(used / total * 100).toFixed(0)}%</span>`;
    };

    // du
    CMDS.du = function (args) {
      const path = args[0] || '.';
      const targetPath = path === '.' ? termState.currentPath : resolvePath(path);
      if (!targetPath) return `<span class="te">du: ${path}: Diretório não encontrado</span>`;
      const files = listFiles(targetPath);
      const total = files.reduce((sum, f) => sum + (f.isDir ? 4096 : f.size), 0);
      return `<span style="color:#d4d4d4;">${formatSize(total)}</span>  <span style="color:#fff;">${path}</span>`;
    };

    // free
    CMDS.free = function () {
      const total = 32768, used = 10240, free = 22528;
      return `<span style="color:#5b6680;">              total  usado  livre</span><br>
            <span style="color:#d4d4d4;">Mem:           ${total}M   ${used}M   ${free}M</span>`;
    };

    // top (simples)
    CMDS.top = function (args) {
      let output = `<span style="color:#5b6680;">PID  %CPU %MEM COMMAND</span><br>`;
      termState.processes.slice(0, 10).forEach(p => {
        output += `<span style="color:#d4d4d4;">${p.pid}   ${p.cpu.toFixed(1)}  ${p.mem.toFixed(1)}  ${p.name}</span><br>`;
      });
      return output;
    };

    // head
    CMDS.head = function (args) {
      if (args.length < 1) return '<span class="te">Uso: head [arquivo]</span>';
      const file = args[0];
      const path = resolvePath(file);
      if (!path) return `<span class="te">head: ${file}: Arquivo não encontrado</span>`;
      const node = getNode(path);
      if (!node || typeof node === 'object') return `<span class="te">head: ${file}: É um diretório</span>`;
      const lines = String(node).split('\n');
      const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10;
      return lines.slice(0, n).map(l => escHtml(l)).join('<br>');
    };

    // tail
    CMDS.tail = function (args) {
      if (args.length < 1) return '<span class="te">Uso: tail [arquivo]</span>';
      const file = args[0];
      const path = resolvePath(file);
      if (!path) return `<span class="te">tail: ${file}: Arquivo não encontrado</span>`;
      const node = getNode(path);
      if (!node || typeof node === 'object') return `<span class="te">tail: ${file}: É um diretório</span>`;
      const lines = String(node).split('\n');
      const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10;
      return lines.slice(-n).map(l => escHtml(l)).join('<br>');
    };

    // sort
    CMDS.sort = function (args) {
      if (args.length < 1) return '<span class="te">Uso: sort [arquivo]</span>';
      const file = args[0];
      const path = resolvePath(file);
      if (!path) return `<span class="te">sort: ${file}: Arquivo não encontrado</span>`;
      const node = getNode(path);
      if (!node || typeof node === 'object') return `<span class="te">sort: ${file}: É um diretório</span>`;
      const lines = String(node).split('\n').sort();
      return lines.map(l => escHtml(l)).join('<br>');
    };

    // sleep
    CMDS.sleep = function (args) {
      if (args.length < 1) return '<span class="te">Uso: sleep [segundos]</span>';
      const secs = parseInt(args[0]);
      if (isNaN(secs) || secs < 1) return '<span class="te">sleep: valor inválido</span>';
      return `<span style="color:var(--dim);">⏳ Aguardando ${secs}s...</span>`;
    };

    // jobs
    CMDS.jobs = function () {
      return '<span style="color:var(--dim);">Nenhum job em background.</span>';
    };

    // fg / bg
    CMDS.fg = function () { return '<span style="color:var(--dim);">Nenhum job para trazer.</span>'; };
    CMDS.bg = function () { return '<span style="color:var(--dim);">Nenhum job para colocar em background.</span>'; };

    // yes
    CMDS.yes = function (args) {
      const text = args.join(' ') || 'y';
      let count = 0;
      const interval = setInterval(() => {
        if (count++ > 20) { clearInterval(interval); return; }
        const outEl = win.querySelector('#term-out');
        if (outEl) {
          const div = document.createElement('div');
          div.innerHTML = text;
          outEl.appendChild(div);
          outEl.scrollTop = outEl.scrollHeight;
        }
      }, 100);
      return '';
    };

    // wget
    CMDS.wget = function (args) {
      if (args.length < 1) return '<span class="te">Uso: wget [URL]</span>';
      const url = args[0];
      const filename = url.split('/').pop() || 'downloaded';
      return `<span style="color:#4ade80;">⬇️ Baixando ${filename}...<br>100% [====================] 1.2MB/s</span>`;
    };

    // ---------- COMANDOS NOVOS: VessieCoin / Sistemas / IA / Erros ----------
    CMDS.coin = CMDS.moedas = function (args) {
      const sub = args[0];
      if (!window.VessieCoin) return '<span class="te">Sistema VessieCoin indisponível.</span>';
      if (sub === 'history' || sub === 'historico') {
        const history = window.VessieCoin.getHistory(10);
        if (!history.length) return '<span style="color:var(--dim);">Nenhuma transação ainda.</span>';
        return history.map(h => `<span style="color:${h.type === 'earn' ? '#4ade80' : '#f87171'};">${h.type === 'earn' ? '+' : '-'}${h.amount}</span> ${escHtml(h.reason)} <span style="color:var(--dim);">(${new Date(h.at).toLocaleTimeString('pt-BR')})</span>`).join('<br>');
      }
      return `<span style="color:#f6c343;"><i class="fas fa-coins"></i> Saldo: ${window.VessieCoin.getBalance()} VessieCoin</span><br><span style="color:var(--dim);">Use 'coin history' para ver o histórico. Abra a Loja VessieCoin no menu Iniciar para gastar.</span>`;
    };

    CMDS.vsys = function (args) {
      const runtime = window.VessieOS?.systemsRuntime;
      if (!runtime) return '<span class="te">SystemsRuntime ainda não carregou (pipeline de módulos ES). Tente novamente em instantes.</span>';
      const [action, id] = args;
      if (!action || action === 'list') {
        const cat = id || null;
        const list = runtime.list(cat);
        if (!list.length) return cat ? `<span class="te">Categoria "${cat}" não encontrada.</span>` : '<span class="te">Nenhum sistema registrado.</span>';
        return `<span class="ti">${list.length} sistema(s)${cat ? ' em ' + cat : ''} (${runtime.count()} no total):</span><br>` +
          list.map(s => `${runtime.isEnabled(s.id) ? '<span style="color:#4ade80;">●</span>' : '<span style="color:var(--dim);">○</span>'} ${s.id} <span style="color:var(--dim);">— ${s.name}</span>`).join('<br>');
      }
      if (action === 'categories') return runtime.listCategories().join(', ');
      if (action === 'on' || action === 'enable') return runtime.enable(id) ? `<span style="color:#4ade80;">Ativado: ${id}</span>` : `<span class="te">Não foi possível ativar "${id}".</span>`;
      if (action === 'off' || action === 'disable') return runtime.disable(id) ? `<span style="color:#f87171;">Desativado: ${id}</span>` : `<span class="te">Não foi possível desativar "${id}".</span>`;
      return '<span class="te">Uso: vsys [list|categories|on|off] [id-ou-categoria]</span>';
    };

    CMDS.errors = CMDS.erros = function (args) {
      let log = [];
      try { log = JSON.parse(localStorage.getItem('vessieos_sys_crash-log') || '[]'); } catch (e) { }
      if (args[0] === 'clear' || args[0] === 'limpar') { localStorage.setItem('vessieos_sys_crash-log', '[]'); return '<span style="color:#4ade80;">Log de erros limpo.</span>'; }
      if (!log.length) return '<span style="color:#4ade80;">Nenhum erro registrado. 🎉</span>';
      return log.slice(0, 15).map(e => `<span style="color:#f87171;">[${e.type || 'error'}]</span> ${escHtml(e.message)} <span style="color:var(--dim);">(${new Date(e.at).toLocaleTimeString('pt-BR')})</span>`).join('<br>');
    };

    CMDS.adaptivecolor = CMDS.corAdaptativa = function (args) {
      const ac = window.VessieAdaptiveColor;
      if (!ac) return '<span class="te">Sistema de cor adaptativa indisponível.</span>';
      const sub = args[0];
      if (sub === 'on' || sub === 'ligar') { ac.enable(); return '<span style="color:#4ade80;">Cor adaptativa ativada — a taskbar e o menu Iniciar agora seguem as cores das janelas abertas.</span>'; }
      if (sub === 'off' || sub === 'desligar') { ac.disable(); return '<span style="color:#f87171;">Cor adaptativa desativada. Cores padrão restauradas.</span>'; }
      return `<span class="ti">Status:</span> ${ac.isEnabled() ? '<span style="color:#4ade80;">ativada</span>' : '<span style="color:var(--dim);">desativada</span>'}<br><span style="color:var(--dim);">Uso: adaptivecolor [on|off]</span>`;
    };

    CMDS.aimodel = function (args) {
      const ai = window.VessieOS?.ai;
      if (!args.length) {
        const selected = localStorage.getItem('vessie_selected_model') || '(nenhum selecionado)';
        return `<span class="ti">Modelo ativo:</span> ${escHtml(selected)}<br><span style="color:var(--dim);">Use 'aimodel list' para ver modelos do LM Studio, ou abra a Vessie IA para trocar pela interface.</span>`;
      }
      if (args[0] === 'list') {
        if (!ai) return '<span class="te">Integração de IA (LM Studio) ainda não carregou.</span>';
        // Comandos do terminal só suportam retorno síncrono (ver executeCommand
        // abaixo) — por isso, como o comando 'ping', imprime uma linha
        // imediata e completa o resultado real de forma assíncrona no DOM.
        (async () => {
          const outEl = win.querySelector('#term-out');
          const appendLine = (html) => {
            if (!outEl) return;
            const div = document.createElement('div');
            div.innerHTML = html;
            outEl.appendChild(div);
            outEl.scrollTop = outEl.scrollHeight;
          };
          const online = await ai.checkConnection().catch(() => false);
          if (!online) return appendLine('<span class="te">LM Studio não está acessível agora.</span>');
          const models = await ai.loadModels().catch(() => []);
          if (!models.length) return appendLine('<span style="color:var(--dim);">Nenhum modelo carregado no LM Studio.</span>');
          models.forEach(m => appendLine(`• ${escHtml(m.id)}`));
        })();
        return '<span style="color:var(--dim);">Consultando modelos no LM Studio...</span>';
      }
      return '<span class="te">Uso: aimodel [list]</span>';
    };

    // ---------- FUNÇÃO DE EXECUÇÃO ----------
    function executeCommand(raw) {
      if (!raw) return;
      termState.history.push(raw);
      termState.historyIndex = termState.history.length;
      termState.lastCommand = raw;
      termState.commandCount++;

      // Expande alias
      const firstWord = raw.split(' ')[0];
      if (firstWord in termState.aliases) {
        raw = raw.replace(firstWord, termState.aliases[firstWord]);
      }

      // Suporte a pipe simples (| grep)
      let parts = raw.split('|').map(s => s.trim());
      let output = '';
      let currentData = '';

      for (let i = 0; i < parts.length; i++) {
        const cmdParts = parts[i].split(' ');
        const cmd = cmdParts[0];
        const args = cmdParts.slice(1);

        if (i === 0) {
          // Comando principal
          if (cmd in CMDS) {
            const result = CMDS[cmd](args);
            if (typeof result === 'string') {
              currentData = result;
            }
          } else {
            output = `<span class="te">'${cmd}' não é reconhecido. Digite 'help'.</span>`;
            break;
          }
        } else {
          // Pipe: processa com grep (simplificado)
          if (cmd === 'grep') {
            const pattern = args[0];
            if (pattern && currentData) {
              const lines = currentData.split('<br>');
              const matched = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
              currentData = matched.join('<br>');
            } else {
              currentData = '';
            }
          } else {
            output = `<span class="te">Pipe com '${cmd}' não suportado.</span>`;
            break;
          }
        }
      }

      if (!output && currentData) output = currentData;
      return output || '';
    }

    // ---------- CONSTRÓI A INTERFACE ----------
    const win = createWin('Terminal', '💻', `
    <div class="term" style="display:flex;flex-direction:column;height:100%;">
      <div class="t-out" id="term-out" style="flex:1;overflow-y:auto;padding:12px 16px;font-family:'Cascadia Code','Consolas',monospace;font-size:13px;line-height:1.6;background:#0c0c0c;color:#cccccc;">
        <div style="color:#f9f1a5;">VessieOS Terminal [v3.0] — Digite <span style="color:#00e676;">help</span> para ver os comandos</div>
        <div style="color:#d4d4d4;">🌸 Bem-vindo, ${S.user || 'Visitante'}! (${new Date().toLocaleString('pt-BR')})</div>
        <div style="color:#5b6680;font-size:.75rem;">💡 Dica: Use Tab para autocompletar, ↑/↓ para histórico</div>
        <div style="color:#5b6680;font-size:.75rem;">✨ Novo: <span style="color:#c4a8ff;">vessie -e "print(1+2)"</span> roda VessieScript de verdade (comandos reais + kernel real)</div>
      </div>
      <div class="t-bar" style="display:flex;align-items:center;padding:6px 14px;background:#0c0c0c;border-top:1px solid #1f1f1f;">
        <span class="t-prompt" id="t-prompt" style="color:#16c60c;font-weight:600;font-family:'Cascadia Code',monospace;white-space:nowrap;">${S.user || 'visitante'}@vessieos:~$</span>
        <input class="t-inp" id="t-inp" placeholder="Digite um comando..." autocomplete="off" spellcheck="false" style="flex:1;background:transparent;border:none;color:#cccccc;font-family:'Cascadia Code',monospace;font-size:13px;outline:none;padding:6px 8px;">
      </div>
    </div>
  `, 760, 520);

    const out = win.querySelector('#term-out');
    const inp = win.querySelector('#t-inp');
    const prompt = win.querySelector('#t-prompt');

    // ---------- ATUALIZA PROMPT ----------
    function updatePrompt() {
      if (prompt) {
        const path = termState.currentPath === 'Desktop' ? '~' : termState.currentPath;
        const user = termState.isRoot ? `<span style="color:#ef4444;">root</span>` : termState.user;
        prompt.innerHTML = `${user}@${termState.host}:<span style="color:#3a96dd;">${path}</span>$ `;
      }
    }
    updatePrompt();

    // ---------- AUTO-COMPLETAR ----------
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const val = this.value;
        if (!val) return;
        // Completa comando ou nome de arquivo
        const parts = val.split(' ');
        const last = parts[parts.length - 1];
        const cmds = Object.keys(CMDS).concat(Object.keys(termState.aliases));
        const matches = cmds.filter(c => c.startsWith(last));
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          this.value = parts.join(' ') + ' ';
          return;
        }
        if (matches.length > 1) {
          // Mostra sugestões
          append(`<span style="color:#5b6680;">${matches.join('  ')}</span>`);
          return;
        }
        // Tenta completar arquivo
        const files = listFiles(termState.currentPath);
        const fileMatches = files.filter(f => f.name.startsWith(last));
        if (fileMatches.length === 1) {
          parts[parts.length - 1] = fileMatches[0].name + (fileMatches[0].isDir ? '/' : '');
          this.value = parts.join(' ');
        } else if (fileMatches.length > 1) {
          append(`<span style="color:#5b6680;">${fileMatches.map(f => f.name).join('  ')}</span>`);
        }
      }

      // Histórico (↑ e ↓)
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (termState.historyIndex > 0) {
          termState.historyIndex--;
          this.value = termState.history[termState.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (termState.historyIndex < termState.history.length - 1) {
          termState.historyIndex++;
          this.value = termState.history[termState.historyIndex] || '';
        } else {
          termState.historyIndex = termState.history.length;
          this.value = '';
        }
      }

      // Ctrl+C (interromper)
      if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        if (termState.editorMode) {
          // Sai do editor
          termState.editorMode = false;
          updatePrompt();
          this.value = '';
          this.placeholder = 'Digite um comando...';
          append('<span style="color:#f87171;">^C</span>');
          return;
        }
        append('<span style="color:#f87171;">^C</span>');
        this.value = '';
      }

      // !! (repetir último comando)
      if (e.key === '!' && this.value === '!!') {
        e.preventDefault();
        if (termState.history.length) {
          this.value = termState.history[termState.history.length - 1];
          this.selectionStart = this.selectionEnd = this.value.length;
        }
      }
    });

    // ---------- FUNÇÃO APPEND (output) ----------
    function append(text, cls = '') {
      const div = document.createElement('div');
      div.className = cls;
      div.innerHTML = text;
      out.appendChild(div);
      out.scrollTop = out.scrollHeight;
    }

    // ---------- PROCESSAMENTO DE ENTRADA ----------
    inp.addEventListener('keypress', function (e) {
      if (e.key !== 'Enter') return;
      const raw = this.value.trim();
      if (!raw) return;

      // Se estiver no modo editor, apenas adiciona nova linha
      if (termState.editorMode) {
        // O editor já manipula o Enter via keydown, mas prevenimos duplicidade
        return;
      }

      // Exibe o comando digitado
      const promptText = prompt ? prompt.textContent : '';
      append(`<span style="color:#3a96dd;">${promptText}</span><span style="color:#cccccc;">${escHtml(raw)}</span>`);

      // Executa
      let output = executeCommand(raw);

      if (output) {
        // Redirecionamento para arquivo (>)
        const redirectMatch = raw.match(/\s*>\s*([^\s]+)$/);
        if (redirectMatch) {
          const filename = redirectMatch[1];
          const path = resolvePath(filename);
          const node = getNode(termState.currentPath);
          if (node && typeof node === 'object') {
            node[filename] = output.replace(/<[^>]*>/g, ''); // Remove HTML
            persistState();
            append(`<span style="color:#4ade80;">✅ '${filename}' salvo.</span>`);
          }
        } else {
          // Exibe output com suporte a HTML
          append(output);
        }
      }

      // Comandos especiais (sleep, yes, ping) que precisam de tratamento especial
      const cmd = raw.split(' ')[0];
      if (cmd === 'sleep') {
        const secs = parseInt(raw.split(' ')[1]);
        if (!isNaN(secs) && secs > 0) {
          append(`<span style="color:var(--dim);">⏳ Aguardando ${secs}s...</span>`);
          setTimeout(() => {
            append(`<span style="color:#4ade80;">✅ ${secs}s concluídos.</span>`);
          }, secs * 1000);
        }
      }

      this.value = '';
    });

    // ---------- FOCUS ----------
    win.addEventListener('click', () => inp.focus());

    // ---------- LIMPEZA ----------
    win.addEventListener('remove', () => {
      // Remove referências
    });

    return win;
  }

  // ============================================================
  //  SETTINGS
  // ============================================================
  function openSettings() {
    return createWin('Configurações', '⚙️', `
    <div class="sett">
      <div class="s-sec">
        <h3><i class="fas fa-image"></i> Papel de Parede</h3>
        <div id="wall-tabs">${getWallpaperTabs().map((tab, i) => `<button class="wall-tab ${i === 0 ? 'active' : ''}" onclick="renderWallPanel('${tab}')">${tab}</button>`).join('')}</div>
        <div style="margin:8px 0 12px;color:var(--dim);font-size:.78rem">Wallpapers pré-definidos (${ensureWallpapers(S.wallpapers || WALLS).length}). Clique em um cartão para aplicar. Ou use uma URL personalizada abaixo.</div>
        <div class="wg" id="wall-grid"></div>
        <div class="wall-preview" id="wall-preview">
          <div class="wall-preview-empty">Selecione um wallpaper para visualizar aqui. O VessieOS agora suporta GIF, WebP, MP4 e até iframes como fundo.</div>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
          <input id="custom-wall" placeholder="URL personalizada..." style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:white;outline:none;font-size:.83rem" oninput="previewWall(this.value)">
          <button onclick="applyWall(document.getElementById('custom-wall').value,null)" style="background:var(--a);border:none;color:white;padding:8px 16px;border-radius:8px;font-size:.83rem;cursor:pointer">Aplicar</button>
        </div>
      </div>
      <div class="s-sec">
        <h3><i class="fas fa-robot"></i> IA Vessie</h3>
        <div class="s-row" style="flex-direction:column;align-items:flex-start;gap:10px;padding-top:8px">
          <div style="display:flex;gap:8px;width:100%;flex-wrap:wrap">
            <label style="flex:1;display:flex;flex-direction:column;gap:6px;color:var(--text)"><span>Provedor IA</span><input readonly value="LM Studio" style="background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:10px 12px;font-size:.86rem"></label>
            <label style="flex:1;display:flex;flex-direction:column;gap:6px;color:var(--text)"><span>Modelo</span><input id="settings-ai-model" placeholder="Modelo LM Studio" type="text" style="background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:8px;color:white;padding:10px 12px;font-size:.86rem"></label>
          </div>
          <label style="display:flex;flex-direction:column;gap:6px;color:var(--text)"><span>Endpoint</span><input id="settings-ai-endpoint" placeholder="Endpoint padrão (opcional)" type="text" style="background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:8px;color:white;padding:10px 12px;font-size:.86rem"></label>
          <label style="display:flex;flex-direction:column;gap:6px;color:var(--text)"><span>Endpoint customizado</span><input id="settings-ai-custom-endpoint" placeholder="Endpoint customizado para provedores não licenciados" type="text" style="background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:8px;color:white;padding:10px 12px;font-size:.86rem"></label>
          <label style="display:flex;flex-direction:column;gap:6px;color:var(--text)"><span>API Key</span><input id="settings-ai-key" placeholder="Sua API Key" type="password" style="background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:8px;color:white;padding:10px 12px;font-size:.86rem"></label>
          <button onclick="saveAIConfig()" class="ia-save-button" style="margin-top:4px">Salvar configuração de IA</button>
          <div style="color:var(--dim);font-size:.8rem;line-height:1.4">Configurações de IA agora podem ser gerenciadas diretamente nas configurações do sistema. O VessieOS usa apenas LM Studio para edição e geração.</div>
        </div>
      </div>
      <div class="s-sec">
        <h3><i class="fas fa-palette"></i> Temas do Sistema</h3>
        <div class="theme-grid">
          ${[
        ['Win11 Blue', '#60a5fa', '#a78bfa', '#3b82f6'],
        ['Win11 Light', '#0078d4', '#005a9e', '#106ebe'],
        ['macOS Sonoma', '#0a84ff', '#bf5af2', '#5e5ce6'],
        ['macOS Graphite', '#8e8e93', '#aeaeb2', '#636366'],
        ['Ubuntu Yaru', '#e95420', '#f4a261', '#77216f'],
        ['Fedora Blue', '#3c6eb4', '#79b8ff', '#2b5797'],
        ['Pop!_OS Teal', '#48b9c7', '#5fdde5', '#1a8a98'],
        ['Linux Mint', '#87cf3e', '#b8e986', '#5a9a2a'],
        ['Dracula', '#bd93f9', '#ff79c6', '#8be9fd'],
        ['Nord', '#88c0d0', '#81a1c1', '#5e81ac'],
        ['Tokyo Night', '#7aa2f7', '#bb9af7', '#7dcfff'],
        ['Catppuccin', '#cba6f7', '#f5c2e7', '#89b4fa'],
        ['Synthwave', '#ff007c', '#00f5d4', '#fee440'],
        ['Solarized', '#268bd2', '#2aa198', '#b58900'],
        ['Gruvbox', '#fabd2f', '#fe8019', '#b8bb26'],
        ['VessieOS', '#a78bfa', '#f0abfc', '#60a5fa']
      ].map(([n, c1, c2, c3]) => `<div class="theme-card" title="${n}" onclick="applyTheme('${n}','${c1}','${c2}','${c3}',this)"><div class="tc-pre" style="background:linear-gradient(135deg,${c1},${c2} 60%,${c3})"></div><span>${n}</span></div>`).join('')}
        </div>
      </div>
      <div class="s-sec">
        <h3><i class="fas fa-sliders-h"></i> Preferências</h3>
        <div class="s-row"><label><i class="fas fa-moon"></i> Modo Escuro</label><label class="tog"><input type="checkbox" checked onchange="toggleDark(this)"><span class="sl"></span></label></div>
        <div class="s-row"><label><i class="fas fa-bell"></i> Notificações</label><label class="tog"><input type="checkbox" checked><span class="sl"></span></label></div>
        <div class="s-row"><label><i class="fas fa-magic"></i> Animações</label><label class="tog"><input type="checkbox" checked><span class="sl"></span></label></div>
        <div class="s-row"><label><i class="fas fa-volume-up"></i> Sons do Sistema</label><label class="tog"><input type="checkbox" ${S.sounds ? 'checked' : ''} onchange="S.sounds=this.checked;persistState();toast('Sons '+(this.checked?'ativados':'desativados'),'success')"><span class="sl"></span></label></div>
        <div class="s-row"><label><i class="fas fa-droplet"></i> Cor Adaptativa (baseada nas janelas abertas)</label><label class="tog"><input type="checkbox" ${window.VessieAdaptiveColor?.isEnabled() ? 'checked' : ''} onchange="this.checked ? window.VessieAdaptiveColor.enable() : window.VessieAdaptiveColor.disable()"><span class="sl"></span></label></div>
        <div class="s-row"><label><i class="fas fa-image"></i> Ícone personalizado</label><input id="icon-url" value="${S.iconImageUrl || ''}" placeholder="URL de imagem" style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:white;outline:none;font-size:.83rem"></div>
        <div class="s-row"><label><i class="fas fa-expand-arrows-alt"></i> Tamanho dos ícones</label><select id="icon-size" onchange="applyDesktopIconSize(this.value)" style="background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:white"><option value="small" ${S.desktopIconSize === 'small' ? 'selected' : ''}>Pequeno</option><option value="medium" ${S.desktopIconSize === 'medium' ? 'selected' : ''}>Médio</option><option value="large" ${S.desktopIconSize === 'large' ? 'selected' : ''}>Grande</option></select></div>
        <div class="s-row"><label><i class="fas fa-file-export"></i> Exportar/VOS</label><div style="display:flex;gap:8px"><button onclick="window.exportVessieData()" style="background:rgba(255,255,255,.06);border:1px solid var(--border);color:white;padding:8px 10px;border-radius:8px;cursor:pointer">Exportar</button><label style="background:rgba(255,255,255,.06);border:1px solid var(--border);color:white;padding:8px 10px;border-radius:8px;cursor:pointer">Importar<input type="file" accept="application/json" onchange="window.importVessieData(this.files[0])" style="display:none"></label></div></div>
      </div>
      <div class="s-sec">
        <h3><i class="fas fa-info-circle"></i> Sobre o VessieOS</h3>
        <div style="background:rgba(255,255,255,.04);border-radius:12px;padding:16px;color:var(--dim);font-size:.85rem;line-height:1.8">
          <strong style="color:white">VessieOS v3.0</strong><br>
          Simulador Windows 11 Ultra com IA Integrada<br>
          Usuário: <span style="color:var(--a)">${S.user}</span><br>
          Build: 26100.3915 · 21/05/2026<br>
          <button onclick="location.reload()" style="margin-top:12px;background:rgba(244,67,54,.15);border:none;color:#f44336;padding:6px 16px;border-radius:8px;font-size:.82rem;cursor:pointer"><i class="fas fa-power-off"></i> Reiniciar Sistema</button>
        </div>
      </div>
    </div>
  `, 640, 560);
    setTimeout(() => {
      renderWallPanel('Todos');
      previewWall(S.wallpaper);
      updateAIInputs();
    }, 50);
    return win;
  }

  function getWallCategory(w) {
    const rawCat = String(w?.c || '').trim();
    if (rawCat) {
      const key = rawCat.toLowerCase();
      if (key.includes('tech') || key.includes('neon') || key.includes('city') || key.includes('cyber') || key.includes('digital') || key.includes('grid')) return 'Tech';
      if (key.includes('space') || key.includes('galaxy') || key.includes('aurora') || key.includes('desert') || key.includes('cosmic') || key.includes('solar') || key.includes('polar')) return 'Futurista';
      if (key.includes('nature') || key.includes('forest') || key.includes('water') || key.includes('river') || key.includes('mountain') || key.includes('flora') || key.includes('cloud')) return 'Natureza';
      return rawCat;
    }
    const t = (w?.n || '').toLowerCase();
    if (t.includes('tech') || t.includes('neon') || t.includes('city') || t.includes('cyber') || t.includes('digital') || t.includes('grid')) return 'Tech';
    if (t.includes('space') || t.includes('galaxy') || t.includes('aurora') || t.includes('desert') || t.includes('cosmic') || t.includes('solar') || t.includes('polar')) return 'Futurista';
    return 'Natureza';
  }
  function getWallpaperTabs() {
    const all = ensureWallpapers(S.wallpapers || WALLS).map(w => getWallCategory(w)).filter((v, i, a) => v && a.indexOf(v) === i);
    const base = ['Todos', 'Natureza', 'Tech', 'Futurista'];
    const others = all.filter(cat => !base.includes(cat));
    return [...base, ...others];
  }

  function renderWallPanel(category) {
    const grid = document.getElementById('wall-grid');
    if (!grid) return;
    const walls = ensureWallpapers(S.wallpapers || WALLS).filter(w => category === 'Todos' || getWallCategory(w) === category);
    grid.innerHTML = walls.map(w => `<div class="wt ${S.wallpaper === w.u ? 'ac' : ''}" onclick="applyWall('${w.u}',this)" title="${w.n}">
    <div class="wt-preview" data-src="${w.u}"></div>
    <div class="wt-name">${w.n}</div>
    <div class="wt-cat">${w.c || getWallCategory(w)}</div>
  </div>`).join('');
    document.querySelectorAll('.wall-tab').forEach(btn => btn.classList.toggle('active', btn.textContent === category));
    setTimeout(() => {
      document.querySelectorAll('.wt-preview').forEach(item => {
        const src = item.dataset.src;
        if (!src) return;
        item.style.backgroundImage = 'none';
        if (src.match(/\.(gif|webp|jpe?g|png)(\?.*)?$/i)) {
          const img = document.createElement('img'); img.src = src; img.alt = 'Wallpaper preview'; img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover'; item.appendChild(img);
        } else if (src.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
          const vid = document.createElement('video'); vid.src = src; vid.autoplay = true; vid.muted = true; vid.loop = true; vid.playsInline = true; vid.style.width = '100%'; vid.style.height = '100%'; vid.style.objectFit = 'cover'; item.appendChild(vid);
        } else if (src.startsWith('http://') || src.startsWith('https://')) {
          const iframe = document.createElement('iframe'); iframe.src = src; iframe.sandbox = 'allow-same-origin allow-scripts allow-popups'; iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.border = 'none'; item.appendChild(iframe);
        } else {
          item.style.backgroundImage = `url('${src}')`;
        }
      });
    }, 10);
  }

  window.previewWall = function (url) {
    const preview = document.getElementById('wall-preview');
    if (!preview) return;
    preview.innerHTML = '';
    if (!url) {
      preview.innerHTML = '<div class="wall-preview-empty">Digite ou cole uma URL de imagem, GIF, WebP, MP4 ou iframe para ver a prévia aqui.</div>';
      return;
    }
    const lower = url.toLowerCase();
    let media = '';
    if (lower.match(/\.(mp4|webm|ogg)(\?.*)?$/)) {
      media = `<video autoplay muted loop playsinline src="${url}"></video>`;
    } else if (lower.match(/\.(gif|webp|jpe?g|png)(\?.*)?$/)) {
      media = `<img src="${url}" alt="Preview de wallpaper">`;
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      const safe = SandboxManager.safeUrl(url);
      media = `<iframe src="${safe}" allow="autoplay; fullscreen" sandbox="allow-same-origin allow-scripts allow-popups" title="Wallpaper iframe" style="width:100%;height:100%;border:none"></iframe>`;
    } else {
      media = '<div class="wall-preview-empty">URL não reconhecida. Use GIF, WebP, JPG, PNG, MP4, WebM ou um link de iframe.</div>';
    }
    preview.innerHTML = `<div class="wall-preview-inner">${media}</div><div class="wp-info"><span>Prévia de Wallpaper</span><span>${url}</span></div>`;
  }

  window.applyWall = function (url, el) {
    if (!url) return;
    setWall(url);
    document.querySelectorAll('.wt').forEach(w => w.classList.remove('ac'));
    if (el) el.classList.add('ac');
    persistState();
    previewWall(url);
    toast('Papel de parede aplicado! 🖼️', 'success');
  };
  window.applyAccent = function (color, el) { document.documentElement.style.setProperty('--a', color); document.querySelectorAll('.clr-swatch').forEach(s => s.classList.remove('ac')); if (el) el.classList.add('ac'); toast('Cor aplicada! 🎨', 'success'); };
  window.applyTheme = function (name, c1, c2, c3, el) { window.VessieAdaptiveColor?.disable(); const r = document.documentElement.style; r.setProperty('--a', c1); r.setProperty('--a2', c2); r.setProperty('--a3', c3 || c1); const hex = c1.replace('#', ''); const R = parseInt(hex.substr(0, 2), 16), G = parseInt(hex.substr(2, 2), 16), B = parseInt(hex.substr(4, 2), 16); r.setProperty('--acc-glow', `rgba(${R},${G},${B},.42)`); document.querySelectorAll('.theme-card').forEach(s => s.classList.remove('ac')); if (el) el.classList.add('ac'); try { localStorage.setItem('vos-theme', JSON.stringify({ name, c1, c2, c3 })); } catch (_) { } toast('Tema ' + name + ' aplicado ✨', 'success'); };
  (function () { try { const t = JSON.parse(localStorage.getItem('vos-theme') || 'null'); if (t) applyTheme(t.name, t.c1, t.c2, t.c3, null); } catch (_) { } })();
  window.toggleDark = function (inp) { document.body.style.filter = inp.checked ? '' : 'invert(1) hue-rotate(180deg)'; };

  // ============================================================
  //  MUSIC PLAYER
  // ============================================================
  function openMusic() {
    // Inicializa variáveis globais se não existirem
    if (typeof S.musTrack === 'undefined') S.musTrack = 0;
    if (typeof S.musPlaying === 'undefined') S.musPlaying = false;
    if (typeof S.musProg === 'undefined') S.musProg = 0;
    if (typeof S.volume === 'undefined') S.volume = 70;

    const win = createWin('Music Player', '🎵', `
    <div class="mplayer">
      <div class="mc-cover" id="mc-cover">🎵</div>
      <audio id="mc-audio" preload="metadata"></audio>
      <div><div class="mc-title" id="mc-title">${TRACKS[0].t}</div><div class="mc-art" id="mc-art">${TRACKS[0].a}</div></div>
      <div class="mc-prog">
        <div class="mc-prog-bar" id="mc-prog-bar" onclick="seekTrack(event,this)"><div class="mc-prog-fill" id="mc-fill" style="width:0%"></div></div>
      </div>
      <div class="mc-time"><span id="mc-cur">0:00</span><span id="mc-dur">${fmtTime(TRACKS[0].dur)}</span></div>
      <div class="mc-ctrl">
        <button onclick="mcPrev()"><i class="fas fa-step-backward"></i></button>
        <button onclick="mcShuffle()"><i class="fas fa-random"></i></button>
        <button class="mc-play" id="mc-play" onclick="mcToggle()"><i class="fas fa-play" id="mc-play-ico"></i></button>
        <button onclick="mcRepeat()" id="mc-repeat-btn"><i class="fas fa-redo"></i></button>
        <button onclick="mcNext()"><i class="fas fa-step-forward"></i></button>
      </div>
      <div class="mc-vol">
        <i class="fas fa-volume-down" style="color:var(--dim)"></i>
        <input type="range" id="mc-vol-slider" min="0" max="100" value="${S.volume}" oninput="S.volume=this.value;document.getElementById('mc-audio').volume=this.value/100">
        <i class="fas fa-volume-up" style="color:var(--dim)"></i>
      </div>
      <div class="mc-tracklist">${TRACKS.map((t, i) => `<div class="mc-track ${i === S.musTrack ? 'active' : ''}" onclick="S.musTrack=${i};S.musProg=0;updateMusicUI();if(S.musPlaying)playCurrentTrack();">${t.t} <span>${t.a}</span></div>`).join('')}</div>
    </div>
  `, 390, 560);

    // ---------- CONFIGURA O ÁUDIO ----------
    const audio = document.getElementById('mc-audio');
    if (audio) {
      // Atualiza a barra de progresso em tempo real
      audio.addEventListener('timeupdate', function () {
        if (this.duration && !isNaN(this.duration) && this.duration > 0) {
          const pct = (this.currentTime / this.duration) * 100;
          const fill = document.getElementById('mc-fill');
          if (fill) fill.style.width = Math.min(100, pct) + '%';
          const cur = document.getElementById('mc-cur');
          if (cur) cur.textContent = fmtTime(this.currentTime);
          S.musProg = this.currentTime;
        }
      });

      // Quando a música termina
      audio.addEventListener('ended', function () {
        const repeatBtn = document.getElementById('mc-repeat-btn');
        const isRepeat = repeatBtn && repeatBtn.dataset.repeat === 'true';
        if (isRepeat) {
          this.currentTime = 0;
          this.play().catch(() => { });
          return;
        }
        // Avança para a próxima faixa
        mcNext();
      });

      // Carrega a faixa atual
      const tr = TRACKS[S.musTrack];
      if (tr && tr.src) {
        audio.src = tr.src;
        audio.volume = (S.volume || 70) / 100;
        if (S.musPlaying) {
          audio.play().catch(() => { });
        }
      }
    }

    updateMusicUI();
    if (S.musPlaying) playCurrentTrack();
    return win;
  }

  // ---------- FUNÇÕES AUXILIARES ----------
  function fmtTime(s) {
    if (!s || isNaN(s) || s < 0) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  function playCurrentTrack() {
    const audio = document.getElementById('mc-audio');
    const tr = TRACKS[S.musTrack];
    if (!audio || !tr?.src) {
      S.musPlaying = false;
      updateMusicUI();
      return;
    }
    // Se a fonte mudou, recarrega
    if (audio.src !== tr.src) {
      audio.src = tr.src;
      audio.load();
    }
    audio.volume = (S.volume || 70) / 100;
    audio.currentTime = S.musProg || 0;
    audio.play().catch(() => {
      S.musPlaying = false;
      updateMusicUI();
    });
    updateMusicUI();
  }

  window.mcToggle = function () {
    const audio = document.getElementById('mc-audio');
    if (!audio) return;

    S.musPlaying = !S.musPlaying;
    const ico = document.getElementById('mc-play-ico');
    const cover = document.getElementById('mc-cover');

    if (ico) ico.className = `fas fa-${S.musPlaying ? 'pause' : 'play'}`;
    if (cover) cover.classList.toggle('playing', S.musPlaying);

    if (S.musPlaying) {
      playCurrentTrack();
    } else {
      audio.pause();
    }
    updateMusicUI();
  };

  window.mcNext = function () {
    S.musTrack = (S.musTrack + 1) % TRACKS.length;
    S.musProg = 0;
    S.musPlaying = true;
    playCurrentTrack();
    updateMusicUI();
  };

  window.mcPrev = function () {
    const audio = document.getElementById('mc-audio');
    // Se passou mais de 3 segundos, volta ao início
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      S.musProg = 0;
      updateMusicUI();
      return;
    }
    S.musTrack = (S.musTrack - 1 + TRACKS.length) % TRACKS.length;
    S.musProg = 0;
    S.musPlaying = true;
    playCurrentTrack();
    updateMusicUI();
  };

  window.mcShuffle = function () {
    S.musTrack = Math.floor(Math.random() * TRACKS.length);
    S.musProg = 0;
    S.musPlaying = true;
    playCurrentTrack();
    updateMusicUI();
    toast('🎵 Faixa aleatória ativada!', 'default');
  };

  window.mcRepeat = function () {
    const btn = document.getElementById('mc-repeat-btn');
    if (!btn) return;
    const isRepeat = btn.dataset.repeat === 'true';
    btn.dataset.repeat = isRepeat ? 'false' : 'true';
    btn.style.color = isRepeat ? 'var(--dim)' : 'var(--a)';
    btn.style.background = isRepeat ? 'transparent' : 'rgba(96,165,250,.15)';
    toast(isRepeat ? '🔁 Repetição desativada' : '🔁 Repetição ativada', 'default');
  };

  window.seekTrack = function (e, bar) {
    const audio = document.getElementById('mc-audio');
    if (!audio || !bar) return;
    const rect = bar.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const pct = x / rect.width;
    const track = TRACKS[S.musTrack];
    if (!track) return;
    const time = pct * track.dur;
    S.musProg = time;
    if (audio) {
      audio.currentTime = time;
    }
    const fill = document.getElementById('mc-fill');
    if (fill) fill.style.width = (pct * 100) + '%';
    const cur = document.getElementById('mc-cur');
    if (cur) cur.textContent = fmtTime(time);
  };

  function updateMusicUI() {
    const tr = TRACKS[S.musTrack];
    if (!tr) return;

    const t = document.getElementById('mc-title');
    const a = document.getElementById('mc-art');
    const d = document.getElementById('mc-dur');
    const ico = document.getElementById('mc-play-ico');
    const cover = document.getElementById('mc-cover');
    const fill = document.getElementById('mc-fill');
    const cur = document.getElementById('mc-cur');
    const audio = document.getElementById('mc-audio');

    if (t) t.textContent = tr.t;
    if (a) a.textContent = tr.a;
    if (d) d.textContent = fmtTime(tr.dur);

    document.querySelectorAll('.mc-track').forEach((el, i) => {
      el.classList.toggle('active', i === S.musTrack);
    });

    if (ico) ico.className = `fas fa-${S.musPlaying ? 'pause' : 'play'}`;
    if (cover) cover.classList.toggle('playing', S.musPlaying);

    // Atualiza progresso
    if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
      const pct = (audio.currentTime / audio.duration) * 100;
      if (fill) fill.style.width = Math.min(100, pct) + '%';
      if (cur) cur.textContent = fmtTime(audio.currentTime);
    } else if (tr.dur) {
      const pct = (S.musProg || 0) / tr.dur * 100;
      if (fill) fill.style.width = Math.min(100, pct) + '%';
      if (cur) cur.textContent = fmtTime(S.musProg || 0);
    }

    // Atualiza volume
    const volSlider = document.getElementById('mc-vol-slider');
    if (volSlider) volSlider.value = S.volume || 70;
    if (audio) audio.volume = (S.volume || 70) / 100;
  }

  // ============================================================
  //  CAMERA
  // ============================================================
  function openCamera() {
    return createWin('Câmera', '📷', `
    <div style="display:flex;flex-direction:column;height:100%;align-items:center;justify-content:center;background:#050508;gap:16px;padding:20px">
      <video id="cam-video" autoplay playsinline style="border-radius:14px;max-width:100%;max-height:340px;background:#1a1a2a"></video>
      <div style="display:flex;gap:12px">
        <button onclick="startCam()" style="background:var(--a);border:none;color:white;padding:10px 20px;border-radius:30px;cursor:pointer"><i class="fas fa-camera"></i> Ligar</button>
        <button onclick="snapPhoto()" style="background:rgba(255,255,255,.1);border:none;color:white;padding:10px 20px;border-radius:30px;cursor:pointer"><i class="fas fa-circle"></i> Foto</button>
        <button onclick="stopCam()" style="background:rgba(244,67,54,.2);border:none;color:#f44336;padding:10px 20px;border-radius:30px;cursor:pointer"><i class="fas fa-stop"></i> Parar</button>
      </div>
      <canvas id="cam-canvas" style="display:none"></canvas>
    </div>
  `, 600, 460);
  }

  let camStream = null;
  window.startCam = async function () { try { camStream = await navigator.mediaDevices.getUserMedia({ video: true }); const v = document.getElementById('cam-video'); if (v) { v.srcObject = camStream; toast('Câmera ligada! 📷', 'success'); } } catch { toast('Câmera não disponível', 'error'); } };
  window.stopCam = function () { if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; } const v = document.getElementById('cam-video'); if (v) v.srcObject = null; };
  window.snapPhoto = function () { const v = document.getElementById('cam-video'); const c = document.getElementById('cam-canvas'); if (!v || !c) return; c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); const a = document.createElement('a'); a.download = 'foto.png'; a.href = c.toDataURL(); a.click(); toast('Foto salva! 📸', 'success'); };

  // ============================================================
  //  CONTEXT MENU
  // ============================================================
  document.getElementById('desktop').addEventListener('contextmenu', e => {
    if (e.target.closest('.win') || e.target.closest('#tb')) return;
    e.preventDefault(); const ctx = document.getElementById('ctx'); ctx.style.display = 'block';
    const x = Math.min(e.clientX, window.innerWidth - 210); const y = Math.min(e.clientY, window.innerHeight - 52 - 280);
    ctx.style.left = x + 'px'; ctx.style.top = y + 'px';
  });
  window.addEventListener('contextmenu', e => { if (!e.target.closest('#desktop') || e.target.closest('.win')) e.preventDefault(); });
  document.addEventListener('click', e => { if (!e.target.closest('#ctx')) document.getElementById('ctx').style.display = 'none'; });
  document.querySelectorAll('.cti[data-act]').forEach(el => {
    el.onclick = () => {
      const act = el.dataset.act; document.getElementById('ctx').style.display = 'none';
      if (act === 'refresh') renderDesktop();
      else if (act === 'newFolder') { const n = prompt('Nome da nova pasta:'); if (n) toast(`Pasta "${n}" criada no desktop! 📁`, 'success'); }
      else if (act === 'personalize') openApp('settings');
      else if (act === 'terminal') openApp('terminal');
      else if (act === 'taskManager') openTaskManager();
      else if (act === 'about') openAbout();
    };
  });

  function openTaskManager() {
    // ---------- ESTADO DOS PROCESSOS ----------
    const processList = [
      { id: 'vessieos', name: 'vessieos.exe', cpu: 2.1, mem: 128, status: 'Ativo', color: '#4caf50', icon: 'fa-windows' },
      { id: 'browser', name: 'browser.exe', cpu: 12.4, mem: 512, status: 'Ativo', color: '#4caf50', icon: 'fa-globe' },
      { id: 'dashboard', name: 'dashboard.exe', cpu: 0.8, mem: 64, status: 'Ativo', color: '#4caf50', icon: 'fa-chart-line' },
      { id: 'games', name: 'games.exe', cpu: 18.2, mem: 256, status: 'Ativo', color: '#4caf50', icon: 'fa-gamepad' },
      { id: 'terminal', name: 'terminal.exe', cpu: 0.1, mem: 32, status: 'Ativo', color: '#4caf50', icon: 'fa-terminal' },
      { id: 'music', name: 'music.exe', cpu: 1.2, mem: 48, status: 'Ativo', color: '#4caf50', icon: 'fa-music' },
      { id: 'discord', name: 'discord.exe', cpu: 3.5, mem: 180, status: 'Ativo', color: '#4caf50', icon: 'fa-comment' },
      { id: 'steam', name: 'steam.exe', cpu: 0.5, mem: 96, status: 'Ativo', color: '#4caf50', icon: 'fa-steam' },
      { id: 'nvidia', name: 'nvidia-settings.exe', cpu: 0.3, mem: 24, status: 'Ativo', color: '#4caf50', icon: 'fa-microchip' },
    ];

    let runningProcesses = processList.map(p => ({ ...p }));
    // Se um processo foi marcado como travado (ex: BSOD do Vessie Overclock)
    // antes deste Gerenciador de Tarefas ser aberto, reflete isso já na abertura.
    try {
      const crashed = JSON.parse(localStorage.getItem('vsys_crashed_processes') || '[]');
      runningProcesses.forEach(p => { if (crashed.includes(p.id)) { p.status = 'Falha'; p.cpu = 0; } });
    } catch (e) { }

    // ---------- FUNÇÕES AUXILIARES ----------
    function getRandomCPU() {
      return (0.5 + Math.random() * 25).toFixed(1);
    }

    function getRandomMem() {
      return Math.floor(20 + Math.random() * 500);
    }

    function updateProcesses() {
      runningProcesses.forEach(p => {
        if (p.id !== 'vessieos' || p.status === 'Ativo') {
          p.cpu = parseFloat(getRandomCPU());
          p.mem = getRandomMem();
        }
      });
      renderProcesses();
      updateSystemStats();
    }

    // ---------- RENDERIZA TABELA ----------
    function renderProcesses() {
      const tbody = document.getElementById('taskmgr-tbody');
      if (!tbody) return;
      tbody.innerHTML = runningProcesses.map(p => `
      <tr data-proc-id="${p.id}" style="border-bottom:1px solid rgba(255,255,255,.04);${p.status === 'Inativo' ? 'opacity:0.4;' : ''}">
        <td style="padding:9px 12px;display:flex;align-items:center;gap:8px;">
          <i class="fas ${p.icon}" style="color:${p.status === 'Ativo' ? 'var(--a)' : '#5b6680'};width:16px;"></i>
          ${p.name}
        </td>
        <td style="padding:9px 12px;text-align:center;">${p.cpu}%</td>
        <td style="padding:9px 12px;text-align:center;">${p.mem} MB</td>
        <td style="padding:9px 12px;text-align:center;">
          <span style="color:${p.status === 'Ativo' ? '#4caf50' : p.status === 'Falha' ? '#ef4444' : '#f44336'};font-size:.75rem;">●</span>
          ${p.status}
        </td>
        <td style="padding:9px 12px;text-align:center;">
          ${p.status === 'Ativo' ? `<button onclick="endProcess('${p.id}')" style="background:rgba(244,67,54,.15);border:none;color:#f44336;padding:4px 12px;border-radius:6px;font-size:.7rem;cursor:pointer;transition:.14s;" onmouseover="this.style.background='rgba(244,67,54,.25)'" onmouseout="this.style.background='rgba(244,67,54,.15)'"><i class="fas fa-times"></i> Finalizar</button>` : `<span style="color:${p.status === 'Falha' ? '#ef4444' : '#5b6680'};font-size:.7rem;">${p.status === 'Falha' ? 'Travado' : 'Finalizado'}</span>`}
        </td>
      </tr>
    `).join('');
    }

    // ---------- ESTATÍSTICAS DO SISTEMA ----------
    function updateSystemStats() {
      const cpuEl = document.getElementById('taskmgr-cpu');
      const ramEl = document.getElementById('taskmgr-ram');
      const diskEl = document.getElementById('taskmgr-disk');
      const procCount = document.getElementById('taskmgr-proc-count');
      if (cpuEl) cpuEl.textContent = (5 + Math.random() * 20).toFixed(1) + '%';
      if (ramEl) ramEl.textContent = (30 + Math.random() * 25).toFixed(0) + '%';
      if (diskEl) diskEl.textContent = (2 + Math.random() * 8).toFixed(1) + '%';
      if (procCount) procCount.textContent = runningProcesses.filter(p => p.status === 'Ativo').length;
    }

    // ---------- FINALIZAR PROCESSO ----------
    window.endProcess = function (id) {
      const process = runningProcesses.find(p => p.id === id);
      if (!process || process.status === 'Inativo') return;

      // Se for o VessieOS, tela azul
      if (id === 'vessieos') {
        showBlueScreen();
        return;
      }

      // Finaliza normalmente
      process.status = 'Inativo';
      process.cpu = 0;
      process.mem = 0;
      toast(`❌ Processo "${process.name}" finalizado`, 'error');
      renderProcesses();
      updateSystemStats();
    };

    // ---------- TELA AZUL ----------
    function showBlueScreen() {
      // Remove a janela do gerenciador
      const win = document.querySelector('.win[data-app="taskmanager"]');
      if (win) win.remove();

      // Cria overlay da tela azul
      const overlay = document.createElement('div');
      overlay.id = 'bsod-overlay';
      overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: #0a4b8a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', 'Consolas', monospace;
      color: #fff;
      padding: 40px;
      animation: bsodFade .5s ease;
    `;

      // Estilo da animação
      const style = document.createElement('style');
      style.textContent = `
      @keyframes bsodFade {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes bsodBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .bsod-icon { font-size: 4rem; margin-bottom: 20px; }
      .bsod-title { font-size: 2.2rem; font-weight: 700; margin-bottom: 10px; }
      .bsod-sub { font-size: 1.2rem; color: #aad4ff; margin-bottom: 20px; }
      .bsod-error { font-size: 1rem; color: #ffd700; background: rgba(0,0,0,.3); padding: 10px 20px; border-radius: 8px; margin-bottom: 20px; font-family: 'Consolas', monospace; }
      .bsod-details { font-size: .85rem; color: #b8d8ff; max-width: 600px; text-align: center; line-height: 1.6; }
      .bsod-progress { width: 300px; height: 4px; background: rgba(255,255,255,.2); border-radius: 2px; margin: 20px 0; overflow: hidden; }
      .bsod-progress-bar { height: 100%; width: 0%; background: #fff; border-radius: 2px; animation: bsodProgress 5s linear forwards; }
      @keyframes bsodProgress {
        0% { width: 0%; }
        20% { width: 15%; }
        50% { width: 45%; }
        80% { width: 78%; }
        100% { width: 100%; }
      }
      .bsod-cursor { animation: bsodBlink 1s step-end infinite; }
    `;
      document.head.appendChild(style);

      overlay.innerHTML = `
      <div class="bsod-icon">💀</div>
      <div class="bsod-title">😵 TELA AZUL DA MORTE</div>
      <div class="bsod-sub">O VessieOS encontrou um problema crítico</div>
      <div class="bsod-error">STOP CODE: VESSIEOS_CRASH_0x0000001A</div>
      <div class="bsod-details">
        O processo <b>vessieos.exe</b> foi finalizado pelo Gerenciador de Tarefas.<br>
        O sistema precisa ser reiniciado para se recuperar.
        <br><br>
        <span style="color:#ffd700;">Dump de memória: 98% concluído</span>
      </div>
      <div class="bsod-progress"><div class="bsod-progress-bar"></div></div>
      <div style="font-size:.8rem;color:#8ab8e0;margin-top:10px;">
        O sistema será reiniciado em <span id="bsod-countdown">10</span> segundos...
        <span class="bsod-cursor">█</span>
      </div>
    `;

      document.body.appendChild(overlay);

      // Contagem regressiva e reinicialização
      let seconds = 10;
      const countdownEl = document.getElementById('bsod-countdown');
      const interval = setInterval(() => {
        seconds--;
        if (countdownEl) countdownEl.textContent = seconds;
        if (seconds <= 0) {
          clearInterval(interval);
          // Remove overlay
          if (overlay) overlay.remove();
          // Recarrega a página
          location.reload();
        }
      }, 1000);

      // Remove o botão de fechar do overlay (não pode fechar)
      overlay.onclick = (e) => e.stopPropagation();
    }

    // ---------- CRIA A JANELA ----------
    const win = createWin('Gerenciador de Tarefas', '📊', `
    <style>
      .taskmgr-container {
        display:flex;
        flex-direction:column;
        height:100%;
        background:#1a1a2e;
        color:#eef2ff;
        overflow:hidden;
        font-family:'Segoe UI',system-ui,sans-serif;
      }
      .taskmgr-tabs {
        display:flex;
        gap:0;
        background:rgba(0,0,0,.2);
        border-bottom:1px solid rgba(255,255,255,.05);
        padding:0 12px;
        flex-shrink:0;
      }
      .taskmgr-tab {
        padding:10px 18px;
        font-size:.78rem;
        font-weight:500;
        color:var(--dim);
        cursor:pointer;
        border-bottom:2px solid transparent;
        transition:.14s;
        background:transparent;
        border-top:none;
        border-left:none;
        border-right:none;
        font-family:inherit;
      }
      .taskmgr-tab:hover {
        color:#fff;
        background:rgba(255,255,255,.04);
      }
      .taskmgr-tab.active {
        color:#fff;
        border-bottom-color:var(--a);
        background:rgba(96,165,250,.08);
      }
      .taskmgr-content {
        flex:1;
        overflow:auto;
        padding:12px 16px;
        background:rgba(0,0,0,.15);
      }
      .taskmgr-content::-webkit-scrollbar { width:6px; }
      .taskmgr-content::-webkit-scrollbar-thumb { background:var(--a); border-radius:3px; }
      .taskmgr-stats {
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(120px,1fr));
        gap:10px;
        margin-bottom:16px;
        background:rgba(255,255,255,.03);
        border-radius:10px;
        padding:12px 16px;
        border:1px solid rgba(255,255,255,.05);
      }
      .taskmgr-stat-item {
        text-align:center;
      }
      .taskmgr-stat-item .label {
        font-size:.65rem;
        text-transform:uppercase;
        color:var(--dim);
        letter-spacing:.05em;
      }
      .taskmgr-stat-item .value {
        font-size:1.2rem;
        font-weight:600;
        color:#fff;
        margin-top:2px;
      }
      .taskmgr-table {
        width:100%;
        border-collapse:collapse;
        font-size:.82rem;
      }
      .taskmgr-table thead th {
        text-align:left;
        padding:8px 12px;
        color:var(--dim);
        border-bottom:1px solid rgba(255,255,255,.06);
        font-weight:600;
        font-size:.7rem;
        text-transform:uppercase;
        letter-spacing:.05em;
        position:sticky;
        top:0;
        background:#1a1a2e;
        z-index:2;
      }
      .taskmgr-table tbody tr {
        transition:.1s;
      }
      .taskmgr-table tbody tr:hover {
        background:rgba(255,255,255,.04);
      }
      .taskmgr-table tbody td {
        padding:8px 12px;
        border-bottom:1px solid rgba(255,255,255,.03);
      }
      .taskmgr-perf {
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
        gap:12px;
        margin-top:16px;
      }
      .taskmgr-perf-card {
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.06);
        border-radius:10px;
        padding:14px 16px;
      }
      .taskmgr-perf-card .label {
        font-size:.7rem;
        color:var(--dim);
        text-transform:uppercase;
        letter-spacing:.04em;
      }
      .taskmgr-perf-card .value {
        font-size:1.5rem;
        font-weight:600;
        color:#fff;
        margin-top:2px;
      }
      .taskmgr-perf-card .bar {
        height:4px;
        background:rgba(255,255,255,.08);
        border-radius:2px;
        margin-top:6px;
        overflow:hidden;
      }
      .taskmgr-perf-card .bar .fill {
        height:100%;
        border-radius:2px;
        transition:width .8s ease;
        width:0%;
      }
      .taskmgr-actions {
        display:flex;
        gap:8px;
        margin-top:12px;
        flex-wrap:wrap;
      }
      .taskmgr-actions button {
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.06);
        color:#fff;
        padding:6px 14px;
        border-radius:6px;
        font-size:.78rem;
        cursor:pointer;
        transition:.14s;
      }
      .taskmgr-actions button:hover {
        background:rgba(255,255,255,.12);
      }
      .taskmgr-actions button.danger {
        background:rgba(239,68,68,.15);
        border-color:rgba(239,68,68,.2);
        color:#f87171;
      }
      .taskmgr-actions button.danger:hover {
        background:rgba(239,68,68,.25);
      }
      @media (max-width:640px) {
        .taskmgr-stats { grid-template-columns:repeat(2,1fr); }
        .taskmgr-perf { grid-template-columns:1fr; }
        .taskmgr-table { font-size:.72rem; }
        .taskmgr-table thead th, .taskmgr-table tbody td { padding:6px 8px; }
      }
    </style>

    <div class="taskmgr-container">
      <!-- Abas -->
      <div class="taskmgr-tabs">
        <button class="taskmgr-tab active" data-tab="processos" onclick="switchTaskTab('processos')"><i class="fas fa-list"></i> Processos</button>
        <button class="taskmgr-tab" data-tab="desempenho" onclick="switchTaskTab('desempenho')"><i class="fas fa-chart-bar"></i> Desempenho</button>
        <button class="taskmgr-tab" data-tab="historico" onclick="switchTaskTab('historico')"><i class="fas fa-clock"></i> Histórico</button>
      </div>

      <!-- Conteúdo -->
      <div class="taskmgr-content" id="taskmgr-content">
        <!-- ABA PROCESSOS -->
        <div id="taskmgr-panel-processos">
          <div class="taskmgr-stats">
            <div class="taskmgr-stat-item">
              <div class="label">Processos</div>
              <div class="value" id="taskmgr-proc-count">${runningProcesses.filter(p => p.status === 'Ativo').length}</div>
            </div>
            <div class="taskmgr-stat-item">
              <div class="label">CPU</div>
              <div class="value" id="taskmgr-cpu">--%</div>
            </div>
            <div class="taskmgr-stat-item">
              <div class="label">RAM</div>
              <div class="value" id="taskmgr-ram">--%</div>
            </div>
            <div class="taskmgr-stat-item">
              <div class="label">Disco</div>
              <div class="value" id="taskmgr-disk">--%</div>
            </div>
          </div>

          <table class="taskmgr-table">
            <thead>
              <tr>
                <th>Processo</th>
                <th style="text-align:center;">CPU</th>
                <th style="text-align:center;">Memória</th>
                <th style="text-align:center;">Status</th>
                <th style="text-align:center;">Ação</th>
              </tr>
            </thead>
            <tbody id="taskmgr-tbody"></tbody>
          </table>

          <div class="taskmgr-actions">
            <button onclick="addFakeProcess()"><i class="fas fa-plus"></i> Simular novo processo</button>
            <button onclick="killAllFake()" class="danger"><i class="fas fa-skull"></i> Finalizar todos</button>
            <button onclick="refreshProcesses()"><i class="fas fa-sync-alt"></i> Atualizar</button>
          </div>
        </div>

        <!-- ABA DESEMPENHO -->
        <div id="taskmgr-panel-desempenho" style="display:none;">
          <div class="taskmgr-perf">
            <div class="taskmgr-perf-card">
              <div class="label">CPU</div>
              <div class="value" id="perf-cpu">0%</div>
              <div class="bar"><div class="fill" id="perf-cpu-bar" style="width:0%;background:var(--a);"></div></div>
            </div>
            <div class="taskmgr-perf-card">
              <div class="label">RAM</div>
              <div class="value" id="perf-ram">0%</div>
              <div class="bar"><div class="fill" id="perf-ram-bar" style="width:0%;background:var(--a2);"></div></div>
            </div>
            <div class="taskmgr-perf-card">
              <div class="label">Disco</div>
              <div class="value" id="perf-disk">0%</div>
              <div class="bar"><div class="fill" id="perf-disk-bar" style="width:0%;background:var(--a3);"></div></div>
            </div>
            <div class="taskmgr-perf-card">
              <div class="label">Processos ativos</div>
              <div class="value" id="perf-proc">0</div>
            </div>
          </div>
          <div style="margin-top:16px;background:rgba(255,255,255,.03);border-radius:10px;padding:14px;border:1px solid rgba(255,255,255,.05);">
            <div style="font-size:.8rem;color:var(--dim);">📊 Uso de memória por processo</div>
            <div id="perf-mem-details" style="margin-top:8px;font-size:.75rem;color:var(--text-2);"></div>
          </div>
        </div>

        <!-- ABA HISTÓRICO -->
        <div id="taskmgr-panel-historico" style="display:none;">
          <div style="background:rgba(255,255,255,.03);border-radius:10px;padding:14px;border:1px solid rgba(255,255,255,.05);">
            <div style="font-size:.8rem;color:var(--dim);">📋 Histórico de ações</div>
            <div id="taskmgr-history-list" style="margin-top:8px;font-size:.78rem;color:var(--text-2);max-height:300px;overflow-y:auto;">
              <div style="color:#5b6680;padding:4px 0;">Nenhuma ação registrada.</div>
            </div>
          </div>
          <div class="taskmgr-actions">
            <button onclick="clearHistory()"><i class="fas fa-trash"></i> Limpar histórico</button>
          </div>
        </div>
      </div>
    </div>
  `, 700, 520);

    // ---------- FUNÇÕES DE ABA ----------
    window.switchTaskTab = function (tab) {
      document.querySelectorAll('.taskmgr-tab').forEach(el => el.classList.remove('active'));
      document.querySelector(`.taskmgr-tab[data-tab="${tab}"]`).classList.add('active');
      document.querySelectorAll('#taskmgr-content > div').forEach(el => el.style.display = 'none');
      document.getElementById(`taskmgr-panel-${tab}`).style.display = 'block';
      if (tab === 'desempenho') updatePerfPanel();
      if (tab === 'historico') updateHistoryPanel();
    };

    // ---------- HISTÓRICO ----------
    let historyLog = [];

    function addHistory(message, type = 'info') {
      const time = new Date().toLocaleTimeString('pt-BR');
      historyLog.unshift({ time, message, type });
      if (historyLog.length > 50) historyLog.pop();
      updateHistoryPanel();
    }

    function updateHistoryPanel() {
      const container = document.getElementById('taskmgr-history-list');
      if (!container) return;
      if (!historyLog.length) {
        container.innerHTML = '<div style="color:#5b6680;padding:4px 0;">Nenhuma ação registrada.</div>';
        return;
      }
      container.innerHTML = historyLog.map(h => `
      <div style="padding:4px 0;border-bottom:1px solid rgba(255,255,255,.03);display:flex;gap:10px;font-size:.78rem;">
        <span style="color:#5b6680;font-size:.65rem;">${h.time}</span>
        <span style="color:${h.type === 'error' ? '#f87171' : h.type === 'success' ? '#4ade80' : 'var(--text-2)'};">${h.message}</span>
      </div>
    `).join('');
    }

    window.clearHistory = function () {
      historyLog = [];
      updateHistoryPanel();
      toast('Histórico limpo', 'default');
    };

    // ---------- PROCESSOS FANTASMA ----------
    let fakeCounter = 0;

    window.addFakeProcess = function () {
      fakeCounter++;
      const names = ['explorer.exe', 'svchost.exe', 'winlogon.exe', 'csrss.exe', 'services.exe', 'lsass.exe', 'spoolsv.exe', 'taskhost.exe'];
      const name = names[Math.floor(Math.random() * names.length)];
      const newProc = {
        id: 'fake_' + Date.now(),
        name: name + (fakeCounter > 1 ? ` (${fakeCounter})` : ''),
        cpu: parseFloat(getRandomCPU()),
        mem: getRandomMem(),
        status: 'Ativo',
        color: '#4caf50',
        icon: 'fa-cube'
      };
      runningProcesses.push(newProc);
      addHistory(`🟢 Processo "${newProc.name}" iniciado`, 'success');
      renderProcesses();
      updateSystemStats();
      toast(`🟢 "${newProc.name}" adicionado`, 'success');
    };

    window.killAllFake = function () {
      const fakes = runningProcesses.filter(p => p.id.startsWith('fake_') && p.status === 'Ativo');
      if (!fakes.length) return toast('Nenhum processo fake ativo', 'error');
      fakes.forEach(p => {
        p.status = 'Inativo';
        p.cpu = 0;
        p.mem = 0;
        addHistory(`❌ Processo "${p.name}" finalizado`, 'error');
      });
      renderProcesses();
      updateSystemStats();
      toast(`💀 ${fakes.length} processos finalizados`, 'error');
    };

    window.refreshProcesses = function () {
      updateProcesses();
      toast('🔄 Processos atualizados', 'default');
    };

    // ---------- ABA DESEMPENHO ----------
    function updatePerfPanel() {
      const cpu = (5 + Math.random() * 25).toFixed(1);
      const ram = (30 + Math.random() * 25).toFixed(0);
      const disk = (2 + Math.random() * 10).toFixed(1);
      const active = runningProcesses.filter(p => p.status === 'Ativo').length;

      document.getElementById('perf-cpu').textContent = cpu + '%';
      document.getElementById('perf-cpu-bar').style.width = cpu + '%';
      document.getElementById('perf-ram').textContent = ram + '%';
      document.getElementById('perf-ram-bar').style.width = ram + '%';
      document.getElementById('perf-disk').textContent = disk + '%';
      document.getElementById('perf-disk-bar').style.width = disk + '%';
      document.getElementById('perf-proc').textContent = active;

      // Detalhes de memória
      const details = document.getElementById('perf-mem-details');
      if (details) {
        const topProcs = runningProcesses
          .filter(p => p.status === 'Ativo')
          .sort((a, b) => b.mem - a.mem)
          .slice(0, 5);
        details.innerHTML = topProcs.map(p =>
          `<div style="display:flex;justify-content:space-between;padding:2px 0;"><span>${p.name}</span><span>${p.mem} MB</span></div>`
        ).join('');
      }
    }

    // ---------- INICIALIZAÇÃO ----------
    // Renderiza os processos
    renderProcesses();
    updateSystemStats();

    // Atualização em tempo real (a cada 2 segundos)
    const interval = setInterval(() => {
      updateProcesses();
      // Se a aba desempenho estiver visível, atualiza
      const perfPanel = document.getElementById('taskmgr-panel-desempenho');
      if (perfPanel && perfPanel.style.display !== 'none') {
        updatePerfPanel();
      }
    }, 2000);

    // ---------- LIMPEZA ----------
    win.addEventListener('remove', () => {
      clearInterval(interval);
      // Remove funções globais
      delete window.endProcess;
      delete window.switchTaskTab;
      delete window.addFakeProcess;
      delete window.killAllFake;
      delete window.refreshProcesses;
      delete window.clearHistory;
    });

    // Adiciona evento para fechar a janela (se clicar no X)
    // Já existe no sistema de janelas

    // ---------- PATCH: Fechar janela ao clicar no X ----------
    // O sistema de janelas já trata isso, mas vamos garantir
    const closeBtn = win.querySelector('.cl');
    if (closeBtn) {
      const originalClick = closeBtn.onclick;
      closeBtn.onclick = function (e) {
        if (originalClick) originalClick.call(this, e);
        clearInterval(interval);
      };
    }

    return win;
  }

  function openAbout() {
    createWin('Sobre o VessieOS', '💜', `
    <div style="padding:36px;text-align:center;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">
      <div style="font-size:5rem;animation:pulse 2s ease infinite">💜</div>
      <h2 style="font-size:2rem;background:linear-gradient(135deg,var(--a),var(--a2));-webkit-background-clip:text;background-clip:text;color:transparent">VessieOS</h2>
      <p style="color:var(--dim);font-size:.9rem">Sistema Operacional Simulado · v3.0</p>
      <div style="background:rgba(255,255,255,.04);border-radius:16px;padding:20px;width:100%;max-width:360px;text-align:left;font-size:.85rem;line-height:2;color:#a0b0cc">
        <div>🌸 IA Vessie integrada (Anthropic Claude)</div>
        <div>🎮 ${GAMES.length}+ jogos disponíveis</div>
        <div>📊 Dashboard com métricas dinâmicas</div>
        <div>💻 Terminal com comandos reais</div>
        <div>🖼️ ${WALLS.length} papéis de parede HD</div>
        <div>🎵 Music Player com ${TRACKS.length} faixas</div>
        <div>📁 Sistema de arquivos virtual</div>
        <div>🎨 Temas e cores personalizáveis</div>
      </div>
      <p style="color:var(--dim);font-size:.78rem">Feito com 💜 usando HTML, CSS & JavaScript puro</p>
    </div>
  `, 480, 520);
  }

  document.getElementById('tb-search').onclick = () => { const sm = document.getElementById('sm'); sm.style.display = 'block'; const input = document.getElementById('sm-q'); input.focus(); searchApps(input.value); };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { document.getElementById('sm').style.display = 'none'; document.getElementById('ctx').style.display = 'none'; document.getElementById('np').classList.remove('open'); }
    if (e.ctrlKey && e.key === 't') openApp('terminal');
    if (e.ctrlKey && e.key === 'b') openApp('browser');
    if (e.ctrlKey && e.key === 'd') openApp('dashboard');
    if (e.ctrlKey && e.key === 'v') openApp('vessie');
  });

  let secretBuf = '';
  document.addEventListener('keydown', e => {
    secretBuf += e.key.toLowerCase(); if (secretBuf.length > 8) secretBuf = secretBuf.slice(-8);
    if (secretBuf.includes('veesie')) { secretBuf = ''; document.getElementById('eg').style.display = 'flex'; setTimeout(() => document.getElementById('eg').style.display = 'none', 4000); toast('🎉 Easter Egg ativado! VEESIE!', 'success'); }
  });


  // ============================================================
  //  ╔══════════════════════════════════════════════════════╗
  //  ║  VESSIEOS ULTRA · MEGA ENHANCEMENT MODULE v4.0       ║
  //  ║  Right-click submenus · Icon sizes · Trash · VMs     ║
  //  ║  Palette extraction · Adaptive taskbar · Snap grid   ║
  //  ╚══════════════════════════════════════════════════════╝
  // ============================================================
  (function ultra() {
    // ---------- INJECT STYLES ----------
    const css = document.createElement('style');
    css.textContent = `
  /* CONTEXT MENU SUBMENU */
  .cti.has-sub{position:relative;padding-right:26px}
  .cti.has-sub::after{content:'\\f105';font-family:'Font Awesome 6 Free';font-weight:900;position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:.7rem;color:var(--dim)}
  .cti.has-sub:hover>.csub,.csub.show{display:block}
  .csub{display:none;position:absolute;left:100%;top:-6px;background:rgba(14,16,28,.98);backdrop-filter:blur(22px);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:5px;box-shadow:0 15px 38px rgba(0,0,0,.8);min-width:190px;margin-left:4px}
  .csub.left{left:auto;right:100%;margin-left:0;margin-right:4px}
  .cti i.fa-check{margin-left:auto;color:var(--a2)}
  /* ICON SIZES */
  .di[data-sz="s"]{width:70px;padding:6px 4px;gap:4px}
  .di[data-sz="s"] .ic{width:38px;height:38px;font-size:20px;border-radius:10px}
  .di[data-sz="s"] label{font-size:10.5px;max-width:64px}
  .di[data-sz="m"]{width:90px}
  .di[data-sz="l"]{width:118px;padding:14px 8px;gap:9px}
  .di[data-sz="l"] .ic{width:78px;height:78px;font-size:44px;border-radius:18px}
  .di[data-sz="l"] label{font-size:13px;max-width:108px}
  .di[data-sz="xl"]{width:148px;padding:18px 10px}
  .di[data-sz="xl"] .ic{width:104px;height:104px;font-size:60px;border-radius:22px}
  .di[data-sz="xl"] label{font-size:14px;max-width:140px}
  .di .ic img,.di .ic{image-rendering:auto}
  /* SELECTION RECTANGLE */
  #selrect{position:absolute;border:1px solid rgba(126,182,255,.7);background:rgba(126,182,255,.13);pointer-events:none;display:none;z-index:5}
  /* ADAPTIVE TASKBAR */
  #tb{transition:background .6s ease,border-color .6s ease}
  #tb.tinted{background:var(--tb-tint, rgba(8,10,20,.85))!important}
  /* VM APP */
  .vm-wrap{display:flex;height:100%;background:#0b0d18;color:#e2e8f0;font-family:'Segoe UI',sans-serif}
  .vm-sb{width:210px;background:#0e1322;border-right:1px solid rgba(255,255,255,.05);padding:14px 10px;overflow-y:auto;flex-shrink:0}
  .vm-cat{font-size:.7rem;text-transform:uppercase;letter-spacing:1.2px;color:#5b6680;padding:10px 8px 6px}
  .vm-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:.84rem;color:#aab4cc;transition:.12s}
  .vm-item:hover{background:rgba(255,255,255,.05);color:#fff}
  .vm-item.ac{background:linear-gradient(90deg,rgba(126,182,255,.18),transparent);color:#fff;box-shadow:inset 3px 0 0 var(--a2)}
  .vm-item i{width:18px;color:var(--a2)}
  .vm-main{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .vm-hero{padding:18px 22px;background:linear-gradient(135deg,#1a2240,#0e1322);border-bottom:1px solid rgba(255,255,255,.05)}
  .vm-hero h2{font-size:1.2rem;margin-bottom:4px;color:#fff}
  .vm-hero p{font-size:.82rem;color:#8898bb;line-height:1.5}
  .vm-frame{flex:1;background:#000;display:flex;align-items:center;justify-content:center;position:relative}
  .vm-frame iframe{width:100%;height:100%;border:0;background:#000}
  .vm-ph{text-align:center;color:#5b6680;padding:30px}
  .vm-ph i{font-size:3.5rem;margin-bottom:14px;display:block;color:#2a3556}
  .vm-actions{display:flex;gap:8px;padding:10px 22px;background:rgba(0,0,0,.3);border-bottom:1px solid rgba(255,255,255,.05);flex-wrap:wrap}
  .vm-btn{background:rgba(126,182,255,.13);border:1px solid rgba(126,182,255,.25);color:#fff;padding:6px 14px;border-radius:7px;font-size:.78rem;cursor:pointer;transition:.12s;display:flex;align-items:center;gap:6px}
  .vm-btn:hover{background:rgba(126,182,255,.25)}
  .vm-btn.danger{background:rgba(244,67,54,.13);border-color:rgba(244,67,54,.3)}
  /* TRASH */
  .trash-wrap{padding:18px;height:100%;overflow:auto}
  .trash-empty{text-align:center;padding:60px 20px;color:#5b6680}
  .trash-empty i{font-size:4rem;margin-bottom:14px;display:block;color:#2a3556}
  .trash-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px}
  .trash-it{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:11px;padding:12px 8px;text-align:center;cursor:pointer;transition:.15s;position:relative}
  .trash-it:hover{background:rgba(255,255,255,.08);transform:translateY(-2px)}
  .trash-it i{font-size:2.2rem;color:var(--a2);margin-bottom:7px;display:block}
  .trash-it .nm{font-size:.78rem;color:#dde;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .trash-it .dt{font-size:.66rem;color:var(--dim);margin-top:3px}
  .trash-bar{display:flex;gap:9px;margin-bottom:14px;align-items:center;flex-wrap:wrap}
  /* APP THUMBNAIL ICON IMG SHARPNESS */
  .di .ic{image-rendering:-webkit-optimize-contrast}
  `;
    document.head.appendChild(css);

    // ---------- STATE ----------
    const LS = {
      sz: () => localStorage.getItem('vos_icon_sz') || 'm',
      setSz: v => localStorage.setItem('vos_icon_sz', v),
      autoArr: () => localStorage.getItem('vos_icon_autoArr') !== '0',
      setAutoArr: v => localStorage.setItem('vos_icon_autoArr', v ? '1' : '0'),
      snap: () => localStorage.getItem('vos_icon_snap') !== '0',
      setSnap: v => localStorage.setItem('vos_icon_snap', v ? '1' : '0'),
      show: () => localStorage.getItem('vos_icon_show') !== '0',
      setShow: v => localStorage.setItem('vos_icon_show', v ? '1' : '0'),
      pos: () => { try { return JSON.parse(localStorage.getItem('vos_icon_pos') || '{}') } catch { return {} } },
      setPos: o => localStorage.setItem('vos_icon_pos', JSON.stringify(o)),
      order: () => { try { return JSON.parse(localStorage.getItem('vos_icon_order') || 'null') } catch { return null } },
      setOrder: a => localStorage.setItem('vos_icon_order', JSON.stringify(a)),
      hidden: () => { try { return JSON.parse(localStorage.getItem('vos_icon_hidden') || '[]') } catch { return [] } },
      setHidden: a => localStorage.setItem('vos_icon_hidden', JSON.stringify(a)),
      trash: () => { try { return JSON.parse(localStorage.getItem('vos_trash') || '[]') } catch { return [] } },
      setTrash: a => localStorage.setItem('vos_trash', JSON.stringify(a)),
      customIcons: () => { try { return JSON.parse(localStorage.getItem('vos_custom_icons') || '[]') } catch { return [] } },
      setCustomIcons: a => localStorage.setItem('vos_custom_icons', JSON.stringify(a)),
    };
    const SZ_PX = { s: { w: 80, h: 80 }, m: { w: 100, h: 110 }, l: { w: 130, h: 140 }, xl: { w: 160, h: 170 } };

    // ---------- DESKTOP APPS LIST ----------
    const BASE_DESKTOP_APPS = [
      { id: 'vessie', n: 'Vessie IA', ic: 'fas fa-heart', bg: 'linear-gradient(135deg,#c46fff,#7a3eb8)' },
      { id: 'vcoinstore', n: 'Loja VessieCoin', ic: 'fas fa-coins', bg: 'linear-gradient(135deg,#f6c343,#c98b1f)' },
      { id: 'dashboard', n: 'Dashboard', ic: 'fas fa-chart-line', bg: 'linear-gradient(135deg,#36d1dc,#5b86e5)' },
      { id: 'games', n: 'Steam', ic: 'fab fa-steam', bg: 'linear-gradient(135deg,#1b2838,#66c0f4)' },
      { id: 'browser', n: 'Navegador', ic: 'fas fa-globe', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
      { id: 'explorer', n: 'Explorador', ic: 'fas fa-folder-open', bg: 'linear-gradient(135deg,#f6d365,#fda085)' },
      { id: 'music', n: 'Música', ic: 'fas fa-music', bg: 'linear-gradient(135deg,#fa709a,#fee140)' },
      { id: 'notepad', n: 'Bloco Notas', ic: 'fas fa-file-lines', bg: 'linear-gradient(135deg,#a8edea,#fed6e3)' },
      { id: 'terminal', n: 'Terminal', ic: 'fas fa-terminal', bg: 'linear-gradient(135deg,#232526,#414345)' },
      { id: 'calc', n: 'Calculadora', ic: 'fas fa-calculator', bg: 'linear-gradient(135deg,#43cea2,#185a9d)' },
      { id: 'settings', n: 'Config', ic: 'fas fa-gear', bg: 'linear-gradient(135deg,#bdc3c7,#2c3e50)' },
      { id: 'camera', n: 'Câmera', ic: 'fas fa-camera', bg: 'linear-gradient(135deg,#ff6e7f,#bfe9ff)' },
      { id: 'word', n: 'Editor', ic: 'fas fa-pen-to-square', bg: 'linear-gradient(135deg,#2193b0,#6dd5ed)' },
      { id: 'vm', n: 'Máquinas Virtuais', ic: 'fas fa-server', bg: 'linear-gradient(135deg,#373b44,#4286f4)' },
      { id: 'trash', n: 'Lixeira', ic: 'fas fa-trash', bg: 'linear-gradient(135deg,#8e9eab,#eef2f3)' },
    ];
    function getDesktopApps() {
      const hidden = new Set(LS.hidden());
      const customs = LS.customIcons();
      let list = BASE_DESKTOP_APPS.concat(customs).filter(a => !hidden.has(a.id));
      const order = LS.order();
      if (order) {
        const map = Object.fromEntries(list.map(a => [a.id, a]));
        const ordered = order.map(id => map[id]).filter(Boolean);
        const rest = list.filter(a => !order.includes(a.id));
        list = ordered.concat(rest);
      }
      return list;
    }

    // ---------- REDEFINE renderDesktop (adaptive sizes, snap, persisted pos) ----------
    window.renderDesktop = function () {
      const area = document.getElementById('icons-area');
      if (!area) return;
      area.innerHTML = '';
      if (!LS.show()) { return; }
      const sz = LS.sz();
      const { w: cellW, h: cellH } = SZ_PX[sz];
      const pad = 16;
      const availH = Math.max(300, (area.clientHeight || window.innerHeight - 52) - pad);
      const rows = Math.max(3, Math.floor(availH / cellH));
      const apps = getDesktopApps();
      const positions = LS.pos();
      const auto = LS.autoArr();

      apps.forEach((app, i) => {
        const col = Math.floor(i / rows), row = i % rows;
        let left = pad + col * cellW;
        let top = pad + row * cellH;
        if (!auto && positions[app.id]) {
          left = positions[app.id].x;
          top = positions[app.id].y;
        }
        const el = document.createElement('div');
        el.className = 'di';
        el.dataset.sz = sz;
        el.dataset.appId = app.id;
        el.style.cssText = `left:${left}px;top:${top}px`;
        const iconHtml = app.iconUrl
          ? `<img class="ic" src="${app.iconUrl}" alt="" onerror="this.outerHTML='<div class=\\'ic\\' style=\\'background:${app.bg || '#444'}\\'><i class=\\'fas fa-cube\\'></i></div>'">`
          : `<div class="ic" style="background:${app.bg || 'linear-gradient(135deg,#555,#222)'}"><i class="${app.ic || 'fas fa-cube'}"></i></div>`;
        el.innerHTML = iconHtml + `<label>${app.n}</label>`;
        el.ondblclick = () => openApp(app.id);
        el.onclick = e => {
          document.querySelectorAll('.di.sel').forEach(x => x.classList.remove('sel'));
          el.classList.add('sel');
          e.stopPropagation();
        };
        el.addEventListener('contextmenu', e => {
          e.preventDefault(); e.stopPropagation();
          document.querySelectorAll('.di.sel').forEach(x => x.classList.remove('sel'));
          el.classList.add('sel');
          showIconCtx(e.clientX, e.clientY, app);
        });
        makeDraggableEnh(el, app.id);
        area.appendChild(el);
      });
    };

    function makeDraggableEnh(el, id) {
      let dx, dy, dragging = false, moved = false;
      el.addEventListener('mousedown', e => {
        if (e.button !== 0 || e.detail > 1) return;
        dx = e.clientX - el.offsetLeft; dy = e.clientY - el.offsetTop;
        dragging = true; moved = false; el.style.zIndex = 999;
      });
      document.addEventListener('mousemove', e => {
        if (!dragging) return;
        moved = true;
        el.style.left = (e.clientX - dx) + 'px';
        el.style.top = (e.clientY - dy) + 'px';
      });
      document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false; el.style.zIndex = '';
        if (moved && !LS.autoArr()) {
          let x = parseInt(el.style.left), y = parseInt(el.style.top);
          if (LS.snap()) {
            const sz = LS.sz(); const { w: cw, h: ch } = SZ_PX[sz];
            x = Math.round((x - 16) / cw) * cw + 16;
            y = Math.round((y - 16) / ch) * ch + 16;
            el.style.left = x + 'px'; el.style.top = y + 'px';
          }
          const pos = LS.pos(); pos[id] = { x, y }; LS.setPos(pos);
        }
      });
    }

    // ---------- DESKTOP CONTEXT MENU (rebuilt with submenus) ----------
    const desktop = document.getElementById('desktop');
    const oldCtx = document.getElementById('ctx');
    if (oldCtx) oldCtx.remove();
    const ctx = document.createElement('div');
    ctx.id = 'ctx';
    document.getElementById('desktop').appendChild(ctx);

    function ckIf(b) { return b ? '<i class="fas fa-check"></i>' : ''; }
    function buildDesktopCtx() {
      const sz = LS.sz();
      return `
      <div class="cti has-sub"><i class="fas fa-eye"></i> Exibir
        <div class="csub">
          <div class="cti" data-cmd="size:xl"><i class="fas fa-expand"></i> Ícones extra grandes ${ckIf(sz === 'xl')}</div>
          <div class="cti" data-cmd="size:l"><i class="fas fa-expand-arrows-alt"></i> Ícones grandes ${ckIf(sz === 'l')}</div>
          <div class="cti" data-cmd="size:m"><i class="fas fa-th-large"></i> Ícones médios ${ckIf(sz === 'm')}</div>
          <div class="cti" data-cmd="size:s"><i class="fas fa-th"></i> Ícones pequenos ${ckIf(sz === 's')}</div>
          <div class="cts"></div>
          <div class="cti" data-cmd="toggle:auto"><i class="fas fa-magnet"></i> Organizar automaticamente ${ckIf(LS.autoArr())}</div>
          <div class="cti" data-cmd="toggle:snap"><i class="fas fa-border-all"></i> Alinhar à grade ${ckIf(LS.snap())}</div>
          <div class="cti" data-cmd="toggle:show"><i class="fas fa-eye-slash"></i> Mostrar ícones ${ckIf(LS.show())}</div>
        </div>
      </div>
      <div class="cti has-sub"><i class="fas fa-sort"></i> Classificar por
        <div class="csub">
          <div class="cti" data-cmd="sort:name"><i class="fas fa-font"></i> Nome</div>
          <div class="cti" data-cmd="sort:size"><i class="fas fa-arrows-alt-v"></i> Tipo</div>
          <div class="cti" data-cmd="sort:random"><i class="fas fa-random"></i> Aleatório</div>
          <div class="cti" data-cmd="sort:reset"><i class="fas fa-undo"></i> Restaurar padrão</div>
        </div>
      </div>
      <div class="cti" data-cmd="refresh"><i class="fas fa-sync-alt"></i> Atualizar</div>
      <div class="cts"></div>
      <div class="cti has-sub"><i class="fas fa-plus"></i> Novo
        <div class="csub">
          <div class="cti" data-cmd="new:folder"><i class="fas fa-folder-plus"></i> Pasta</div>
          <div class="cti" data-cmd="new:txt"><i class="fas fa-file"></i> Documento de texto</div>
          <div class="cti" data-cmd="new:shortcut"><i class="fas fa-link"></i> Atalho (URL)</div>
          <div class="cti" data-cmd="new:custom"><i class="fas fa-image"></i> Ícone personalizado</div>
        </div>
      </div>
      <div class="cti" data-cmd="personalize"><i class="fas fa-paint-brush"></i> Personalizar</div>
      <div class="cti" data-cmd="wallnext"><i class="fas fa-images"></i> Próximo wallpaper</div>
      <div class="cts"></div>
      <div class="cti" data-cmd="terminal"><i class="fas fa-terminal"></i> Abrir Terminal</div>
      <div class="cti" data-cmd="taskmgr"><i class="fas fa-tasks"></i> Gerenciador de Tarefas</div>
      <div class="cti" data-cmd="trash"><i class="fas fa-trash"></i> Lixeira</div>
      <div class="cts"></div>
      <div class="cti" data-cmd="about"><i class="fas fa-info-circle"></i> Sobre o VessieOS</div>
    `;
    }

    function showCtxAt(x, y) {
      ctx.style.display = 'block';
      ctx.style.left = Math.min(x, window.innerWidth - 230) + 'px';
      ctx.style.top = Math.min(y, window.innerHeight - 460) + 'px';
    }
    function hideCtx() { ctx.style.display = 'none'; document.querySelectorAll('.csub.show').forEach(s => s.classList.remove('show')); }

    desktop.addEventListener('contextmenu', e => {
      if (e.target.closest('.win') || e.target.closest('#tb') || e.target.closest('.di')) return;
      e.preventDefault();
      ctx.innerHTML = buildDesktopCtx();
      bindCtxCmds();
      showCtxAt(e.clientX, e.clientY);
    });
    document.addEventListener('click', e => { if (!e.target.closest('#ctx')) hideCtx(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hideCtx(); });

    function bindCtxCmds() {
      ctx.querySelectorAll('.cti[data-cmd]').forEach(el => {
        el.onclick = (e) => {
          e.stopPropagation();
          const [cmd, arg] = el.dataset.cmd.split(':');
          handleCtxCmd(cmd, arg);
          hideCtx();
        };
      });
      // submenu hover
      ctx.querySelectorAll('.cti.has-sub').forEach(p => {
        p.addEventListener('mouseenter', () => {
          ctx.querySelectorAll('.csub.show').forEach(s => { if (!p.contains(s)) s.classList.remove('show'); });
          const s = p.querySelector('.csub'); if (s) {
            s.classList.add('show');
            const r = s.getBoundingClientRect();
            if (r.right > window.innerWidth) s.classList.add('left');
          }
        });
      });
    }

    function handleCtxCmd(cmd, arg) {
      if (cmd === 'size') { LS.setSz(arg); renderDesktop(); toast('Tamanho de ícone: ' + ({ s: 'Pequeno', m: 'Médio', l: 'Grande', xl: 'Extra Grande' }[arg])); }
      else if (cmd === 'toggle') {
        if (arg === 'auto') { LS.setAutoArr(!LS.autoArr()); if (LS.autoArr()) { localStorage.removeItem('vos_icon_pos'); } renderDesktop(); }
        if (arg === 'snap') { LS.setSnap(!LS.snap()); }
        if (arg === 'show') { LS.setShow(!LS.show()); renderDesktop(); }
      }
      else if (cmd === 'sort') {
        const apps = getDesktopApps();
        let arr;
        if (arg === 'name') arr = apps.slice().sort((a, b) => a.n.localeCompare(b.n)).map(a => a.id);
        else if (arg === 'size') arr = apps.slice().sort((a, b) => (a.id || '').localeCompare(b.id || '')).map(a => a.id);
        else if (arg === 'random') arr = apps.slice().sort(() => Math.random() - .5).map(a => a.id);
        else { localStorage.removeItem('vos_icon_order'); localStorage.removeItem('vos_icon_pos'); LS.setAutoArr(true); renderDesktop(); return; }
        LS.setOrder(arr); LS.setAutoArr(true); localStorage.removeItem('vos_icon_pos'); renderDesktop();
      }
      else if (cmd === 'refresh') { renderDesktop(); toast('Desktop atualizado', 'success'); }
      else if (cmd === 'new') {
        if (arg === 'folder') { const n = prompt('Nome da pasta:', 'Nova pasta'); if (n) addCustomIcon({ n, ic: 'fas fa-folder', bg: 'linear-gradient(135deg,#f6d365,#fda085)' }); }
        else if (arg === 'txt') { const n = prompt('Nome do arquivo:', 'Novo documento.txt'); if (n) addCustomIcon({ n, ic: 'fas fa-file-lines', bg: 'linear-gradient(135deg,#74ebd5,#9face6)', openId: 'notepad' }); }
        else if (arg === 'shortcut') { const u = prompt('URL do atalho:', 'https://'); if (u) { const n = prompt('Nome:', u.replace(/^https?:\/\//, '').split('/')[0]) || u; addCustomIcon({ n, ic: 'fas fa-link', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', url: u }); } }
        else if (arg === 'custom') {
          const n = prompt('Nome do ícone:'); if (!n) return;
          const u = prompt('URL da imagem (ícone):', '');
          const link = prompt('Abrir URL/site ao clicar (opcional):', '');
          addCustomIcon({ n, iconUrl: u || undefined, ic: u ? undefined : 'fas fa-star', bg: 'linear-gradient(135deg,#fceabb,#f8b500)', url: link || undefined });
        }
      }
      else if (cmd === 'personalize') { openApp('settings'); }
      else if (cmd === 'wallnext') { nextWall(); }
      else if (cmd === 'terminal') { openApp('terminal'); }
      else if (cmd === 'taskmgr') { openTaskManager(); }
      else if (cmd === 'trash') { openApp('trash'); }
      else if (cmd === 'about') { openAbout(); }
    }

    function addCustomIcon(o) {
      const arr = LS.customIcons();
      o.id = 'cu_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      arr.push(o); LS.setCustomIcons(arr); renderDesktop();
      toast('"' + o.n + '" criado no desktop', 'success');
    }

    // ---------- PER-ICON CONTEXT MENU ----------
    function showIconCtx(x, y, app) {
      ctx.innerHTML = `
      <div class="cti" data-i="open"><i class="fas fa-play"></i> Abrir</div>
      <div class="cti" data-i="newwin"><i class="fas fa-window-restore"></i> Abrir em nova janela</div>
      <div class="cts"></div>
      <div class="cti" data-i="rename"><i class="fas fa-i-cursor"></i> Renomear</div>
      <div class="cti" data-i="changeicon"><i class="fas fa-image"></i> Alterar ícone</div>
      <div class="cts"></div>
      <div class="cti" data-i="trash"><i class="fas fa-trash"></i> Enviar para Lixeira</div>
      <div class="cti" data-i="hide"><i class="fas fa-eye-slash"></i> Ocultar do desktop</div>
      <div class="cts"></div>
      <div class="cti" data-i="props"><i class="fas fa-info-circle"></i> Propriedades</div>
    `;
      showCtxAt(x, y);
      ctx.querySelectorAll('.cti[data-i]').forEach(el => {
        el.onclick = e => {
          e.stopPropagation();
          iconCmd(el.dataset.i, app);
          hideCtx();
        };
      });
    }
    function iconCmd(c, app) {
      if (c === 'open' || c === 'newwin') {
        if (app.url) { window.open(app.url, '_blank'); return; }
        if (app.openId) { openApp(app.openId); return; }
        openApp(app.id);
      }
      else if (c === 'rename') {
        const nn = prompt('Novo nome:', app.n); if (!nn) return;
        const customs = LS.customIcons();
        const ci = customs.find(x => x.id === app.id);
        if (ci) { ci.n = nn; LS.setCustomIcons(customs); }
        else { // rename base app via custom override
          const ov = JSON.parse(localStorage.getItem('vos_icon_names') || '{}'); ov[app.id] = nn;
          localStorage.setItem('vos_icon_names', JSON.stringify(ov));
          BASE_DESKTOP_APPS.forEach(b => { if (b.id === app.id) b.n = nn; });
        }
        renderDesktop();
      }
      else if (c === 'changeicon') {
        const u = prompt('URL da nova imagem do ícone:', app.iconUrl || '');
        if (u === null) return;
        const customs = LS.customIcons();
        const ci = customs.find(x => x.id === app.id);
        if (ci) { ci.iconUrl = u || undefined; LS.setCustomIcons(customs); }
        else { BASE_DESKTOP_APPS.forEach(b => { if (b.id === app.id) b.iconUrl = u || undefined; }); }
        renderDesktop();
      }
      else if (c === 'trash') {
        const trash = LS.trash();
        trash.unshift({ ...app, deletedAt: Date.now(), wasCustom: !!LS.customIcons().find(x => x.id === app.id) });
        LS.setTrash(trash);
        const customs = LS.customIcons().filter(x => x.id !== app.id); LS.setCustomIcons(customs);
        const hidden = LS.hidden(); if (!hidden.includes(app.id)) { hidden.push(app.id); LS.setHidden(hidden); }
        renderDesktop(); toast('"' + app.n + '" enviado para a Lixeira', 'success');
      }
      else if (c === 'hide') {
        const hidden = LS.hidden(); if (!hidden.includes(app.id)) { hidden.push(app.id); LS.setHidden(hidden); }
        renderDesktop();
      }
      else if (c === 'props') {
        createWin('Propriedades · ' + app.n, '<i class="fas fa-info-circle"></i>',
          `<div style="padding:22px;font-size:.86rem;line-height:1.9;color:#cdd6f4">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
            <div style="width:64px;height:64px;border-radius:14px;background:${app.bg || '#333'};display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff">${app.iconUrl ? `<img src="${app.iconUrl}" style="width:100%;height:100%;border-radius:14px;object-fit:cover">` : `<i class="${app.ic}"></i>`}</div>
            <div><div style="font-size:1.05rem;font-weight:600">${app.n}</div><div style="color:var(--dim);font-size:.78rem">${app.id}</div></div>
          </div>
          <div><b>Tipo:</b> ${app.url ? 'Atalho de Internet' : (app.openId ? 'Atalho' : 'Aplicativo do sistema')}</div>
          ${app.url ? `<div><b>URL:</b> <a href="${app.url}" target="_blank" style="color:var(--a2)">${app.url}</a></div>` : ''}
          <div><b>Tamanho atual:</b> ${LS.sz().toUpperCase()}</div>
          <div><b>Posição persistida:</b> ${LS.pos()[app.id] ? 'Sim' : 'Não'}</div>
        </div>`, 420, 360);
      }
    }

    // Apply name overrides from rename
    try { const ov = JSON.parse(localStorage.getItem('vos_icon_names') || '{}'); BASE_DESKTOP_APPS.forEach(b => { if (ov[b.id]) b.n = ov[b.id]; }); } catch { }

    // ---------- WALLPAPER NEXT + PALETTE EXTRACTION ----------
    let wallIdx = 0;
    window.nextWall = function () {
      if (typeof WALLS === 'undefined' || !WALLS.length) return;
      wallIdx = (wallIdx + 1) % WALLS.length;
      const u = WALLS[wallIdx].u;
      setWall(u); extractPalette(u); toast('Wallpaper: ' + WALLS[wallIdx].n);
    };

    function extractPalette(url) {
      const img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const c = document.createElement('canvas'); const W = 48, H = 48; c.width = W; c.height = H;
          const x = c.getContext('2d'); x.drawImage(img, 0, 0, W, H);
          const d = x.getImageData(0, 0, W, H).data;
          const buckets = {}; let bestC = null, bestN = 0;
          for (let i = 0; i < d.length; i += 4) {
            const a = d[i + 3]; if (a < 200) continue;
            const r = d[i] & 0xF0, g = d[i + 1] & 0xF0, b = d[i + 2] & 0xF0;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            if (max - min < 24) continue; // skip greys
            if (max < 60 || max > 240) continue;
            const k = `${r},${g},${b}`;
            buckets[k] = (buckets[k] || 0) + 1;
            if (buckets[k] > bestN) { bestN = buckets[k]; bestC = [r, g, b]; }
          }
          if (!bestC) return;
          const [r, g, b] = bestC;
          const root = document.documentElement.style;
          const hex = `rgb(${r + 8},${g + 8},${b + 8})`;
          const hex2 = `rgb(${Math.min(255, r + 60)},${Math.min(255, g + 30)},${Math.min(255, b + 90)})`;
          root.setProperty('--a', hex);
          root.setProperty('--a3', hex);
          root.setProperty('--a2', hex2);
          const tb = document.getElementById('tb');
          if (tb) {
            tb.classList.add('tinted');
            tb.style.setProperty('--tb-tint', `rgba(${Math.round(r * 0.18)},${Math.round(g * 0.18)},${Math.round(b * 0.22)},.78)`);
          }
        } catch (e) { /* CORS may block — silent */ }
      };
      img.src = url;
    }
    // Hook setWall to also extract palette
    const _origSetWall = window.setWall;
    if (_origSetWall) {
      window.setWall = function (u) { _origSetWall(u); extractPalette(u); };
    }
    // Run once on boot if wallpaper already set
    setTimeout(() => { if (typeof S !== 'undefined' && S.wallpaper) extractPalette(S.wallpaper); }, 1200);

    // ---------- PATCH openApp TO HANDLE NEW APPS + CUSTOM ICONS ----------
    const _origOpen = window.openApp;
    window.openApp = function (id) {
      // custom icon shortcuts
      const ci = LS.customIcons().find(x => x.id === id);
      if (ci) {
        if (ci.url) {
          return createWin(ci.n, ci.iconUrl ? `<img src="${ci.iconUrl}" style="width:18px;height:18px;border-radius:4px">` : `<i class="${ci.ic || 'fas fa-link'}"></i>`,
            `<iframe src="${ci.url}" style="border:0;width:100%;height:100%" allow="fullscreen;autoplay" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>`,
            960, 640);
        }
        if (ci.openId) return _origOpen(ci.openId);
        return toast('Arquivo: ' + ci.n);
      }
      if (id === 'trash') return openTrash();
      if (id === 'vm') return openVM();
      return _origOpen(id);
    };

    // ---------- TRASH APP ----------
    function openTrash() {
      const items = LS.trash();
      const win = createWin('Lixeira', '<i class="fas fa-trash" style="color:#9ecbff"></i>', `
      <div class="trash-wrap">
        <div class="trash-bar">
          <button class="vm-btn" id="tr-restore-all"><i class="fas fa-undo"></i> Restaurar tudo</button>
          <button class="vm-btn danger" id="tr-empty"><i class="fas fa-fire"></i> Esvaziar Lixeira</button>
          <span style="color:var(--dim);font-size:.8rem;margin-left:auto">${items.length} item(ns)</span>
        </div>
        <div id="tr-body"></div>
      </div>
    `, 640, 460);
      win.dataset.app = 'trash';
      renderTrashBody(win);
      win.querySelector('#tr-restore-all').onclick = () => {
        const it = LS.trash();
        it.forEach(t => {
          if (t.wasCustom) { const c = LS.customIcons(); c.push(t); LS.setCustomIcons(c); }
          const h = LS.hidden().filter(x => x !== t.id); LS.setHidden(h);
        });
        LS.setTrash([]); renderDesktop(); renderTrashBody(win); toast('Tudo restaurado', 'success');
      };
      win.querySelector('#tr-empty').onclick = () => {
        if (!confirm('Esvaziar Lixeira definitivamente?')) return;
        LS.setTrash([]); renderTrashBody(win); toast('Lixeira esvaziada', 'success');
      };
    }
    function renderTrashBody(win) {
      const body = win.querySelector('#tr-body');
      const items = LS.trash();
      if (!items.length) {
        body.innerHTML = `<div class="trash-empty"><i class="fas fa-trash-can"></i><h3>Lixeira vazia</h3><p>Itens excluídos aparecerão aqui</p></div>`;
        return;
      }
      body.innerHTML = `<div class="trash-grid">${items.map((t, i) => `
      <div class="trash-it" data-i="${i}">
        <i class="${t.ic || 'fas fa-file'}"></i>
        <div class="nm">${t.n}</div>
        <div class="dt">${new Date(t.deletedAt).toLocaleDateString('pt-BR')}</div>
      </div>`).join('')}</div>`;
      body.querySelectorAll('.trash-it').forEach(el => {
        el.oncontextmenu = e => {
          e.preventDefault();
          const i = +el.dataset.i, t = LS.trash()[i];
          ctx.innerHTML = `<div class="cti" data-tr="rest"><i class="fas fa-undo"></i> Restaurar</div><div class="cti" data-tr="del"><i class="fas fa-times"></i> Excluir definitivamente</div>`;
          showCtxAt(e.clientX, e.clientY);
          ctx.querySelectorAll('.cti').forEach(x => x.onclick = () => {
            const a = x.dataset.tr; const arr = LS.trash();
            if (a === 'rest') {
              if (t.wasCustom) { const c = LS.customIcons(); c.push(t); LS.setCustomIcons(c); }
              const h = LS.hidden().filter(x => x !== t.id); LS.setHidden(h);
            }
            arr.splice(i, 1); LS.setTrash(arr); renderDesktop(); renderTrashBody(win); hideCtx();
          });
        };
        el.ondblclick = () => {
          const i = +el.dataset.i, t = LS.trash()[i];
          if (confirm(`Restaurar "${t.n}"?`)) {
            if (t.wasCustom) { const c = LS.customIcons(); c.push(t); LS.setCustomIcons(c); }
            const h = LS.hidden().filter(x => x !== t.id); LS.setHidden(h);
            const arr = LS.trash(); arr.splice(i, 1); LS.setTrash(arr);
            renderDesktop(); renderTrashBody(win);
          }
        };
      });
    }

    // ---------- VIRTUAL MACHINES APP ----------
    const VMS = [
      {
        cat: 'Windows', items: [
          { id: 'win11', n: 'Windows 11 (Web Demo)', ic: 'fab fa-windows', desc: 'Emulação Windows 11 via web — interface completa', url: 'https://win11.blueedge.me/' },
          { id: 'win10', n: 'Windows 10 (Web)', ic: 'fab fa-windows', desc: 'Windows 10 emulado em JavaScript', url: 'https://win10.blueedge.me/' },
          { id: 'winxp', n: 'Windows XP (v86)', ic: 'fab fa-windows', desc: 'Windows XP rodando em v86 (emulador x86)', url: 'https://copy.sh/v86/?profile=windows2000' },
          { id: 'win98', n: 'Windows 98', ic: 'fab fa-windows', desc: 'Windows 98 clássico em v86', url: 'https://copy.sh/v86/?profile=windows98' },
        ]
      },
      {
        cat: 'Linux', items: [
          { id: 'ubuntu', n: 'Ubuntu Linux', ic: 'fab fa-ubuntu', desc: 'Ubuntu rodando direto no navegador', url: 'https://bellard.org/jslinux/vm.html?cpu=riscv64&url=buildroot-riscv64.cfg&mem=256' },
          { id: 'alpine', n: 'Alpine Linux', ic: 'fab fa-linux', desc: 'Distro leve via v86', url: 'https://copy.sh/v86/?profile=linux26' },
          { id: 'debian', n: 'Debian', ic: 'fab fa-debian', desc: 'Debian Linux via JSLinux', url: 'https://bellard.org/jslinux/vm.html?cpu=x86&url=https://bellard.org/jslinux/buildroot-x86.cfg&mem=192' },
        ]
      },
      {
        cat: 'Android & Mobile', items: [
          { id: 'android', n: 'Android (Demo)', ic: 'fab fa-android', desc: 'Emulador Android web', url: 'https://www.geo.tv/' },
          { id: 'androsim', n: 'Android Simulator', ic: 'fab fa-android', desc: 'Simulador de interface Android', url: 'https://appetize.io/embed/b0gfn0kpemmbq3a5wykcwumg34?device=pixel4&osVersion=11.0&scale=75&autoplay=false' },
        ]
      },
      {
        cat: 'Outros sistemas', items: [
          { id: 'macos9', n: 'Mac OS 9 (PCE)', ic: 'fab fa-apple', desc: 'Mac OS clássico em JavaScript', url: 'https://infinitemac.org/1999/Mac%20OS%209.0.4' },
          { id: 'kolibri', n: 'KolibriOS', ic: 'fas fa-circle-notch', desc: 'OS minúsculo em assembly via v86', url: 'https://copy.sh/v86/?profile=kolibri' },
          { id: 'freedos', n: 'FreeDOS', ic: 'fas fa-terminal', desc: 'DOS livre via v86', url: 'https://copy.sh/v86/?profile=freedos' },
          { id: 'haiku', n: 'Haiku OS', ic: 'fas fa-rocket', desc: 'Sucessor do BeOS via v86', url: 'https://copy.sh/v86/?profile=haiku' },
        ]
      },
      {
        cat: 'Jogos & Plataformas', items: [
          { id: 'roblox', n: 'Roblox (Web)', ic: 'fas fa-cube', desc: 'Acessa Roblox via portal web', url: 'https://www.roblox.com/' },
          { id: 'ff', n: 'Free Fire Web', ic: 'fas fa-fire', desc: 'Portal Free Fire (Garena)', url: 'https://ff.garena.com/' },
          { id: 'cod', n: 'Call of Duty Web', ic: 'fas fa-crosshairs', desc: 'Portal Call of Duty', url: 'https://www.callofduty.com/' },
          { id: 'msdos', n: 'MS-DOS Games Archive', ic: 'fas fa-gamepad', desc: 'Centenas de jogos clássicos DOS no Archive.org', url: 'https://archive.org/details/softwarelibrary_msdos_games' },
          { id: 'flash', n: 'Flash Games', ic: 'fas fa-bolt', desc: 'Coleção Flashpoint via web', url: 'https://flashpointarchive.org/' },
          { id: 'discrod', n: 'Discrod', ic: '<i class="fab fa-discord" style="color:#5865F2"></i>', cat: 'util' },
        ]
      },
    ];

    function openVM() {
      const sb = VMS.map(g => `<div class="vm-cat">${g.cat}</div>` + g.items.map(it => `<div class="vm-item" data-vm="${it.id}"><i class="${it.ic}"></i> ${it.n}</div>`).join('')).join('');
      const win = createWin('Máquinas Virtuais', '<i class="fas fa-server" style="color:#7eb6ff"></i>', `
      <div class="vm-wrap">
        <div class="vm-sb">${sb}</div>
        <div class="vm-main">
          <div class="vm-hero" id="vm-hero">
            <h2>🖥️ Máquinas Virtuais VessieOS</h2>
            <p>Escolha um sistema operacional ou plataforma para iniciar a máquina virtual. Suporta Windows, Linux, Android, Mac OS e jogos clássicos rodando diretamente no navegador via v86, JSLinux e portais web.</p>
          </div>
          <div class="vm-actions" id="vm-actions" style="display:none">
            <button class="vm-btn" id="vm-reload"><i class="fas fa-sync"></i> Reiniciar</button>
            <button class="vm-btn" id="vm-fs"><i class="fas fa-expand"></i> Tela cheia</button>
            <button class="vm-btn" id="vm-open"><i class="fas fa-external-link-alt"></i> Abrir em nova aba</button>
            <button class="vm-btn danger" id="vm-stop"><i class="fas fa-stop"></i> Parar VM</button>
          </div>
          <div class="vm-frame" id="vm-frame">
            <div class="vm-ph"><i class="fas fa-server"></i><h3>Nenhuma VM ativa</h3><p>Selecione um sistema na barra lateral</p></div>
          </div>
        </div>
      </div>
    `, 1000, 640);
      win.dataset.app = 'vm';
      const frame = win.querySelector('#vm-frame');
      const actions = win.querySelector('#vm-actions');
      const hero = win.querySelector('#vm-hero');
      let currentUrl = null, currentVM = null;
      function startVM(it) {
        currentUrl = it.url; currentVM = it;
        hero.innerHTML = `<h2><i class="${it.ic}"></i> ${it.n}</h2><p>${it.desc}</p>`;
        frame.innerHTML = `<iframe src="${it.url}" allow="fullscreen;autoplay;gamepad;microphone;camera;clipboard-read;clipboard-write" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals"></iframe>`;
        actions.style.display = 'flex';
        win.querySelectorAll('.vm-item').forEach(x => x.classList.toggle('ac', x.dataset.vm === it.id));
        toast('Iniciando ' + it.n + '...');
      }
      win.querySelectorAll('.vm-item').forEach(el => {
        el.onclick = () => {
          const id = el.dataset.vm; const it = VMS.flatMap(g => g.items).find(i => i.id === id); if (it) startVM(it);
        };
      });
      win.querySelector('#vm-reload').onclick = () => { if (currentVM) startVM(currentVM); };
      win.querySelector('#vm-fs').onclick = () => { const f = frame.querySelector('iframe'); if (f && f.requestFullscreen) f.requestFullscreen(); };
      win.querySelector('#vm-open').onclick = () => { if (currentUrl) window.open(currentUrl, '_blank'); };
      win.querySelector('#vm-stop').onclick = () => {
        frame.innerHTML = `<div class="vm-ph"><i class="fas fa-server"></i><h3>VM parada</h3></div>`;
        actions.style.display = 'none';
        win.querySelectorAll('.vm-item.ac').forEach(x => x.classList.remove('ac'));
        currentUrl = null; currentVM = null;
      };
    }

    // ---------- TASKBAR SELECTION RECTANGLE ----------
    let selStart = null;
    const selRect = document.createElement('div'); selRect.id = 'selrect';
    desktop.appendChild(selRect);
    desktop.addEventListener('mousedown', e => {
      if (e.button !== 0 || e.target.closest('.di') || e.target.closest('.win') || e.target.closest('#ctx')) return;
      selStart = { x: e.clientX, y: e.clientY };
      Object.assign(selRect.style, { display: 'block', left: e.clientX + 'px', top: e.clientY + 'px', width: '0px', height: '0px' });
      document.querySelectorAll('.di.sel').forEach(x => x.classList.remove('sel'));
    });
    window.addEventListener('mousemove', e => {
      if (!selStart) return;
      const x = Math.min(e.clientX, selStart.x), y = Math.min(e.clientY, selStart.y);
      const w = Math.abs(e.clientX - selStart.x), h = Math.abs(e.clientY - selStart.y);
      Object.assign(selRect.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
      const r = { x, y, w, h };
      document.querySelectorAll('.di').forEach(el => {
        const b = el.getBoundingClientRect();
        const hit = b.right > r.x && b.left < r.x + r.w && b.bottom > r.y && b.top < r.y + r.h;
        el.classList.toggle('sel', hit);
      });
    });
    window.addEventListener('mouseup', () => { selStart = null; selRect.style.display = 'none'; });

    // ---------- KEYBOARD SHORTCUTS ----------
    document.addEventListener('keydown', e => {
      if (e.key === 'Delete') {
        const sels = document.querySelectorAll('.di.sel');
        if (sels.length) {
          sels.forEach(el => {
            const id = el.dataset.appId;
            const app = getDesktopApps().find(a => a.id === id); if (app) iconCmd('trash', app);
          });
        }
      }
      if (e.key === 'F2') {
        const s = document.querySelector('.di.sel'); if (s) { const id = s.dataset.appId; const app = getDesktopApps().find(a => a.id === id); if (app) iconCmd('rename', app); }
      }
      if (e.key === 'F5') { e.preventDefault(); renderDesktop(); }
      if (e.ctrlKey && e.key.toLowerCase() === 'a' && !e.target.closest('input,textarea')) {
        e.preventDefault(); document.querySelectorAll('.di').forEach(d => d.classList.add('sel'));
      }
    });

    // ---------- INITIAL RENDER ----------
    // re-render after a tick to apply if desktop is already shown
    setTimeout(() => { if (document.getElementById('desktop').style.display !== 'none') renderDesktop(); }, 200);

    console.log('%c💜 VessieOS Ultra v4.0 loaded', 'background:linear-gradient(90deg,#c46fff,#7a3eb8);color:#fff;padding:6px 14px;border-radius:6px;font-weight:bold');
  })();

  /* ============================================================
     ULTRA POLISH v5 · Real-app UI + Theme grid + Multi-area Snap
     ============================================================ */
  (function polish() {
    const css = document.createElement('style');
    css.textContent = `
  /* Theme grid (Settings) */
  .theme-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:6px}
  .theme-card{background:rgba(255,255,255,.04);border:1px solid var(--hairline);border-radius:10px;padding:8px;cursor:pointer;transition:.16s var(--ease);display:flex;flex-direction:column;gap:6px;align-items:stretch}
  .theme-card:hover{background:rgba(255,255,255,.08);transform:translateY(-2px);border-color:var(--border-strong)}
  .theme-card.ac{border-color:var(--a);box-shadow:0 0 0 2px var(--acc-glow)}
  .theme-card .tc-pre{height:42px;border-radius:7px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 4px 10px rgba(0,0,0,.3)}
  .theme-card span{font-size:.7rem;color:var(--text-2);text-align:center;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

  /* ============ NOTEPAD (Win11 Notepad real-look) ============ */
  .npad{background:#1f1f1f}
  .npad-tb{background:#2b2b2b;border-bottom:1px solid #1a1a1a;padding:6px 10px;gap:4px;display:flex;align-items:center}
  .npad-tb button{background:transparent;border:1px solid transparent;color:#e8e8e8;padding:5px 10px;border-radius:4px;font-size:.78rem;font-weight:400}
  .npad-tb button:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.04)}
  .npad-tb span{color:#9c9c9c;font-size:.74rem}
  .npad-area{background:#1f1f1f;color:#f0f0f0;font-family:'Consolas','Cascadia Mono',monospace;font-size:14px;padding:16px 22px;line-height:1.65;caret-color:#fff}

  /* ============ CALCULATOR (Win11 Calculator real-look) ============ */
  .calc{background:#202020;padding:14px;gap:6px}
  .c-disp{background:transparent;border:none;padding:8px 12px 18px}
  .c-expr{color:#9c9c9c;font-size:.85rem;text-align:right}
  .c-val{color:#fff;font-size:2.6rem;font-weight:600;letter-spacing:-.02em;text-align:right}
  .c-grid{gap:4px}
  .cb{background:#323232;border:none;color:#fff;border-radius:4px;height:52px;font-size:1rem;font-weight:400;transition:background .1s}
  .cb:hover{background:#3d3d3d}
  .cb.op{background:#2b2b2b;color:var(--a)}
  .cb.op:hover{background:#3a3a3a}
  .cb.eq{background:linear-gradient(180deg,var(--a),var(--a3));color:#000;font-weight:600;box-shadow:none}
  .cb.cl{background:#2b2b2b;color:#fff}

  /* ============ TERMINAL (Windows Terminal real-look) ============ */
  .term{background:#0c0c0c}
  .t-out{background:#0c0c0c;color:#cccccc;font-family:'Cascadia Code','Cascadia Mono','Consolas',monospace;font-size:13px;line-height:1.5;padding:14px 18px}
  .t-out .tc2{color:#3a96dd}
  .t-out .te{color:#e74856}
  .t-out .ti{color:#f9f1a5}
  .t-bar{background:#0c0c0c;border-top:1px solid #1f1f1f;padding:6px 18px}
  .t-prompt{color:#16c60c;font-weight:600;font-family:'Cascadia Code',monospace}
  .t-prompt::before{content:'PS '; color:#3a96dd}
  .t-inp{color:#cccccc;font-family:'Cascadia Code',monospace;font-size:13px;caret-color:#fff}
  /* Terminal window chrome tinted */
  .win:has(.term) .wh{background:linear-gradient(180deg,#1a1a1a,#0c0c0c);border-bottom:1px solid #1f1f1f}

  /* ============ FILE EXPLORER (Win11 Explorer real-look) ============ */
  .fexp{background:#202020}
  .fesb{background:#1d1d1d;border-right:1px solid #2b2b2b;padding:8px 6px;width:220px}
  .fesb .fld{padding:7px 12px;border-radius:4px;font-size:.82rem;color:#dcdcdc;font-weight:400}
  .fesb .fld i{color:#dcb67a;width:16px}
  .fesb .fld:hover{background:rgba(255,255,255,.06)}
  .fesb .fld.ac{background:rgba(96,165,250,.18)}
  .fesb .fld.ac i{color:var(--a)}
  .fem{background:#202020;padding:10px 14px}
  .fe-tb{background:#1d1d1d;border:1px solid #2b2b2b;border-radius:4px;padding:6px;gap:4px;align-items:center}
  .fe-path{background:#2b2b2b;border:1px solid transparent;border-radius:4px;color:#e0e0e0;font-family:'Segoe UI Variable',sans-serif;font-size:.8rem;padding:6px 10px}
  .fe-tbtn{background:transparent;border:1px solid transparent;color:#e0e0e0;border-radius:4px;font-size:.78rem;padding:5px 10px}
  .fe-tbtn:hover{background:rgba(255,255,255,.07)}
  .fi i{color:#dcb67a;font-size:2.2rem}
  .fi:hover{background:rgba(255,255,255,.05)}
  .fi.sel{background:rgba(96,165,250,.22);border-color:rgba(96,165,250,.5)}
  .fi span{color:#f0f0f0;font-size:.74rem}

  /* ============ BROWSER (Edge real-look) ============ */
  .brow{background:#202124}
  .brow-bar{background:#323639;border-bottom:1px solid #1a1a1a;padding:8px 10px;gap:6px;display:flex;align-items:center}
  .brow-bar input{background:#202124;border:1px solid transparent;border-radius:22px;padding:8px 18px;color:#e8eaed;font-size:.84rem;height:36px}
  .brow-bar input:focus{background:#202124;border-color:var(--a);box-shadow:0 0 0 2px var(--acc-glow)}
  .bnav{background:transparent;border:none;color:#e8eaed;width:34px;height:34px;border-radius:50%;font-size:.88rem}
  .bnav:hover{background:rgba(255,255,255,.08)}
  .brow-frame{background:#fff}

  /* ============ MUSIC (Spotify-inspired) ============ */
  .mplayer{background:linear-gradient(180deg,#181818,#000);padding:30px 26px;gap:18px;justify-content:flex-start;padding-top:40px}
  .mc-cover{width:200px;height:200px;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.04);background:linear-gradient(135deg,var(--a),var(--a2))!important;animation:none!important;font-size:4.2rem}
  .mc-cover.playing{animation:none!important}
  .mc-title{color:#fff;font-size:1.4rem;font-weight:700;letter-spacing:-.02em}
  .mc-art{color:#b3b3b3;font-size:.92rem;font-weight:500}
  .mc-prog-bar{background:rgba(255,255,255,.18);height:5px;border-radius:3px}
  .mc-prog-fill{background:#fff;border-radius:3px}
  .mc-prog-bar:hover .mc-prog-fill{background:#1ed760}
  .mc-time{color:#a7a7a7}
  .mc-ctrl{gap:18px;margin-top:14px}
  .mc-ctrl button{color:#b3b3b3;font-size:1.15rem;width:38px;height:38px}
  .mc-ctrl button:hover{color:#fff;background:transparent;transform:scale(1.08)}
  .mc-play{background:#fff!important;color:#000!important;width:56px!important;height:56px!important;box-shadow:0 4px 14px rgba(0,0,0,.5)!important}
  .mc-play:hover{background:#fff!important;transform:scale(1.06);filter:none}
  .mc-vol input{accent-color:#1ed760}

  /* ============ VESSIE AI (ChatGPT-inspired) ============ */
  .chat-msgs{background:#212121}
  .msg.ai .mb{background:#2f2f2f;border:none;color:#ececec;border-radius:18px;padding:14px 18px;font-size:.9rem;line-height:1.6}
  .msg.u .mb{background:#414158;color:#fff;border-radius:18px;padding:12px 16px;background-image:none}
  .chat-bar{background:#212121;border-top:1px solid #2f2f2f;padding:14px 16px}
  .chat-bar input{background:#2f2f2f;border:1px solid transparent;border-radius:22px;padding:12px 18px}
  .chat-bar input:focus{border-color:var(--a)}
  .chat-send{background:#fff!important;color:#000!important;border-radius:50%!important;box-shadow:none!important}
  .chat-send:hover{filter:brightness(.92);transform:none}
  .vessy-header{background:#212121;border-bottom:1px solid #2f2f2f}

  /* ============ DASHBOARD polish ============ */
  .dash{background:linear-gradient(180deg,rgba(96,165,250,.04),transparent 30%)}

  /* ============ SETTINGS polish (Win11 Settings real-look) ============ */
  .sett{background:transparent;padding:28px 32px}
  .s-sec h3{font-size:1rem;font-weight:600;color:#fff;padding-bottom:12px;margin-bottom:16px}

  /* ============ MULTI-AREA SNAP OVERLAY ============ */
  #snap-ov{position:fixed;inset:0;pointer-events:none;z-index:480;display:none}
  #snap-ov.show{display:block}
  .snap-zone{position:absolute;background:rgba(96,165,250,.18);border:2px solid var(--a);border-radius:10px;opacity:0;transition:opacity .14s var(--ease);box-shadow:0 0 30px var(--acc-glow),inset 0 0 30px rgba(255,255,255,.04);backdrop-filter:blur(10px)}
  .snap-zone.on{opacity:1}
  /* snap hint chip */
  #snap-hint{position:fixed;top:8px;left:50%;transform:translateX(-50%);background:var(--acrylic-strong);backdrop-filter:blur(24px);border:1px solid var(--border-strong);padding:8px 16px;border-radius:24px;color:#fff;font-size:.78rem;font-weight:500;z-index:9999;display:none;box-shadow:var(--shadow-2)}
  #snap-hint.show{display:block;animation:fu .2s var(--ease)}
  #snap-hint kbd{background:rgba(255,255,255,.1);border:1px solid var(--border);padding:1px 6px;border-radius:4px;font-family:inherit;font-size:.74rem;margin:0 2px}
  `;
    document.head.appendChild(css);

    // ============================================================
    //  APP: DISCROD (Chat com Webhook do Discord)
    //  - Login com [S} Login user pass
    //  - Mensagens com [G} mensagem
    //  - Figurinhas, Fotos, Comandos
    //  - Webhook configurável via Settings
    // ============================================================
    (function () {
      "use strict";

      // Nome padrão do app
      const APP_ID = 'discrod';

      // Chaves do localStorage
      const LS_WEBHOOK = 'discrod_webhook';
      const LS_USERS = 'discrod_users';
      const LS_MESSAGES = 'discrod_messages';
      const LS_SESSION = 'discrod_session';

      // Estado interno
      const state = {
        webhookUrl: localStorage.getItem(LS_WEBHOOK) || 'https://discord.com/api/webhooks/1507799363496181912/y_bVPzaG243vEMDDE5ghOdgf4xgi1-U_oFTSyP6sJcUO_os-HyXr-ygDshEKddZ8OtRN',
        currentUser: null,
        messages: JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]'),
        users: JSON.parse(localStorage.getItem(LS_USERS) || '{}'),
        sessionId: Date.now() + '_' + Math.random().toString(36).slice(2, 6)
      };

      // Salva estado
      function saveMessages() {
        localStorage.setItem(LS_MESSAGES, JSON.stringify(state.messages));
      }
      function saveUsers() {
        localStorage.setItem(LS_USERS, JSON.stringify(state.users));
      }
      function saveWebhook(url) {
        state.webhookUrl = url;
        localStorage.setItem(LS_WEBHOOK, url);
      }

      // Broadcast Channel para sincronizar entre abas
      let channel = null;
      try {
        channel = new BroadcastChannel('discrod_channel');
        channel.onmessage = (e) => {
          const data = e.data;
          if (data.type === 'new_msg') {
            state.messages.push(data.msg);
            saveMessages();
            renderMessages();
          } else if (data.type === 'sync_users') {
            state.users = data.users;
            saveUsers();
          } else if (data.type === 'login_sync') {
            // Se outro usuário logou com o mesmo nome, força logout local
            if (state.currentUser && data.username === state.currentUser) {
              toast('⚠️ Outra sessão logou com seu nome!', 'error');
              state.currentUser = null;
              localStorage.removeItem(LS_SESSION);
              showLogin();
            }
          }
        };
      } catch (e) { }

      // Função para enviar ao Discord via Webhook
      async function sendToWebhook(content, file = null) {
        if (!state.webhookUrl) {
          toast('❌ Webhook não configurado! Vá em Configurações.', 'error');
          return false;
        }
        try {
          let body;
          let headers = {};
          if (file) {
            const formData = new FormData();
            formData.append('payload_json', JSON.stringify({ content }));
            formData.append('file', file, file.name);
            body = formData;
          } else {
            body = JSON.stringify({ content });
            headers['Content-Type'] = 'application/json';
          }
          const res = await fetch(state.webhookUrl, { method: 'POST', body, headers });
          if (!res.ok) throw new Error(`Erro ${res.status}`);
          return true;
        } catch (err) {
          toast('Erro ao enviar: ' + err.message, 'error');
          return false;
        }
      }

      // ============ RENDERIZAÇÃO DA UI ============
      let winRef = null;
      let loginContainer = null;
      let chatContainer = null;
      let msgListEl = null;
      let inputEl = null;

      function renderMessages() {
        if (!msgListEl) return;
        msgListEl.innerHTML = '';
        state.messages.forEach(msg => {
          const div = document.createElement('div');
          div.className = `msg-chat ${msg.username === state.currentUser ? 'my' : 'other'}`;
          const time = new Date(msg.timestamp).toLocaleTimeString('pt-BR');
          let contentHtml = '';
          if (msg.type === 'image') {
            contentHtml = `<img src="${msg.content}" style="max-width:200px;max-height:150px;border-radius:8px;margin-top:4px">`;
          } else if (msg.type === 'sticker') {
            contentHtml = `<span style="font-size:2.2rem">${msg.content}</span>`;
          } else {
            contentHtml = `<span>${msg.content}</span>`;
          }
          div.innerHTML = `
        <div style="display:flex;gap:8px;align-items:baseline;margin-bottom:2px">
          <strong style="color:${msg.username === state.currentUser ? 'var(--a)' : '#c084fc'}">${msg.username}</strong>
          <span style="font-size:.65rem;color:var(--dim)">${time}</span>
        </div>
        <div>${contentHtml}</div>
      `;
          msgListEl.appendChild(div);
        });
        msgListEl.scrollTop = msgListEl.scrollHeight;
      }

      function showLogin() {
        if (loginContainer) loginContainer.style.display = 'flex';
        if (chatContainer) chatContainer.style.display = 'none';
      }

      function showChat() {
        if (loginContainer) loginContainer.style.display = 'none';
        if (chatContainer) chatContainer.style.display = 'flex';
        renderMessages();
      }

      function buildUI(win) {
        winRef = win;
        const body = win.querySelector('.wb');
        body.style.overflow = 'hidden';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        body.style.background = 'var(--bg-w)';

        // Login Overlay
        loginContainer = document.createElement('div');
        loginContainer.style.cssText = `
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      height:100%; gap:16px; background:rgba(0,0,0,.3); padding:20px;
    `;
        loginContainer.innerHTML = `
      <div style="font-size:3rem">💬</div>
      <h2 style="color:#fff;margin:0">Discrod</h2>
      <p style="color:var(--dim);margin:0">Digite seu nome e senha para entrar</p>
      <input id="drd-login-user" placeholder="Usuário" style="width:80%;padding:10px 16px;border-radius:10px;border:1px solid var(--border);background:rgba(255,255,255,.06);color:#fff;font-size:.95rem;outline:none">
      <input id="drd-login-pass" type="password" placeholder="Senha" style="width:80%;padding:10px 16px;border-radius:10px;border:1px solid var(--border);background:rgba(255,255,255,.06);color:#fff;font-size:.95rem;outline:none">
      <button id="drd-login-btn" style="width:80%;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--a),var(--a2));color:#fff;font-weight:600;font-size:1rem;cursor:pointer">Entrar</button>
      <div id="drd-login-error" style="color:#f87171;font-size:.85rem;min-height:24px"></div>
    `;
        body.appendChild(loginContainer);

        // Chat Container
        chatContainer = document.createElement('div');
        chatContainer.style.cssText = `
      display:none; flex-direction:column; height:100%; width:100%;
    `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
      display:flex; justify-content:space-between; align-items:center;
      padding:10px 18px; background:rgba(255,255,255,.04);
      border-bottom:1px solid var(--hairline); flex-shrink:0;
    `;
        header.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-weight:600" id="drd-header-user">Usuário</span>
        <span style="font-size:.7rem;color:#4ade80">● Online</span>
      </div>
      <div style="display:flex;gap:6px">
        <button id="drd-sync-btn" style="background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--text);padding:4px 10px;border-radius:6px;font-size:.72rem;cursor:pointer"><i class="fas fa-sync-alt"></i> Sinc</button>
        <button id="drd-settings-btn" style="background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--text);padding:4px 10px;border-radius:6px;font-size:.72rem;cursor:pointer"><i class="fas fa-cog"></i></button>
        <button id="drd-logout-btn" style="background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);color:#f87171;padding:4px 10px;border-radius:6px;font-size:.72rem;cursor:pointer">Sair</button>
      </div>
    `;
        chatContainer.appendChild(header);

        // Message List
        msgListEl = document.createElement('div');
        msgListEl.style.cssText = `
      flex:1; overflow-y:auto; padding:14px 18px; display:flex; flex-direction:column; gap:12px;
      background:rgba(0,0,0,.12);
    `;
        chatContainer.appendChild(msgListEl);

        // Input Bar
        const inputBar = document.createElement('div');
        inputBar.style.cssText = `
      display:flex; align-items:center; gap:6px; padding:10px 14px;
      background:rgba(0,0,0,.2); border-top:1px solid var(--hairline); flex-shrink:0;
    `;
        inputBar.innerHTML = `
      <button id="drd-sticker-btn" style="background:none;border:none;color:var(--dim);font-size:1.1rem;cursor:pointer" title="Figurinhas">😊</button>
      <label for="drd-file-input" style="background:none;border:none;color:var(--dim);font-size:1.1rem;cursor:pointer" title="Foto/Arquivo"><i class="fas fa-paperclip"></i></label>
      <input type="file" id="drd-file-input" accept="image/*" style="display:none">
      <input id="drd-msg-input" placeholder="Digite sua mensagem..." style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:20px;padding:10px 16px;color:#fff;outline:none;font-size:.9rem;">
      <button id="drd-send-btn" style="background:linear-gradient(135deg,var(--a),var(--a2));border:none;color:#fff;border-radius:50%;width:40px;height:40px;cursor:pointer;font-size:1rem"><i class="fas fa-paper-plane"></i></button>
    `;
        chatContainer.appendChild(inputBar);

        body.appendChild(chatContainer);

        // ============ EVENTOS ============

        // Login
        document.getElementById('drd-login-btn').onclick = () => {
          const user = document.getElementById('drd-login-user').value.trim();
          const pass = document.getElementById('drd-login-pass').value.trim();
          const errEl = document.getElementById('drd-login-error');
          if (!user || !pass) { errEl.textContent = 'Preencha usuário e senha'; return; }

          // Verifica se já está logado
          if (state.users[user] && state.users[user].active === true) {
            errEl.textContent = '❌ Usuário já está logado em outra sessão!';
            return;
          }

          // Atualiza estado
          state.users[user] = { password: pass, active: true, session: state.sessionId };
          saveUsers();
          state.currentUser = user;
          localStorage.setItem(LS_SESSION, JSON.stringify({ username: user, sessionId: state.sessionId }));

          // Envia login para o Discord
          const loginMsg = `[S} Login ${user} ${pass}`;
          sendToWebhook(loginMsg);

          // Notifica outras abas
          if (channel) channel.postMessage({ type: 'login_sync', username: user });

          // Entra no chat
          showChat();
          document.getElementById('drd-header-user').textContent = user;
          toast(`Bem-vindo, ${user}! 💬`, 'success');

          // Adiciona mensagem de boas-vindas local
          state.messages.push({ username: 'Sistema', content: `${user} entrou no chat.`, timestamp: Date.now(), type: 'text' });
          saveMessages();
          renderMessages();
        };

        // Logout
        document.getElementById('drd-logout-btn').onclick = () => {
          if (state.currentUser) {
            state.users[state.currentUser].active = false;
            saveUsers();
            sendToWebhook(`[S} Logout ${state.currentUser}`);
          }
          state.currentUser = null;
          localStorage.removeItem(LS_SESSION);
          showLogin();
          toast('Desconectado', 'default');
        };

        // Enviar Mensagem
        async function sendMessage() {
          const input = document.getElementById('drd-msg-input');
          const text = input.value.trim();
          if (!text) return;

          const msgObj = {
            username: state.currentUser,
            content: text,
            timestamp: Date.now(),
            type: 'text'
          };

          // Salva local
          state.messages.push(msgObj);
          saveMessages();
          renderMessages();
          input.value = '';

          // Envia para o Discord com prefixo [G}
          const discordContent = `[G} ${text}`;
          await sendToWebhook(discordContent);

          // Broadcast para outras abas
          if (channel) channel.postMessage({ type: 'new_msg', msg: msgObj });
        }

        document.getElementById('drd-send-btn').onclick = sendMessage;
        document.getElementById('drd-msg-input').onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };

        // Figurinhas (Emojis rápidos)
        const stickerPicker = document.createElement('div');
        stickerPicker.id = 'drd-sticker-picker';
        stickerPicker.style.cssText = `
      display:none; position:absolute; bottom:70px; left:20px;
      background:var(--acrylic-strong); border:1px solid var(--border); border-radius:12px;
      padding:10px; gap:6px; flex-wrap:wrap; max-width:260px; max-height:150px; overflow-y:auto;
      backdrop-filter:blur(20px); z-index:10;
    `;
        const stickers = ['😊', '😂', '❤️', '🔥', '🎉', '💜', '✨', '🥺', '🤡', '👀', '🚀', '🌈', '🍕', '🎮', '💀', '😎', '🤖', '👾', '⭐', '🌀'];
        stickers.forEach(s => {
          const span = document.createElement('span');
          span.textContent = s;
          span.style.cssText = 'font-size:1.8rem;cursor:pointer;padding:4px;border-radius:6px;transition:.1s';
          span.onmouseenter = () => span.style.background = 'rgba(255,255,255,.1)';
          span.onmouseleave = () => span.style.background = 'transparent';
          span.onclick = () => {
            const msgObj = { username: state.currentUser, content: s, timestamp: Date.now(), type: 'sticker' };
            state.messages.push(msgObj);
            saveMessages();
            renderMessages();
            sendToWebhook(`[G} (Sticker) ${s}`);
            if (channel) channel.postMessage({ type: 'new_msg', msg: msgObj });
            stickerPicker.style.display = 'none';
          };
          stickerPicker.appendChild(span);
        });
        inputBar.appendChild(stickerPicker);
        document.getElementById('drd-sticker-btn').onclick = (e) => {
          e.stopPropagation();
          stickerPicker.style.display = stickerPicker.style.display === 'flex' ? 'none' : 'flex';
        };
        document.addEventListener('click', () => { stickerPicker.style.display = 'none'; });

        // Upload de Fotos
        document.getElementById('drd-file-input').onchange = async function (e) {
          const file = this.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = async (ev) => {
            const dataUrl = ev.target.result;
            const msgObj = { username: state.currentUser, content: dataUrl, timestamp: Date.now(), type: 'image' };
            state.messages.push(msgObj);
            saveMessages();
            renderMessages();
            // Envia para webhook com anexo
            await sendToWebhook(`[G} (Imagem) ${file.name}`, file);
            if (channel) channel.postMessage({ type: 'new_msg', msg: msgObj });
          };
          reader.readAsDataURL(file);
          this.value = '';
        };

        // Sincronizar manual
        document.getElementById('drd-sync-btn').onclick = () => {
          // Re-carrega mensagens do localStorage (já está sempre atualizado)
          state.messages = JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]');
          renderMessages();
          toast('Sincronizado com armazenamento local', 'success');
          // Tenta puxar via Broadcast também
          if (channel) channel.postMessage({ type: 'sync_users', users: state.users });
        };

        // Configurações (Webhook)
        document.getElementById('drd-settings-btn').onclick = () => {
          const current = state.webhookUrl;
          const newUrl = prompt('✏️ Editar URL do Webhook do Discord:', current);
          if (newUrl !== null && newUrl.trim() !== '') {
            saveWebhook(newUrl.trim());
            toast('Webhook atualizado com sucesso!', 'success');
          }
        };

        // Verifica sessão salva
        try {
          const session = JSON.parse(localStorage.getItem(LS_SESSION) || 'null');
          if (session && state.users[session.username] && state.users[session.username].active === true) {
            state.currentUser = session.username;
            document.getElementById('drd-header-user').textContent = session.username;
            showChat();
            renderMessages();
            toast(`Reconectado como ${session.username}`, 'default');
            return;
          }
        } catch (e) { }
        showLogin();
      }

      // ============ FUNÇÃO PRINCIPAL DO APP ============
      window.openDiscrod = function () {
        // Verifica se já existe uma janela aberta
        const existing = document.querySelector('.win[data-app="discrod"]');
        if (existing) { focusWin(existing.id); return; }

        const win = createWin('Discrod', '<i class="fab fa-discord" style="color:#5865F2"></i>', `<div id="discrod-body"></div>`, 720, 540);
        win.dataset.app = 'discrod';
        buildUI(win);
      };

      // Adiciona à lista de APPS (se existir)
      if (window.APPS && Array.isArray(window.APPS)) {
        const exists = window.APPS.some(a => a.id === APP_ID);
        if (!exists) {
          window.APPS.push({ id: APP_ID, n: 'Discrod', ic: '<i class="fab fa-discord" style="color:#5865F2"></i>', cat: 'util' });
        }
      }

      // Vincula ao openApp existente (patch seguro)
      const origOpenApp = window.openApp;
      if (origOpenApp) {
        window.openApp = function (id) {
          if (id === APP_ID) { window.openDiscrod(); return; }
          return origOpenApp(id);
        };
      } else {
        // Fallback: define global
        window.openApp = function (id) {
          if (id === APP_ID) { window.openDiscrod(); return; }
          toast('App não encontrado', 'error');
        };
      }

      // Estilos extras para o chat
      const style = document.createElement('style');
      style.textContent = `
    .msg-chat { padding:8px 12px; border-radius:12px; max-width:78%; word-wrap:break-word; animation:fu .2s ease; }
    .msg-chat.my { background:var(--a); color:#fff; align-self:flex-end; border-bottom-right-radius:4px; }
    .msg-chat.other { background:rgba(255,255,255,.08); border:1px solid var(--hairline); align-self:flex-start; border-bottom-left-radius:4px; }
    .msg-chat img { border-radius:8px; max-width:100%; }
  `;
      document.head.appendChild(style);

      console.log('✅ App Discrod carregado! Use o menu Iniciar ou digite "discrod" no search.');
    })();

    // ---------- SNAP OVERLAY ----------
    const ov = document.createElement('div'); ov.id = 'snap-ov';
    const TH = 52;
    const mkZone = (l, t, w, h) => { const z = document.createElement('div'); z.className = 'snap-zone'; z.style.cssText = `left:${l};top:${t};width:${w};height:${h}`; ov.appendChild(z); return z; };
    const zL = mkZone('6px', '6px', 'calc(50vw - 9px)', `calc(100vh - ${TH + 12}px)`);
    const zR = mkZone('calc(50vw + 3px)', '6px', 'calc(50vw - 9px)', `calc(100vh - ${TH + 12}px)`);
    const zT = mkZone('6px', '6px', 'calc(100vw - 12px)', `calc(100vh - ${TH + 12}px)`);
    document.body.appendChild(ov);

    // snap functions
    function snapWin(win, side) {
      if (!win) return;
      win.classList.remove('maximized');
      win.style.transition = 'left .18s var(--ease),top .18s var(--ease),width .18s var(--ease),height .18s var(--ease)';
      const H = `calc(100vh - ${TH}px)`;
      if (side === 'left') { Object.assign(win.style, { left: '0px', top: '0px', width: '50vw', height: H }); }
      else if (side === 'right') { Object.assign(win.style, { left: '50vw', top: '0px', width: '50vw', height: H }); }
      else if (side === 'top') { win.classList.add('maximized'); }
      else if (side === 'tl') { Object.assign(win.style, { left: '0px', top: '0px', width: '50vw', height: `calc(50vh - ${TH / 2}px)` }); }
      else if (side === 'tr') { Object.assign(win.style, { left: '50vw', top: '0px', width: '50vw', height: `calc(50vh - ${TH / 2}px)` }); }
      else if (side === 'bl') { Object.assign(win.style, { left: '0px', top: `calc(50vh - ${TH / 2}px)`, width: '50vw', height: `calc(50vh - ${TH / 2}px)` }); }
      else if (side === 'br') { Object.assign(win.style, { left: '50vw', top: `calc(50vh - ${TH / 2}px)`, width: '50vw', height: `calc(50vh - ${TH / 2}px)` }); }
      setTimeout(() => { win.style.transition = ''; }, 220);
    }

    // Drag-to-edge: monitor mouse during drag of any .wh
    let dragWin = null, hovering = null;
    document.addEventListener('mousedown', (e) => {
      const hdr = e.target.closest('.wh');
      if (!hdr || e.target.closest('.wctrl')) return;
      dragWin = hdr.closest('.win');
      ov.classList.add('show');
    }, true);
    document.addEventListener('mousemove', (e) => {
      if (!dragWin) return;
      const x = e.clientX, y = e.clientY, w = window.innerWidth, h = window.innerHeight - TH;
      [zL, zR, zT].forEach(z => z.classList.remove('on'));
      hovering = null;
      if (y < 6) { hovering = 'top'; zT.classList.add('on'); }
      else if (x < 12) { hovering = 'left'; zL.classList.add('on'); }
      else if (x > w - 12) { hovering = 'right'; zR.classList.add('on'); }
    }, true);
    document.addEventListener('mouseup', () => {
      if (dragWin && hovering) { snapWin(dragWin, hovering); }
      dragWin = null; hovering = null;
      [zL, zR, zT].forEach(z => z.classList.remove('on'));
      ov.classList.remove('show');
    }, true);

    // ---------- KEYBOARD: Win+Arrow snap (Alt+Arrow as alt) ----------
    function focusedWin() { return document.querySelector('.win.focused') || document.querySelectorAll('.win:not(.minimized)')[document.querySelectorAll('.win:not(.minimized)').length - 1]; }
    document.addEventListener('keydown', (e) => {
      const mod = e.metaKey || e.altKey;
      if (!mod || !e.key.startsWith('Arrow')) return;
      const w = focusedWin(); if (!w) return;
      e.preventDefault();
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'top', ArrowDown: null };
      if (e.key === 'ArrowDown') { w.classList.remove('maximized'); Object.assign(w.style, { width: '720px', height: '500px', left: '40px', top: '40px' }); return; }
      snapWin(w, map[e.key]);
    });

    // ---------- SNAP HINT (shows briefly first time a window opens) ----------
    const hint = document.createElement('div'); hint.id = 'snap-hint';
    hint.innerHTML = '💡 Arraste para a borda ou use <kbd>Alt</kbd>+<kbd>←→↑</kbd> para dividir a tela';
    document.body.appendChild(hint);
    try {
      if (!localStorage.getItem('vos-snap-hint')) {
        setTimeout(() => { hint.classList.add('show'); setTimeout(() => hint.classList.remove('show'), 4500); localStorage.setItem('vos-snap-hint', '1'); }, 2500);
      }
    } catch (_) { }

    console.log('%c✨ VessieOS Polish v5 — Real-app UI · Themes · Multi-area Snap', 'background:linear-gradient(90deg,#60a5fa,#a78bfa);color:#fff;padding:6px 14px;border-radius:6px;font-weight:bold');
  })();

})();
