# Política de URLs do VessieOS (`VessieURLGuard`)

Todo endereço que entra no Game Hub — jogo adicionado à mão, link descoberto
pelo coletor, capa de jogo, importação de JSON e o `src` do iframe na hora de
jogar — passa por `JS/kernel/security/url-guard.js` antes de ser usado.

## O que é bloqueado

| Caso | Exemplo | Motivo |
| --- | --- | --- |
| Host em IP cru (v4 pontuado) | `http://200.168.0.10/game` | painel improvisado, vetor típico de drive-by/trojan |
| IPv4 ofuscado | `http://2130706433/`, `http://0x7f000001/`, `http://127.1/` | mesma coisa, escrito para driblar filtro ingênuo |
| IPv6 literal | `http://[::1]/` | idem |
| Host local/reservado | `localhost`, `*.local`, `*.internal`, `*.lan`, `*.home`, `*.onion`, rótulo único (`servidor`) | aponta para a máquina/rede de quem abriu |
| Protocolo diferente de http/https | `javascript:`, `data:`, `file:` | execução de script e leitura de disco |
| Credenciais embutidas | `https://user:senha@site.com` | phishing/exfiltração de credencial |
| Porta fora de 80/443/8080/8443 | `https://site.com:31337/` | painéis caseiros |
| Arquivo executável | `.exe .msi .apk .scr .bat .cmd .com .jar .vbs .ps1 .dll .dmg .deb .rpm .sh .hta` | download disfarçado de jogo |
| Blocklist manual | `sec.blockHost("site.com")` | decisão do usuário |

O que passa é normalizado: `http://` vira `https://` e o fragmento é removido,
para que a mesma página não entre duas vezes na biblioteca.

## Limites conhecidos

- A verificação é do lado do cliente e olha o endereço, não o conteúdo. Ela
  reduz a superfície (IP cru, executável, host interno), mas não substitui
  antivírus nem inspeção de conteúdo, e um host público pode hospedar algo
  malicioso mesmo passando na política.
- Não há resolução de DNS no navegador: um domínio que aponta para `10.0.0.5`
  não é detectável aqui.
- Um iframe recusado por `X-Frame-Options`/CSP não informa o motivo à página
  que o incorpora. Por isso o `VessieIframeDoctor` marca esses casos como
  `unverified` e eles **nunca** são apagados automaticamente — só `blocked`
  (recusado pela própria política), `error` e `timeout` contam como quebrados.

## Uso

```js
const verdict = VessieURLGuard.inspect('200.168.0.10/jogo');
// { ok: false, reason: 'host-ip-literal', message: 'Host é um IP cru ...' }

VessieURLGuard.sanitize('http://site.com/jogo'); // 'https://site.com/jogo'
VessieURLGuard.partition(games);                 // { allowed, blocked }
```

Pelo VessieScript (módulo `sec`, sem acesso a `window`/`fetch`/`eval`):

```vessie
if (!sec.allowed(url)) { print(sec.check(url).message); }
games.purgeUnsafe();
```
