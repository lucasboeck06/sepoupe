# Roadmap — financeiro-pessoal

**Objetivo:** app de controle financeiro no ar, usado de verdade, publicável no portfólio.
**Escopo do v1:** entrada 100% manual. Sem Open Finance, sem webhook, sem importação.

---

## Regras da trilha

1. **Uma sessão = uma tarefa.** Se a tarefa não cabe em 60 minutos, ela está grande demais — quebra.
2. **Não pula pra frente.** Deu vontade de mexer no Pluggy? Anota na seção "Ideias" no fim e volta.
3. **Toda sessão termina no `NOTAS.md`:** o que fiz / onde parei / próximo passo exato.
4. **"Pronto quando" é lei.** Não é pronto porque parece pronto, é pronto quando o critério bate.
5. Marcar `[x]` aqui mesmo. Progresso visível importa mais do que parece.

---

## Fase 0 — Limpar o caminho

> Tirar do caminho crítico tudo que travou o projeto. Repo honesto = cabeça limpa.

- [x] Mover código de webhook (Asaas + Pluggy) para branch `feature/open-finance`
- [x] Remover `pluggy-sdk` do `package.json` e rodar `npm install`
- [x] Remover rotas `/webhook/*` do `main`
- [x] Limpar variáveis de Pluggy/Asaas do `.env.example`

**Pronto quando:** `main` sobe sem nenhuma referência a integração bancária.
**Tempo:** 1 sessão curta (~30 min)

---

## Fase 1 — Fechar o backend

### 1.1 — Transações

- [ ] `PATCH /transacoes/:id` — atualiza categoria (em andamento)
- [ ] `DELETE /transacoes/:id` — valida dono pelo token
- [ ] `GET /transacoes` com filtro `?tipo=entrada|saida`
- [ ] `GET /transacoes` com filtro `?mes=YYYY-MM`
- [ ] `POST /transacoes` — conferir que aceita `categoria_id` na criação

**Pronto quando:** dá pra criar, listar, filtrar, editar e apagar transação inteira pelo Postman.

### 1.2 — Categorias (leitura)

- [ ] Seed de ~8 categorias direto por SQL (5 saída, 3 entrada)
- [ ] `GET /categorias` retornando `id`, `nome`, `tipo`

**Pronto quando:** o front consegue montar um select de categorias com o tipo junto.

**Tempo:** 2 sessões

---

## Fase 2 — Tela de nova transação

> A tela mais importante do projeto. Se lançar um gasto for chato, o app morre em duas semanas.
> **Meta: lançar em menos de 10 segundos.**

- [ ] Página `NovaTransacao` com 4 campos: valor, categoria, data, descrição (opcional)
- [ ] Select de categoria alimentado pelo `GET /categorias`
- [ ] Data com default = hoje
- [ ] **Tipo (entrada/saída) inferido pela categoria** — o campo não existe na tela
- [ ] Submit chamando `POST /transacoes` com o JWT
- [ ] Feedback de sucesso + limpar form (ou voltar pra lista)
- [ ] Tratamento de erro visível (não só `console.log`)

**Pronto quando:** você lança um gasto real pelo navegador do celular sem xingar.
**Tempo:** 2 sessões

---

## Fase 3 — Tela de lista

- [ ] Listar transações do mês atual (`GET /transacoes?mes=`)
- [ ] Item: ícone/cor da categoria + descrição + data + valor
- [ ] Verde para entrada (+), vermelho para saída (−)
- [ ] Toggle Todas / Entradas / Saídas
- [ ] Toque no item → edição de categoria e valor (`PATCH`)
- [ ] Excluir transação (`DELETE`) com confirmação

**Pronto quando:** dá pra corrigir um lançamento errado sem abrir o banco.
**Tempo:** 2 sessões

---

## Fase 4 — Deploy 🚀

> Aqui o projeto vira produto. Não adia isso.

### 4.1 — Preparar

- [ ] Separar build do front (`vite build`) do backend
- [ ] `.env` de produção (banco, JWT_SECRET novo, origem do CORS)
- [ ] CORS liberando o domínio real em vez de `localhost:5173`
- [ ] Testar o build local antes de subir

### 4.2 — Subir

- [ ] VPS Hetzner CX22 provisionada
- [ ] PostgreSQL instalado + banco criado + schema aplicado
- [ ] Backend rodando com PM2 ou systemd (sobrevive a reboot)
- [ ] Nginx servindo o front e fazendo proxy pro backend
- [ ] DNS no Cloudflare apontando `financeiro.lvbklabs.dev`
- [ ] SSL ativo (cadeado verde)
- [ ] Usuário seu e da sua esposa criados em produção

**Pronto quando:** você abre o link no celular, loga e lança um gasto.
**Tempo:** 2 sessões (reserva mais — deploy sempre surpreende)

---

## Fase 5 — Usar de verdade (2 semanas)

> Isso é um passo do roadmap, não um intervalo. Não codar aqui é o trabalho.

- [ ] Lançar todo gasto real por 2 semanas
- [ ] Sua esposa usando também
- [ ] Anotar todo incômodo no `NOTAS.md` (sem consertar na hora)

**Pronto quando:** você tem uma lista de melhorias vinda do uso, não da imaginação.

---

## Fase 6 — CRUD de categorias

> Agora que você já sabe quais categorias realmente usa.

- [ ] `POST /categorias`
- [ ] `PATCH /categorias/:id`
- [ ] `DELETE /categorias/:id` — decidir o que fazer com transações que usam ela
- [ ] Tela de categorias: listar, criar, editar, excluir
- [ ] Validação: não deixar criar categoria duplicada

**Pronto quando:** dá pra ajustar as categorias sem SQL.
**Tempo:** 2 sessões

---

## Fase 7 — Dashboard

> Por último de propósito: só com dados reais você sabe qual número importa.

- [ ] Endpoint de resumo do mês (total entradas, total saídas, saldo)
- [ ] Endpoint de total por categoria
- [ ] Card de saldo do mês
- [ ] Entradas vs saídas
- [ ] Gráfico de gastos por categoria
- [ ] Navegar entre meses

**Pronto quando:** você olha a tela e aprende algo que não sabia sobre seus gastos.
**Tempo:** 2 sessões

---

## Fase 8 — Publicar

> A parte que transforma o projeto em portfólio. Não pula.

- [ ] README com: o problema, a solução, o link no ar, a stack
- [ ] Screenshots das telas (mobile)
- [ ] Seção de decisões técnicas — incluindo **por que o Open Finance ficou fora do v1**
- [ ] Instruções de rodar local
- [ ] Post no LinkedIn contando o processo, não só o resultado

**Pronto quando:** alguém que não te conhece entende o projeto em 30 segundos.
**Tempo:** 1–2 sessões

---

## Depois do v1

**v2 — Importação de extrato**
Upload de CSV/OFX do Inter → parse → transações caem como pendentes → tela de categorização (que já existe) → tabela `categoria_referencias` aprende com cada categorização.
Pega ~80% do valor da automação com ~10% da complexidade do Open Finance.

**v3 — Open Finance (Pluggy)**
Só se o v2 não resolver. A branch `feature/open-finance` está te esperando.

---

## Ideias (não mexer agora)

> Tudo que der vontade de fazer fora de ordem vem pra cá.

- Adicionar a questão de "famílias", grupo de pessoas que tem acesso a infos umas das outras.
  Com permissões internas e segurança contra outros usuários
- Editar transações entra para uma release futura, basta apagar e criar de novo aqui.
-
