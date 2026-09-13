/*!
 * Suíte de testes do VessieOS — sem dependências externas.
 *   node tests/run-tests.js
 */
'use strict';

const assert = require('assert');
const path = require('path');

const VessieURLGuard = require(path.join(__dirname, '..', 'JS/kernel/security/url-guard.js'));
const VessieGamePatterns = require(path.join(__dirname, '..', 'JS/systems/game-patterns.js'));
const { VessieCollector } = require(path.join(__dirname, '..', 'JS/systems/game-collector-v2.js'));
const { GameLibrary } = require(path.join(__dirname, '..', 'JS/systems/game-library.js'));
const VessieIframeDoctor = require(path.join(__dirname, '..', 'JS/systems/iframe-doctor.js'));
const VessieGameAPI = require(path.join(__dirname, '..', 'JS/kernel/modules/scripting/lib/vessie-game-api.js'));
const { VessieScript } = require(path.join(__dirname, '..', 'JS/kernel/modules/scripting/lib/vessiescript.js'));

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

function memoryStorage() {
  const data = new Map();
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)) };
}

function makeLibrary(seed = []) {
  const library = new GameLibrary({ guard: VessieURLGuard, doctor: VessieIframeDoctor, storage: memoryStorage() });
  library.load(seed);
  return library;
}

// ---------------------------------------------------------------- url guard
test('guard bloqueia host em IP cru (exemplo do usuário)', () => {
  const verdict = VessieURLGuard.inspect('http://200.168.0.10/jogo.html');
  assert.strictEqual(verdict.ok, false);
  assert.strictEqual(verdict.reason, VessieURLGuard.REASONS.IP_LITERAL);
});

test('guard bloqueia IP privado, loopback, link-local e CGNAT', () => {
  for (const url of ['https://10.0.0.5/g', 'https://192.168.1.20/g', 'https://127.0.0.1:8080/g', 'https://169.254.1.1/g', 'https://100.64.0.1/g']) {
    assert.strictEqual(VessieURLGuard.inspect(url).ok, false, url);
  }
});

test('guard bloqueia IP ofuscado (decimal, hex, octal, comprimido) e IPv6', () => {
  for (const url of ['https://2130706433/g', 'https://0x7f000001/g', 'https://0177.0.0.1/g', 'https://127.1/g', 'https://[::1]/g']) {
    assert.strictEqual(VessieURLGuard.inspect(url).ok, false, url);
  }
});

test('guard bloqueia hosts locais, portas estranhas, credenciais e executáveis', () => {
  assert.strictEqual(VessieURLGuard.inspect('https://localhost/g').reason, VessieURLGuard.REASONS.LOCAL_HOST);
  assert.strictEqual(VessieURLGuard.inspect('https://painel.local/g').reason, VessieURLGuard.REASONS.LOCAL_HOST);
  assert.strictEqual(VessieURLGuard.inspect('https://site.com:31337/g').reason, VessieURLGuard.REASONS.PORT);
  assert.strictEqual(VessieURLGuard.inspect('https://user:senha@site.com/g').reason, VessieURLGuard.REASONS.CREDENTIALS);
  assert.strictEqual(VessieURLGuard.inspect('https://site.com/setup.exe').reason, VessieURLGuard.REASONS.EXECUTABLE);
  assert.strictEqual(VessieURLGuard.inspect('javascript:alert(1)').reason, VessieURLGuard.REASONS.PROTOCOL);
  assert.strictEqual(VessieURLGuard.inspect('Exemple').ok, false);
});

test('guard aceita jogos legítimos e promove http para https', () => {
  const verdict = VessieURLGuard.inspect('http://orbit-kick.com/games/knife-master/#frag');
  assert.strictEqual(verdict.ok, true);
  assert.strictEqual(verdict.url, 'https://orbit-kick.com/games/knife-master/');
});

test('guard permite bloquear host manualmente', () => {
  VessieURLGuard.blockHost('site-ruim.com');
  assert.strictEqual(VessieURLGuard.inspect('https://site-ruim.com/x').reason, VessieURLGuard.REASONS.BLOCKLIST);
  VessieURLGuard.unblockHost('site-ruim.com');
  assert.strictEqual(VessieURLGuard.inspect('https://site-ruim.com/x').ok, true);
});

// ----------------------------------------------------------------- patterns
const SEED = [
  { n: 'Village Craft', u: 'https://1v1-lol.gitlab.io/go/class-389.html', ic: 'https://jamestore214.github.io/img/class-389.png' },
  { n: 'Shady Bears', u: 'https://1v1-lol.gitlab.io/go/class-379.html', ic: 'https://jamestore214.github.io/img/class-379.png' },
  { n: 'Bitlife', u: 'https://1v1-lol.gitlab.io/go/class-441.html', ic: 'https://jamestore214.github.io/img/class-441.png' },
  { n: 'Knife Master', u: 'https://orbit-kick.com/games/knife-master/', ic: 'https://dam.orbit-kick.com/games/knife-master-cover.png' },
  { n: 'City Brawl', u: 'https://orbit-kick.com/games/city-brawl/', ic: 'https://dam.orbit-kick.com/games/city-brawl-cover.png' },
  { n: 'Exemple', u: 'Exemple', ic: 'Exemple' }
];

test('padrões são aprendidos a partir da lista de jogos existente', () => {
  const knowledge = VessieGamePatterns.learn(SEED);
  assert.ok(knowledge.hosts.includes('1v1-lol.gitlab.io'));
  assert.ok(knowledge.patterns.some((p) => p.template === '/go/class-:num.html' && p.count === 3));
  assert.ok(knowledge.patterns.some((p) => p.template === '/games/:slug/'));
});

test('link novo que segue o padrão do host é aceito, institucional é descartado', () => {
  const knowledge = VessieGamePatterns.learn(SEED);
  const good = VessieGamePatterns.score('https://orbit-kick.com/games/tank-rush/', knowledge);
  const bad = VessieGamePatterns.score('https://orbit-kick.com/privacy-policy', knowledge);
  const asset = VessieGamePatterns.score('https://orbit-kick.com/games/logo.png', knowledge);
  assert.ok(good.score >= 0.6, `esperado alto, veio ${good.score}`);
  assert.strictEqual(bad.score, 0);
  assert.strictEqual(asset.score, 0);
});

test('capa é prevista pelo padrão de imagem do host', () => {
  const knowledge = VessieGamePatterns.learn(SEED);
  const cover = VessieGamePatterns.guessCover('https://orbit-kick.com/games/tank-rush/', knowledge);
  assert.strictEqual(cover, 'https://dam.orbit-kick.com/games/tank-rush-cover.png');
});

test('nome legível é derivado da URL', () => {
  assert.strictEqual(VessieGamePatterns.nameFromUrl('https://x.com/games/tank-rush/'), 'Tank Rush');
});

// ---------------------------------------------------------------- collector
const FAKE_SITE = `
  <html><head><title>Portal</title></head><body>
    <a href="/games/tank-rush/">Tank Rush</a>
    <a href="/games/city-brawl/">City Brawl</a>
    <a href="/privacy-policy">Privacidade</a>
    <a href="http://192.168.0.99/games/backdoor/">Jogo "grátis"</a>
    <a href="https://outro-site.com/games/externo/">Externo</a>
  </body></html>`;

const FAKE_GAME_PAGE = `
  <html><head>
    <meta property="og:title" content="Tank Rush | Orbit Kick">
    <meta property="og:image" content="https://dam.orbit-kick.com/games/tank-rush-cover.png">
  </head><body><canvas></canvas></body></html>`;

function makeCollector() {
  const { JSDOMLike } = require(path.join(__dirname, 'tiny-dom.js'));
  return new VessieCollector({
    guard: VessieURLGuard,
    patterns: VessieGamePatterns,
    parseDOM: (html) => new JSDOMLike(html),
    fetchText: async (url) => (url.includes('/games/') ? FAKE_GAME_PAGE : FAKE_SITE)
  });
}

test('coletor descobre links internos e ignora externos', () => {
  const collector = makeCollector();
  const links = collector.discoverLinks(FAKE_SITE, 'https://orbit-kick.com/');
  assert.ok(links.includes('https://orbit-kick.com/games/tank-rush/'));
  assert.ok(!links.some((l) => l.includes('outro-site.com')));
});

test('coletor separa candidatos, bloqueios de segurança e descartes', async () => {
  const collector = makeCollector();
  collector.train(SEED);
  const result = await collector.collectSite('https://orbit-kick.com/', { limit: 5 });
  assert.ok(result.games.length >= 2);
  assert.ok(result.games.every((g) => g.url.startsWith('https://orbit-kick.com/games/')));
  assert.ok(!result.games.some((g) => g.url.includes('192.168')));
  assert.ok(result.discarded.some((d) => d.url.includes('privacy')));
});

test('coletor recusa site com host em IP cru', async () => {
  const collector = makeCollector();
  await assert.rejects(() => collector.collectSite('http://200.168.0.10/'), /bloqueado/i);
});

test('coletor extrai título e capa da página do jogo', () => {
  const collector = makeCollector();
  const meta = collector.extractMetadata(FAKE_GAME_PAGE, 'https://orbit-kick.com/games/tank-rush/');
  assert.strictEqual(meta.name, 'Tank Rush');
  assert.strictEqual(meta.cover, 'https://dam.orbit-kick.com/games/tank-rush-cover.png');
});

// ------------------------------------------------------------------ library
test('biblioteca normaliza a lista base e descarta registros inválidos', () => {
  const library = makeLibrary(SEED);
  assert.strictEqual(library.all().length, 5);
  assert.ok(!library.all().some((g) => g.url === 'Exemple'));
  assert.ok(library.all().every((g) => g.id && g.name && g.url.startsWith('https://')));
});

test('biblioteca deduplica por identidade de URL', () => {
  const library = makeLibrary(SEED);
  const before = library.all().length;
  const result = library.add({ name: 'Repetido', url: 'https://orbit-kick.com/games/city-brawl/' });
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.reason, 'duplicado');
  assert.strictEqual(library.all().length, before);
});

test('biblioteca recusa envio de jogo com host em IP cru', () => {
  const library = makeLibrary(SEED);
  const result = library.add({ name: 'Trojan', url: 'http://200.168.0.10/game' });
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.reason, VessieURLGuard.REASONS.IP_LITERAL);
});

test('seleção: individual, todos, inverter e exclusão em massa', () => {
  const library = makeLibrary(SEED);
  const all = library.all();
  library.toggle(all[0].id);
  library.toggle(all[1].id);
  assert.strictEqual(library.selectedCount(), 2);
  library.invertSelection();
  assert.strictEqual(library.selectedCount(), all.length - 2);
  library.clearSelection();
  library.selectAll(library.filter('class'));
  const removed = library.deleteSelected();
  assert.strictEqual(removed.length, 3);
  assert.strictEqual(library.all().length, 2);
  assert.strictEqual(library.selectedCount(), 0);
});

test('varredura de segurança remove jogo em IP cru que entrou por fora', () => {
  const library = makeLibrary(SEED);
  library.games.push({ id: 'x1', name: 'Suspeito', url: 'http://200.168.0.10/g', icon: '', cover: '', added: 0, plays: 0 });
  const removed = library.securitySweep();
  assert.strictEqual(removed.length, 1);
  assert.strictEqual(removed[0].blockedReason, VessieURLGuard.REASONS.IP_LITERAL);
  assert.ok(!library.all().some((g) => g.id === 'x1'));
});

test('limpeza de iframe remove apenas quebrados confirmados, nunca "não verificável"', () => {
  const library = makeLibrary(SEED);
  const all = library.all();
  library.applyHealth([
    { id: all[0].id, status: 'error', label: 'x', detail: '', checkedAt: 1 },
    { id: all[1].id, status: 'timeout', label: 'x', detail: '', checkedAt: 1 },
    { id: all[2].id, status: 'unverified', label: 'x', detail: '', checkedAt: 1 },
    { id: all[3].id, status: 'ok', label: 'x', detail: '', checkedAt: 1 }
  ]);
  const removed = library.deleteBroken();
  assert.strictEqual(removed.length, 2);
  assert.ok(library.all().some((g) => g.id === all[2].id));
});

test('export/import preserva jogos válidos e rejeita os perigosos', () => {
  const library = makeLibrary(SEED);
  const json = library.exportJSON();
  const outra = makeLibrary([]);
  const result = outra.importJSON(json);
  assert.strictEqual(result.added.length, 5);

  const sujo = JSON.stringify([{ name: 'Mal', url: 'http://10.0.0.7/x' }, { name: 'Bom', url: 'https://jogos.com/games/ok/' }]);
  const result2 = outra.importJSON(sujo);
  assert.strictEqual(result2.added.length, 1);
  assert.strictEqual(result2.rejected.length, 1);
  assert.strictEqual(result2.rejected[0].reason, VessieURLGuard.REASONS.IP_LITERAL);
});

test('import de JSON inválido não quebra a biblioteca', () => {
  const library = makeLibrary(SEED);
  const result = library.importJSON('{nada disso');
  assert.strictEqual(result.error, 'JSON inválido');
  assert.strictEqual(library.all().length, 5);
});

test('doctor classifica status quebrado corretamente', () => {
  assert.ok(VessieIframeDoctor.isBroken('timeout'));
  assert.ok(VessieIframeDoctor.isBroken('blocked'));
  assert.ok(!VessieIframeDoctor.isBroken('unverified'));
  assert.ok(!VessieIframeDoctor.isBroken('ok'));
});

test('doctor marca URL recusada pela política sem tocar na rede', async () => {
  const result = await VessieIframeDoctor.probe('http://200.168.0.10/g', { guard: VessieURLGuard });
  assert.strictEqual(result.status, 'blocked');
});

// -------------------------------------------------------------- vessiescript
async function runScript(source, hostAPI = {}) {
  const output = [];
  await VessieScript.run(source, Object.assign({ print: (t) => output.push(t) }, hostAPI));
  return output;
}

test('v2: template string com interpolação', async () => {
  const out = await runScript('var nome = "Vessie"; print(`Olá ${nome}, ${1 + 2} jogos`);');
  assert.deepStrictEqual(out, ['Olá Vessie, 3 jogos']);
});

test('v2: try/catch/finally e throw', async () => {
  const out = await runScript(`
    try { throw "falhou"; }
    catch (e) { print("capturado: " + e); }
    finally { print("fim"); }
  `);
  assert.deepStrictEqual(out, ['capturado: falhou', 'fim']);
});

test('v2: match com arm padrão', async () => {
  const out = await runScript(`
    func classificar(n) {
      return match (n) { 1 => "um", 2 => "dois", _ => "muitos" };
    }
    print(classificar(1)); print(classificar(2)); print(classificar(9));
  `);
  assert.deepStrictEqual(out, ['um', 'dois', 'muitos']);
});

test('v2: funções seta, pipeline e parâmetros padrão', async () => {
  const out = await runScript(`
    func dobro(n) { return n * 2; }
    func somar(a, b = 10) { return a + b; }
    var f = (a, b) => a + b;
    print(f(2, 3));
    print(somar(5));
    print(5 |> dobro);
  `);
  assert.deepStrictEqual(out, ['5', '15', '10']);
});

test('v2: ?? , ?. e **', async () => {
  const out = await runScript(`
    var vazio = null;
    print(vazio ?? "padrao");
    print(vazio?.qualquer ?? "sem objeto");
    print(2 ** 3 ** 2);
  `);
  assert.deepStrictEqual(out, ['padrao', 'sem objeto', '512']);
});

test('v2: biblioteca padrão text/list/math/json', async () => {
  const out = await runScript(`
    print(text.slug("Tank Rush 2!"));
    print(list.map([1, 2, 3], (n) => n * 2));
    print(list.filter([1, 2, 3, 4], (n) => n > 2));
    print(math.sum([1, 2, 3]));
    print(json.encode({ a: 1 }));
  `);
  assert.deepStrictEqual(out, ['tank-rush-2', '[2, 4, 6]', '[3, 4]', '6', '{"a":1}']);
});

test('v2: código v1 continua funcionando (classe, herança, evento)', async () => {
  const out = await runScript(`
    class Base { func oi() { return "base"; } }
    class Filho : Base { override func oi() { return "filho+" + super.oi(); } }
    print(new Filho().oi());
    event aoIniciar;
    aoIniciar += func () { print("iniciou"); };
    aoIniciar();
  `);
  assert.deepStrictEqual(out, ['filho+base', 'iniciou']);
});

// --------------------------------------------------------------- game api
test('script consegue gerenciar a biblioteca pelos módulos games/sec', async () => {
  const library = makeLibrary(SEED);
  const hostAPI = VessieGameAPI.createHostAPI({ library, guard: VessieURLGuard, doctor: VessieIframeDoctor });
  const out = [];
  hostAPI.print = (t) => out.push(t);

  await VessieScript.run(`
    print(games.count());
    var r = games.add("Novo Jogo", "https://jogos.com/games/novo/");
    print(r["ok"]);
    var mau = games.add("Trojan", "http://200.168.0.10/x");
    print(mau["reason"]);
    print(sec.isIP("200.168.0.10"));
    print(sec.allowed("https://jogos.com/games/ok/"));
  `, hostAPI);

  assert.deepStrictEqual(out, ['5', 'true', 'host-ip-literal', 'true', 'true']);
  assert.strictEqual(library.all().length, 6);
});

test('script não enxerga window, document nem eval', async () => {
  const library = makeLibrary(SEED);
  const hostAPI = VessieGameAPI.createHostAPI({ library, guard: VessieURLGuard });
  await assert.rejects(() => VessieScript.run('print(window);', hostAPI), /não definida/);
  await assert.rejects(() => VessieScript.run('print(eval("1"));', hostAPI), /não definida/);
});

// ------------------------------------------------------------------- runner
(async () => {
  let failed = 0;
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`  ok  ${name}`);
    } catch (error) {
      failed++;
      console.error(`FAIL  ${name}\n      ${error && error.message}`);
    }
  }
  console.log(`\n${tests.length - failed}/${tests.length} testes passaram`);
  process.exit(failed ? 1 : 0);
})();
