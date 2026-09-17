# MediCigma / MedFinance Clinical Suite — contexto permanente

Sistema de gestão financeira para clínicas médicas. Nasceu como app do **Google AI Studio** e
foi exportado para código em 15/09/2026.

**Estado honesto: é um protótipo visual. O sistema não existe atrás das telas.** Isso não é
crítica — como peça para mostrar a clínica e validar a ideia, está bom. Mas nenhuma decisão
deve partir da suposição de que algo funciona.

---

## Ambiente

| Campo | Valor |
|---|---|
| Pasta | `C:\Users\Filipe Rezende\medicigma` |
| Repositório | `https://github.com/FilipeRez/medicigma` (`origin/main`) |
| **Git** | ✅ **sim** — é o único projeto do Filipe com versionamento. Há rede de segurança para reverter |
| Stack | React 19 · Vite 6 · Tailwind 4 · React Router 7 · Motion · TypeScript 5.8 |
| Rodar | `npm run dev` (Vite na porta 3000, host 0.0.0.0) |
| Checar | `npm run lint` = `tsc --noEmit`. Em 15/09 tipos e build passaram limpos |
| Segredo | `GEMINI_API_KEY` e `APP_URL` em `.env` — injetados pelo AI Studio em runtime. **Nunca entram em commit** |

**Dois lockfiles convivendo:** `bun.lock` (do AI Studio) e `package-lock.json` (gerado aqui,
ainda **untracked**). Escolher um antes do primeiro trabalho sério de dependência.

## Estrutura

```
src/
  App.tsx                  roteamento e estado global
  pages/LandingSelection.tsx   escolha do portal
  components/
    DashboardView  FinancesView  GovernanceView  PatientsView
    Header  Sidebar  BottomNav  Modals
  data/mockData.ts         TODA a base de dados do app
```

**Dois portais**, escolhidos na tela inicial:

- `/admin` — Portal Contabilidade (web): dashboard, finanças, pacientes, acessos, white-label.
- `/app` — App do Médico (mobile): as mesmas telas em layout de celular, com barra inferior.

## O domínio (os termos estão certos, vale aprender)

| Termo | O que é |
|---|---|
| **TISS** | Padrão ANS de troca de informação com convênio. O app promete exportar XML |
| **Glosa** | Item que o convênio recusou pagar. "Recurso de glosa" é a contestação |
| **DMED** | Declaração de serviços médicos à Receita. Gera recibo para a declaração do paciente |
| **Repasse** | Divisão da produção entre clínica e médico — a tela usa 70/30 |
| **CRM / RQE** | Registro do médico e da especialidade |
| **LTV** | Quanto um paciente já rendeu ao longo do tempo |

## Como carregar o contexto

Este arquivo **não carrega sozinho**. Use `/medicigma produto` ou `/medicigma codigo`.
