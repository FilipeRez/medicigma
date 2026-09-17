# Trilha: produto — escopo, público, modelo de negócio

Carregue com `/medicigma produto`.

> ⚠️ **Este projeto ainda não tem decisão de produto tomada.** O que existe é um protótipo
> visual e seis perguntas abertas. Não trate nenhuma escolha abaixo como definida, e não
> deduza a resposta a partir do que a tela mostra — a tela foi gerada por IA a partir de um
> prompt, não de uma decisão do Filipe.

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

## As seis perguntas em aberto (15/09/2026)

A conversa parou exatamente aqui. **As duas primeiras definem o resto.**

1. **Qual é o objetivo?** Mostrar para clínicas e validar, virar SaaS de verdade, ou atender
   um cliente específico? Muda tudo o que vem depois.
2. **Quem é o usuário principal?** A tela inicial fala em "contabilidade" e em "médico" — são
   **dois produtos diferentes**: um escritório contábil que atende várias clínicas, ou a
   própria clínica. Define o modelo multi-tenant.
3. **Escopo do MVP.** TISS de verdade (XML no padrão ANS, com versões e validação) e
   assinatura digital de DMED são trabalhosos. MVP realista: login, pacientes, lançamentos,
   repasses e recibo em PDF — TISS depois.
4. **LGPD.** Dado de saúde é sensível. Com dado real, exige controle de acesso por tenant,
   auditoria de verdade e cuidado com foto e CPF desde o início.
5. **Stack do backend.** O Filipe já usa Supabase e Vercel no `financas-casal`. Reaproveitar
   o padrão (auth, Postgres com RLS por clínica) é o caminho natural.
6. **Relação com o `financas-casal`.** Boa parte da lógica se sobrepõe — lançamentos,
   categorias, multi-tenant. Decidir se compartilham base ou seguem separados.

## Conexões com outros mundos do Filipe

- **`financas-casal`** — sobreposição de lógica (pergunta 6). Vale olhar antes de desenhar
  o schema.
- **`veritum-crm`** — já resolveu, em produção, dois problemas que este projeto vai ter:
  Supabase com auth e um bot de WhatsApp via Evolution API. Se a cobrança por WhatsApp sair
  do desenho, o caminho já foi percorrido lá.
