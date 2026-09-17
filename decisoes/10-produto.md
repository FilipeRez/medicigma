# Trilha: produto — escopo, público, modelo de negócio

Carregue com `/medicigma produto`.

> ✅ **As duas perguntas que travavam tudo foram respondidas em 17/09/2026** (objetivo e
> usuário principal). As outras quatro seguem abertas. Continue não deduzindo resposta a
> partir do que a tela mostra: a tela foi gerada por IA a partir de um prompt.

---

## O que o protótipo propõe (é hipótese, não decisão)

Funcionalidades que aparecem na interface:

- Faturamento de convênio no padrão **TISS** (exportação de XML)
- **Recurso de glosa** — contestação de item recusado pelo convênio
- Recibos **DMED** para a declaração de saúde, com menção a assinatura digital
- **Repasse de produção 70/30** entre clínica e médico
- Cobrança por **WhatsApp**
- **Carteira de pacientes com LTV**
- Perfis de permissão: sócio, médico, recepção
- **Log de auditoria**
- **White-label**: subdomínio e cor por clínica

O domínio está bem entendido e os termos do setor estão corretos. Isso é o ativo real do
protótipo — mais do que o código.

## Respondidas em 17/09/2026

1. **Qual é o objetivo? → Validar a ideia antes de construir.** A prévia é instrumento de
   pesquisa: medir a reação de um colega de trabalho e de clínicas-clientes. Nada de backend
   antes do retorno.
2. **Quem é o usuário principal? → O escritório contábil.** O Filipe é o escritório; as
   clínicas são clientes dele. Como são vários clientes, cada um precisa de usuário e senha
   próprios, e os dados de um não podem aparecer para o outro.

   **Consequência para a arquitetura:** multi-tenant com o **escritório como tenant raiz** e
   as clínicas como sub-tenants. No dia do backend, a chave de isolamento (RLS no Supabase)
   é a clínica, e o usuário do escritório é o único que enxerga mais de uma. O protótipo já
   está montado assim, em `src/data/clinics.ts` e `src/state/AppState.tsx`.

## As quatro perguntas que seguem abertas
3. **Escopo do MVP.** TISS de verdade (XML no padrão ANS, com versões e validação) e
   assinatura digital de DMED são trabalhosos. MVP realista: login, pacientes, lançamentos,
   repasses e recibo em PDF — TISS depois.
4. **LGPD.** Dado de saúde é sensível. Com dado real, exige controle de acesso por tenant,
   auditoria de verdade e cuidado com foto e CPF desde o início.
5. **Stack do backend.** O Filipe já usa Supabase e Vercel no `financas-casal`. Reaproveitar
   o padrão (auth, Postgres com RLS por clínica) é o caminho natural.
6. **Relação com o `financas-casal`.** Boa parte da lógica se sobrepõe — lançamentos,
   categorias, multi-tenant. Decidir se compartilham base ou seguem separados.

## O que a prévia de 17/09 já mostra

Três perfis de login (escritório, clínica, médico), três clínicas-clientes fictícias com
bases isoladas, repasses calculados sobre a produção e DRE com série mensal. O que ainda é
encenação está listado em `20-codigo.md` — **nunca apresentar como pronto**.

## Conexões com outros mundos do Filipe

- **`financas-casal`** — sobreposição de lógica (pergunta 6). Vale olhar antes de desenhar
  o schema.
- **`veritum-crm`** — já resolveu, em produção, dois problemas que este projeto vai ter:
  Supabase com auth e um bot de WhatsApp via Evolution API. Se a cobrança por WhatsApp sair
  do desenho, o caminho já foi percorrido lá.
