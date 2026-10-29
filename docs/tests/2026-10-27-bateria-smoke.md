# Bateria curta de smoke tests — 27/10/2026

## Escopo

Verificação rápida dos fluxos principais do MVP descrito em [../plans/2026-10-20-jogo-diario-de-palavras.md](../plans/2026-10-20-jogo-diario-de-palavras.md).

- App servido localmente com `python3 -m http.server 8000 --bind 127.0.0.1`.
- Testes executados na interface com Playwright, no navegador integrado.
- Viewport responsivo verificado em 375 × 812 px.
- Estado inicial sem partidas salvas; dados criados durante o teste foram removidos ao final.

## Resultado

**10 verificações aprovadas; nenhum defeito encontrado nos fluxos cobertos.**

| # | Verificação | Resultado observado |
|---|---|---|
| 1 | Carregamento e tela inicial | Título, tema do dia e chamada para jogar exibidos. |
| 2 | Ajuda | Diálogo abriu e fechou pelo botão de fechar. |
| 3 | Tema | Alternância entre claro e escuro atualizou a interface. |
| 4 | Tabuleiro | Partida apresentou 30 casas: 6 tentativas × 5 letras. |
| 5 | Validação | Envio vazio e palavra fora da lista foram rejeitados, sem consumir tentativa. |
| 6 | Entrada | Uma tentativa válida foi digitada pelo teclado físico; a resposta foi aceita. |
| 7 | Persistência do progresso | Após recarregar e reabrir a partida, a tentativa anterior permaneceu. |
| 8 | Vitória | Teclado virtual completou a palavra; resposta e contador `2/6` foram exibidos. |
| 9 | Estatísticas | Diálogo exibiu uma partida e uma vitória após concluir o desafio. |
| 10 | Mobile | Em 375 px de largura, a página não apresentou rolagem horizontal. |

## Limites desta bateria

É um smoke test curto, não uma suíte completa. Não foram exercitados o encerramento por seis erros, o tratamento de letras repetidas em todas as combinações, o conteúdo efetivamente copiado/compartilhado, nem a persistência das estatísticas após recarregar uma partida concluída. Também não houve auditoria automatizada de acessibilidade ou teste em dispositivo físico.

O repositório não possui runner nem suíte automatizada configurados; esta execução verifica a interface no navegador e não substitui testes unitários/regressivos.
