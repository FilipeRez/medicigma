# Política — MediCigma

O que barra ação irreversível ou erro caro neste projeto. **Carrega em toda chamada de
`/medicigma`, qualquer que seja a trilha.**

Este projeto é diferente dos outros do Filipe em dois pontos que mudam tudo:

1. **Tem git.** Existe rede de segurança: `git diff`, `git restore`, `git revert`. Mexer em
   arquivo aqui é reversível — desde que esteja commitado.
2. **Não é produção e não tem dado real.** Não há cliente, não há paciente, não há banco.
   O risco aqui não é destruir dado: é **construir em cima de suposição errada**.

---

## Regras

1. **Nenhum segredo em commit.** `GEMINI_API_KEY`, `APP_URL`, chave de Supabase ou de
   convênio. Conferir o `.gitignore` antes de todo `git add`. O `.env.example` existe
   justamente para documentar sem expor.

2. **Commitar antes de refatorar.** A rede de segurança só vale se o ponto de retorno existir.
   Árvore suja + refatoração grande = mesma situação dos projetos sem git.

3. **Nunca apresentar tela simulada como funcionalidade pronta.** Botão que só abre um aviso
   ("Exportar XML TISS", "Baixar DMED assinada", "Recurso de glosa protocolado") é maquete.
   Ao falar do app — com o Filipe ou em material para clínica — separar o que existe do que
   é desenho.

4. **Dado de saúde é dado sensível (LGPD).** No dia em que entrar dado real, precisa de
   controle de acesso por tenant, auditoria de verdade e cuidado com CPF e foto **desde o
   primeiro registro**. Não é etapa de polimento; retrofitar isso depois é reescrever.

5. **Não decidir arquitetura antes das perguntas 1 e 2** (objetivo e usuário principal,
   em `10-produto.md`). Multi-tenant de escritório contábil e multi-tenant de clínica única
   são produtos diferentes — errar aqui joga fora o backend inteiro.

6. **Não instalar dependência nova sem resolver os dois lockfiles.** `bun.lock` e
   `package-lock.json` convivem hoje; misturar gerenciador quebra o build de forma difícil
   de diagnosticar.

7. **`mockData.ts` é a base de dados atual.** Alterar ali muda o app inteiro. Não tratar
   como arquivo de exemplo descartável enquanto não houver backend.
