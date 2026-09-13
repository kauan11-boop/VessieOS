# VessieOS

Sistema operacional web — desktop completo no navegador, com janelas arrastáveis, apps, IA local via LM Studio e hospedagem 100% estática, pronta para o **GitHub Pages**.

## ✨ Principais recursos

- 🖥️ **Desktop completo** — janelas arrastáveis, taskbar, menu iniciar, notificações
- 🤖 **IA integrada (LM Studio)** — chat com streaming, conectado a um modelo rodando localmente
- 💬 **Discord** — integração via OAuth2 (API v10, sem webhooks)
- 👥 **Rede social** — posts, comentários, curtidas e seguidores
- 🎮 **Game Hub** — coletor automático de jogos com fallback de proxy
- 📡 **Modo offline** — Service Worker com cache e sincronização automática
- 📱 **Responsivo** — funciona de telas pequenas a ultra-wide

## 🚀 Começando

### Rodar localmente

```bash
git clone https://github.com/<seu-usuario>/VessieOS.git
cd VessieOS
python -m http.server 8000
# Acesse http://localhost:8000
```

### Publicar no GitHub Pages

1. Faça push do repositório para o GitHub
2. Em **Settings → Pages**, selecione a branch de publicação (ex.: `main`)
3. O site fica em `https://<seu-usuario>.github.io/<repositorio>/`

> O arquivo `.nojekyll` já está incluso, e todos os caminhos internos (Service Worker, callback de OAuth, assets) são relativos — o projeto funciona tanto na raiz de um domínio quanto em um subcaminho de projeto do GitHub Pages.

### Pontos de entrada

| Arquivo | Descrição |
|---|---|
| `index.html` | Landing page — apresentação, features, status do sistema |
| `VessieOS.html` | O sistema desktop completo (a "OS" em si) |
| `HTML/systems/dashboard.html` | Dashboard de testes dos subsistemas |
| `callback.html` | Callback de autenticação OAuth2 (Discord/GitHub) |

## 📁 Estrutura

```
VessieOS/
├── JS/
│   ├── core/        → boot, storage, tema, gráficos, eventos
│   ├── kernel/       → kernel do sistema, módulos, IA, executor
│   └── modules/       → janelas, taskbar, menu iniciar, notificações
├── CSS/
│   ├── base/          → reset, layout, tema, responsividade
│   └── components/    → estilos de cada componente da UI
├── systems/
│   ├── online/         → autenticação, sincronização, Service Worker
│   ├── discord/         → integração Discord (OAuth2 + API v10)
│   └── social/            → rede social
└── docs/                    → guias detalhados (setup, arquitetura, status)
```

Para configuração de OAuth (Discord/GitHub), integração com LM Studio e mais detalhes de arquitetura, veja a pasta [`docs/`](docs/):

- [`docs/QUICK-START.md`](docs/QUICK-START.md) — guia rápido de uso
- [`docs/README-COMPLETE-SYSTEM.md`](docs/README-COMPLETE-SYSTEM.md) — visão geral técnica dos sistemas
- [`docs/README-ONLINE-SETUP.md`](docs/README-ONLINE-SETUP.md) — setup de autenticação e sincronização online
- [`docs/README-IMPLEMENTATION-STATUS.md`](docs/README-IMPLEMENTATION-STATUS.md) — status de implementação

## ⚠️ Limitações conhecidas

- A IA (LM Studio) precisa rodar localmente na máquina de quem acessa o site — não há backend de IA hospedado.
- O sistema de módulos automáticos (`JS/kernel/module-system.js`) espera uma API de backend (`/api/modules/*`) que não existe neste projeto estático — hoje essa automação não funciona no GitHub Pages sem um servidor adicional.
- Login via Discord/GitHub usa fluxo OAuth2 client-side; a troca de código por token do GitHub normalmente exige um backend (aqui o código é apenas armazenado, sem troca completa).

## 📄 Licença

MIT — livre para usar e modificar.

## 🧬 VessieScript — a linguagem própria, agora ligada ao desktop de verdade

Esta versão conecta a linguagem **VessieScript** (motor em
`JS/kernel/modules/scripting/lib/vessiescript.js`, spec em
`assets/vessiescript/SPEC.md` do projeto original) ao restante do sistema,
que antes existia mas nunca era carregada.

**O que foi feito nesta integração:**

1. **Motor carregado de verdade** — `index.html` agora inclui
   `vessiescript.js` + três extensões via `<script>` clássico, antes do
   pipeline de módulos ES, exatamente como `NEW-MODULES.md` já
   documentava (mas nunca estava implementado):
   - `vessiescript-extensions.js` — comandos reais: `fs.*`, `proc.*`,
     `registry.*`, `log.*`, `net.*`, `json.*`, `string.*`, `math.*`,
     `time.*`, `storage.*`, `events.*`, `map/filter/reduce/sort/assert/
     clone/typeOf`.
   - `kernel-adapter.js` — liga `fs/proc/registry/log` ao kernel real
     (`window.VessieOS.*`) quando presente.
   - `csharp-adapter.js` — transpila VessieScript para C# compilável de
     verdade + bridge de runtime com .NET via Blazor WebAssembly.
2. **Filesystem unificado** — Terminal, Explorador de Arquivos e os
   comandos `fs.*` do VessieScript agora compartilham o **mesmo** VFS real
   (antes eram duas simulações paralelas e desconectadas). Um arquivo
   criado por `fs.write(...)` num script aparece instantaneamente no
   Explorador de Arquivos e no `ls`/`cat` do Terminal — testado e
   confirmado com screenshots.
3. **Comando `vessie` no Terminal real** — `vessie -e "codigo"` roda uma
   linha de VessieScript; `vessie arquivo.vessie` roda um arquivo do VFS
   real. Digite `man vessie` no Terminal para ajuda.
4. **Correções de bugs pré-existentes** encontrados durante os testes:
   `ScriptingManager.runFromFile` usava uma API de filesystem que não
   existia; três módulos (`ai-integration`, `web-system-generator`,
   `system-manager`) chamavam `window.VessieOS.modules.registerModule`
   (deveria ser `.moduleSystem.registerModule`), causando erros no boot.

**Testado de ponta a ponta** com um servidor local + Chromium headless:
boot → termos → login → desktop → abrir Terminal → `vessie -e
"print(1+2, math.sqrt(81))"` → `3 9` → `fs.write(...)` visível no
Explorador de Arquivos, zero erros de JavaScript novos.

**Limitação conhecida (documentada, não escondida):** `proc.*`/
`registry.*`/`log.*` do VessieScript falam com o kernel modular real
(`window.VessieOS.ProcessManager/Registry/kernel`), que é um sistema
paralelo à lista de processos que o **Gerenciador de Tarefas** mostra na
tela (esse último usa um estado interno próprio, mais antigo, dentro de
`JS/core/main.js`). Só o filesystem foi unificado nesta passada — unificar
também processos/registro é um refactor maior, fora do escopo desta
integração.

### Testar o comando `vessie` agora

```bash
python -m http.server 8000
# abra http://localhost:8000, faça login (senha: EO123), abra o Terminal
```

```
vessie -e "print('Olá do VessieScript!', math.sqrt(81))"
vessie -e "fs.write('Desktop/teste.txt', 'ola')"
ls
cat teste.txt
```
