# Roadmap — financeiro-pessoal

**Objetivo:** app de controle financeiro no ar, usado de verdade, publicável no portfólio.
**Escopo do v1:** entrada 100% manual. Sem Open Finance, sem webhook, sem importação.

---

## Regras da trilha

1. **Uma sessão = uma tarefa.** Se a tarefa não cabe em 60 minutos, ela está grande demais — quebra.
2. **Não pula pra frente.** Deu vontade de mexer em algo fora da fase atual? Anota na seção "Ideias" no fim e volta.
3. **Toda sessão termina no `NOTAS.md`:** o que fiz / onde parei / próximo passo exato.
4. **"Pronto quando" é lei.** Não é pronto porque parece pronto, é pronto quando o critério bate.
5. Marcar `[x]` aqui mesmo. Progresso visível importa mais do que parece.

---

## Fase 0 — Limpar o caminho ✅

- [x] Mover código de webhook (Asaas + Pluggy) para branch `feature/open-finance`
- [x] Remover `pluggy-sdk` do `package.json` e rodar `npm install`
- [x] Remover rotas `/webhook/*` do `main`
- [x] Limpar variáveis de Pluggy/Asaas do `.env.example`

---# SePoupe

Controle financeiro pessoal, para uso individual ou compartilhado entre duas pessoas de confiança (por exemplo, um casal). Nasceu de um problema simples: eu precisava enxergar para onde meu dinheiro estava indo, e não queria depender de planilha nem de app cheio de funcionalidade que eu nunca ia usar.

O projeto está em produção, sendo usado de verdade no dia a dia.

## Índice

- [O que o app faz](#o-que-o-app-faz)
- [Como funcionam as contas (cartão, cheque especial, VA)](#como-funcionam-as-contas-cartão-cheque-especial-va)
- [Escopo do v1](#escopo-do-v1)
- [Stack](#stack)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Roadmap](#roadmap)
- [Licença](#licença)

## O que o app faz

- Lançamento de transações (entrada e saída), com categoria, método de pagamento e data
- Categorias com ícone e cor, criadas pelo usuário
- Dashboard com resumo do mês: entradas, saídas e saldo disponível
- Gráfico de gastos diários
- Listagem de transações com filtro por tipo, ordenação e navegação por mês
- Controle de saldo de cartão de crédito, cheque especial e vale-alimentação

## Como funcionam as contas (cartão, cheque especial, VA)

O sistema entende três tipos de conta, além do dinheiro em espécie:

- **Cartão de crédito**: tem um limite. Cada compra no crédito aumenta o valor usado. Pagar a fatura reduz esse valor de volta — o pagamento da fatura **não conta como um gasto novo**, porque o gasto já foi registrado no momento da compra. Contar os dois seria duplicar o valor.
- **Cheque especial**: funciona do mesmo jeito que o cartão de crédito — tem limite, e o uso aumenta o valor devido. Quitar reduz.
- **Vale-alimentação (VA)**: diferente dos outros dois, não tem limite fixo. É uma carteira: o crédito do vale é uma entrada, e cada compra com ele reduz o saldo disponível.

Essa distinção existe porque, sem ela, o total de gastos do mês fica errado: pagar uma fatura de cartão não é um gasto a mais, é a liquidação de gastos que já aconteceram antes. O sistema separa isso automaticamente com um tipo de transação chamado "acerto", que atualiza o saldo da conta sem contar como gasto no resumo do mês.

## Escopo do v1

Este é um projeto pessoal, com escopo definido conscientemente:

- **Entrada de transações é 100% manual.** Não há integração bancária automática (Open Finance) nesta versão.
- **Não há isolamento de dados entre usuários.** Todos os usuários cadastrados no sistema compartilham as mesmas transações e contas — o objetivo é um financeiro compartilhado (ex: casal), não um sistema multiusuário isolado por família.
- **Sem edição de transação.** Corrigir um lançamento errado hoje significa apagar e criar de novo.

Essas decisões, e o que está planejado para versões futuras (multi-usuário isolado, integração bancária, categorização automática), estão documentadas em [ROADMAP.md](./ROADMAP.md).

## Stack

**Backend**

- Node.js + Fastify
- PostgreSQL
- Autenticação via JWT em cookie httpOnly

**Frontend**

- React + Vite
- Tailwind CSS

**Infraestrutura**

- Deploy em VPS própria, com Nginx e PM2
- CI/CD via GitHub Actions

## Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) versão 20 ou superior
- [PostgreSQL](https://www.postgresql.org/download/) versão 16 ou superior

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/lucasboeck06/financeiro-pessoal.git
cd financeiro-pessoal
```

**2. Instale as dependências**

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

**3. Crie o banco de dados**

```bash
createdb sepoupe
psql -d sepoupe -f schema.sql
```

Isso cria todas as tabelas necessárias. O banco começa vazio — não há dados de exemplo por padrão.

**4. Configure as variáveis de ambiente**

Copie o arquivo de exemplo do backend e preencha com seus dados:

```bash
cp .env.example .env
```

Copie também o do frontend:

```bash
cp frontend/.env.example frontend/.env
```

Veja a seção [Variáveis de ambiente](#variáveis-de-ambiente) para o que cada uma significa.

**5. Rode o backend**

```bash
cd backend
npm run dev
```

**6. Em outro terminal, rode o frontend**

```bash
cd frontend
npm run dev
```

**7. Acesse**

O frontend deve abrir em `http://localhost:5173`. Crie um usuário direto no banco (a rota de cadastro exige login, veja o roadmap) ou ajuste conforme sua necessidade.

## Variáveis de ambiente

### Backend (`.env`)

| Variável      | O que é                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| `DBUSER`      | Usuário do PostgreSQL                                                     |
| `DBHOST`      | Endereço do banco (geralmente `localhost`)                                |
| `DBPORT`      | Porta do banco (padrão `5432`)                                            |
| `DBNAME`      | Nome do banco criado no passo 3                                           |
| `DBPASSWORD`  | Senha do usuário do banco                                                 |
| `SECRET`      | Chave secreta usada para assinar o JWT — use uma string longa e aleatória |
| `NODE_ENV`    | `development` localmente, `production` em produção                        |
| `CORS_ORIGIN` | Endereço do frontend (`http://localhost:5173` em desenvolvimento)         |

### Frontend (`frontend/.env`)

| Variável            | O que é                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Endereço do backend (`http://localhost:3000` em desenvolvimento) |

## Roadmap

A trajetória completa do projeto, decisões de arquitetura e o que vem a seguir estão documentados em [ROADMAP.md](./ROADMAP.md).

## Licença

Este projeto está sob a licença MIT — veja [LICENSE](./LICENSE) para mais detalhes.

## Fase 1 — Backend ✅

### 1.1 — Categorias

- [x] Seed de 23 categorias por SQL (saída e entrada)
- [x] Colunas `icone`, `cor_primaria`, `cor_secundaria` com constraint de ícone único
- [x] `GET /categorias` com filtro `?nome=` (ILIKE)
- [x] CRUD completo no back (criar, listar, editar, excluir)

### 1.2 — Transações

- [x] `POST /transacoes` com `data` (coluna nova), `operacaoTipo`, `categoriaId`
- [x] `GET /transacoes` com filtro `?tipo=entrada|saida`
- [x] `GET /transacoes/pendentes` (categoria_id IS NULL)
- [x] `tipo` derivado da categoria no service (front não manda mais)
- [x] `usuarioId` extraído do token no controller (front não manda mais)
- [x] Coluna `info_reconhecidas` removida por redundância
- [ ] `DELETE /transacoes/:id` — valida dono pelo token

### 1.3 — Auth

- [x] Login com JWT via cookie httpOnly
- [x] `maxAge` de 7 dias no cookie
- [x] Rotas protegidas com preHandler authenticate

---

## Fase 2 — Tela de nova transação ✅

- [x] Valor em centavos com formatação R$ (efeito direita → esquerda)
- [x] Teclado numérico no mobile (`inputMode="numeric"`)
- [x] Descrição
- [x] Seletor de método de pagamento (PIX / Débito / Crédito / Dinheiro)
- [x] Categorias carregadas do back com `useEffect`
- [x] Tiles com ícone (`DynamicIcon`) e cores do banco
- [x] Busca de categorias por nome (filtro em memória, sem acento)
- [x] Limite de 7 categorias visíveis + tile "Adicionar" fixo
- [x] Seleção de categoria com destaque visual
- [x] Campo de data com default = hoje
- [x] POST salvando no banco
- [x] Validação antes do envio
- [ ] Feedback de sucesso + limpar form (ou voltar pra lista)

**Pronto quando:** você lança um gasto real pelo celular sem xingar.

---

## Fase 3 — Deploy 🚀

> Aqui o projeto vira produto. Não adia isso.

### 3.1 — Preparar

- [ ] Separar build do front (`vite build`) do backend
- [ ] `.env` de produção (banco, JWT_SECRET novo, origem do CORS)
- [ ] CORS liberando o domínio real em vez de `localhost:5173`
- [ ] Testar o build local antes de subir

### 3.2 — Subir

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

## Fase 4 — Usar de verdade (2 semanas)

> Isso é um passo do roadmap, não um intervalo. Não codar aqui é o trabalho.

- [ ] Lançar todo gasto real por 2 semanas
- [ ] Sua esposa usando também
- [ ] Anotar todo incômodo no `NOTAS.md` (sem consertar na hora)

**Pronto quando:** você tem uma lista de melhorias vinda do uso, não da imaginação.

---

## Fase 5 — Dashboard

> Só com dados reais você sabe qual número importa.

- [ ] Endpoint de resumo do mês (total entradas, total saídas, saldo)
- [ ] Endpoint de total por categoria
- [ ] Card de saldo do mês
- [ ] Entradas vs saídas
- [ ] Gráfico de gastos por categoria
- [ ] Navegar entre meses

**Pronto quando:** você olha a tela e aprende algo que não sabia sobre seus gastos.
**Tempo:** 2 sessões

---

## Fase 6 — Tela de lista de transações

- [ ] Listar transações do mês atual
- [ ] Item: ícone/cor da categoria + descrição + data + valor
- [ ] Verde para entrada (+), vermelho para saída (−)
- [ ] Toggle Todas / Entradas / Saídas
- [ ] `DELETE /transacoes/:id` no back
- [ ] Excluir transação com confirmação
- [ ] Filtro por mês

**Pronto quando:** dá pra ver e apagar um lançamento sem abrir o banco.
**Tempo:** 2 sessões

---

## Fase 7 — Publicar

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
Upload de CSV/OFX do Inter → parse → transações caem como pendentes → tela de categorização → tabela `categoria_referencias` aprende com cada categorização.
Pega ~80% do valor da automação com ~10% da complexidade do Open Finance.

**v3 — Open Finance (Pluggy)**
Só se o v2 não resolver. A branch `feature/open-finance` está te esperando.

---

## Ideias (não mexer agora)

> Tudo que der vontade de fazer fora de ordem vem pra cá.

- Famílias: grupo de pessoas com acesso compartilhado, permissões internas, segurança entre usuários
- Editar transações (PATCH): entra em release futura, por enquanto apaga e cria de novo
- Cartão de crédito: limite, usado, disponível, pagamento de fatura
- Cheque especial: limite, uso, acertos
- Parcelados: parcela atual, total de parcelas, geração mensal
- Dívidas com familiares: credor, total, pago, restante, parcelas combinadas
- Tabela "contas" (crédito e cheque especial com limite)
- Tabela "icones" com todos os nomes de ícone, exposta pro front
- Seletor de ícone e cor na tela de criar categoria
- Categorização automática com tabela `categoria_referencias`
- Tela de pendentes + badge na NavBar (volta com importação)
- Busca de categorias no servidor (debounce) pra lista de transações
- Guardar rascunho de formulário entre telas
- Corrigir ícone do date picker no mobile
- PWA: manifest + "Adicionar à tela inicial" com logo LVBK
- Limitar seleção de data até o dia atual, para tudo! (Criar transacao, Ver transacoes e etc)
