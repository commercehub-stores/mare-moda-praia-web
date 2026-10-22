# Criar uma tela ou seção

1. Crie `app/<rota>/page.tsx` como Server Component (`export default async function`).
2. Busque dados pelo adaptador: `import { commerce } from "@/lib/store.ts"`. Nunca `fetch` na VTEX.
3. Use as classes de `app/globals.css` (`container`, `stack`, `row`, `grid`, `card`, `button`) e os
   tokens de `design/tokens.json` (ferramenta MCP `design_tokens`). Não invente cores.
4. Estados: vazio (`.empty` com texto útil) e erro (deixe o `not-found`/erro do Next tratar).
5. Rode `yarn typecheck && yarn lint && yarn test && yarn build` antes de abrir o PR.
