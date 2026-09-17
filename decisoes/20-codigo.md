# Trilha: código — estado técnico verificado

Carregue com `/medicigma codigo`.

Tudo abaixo foi **verificado no código**, não deduzido da interface. Serve para não perder
tempo investigando de novo o que já se sabe que não existe. Última verificação: **17/09/2026**.

---

## O que existe de verdade

- 29 arquivos em `src/`. `tsc --noEmit` e `vite build` passam **sem erro**.
- Roteamento em `src/App.tsx`; estado global e sessão em `src/state/AppState.tsx`.
- **Login simulado com três perfis** (`src/pages/LoginPage.tsx`): escritório, clínica e
  médico. Rota protegida: sem sessão, `/admin` e `/app` redirecionam para `/login`.
- **Multi-tenant de escritório contábil** (`src/data/clinics.ts`): três clínicas-clientes
  fictícias com base própria. O usuário do escritório alterna entre elas pelo cabeçalho; os
  demais ficam presos à sua. O médico só enxerga a produção dele — o recorte acontece em
  `AppState.tsx`, no `useMemo` de `data`.
- **Persistência em `localStorage`**, uma chave por clínica (`medicigma:data:<id>`). F5 não
  apaga mais o que foi lançado. Há "restaurar dados de demonstração" no menu do perfil.
- **Tela Produção & Repasses** (`RepassesView.tsx`): calcula produção, glosa fora da base,
  percentual por profissional, repasse e retenção da clínica. "Marcar pago" cria um
  lançamento de despesa de verdade; exporta CSV.
- **Tela Relatórios & DRE** (`RelatoriosView.tsx`): série mensal de receitas × despesas em
  SVG puro, despesa por categoria, demonstrativo e exportação. Sem biblioteca de gráficos.
  Par de cores validado para daltonismo (ΔE 13,6 em deuteranopia).
- **Dashboard, Finanças, Pacientes e Governança leem os lançamentos** — os números fixos
  saíram em 17/09 e os totais batem entre as telas. O painel compara o mês em curso com o
  mesmo intervalo do mês anterior, para não medir meio mês contra um mês fechado.
- **PWA instalável**: `public/manifest.webmanifest`, ícones em `public/icons/`, service
  worker em `public/sw.js` (rede primeiro na navegação, cache primeiro nos arquivos com
  hash) e `vercel.json` com o fallback de rota da SPA.
- Layout duplo funcionando: web em `/admin`, mobile em `/app`. No celular o menu lateral é
  uma gaveta — antes cobria a tela inteira.

## O que NÃO existe — não investigar de novo

| Achado | Onde |
|---|---|
| **Sem backend e sem banco.** O dado vive no `localStorage` do navegador: não sai de um aparelho para o outro e some se o usuário limpar os dados do site | `src/state/AppState.tsx` |
| **O login não é segurança.** Usuário e senha estão no código e a checagem roda no navegador. Serve para demonstrar o isolamento, não para proteger nada | `src/data/clinics.ts` |
| **Ações simuladas.** "Exportar XML TISS", "Baixar DMED com assinatura digital" e "Recurso de glosa protocolado" só exibem uma mensagem | `Modals.tsx` |
| **Não há integração com convênio, Receita, banco ou WhatsApp** — o botão de cobrança só abre o `wa.me` com um texto pronto | `App.tsx` |
| **Os dados são fictícios**, inclusive os históricos, gerados por semente determinística em `buildHistory` | `src/data/clinics.ts` |

## Dívidas conhecidas

1. **A lista "Vencimentos & Repasses" do painel ainda é fixa** — os três itens não vêm
   dos lançamentos. O resto do painel foi ligado aos dados em 17/09.
2. **O bundle está em ~455 KB** (123 KB comprimido). Aceitável para a prévia; se virar
   produto, dividir por rota.
3. **Sem teste automatizado.** A verificação hoje é `tsc` mais navegação manual.

## Deploy (resolvido em 17/09)

Publicado em `https://medicigma-filiperezs-projects.vercel.app`, projeto `medicigma` no time
`filiperezs-projects` (plano Hobby, gratuito), ligado ao repositório pela integração do
GitHub — **todo push em `main` republica sozinho**.

A **proteção de acesso da Vercel foi desligada** de propósito: com ela ativa, quem abrisse o
link caía numa tela de login da Vercel. O link é público; os dados são fictícios. Para fechar
depois, basta reativar o `ssoProtection` ou pôr senha no projeto.

O que travou no caminho, para não repetir: o GitHub App da Vercel estava instalado mas **sem
acesso a este repositório** — o erro da API dizia "install", quando o que faltava era
*Configure → Repository access*. A CLI (`npx vercel`) não está autenticada nesta máquina.

## Histórico

| Data | O que |
|---|---|
| 15/09 | Exportado do AI Studio. O `Save to GitHub` falhou por conflito com o "Initial commit"; o caminho que funcionou foi o ZIP |
| 15/09 | `feat: initialize MedFinance Clinical Suite project` — o código real entrou aqui |
| 17/09 | `chore: resolve pendencias tecnicas do prototipo` — imagens locais, npm eleito, dependências mortas removidas |
| 17/09 | `feat: multi-tenant de escritorio contabil, login, repasses, DRE e PWA` |
| 17/09 | Publicado na Vercel, ligado ao GitHub: `https://medicigma-filiperezs-projects.vercel.app`. Todo push em `main` republica |
| 17/09 | `fix: portal web deixa de mostrar numeros de maquete` — revisão do `/admin` em desktop |
