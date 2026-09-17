# Pendências — MediCigma

O que está em aberto. **Carrega em toda chamada de `/medicigma`.**

---

## Bloqueia todo o resto

- **Responder as perguntas 1 e 2** de `10-produto.md`: qual é o objetivo (validar / SaaS /
  cliente único) e quem é o usuário principal (escritório contábil ou clínica). Enquanto não
  houver resposta, **não há decisão de arquitetura possível** — multi-tenant de contabilidade
  e de clínica única são produtos diferentes.
  *A conversa de 15/09 parou exatamente aqui.*

## Técnicas, independentes das respostas acima

- **Escolher um gerenciador de pacotes** e apagar o lockfile perdedor (`bun.lock` ×
  `package-lock.json`). O `package-lock.json` está untracked hoje.
- **Conferir se a pasta `.playwright-mcp` saiu** do projeto ou entrou no `.gitignore`.
- **Substituir as imagens** de `lh3.googleusercontent.com` por asset local — os links expiram.
- **Decidir sobre `@google/genai` e `express`**: declarados, nunca usados. Ou entram no
  escopo, ou saem do `package.json` junto com a capability no `metadata.json`.

## Decidido, para não rediscutir

- **Este arquivo e os irmãos em `decisoes/` foram criados em 16/09/2026**, quando o MediCigma
  virou o sétimo "mundo" da arquitetura de contexto do Filipe. Ele é o **piloto do formato
  novo** — trilhas por assunto, carregadas por comando, em vez de um `DECISOES.md` único que
  carrega sozinho.
- **`CONTEXTO.md` não se chama `CLAUDE.md` de propósito.** Arquivo com esse nome carrega
  automaticamente ao abrir a pasta, e a arquitetura nova quer carregamento sob comando.
