# Pendências — MediCigma

O que está em aberto. **Carrega em toda chamada de `/medicigma`.**

---

## Em aberto

- **Escolher o caminho do deploy na Vercel.** A conta é Hobby (gratuita), mas a integração
  do GitHub com a Vercel **não está instalada**, e a CLI (`vercel`) não está autenticada
  nesta máquina. Sem uma das duas, não há como publicar daqui. Opções em `20-codigo.md`.
- **Perguntas 3 a 6 de `10-produto.md`**: escopo exato do MVP, LGPD, stack do backend e
  relação com o `financas-casal`. Agora são respondíveis — as duas primeiras, que as
  bloqueavam, foram decididas em 17/09.
- **Backend não existe.** Tudo vive no `localStorage` do navegador: some ao limpar os dados
  do site e não passa de um aparelho para outro. É suficiente para a validação, e nada além.

## Decidido, para não rediscutir

- **17/09/2026 — as perguntas 1 e 2 foram respondidas.** Usuário principal: **escritório
  contábil** com várias clínicas-clientes, cada uma isolada por login. Objetivo desta etapa:
  **validar a ideia antes de construir**. Isso destrava a decisão de arquitetura, parada
  desde 15/09.
- **APK fora da Play Store ficou para depois.** O PWA atende à prévia: instala na tela
  inicial do Android e abre em tela cheia. Empacotar com Capacitor ou TWA só se a validação
  andar.
- **npm é o gerenciador.** O `bun.lock` foi removido em 17/09; o `package-lock.json` está
  versionado. Não misturar.
- **Este arquivo e os irmãos em `decisoes/` foram criados em 16/09/2026**, quando o MediCigma
  virou o sétimo "mundo" da arquitetura de contexto do Filipe. Ele é o **piloto do formato
  novo** — trilhas por assunto, carregadas por comando.
- **`CONTEXTO.md` não se chama `CLAUDE.md` de propósito.** Arquivo com esse nome carrega
  automaticamente ao abrir a pasta, e a arquitetura nova quer carregamento sob comando.

## Resolvidas em 17/09/2026

- ~~Escolher gerenciador de pacotes~~ → npm.
- ~~`.playwright-mcp` dentro do projeto~~ → não existia mais; entrou no `.gitignore` de
  qualquer forma, porque a ferramenta recria a pasta.
- ~~Imagens do `lh3.googleusercontent.com`~~ → baixadas para `public/assets/` e reduzidas de
  297 KB para 35 KB.
- ~~`@google/genai` e `express` declarados e não usados~~ → removidos, junto com `dotenv`,
  `@types/express`, `tsx` e a capability do AI Studio no `metadata.json`.
- ~~Abas "Repasses" e "Relatórios" sem tela~~ → construídas, e calculadas sobre os
  lançamentos.
