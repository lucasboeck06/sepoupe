# SePoupe

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
