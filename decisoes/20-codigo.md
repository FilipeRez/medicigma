# Trilha: código — estado técnico verificado

Carregue com `/medicigma codigo`.

Tudo abaixo foi **verificado no código em 15–16/09/2026**, não deduzido da interface. Serve
para não perder tempo investigando de novo o que já se sabe que não existe.

---

## O que existe de verdade

- 23 arquivos, ~5 mil linhas. `tsc --noEmit` e `vite build` passaram **sem erro**.
- Roteamento e estado global em `src/App.tsx`.
- Quatro telas reais: `DashboardView`, `FinancesView`, `GovernanceView`, `PatientsView`.
- Layout duplo (web em `/admin`, mobile em `/app`) funcionando de verdade.

## O que NÃO existe — não investigar de novo

| Achado | Onde |
|---|---|
| **Sem backend e sem banco.** Todo dado vem de `mockData.ts` e vive só em memória — **F5 apaga tudo** | `src/data/mockData.ts` |
| **Ações simuladas.** "Exportar XML TISS", "Baixar DMED com assinatura digital" e "Recurso de glosa protocolado" só exibem uma mensagem | `Modals.tsx:409`, `Modals.tsx:701` |
| **Recurso de glosa mostra sempre R$ 720,00**, qualquer que seja a transação | `App.tsx:107` |
| **Abas "Repasses" e "Relatórios" estão no menu e não têm tela** — clicar deixa a área principal vazia | `Sidebar.tsx` |
| **Não há login.** Os perfis de permissão (sócio, médico, recepção) são apenas visuais | — |
| **Gemini declarado e não usado.** `@google/genai` e `express` estão no `package.json` e não aparecem em nenhum import | `package.json` |
| **Imagens são links temporários do Google** (`lh3.googleusercontent.com/aida…`) e **expiram** | componentes de UI |
| **"Dados sincronizados em tempo real"** na tela inicial não tem nada por trás | `LandingSelection.tsx` |

## Dívidas conhecidas

1. **Dois lockfiles.** `bun.lock` (do AI Studio, commitado) e `package-lock.json` (gerado
   aqui, **untracked**). Escolher um gerenciador antes do próximo `install`.
2. **Imagens que expiram.** Trocar por asset local antes de qualquer demonstração agendada —
   é o tipo de falha que aparece no pior momento.
3. **`metadata.json` declara `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`**, que é um resquício
   do AI Studio. Se a IA não entrar no escopo, remover junto com as duas dependências mortas.

## Histórico

| Data | O que |
|---|---|
| 15/09 | Exportado do AI Studio. O `Save to GitHub` falhou por conflito com o "Initial commit" já existente; o caminho que funcionou foi o ZIP |
| 15/09 | `feat: initialize MedFinance Clinical Suite project` — o código real entrou aqui |
| 15/09 | Playwright criou uma pasta `.playwright-mcp` dentro do projeto; conferir se saiu ou está no `.gitignore` |
