# Módulos novos adicionados ao kernel modular do VessieOS

Este projeto (`assets/vessieos-kernel/`) é a arquitetura multi-arquivo real
do VessieOS — kernel com sistema de módulos por pipeline
(`JS/kernel/module-system.js` + `JS/kernel/modules/index.js`), separada dos
templates single-file HTML em `assets/templates/`. Use esta pasta como base
sempre que o pedido exigir uma arquitetura modular/escalável (múltiplos
arquivos, kernel com módulos com dependências) em vez de um único HTML.

Os 5 módulos abaixo foram adicionados nesta passada, seguindo exatamente a
convenção já usada pelos módulos existentes (`accessibility`,
`performance`, etc.): classe ES6 com `export default`, `constructor(deps)`
para injeção de dependências, `init()`/`destroy()`, `on(event, callback)` +
`_emit()` que dispara tanto callbacks internos quanto um
`CustomEvent` em `document` no namespace `vessie:<módulo>:<evento>`.

## Como registrar um novo módulo (padrão do projeto)

1. Criar `JS/kernel/modules/<nome>/index.js` com a classe seguindo a
   convenção acima.
2. Importar em `JS/kernel/modules/index.js` e adicionar uma entrada no
   array `MODULES` com `name`, `version`, `dependencies` (nomes de outros
   módulos já registrados), `priority` (ordem de boot — número maior roda
   depois), `autoStart` e `description`.
3. O `ModuleSystem` (`module-system.js`) injeta automaticamente as
   dependências resolvidas no `constructor`, chama `init(context)` e,
   se `autoStart`, `start()`.

## Módulos adicionados

### SpotlightSearch (`search-spotlight/`, prioridade 17)
Busca universal por apps, arquivos, configurações e comandos registrados
por qualquer outro módulo. Abre com `Ctrl+Espaço`, faz fuzzy match por
subsequência (sem dependências externas). Complementa o `command-palette`
já existente (que executa comandos digitados) com busca por *conteúdo*.
Eventos: `vessie:spotlight:{query,open,opened,closed,registered}`.

### WidgetsBoard (`widgets-board/`, prioridade 18)
Estado de um painel de widgets estilo Windows 11 (relógio, notas rápidas,
clima, etc.) — adicionar/remover/reordenar widgets, com layout persistido
em `localStorage`. Não renderiza HTML: a camada de UI decide como desenhar
cada `type` de widget a partir do estado exposto por `list()`.
Eventos: `vessie:widgets:{widget-added,widget-removed,widget-updated,layout-changed}`.

### PowerManager (`power-management/`, prioridade 19)
Estado de energia via `navigator.getBattery()` (com fallback simulado
quando a API não existe, comum em desktop/alguns navegadores) e
transições `sleep()`/`hibernate()`/`wake()`. Integra com o `IdleScheduler`
já existente no kernel para sleep automático após N minutos ociosos.
Eventos: `vessie:power:{battery-change,battery-critical,sleep,hibernate,wake}`.

### ClipboardManager (`clipboard-manager/`, prioridade 20)
Histórico de área de transferência estilo `Win+V`: escuta o evento `copy`,
lê o conteúdo via `navigator.clipboard.readText()`, mantém histórico
limitado (itens fixados são imunes ao limite) persistido em
`localStorage`, e permite colar de volta qualquer item antigo.
Eventos: `vessie:clipboard:{item-added,item-pinned,item-removed,item-pasted,history-cleared}`.

### ScriptingManager (`scripting/`, prioridade 21)
Integra o motor da linguagem própria do ecossistema, **VessieScript**
(ver `assets/vessiescript/SPEC.md`), ao kernel — permite que apps, mods e
lógica de jogo do VessieOS sejam escritos em arquivos `.vessie` em vez de
JS puro.

**Importante sobre carregamento**: assim como o `Vessie3DProEngine` (ver
comentário em `modules/index.js`), o motor real
(`scripting/lib/vessiescript.js`) é um script UMD clássico que se
auto-instancia em `window.VessieScript` — ele precisa continuar
funcionando também fora do navegador (CLI standalone via Node, ver
`assets/vessiescript/cli/`), então não usa `export` de módulo ES. Por isso
ele deve ser incluído via `<script>` clássico **antes** do
`<script type="module">` que carrega `JS/kernel/modules/index.js`:

```html
<script src="JS/kernel/modules/scripting/lib/vessiescript.js"></script>
<script type="module" src="JS/kernel/modules/index.js"></script>
```

O `ScriptingManager` apenas localiza esse global já carregado (`isAvailable()`
retorna `false` sem quebrar o boot se o script clássico não foi incluído) e
expõe `run(source, { id, hostAPI })` / `runFromFile(path, { filesystem })`
para o resto do kernel, injetando por padrão `print`/`onEntity`/`onUI` que
disparam eventos do próprio módulo — o mesmo papel que `GraphicsHub`
desempenha para `window.Vessie3DPro`.
