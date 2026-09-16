# Roadmap — SePoupe

Este documento é a trajetória completa do projeto: de onde começou, o que mudou de rumo, o que está pronto hoje e para onde vai. Não é um roadmap escrito de uma vez só no início e esquecido — é atualizado conforme o projeto evolui, e existe pra registrar decisões, não só tarefas.

---

## A história do projeto

O SePoupe começou como um sistema financeiro mais ambicioso do que acabou sendo o v1: a ideia inicial era ter Open Finance desde o começo, integrando com o Pluggy para captar transações automaticamente do banco. O backend foi desenhado em Fastify com arquitetura em camadas (controller → service → repository), o frontend em React + Vite + Tailwind, e o banco em PostgreSQL.

No meio do caminho, a integração com Pluggy travou o projeto: testar webhook de Open Finance é difícil (depende de transação real, ngrok, payload que só traz um link em vez dos dados), e a complexidade acabou drenando o ânimo de continuar. Antes disso, uma tentativa com Asaas também foi descartada — o cartão de débito não tinha webhook próprio e a solução dependia de manter uma conta Asaas como banco principal, o que não fazia sentido.

A virada foi reconhecer que **Open Finance não era pré-requisito de MVP**. O produto de verdade — saber para onde o dinheiro está indo — funciona com entrada 100% manual. Cortar o escopo pra isso, documentar a decisão, e usar o app de verdade no dia a dia foi o que destravou o projeto e levou ao deploy em produção.

Depois do deploy, o projeto seguiu evoluindo com uso real: telas de lançamento e listagem de transações, dashboard com métricas reais, sistema de contas (cartão de crédito, cheque especial, vale-alimentação) com saldo calculado a partir das transações, filtros e navegação por mês, gráfico de gastos diários. Cada peça nasceu de uma necessidade concreta de uso, não de planejamento antecipado — inclusive o próprio conceito de "acerto" (fatura de cartão, quitação de cheque) surgiu de perceber que contar esses valores como gasto duplicava o número real.

---

## Decisões de arquitetura e por quê

**Camadas (controller → service → repository), consistente em todos os módulos.** Controller só valida e desestrutura a requisição, service aplica regra de negócio, repository só executa query. Um service pode consultar o repository de outro domínio quando faz sentido (ex: `transacaoService` consulta `categoriaRepository` para derivar o tipo da transação), mas nunca chama o service de outro domínio — isso evita acoplamento cruzado entre features.

**Sem isolamento de dados por usuário — decisão deliberada, não esquecimento.** O v1 é um financeiro compartilhado entre duas pessoas de confiança (o casal). Todos os usuários cadastrados enxergam as mesmas transações e contas. `usuario_id` existe, mas serve apenas como atribuição de quem gastou, não como filtro de visibilidade. Multi-tenant real (famílias isoladas entre si) é trabalho futuro, não uma correção pendente.

**Sem edição de transação (PATCH) no v1.** Com um formulário de poucos campos, corrigir um lançamento errado é mais simples apagando e recriando do que construindo uma tela de edição inteira. Fica para uma release futura, se o uso real mostrar necessidade.

**Tipo da transação (entrada/saída/acerto) é derivado da categoria no backend, nunca confiado ao valor que vem do front.** O mesmo vale para `usuario_id`, extraído do token JWT no controller em vez de vir no corpo da requisição — o front nunca decide, sozinho, dados que afetam regra de negócio ou identidade.

**Contas (cartão de crédito, cheque especial, VA) com saldo calculado por movimentação, não por consulta agregada em tempo real.** Cada transação que usa um desses métodos de pagamento atualiza o saldo da conta correspondente via `contasService`, com uma função de registrar e outra de reverter (usada no delete). VA funciona como carteira sem limite fixo; cartão e cheque têm limite e saldo usado.

**"Acerto" como tipo de transação separado de entrada e saída.** Pagar a fatura do cartão ou quitar o cheque especial não é um gasto novo — é liquidar algo que já foi contado quando a compra aconteceu. Contar os dois duplicaria o valor. O dashboard mostra `entradas`, `saídas` (gastos reais) e `acertos` como três métricas separadas, com `disponível = entradas - saídas - acertos`.

**Módulo de dashboard separado do CRUD.** Ele não pertence a nenhuma entidade específica, consome dado agregado de várias tabelas — por isso vive em seu próprio `dashboardController → dashboardService → dashboardRepository`, devolvendo tudo que a tela precisa numa única rota (`GET /dashboard?mes=`).

**Cookie httpOnly para o JWT, nunca localStorage.** Evita acesso via JavaScript malicioso (XSS). `secure` e `sameSite` ajustados para funcionar tanto em desenvolvimento (com túnel HTTPS) quanto em produção (mesmo domínio).

---

## Estado atual

### Backend

- Autenticação JWT via cookie httpOnly, `maxAge` de 7 dias
- CRUD completo de categorias, com ícone, cor primária e cor secundária (23 categorias seedadas)
- Transações: criar, listar (com filtro por tipo, ordenação por data ou criação, filtro por mês), deletar
- Sistema de contas com saldo atualizado automaticamente por movimentação, e revertido no delete
- Dashboard com resumo do mês (entradas, saídas, acertos), gastos por categoria, gráfico de gastos diários
- Arquitetura em camadas consistente, SQL sempre parametrizado (sem SQL injection)

### Frontend

- Tela de login
- Tela de nova transação: valor em centavos com formatação de moeda em tempo real, seletor de categoria com busca (sem acento) e ícones dinâmicos, seletor de método de pagamento, campo de data
- Tela de listagem de transações: filtros por tipo, ordenação, navegação por mês (setas e seletor em grid, com limites de data respeitados), exclusão com confirmação
- Dashboard com métricas do mês, saldo de contas, gráfico de gastos diários
- PWA instalável no celular

### Infraestrutura

- Deploy em VPS própria (Hetzner Cloud), com PostgreSQL, Nginx como proxy reverso, PM2 mantendo o backend no ar
- Domínio próprio com HTTPS (Cloudflare)
- CI/CD via GitHub Actions: merge na main dispara deploy automático via SSH
- Firewall restrito às portas necessárias (SSH, HTTP, HTTPS)

### Preparação para publicação

- `schema.sql` gerado a partir do banco de produção, reproduzível do zero
- `.env.example` documentando as variáveis necessárias
- Auditoria de código feita (nota geral 71/100 na primeira revisão completa), com os itens que bloqueavam publicação corrigidos: schema versionado, variáveis de ambiente documentadas, licença, README de portfólio, correção de enumeração de usuário na mensagem de erro de login

---

## Pendências conhecidas (não bloqueiam o uso)

Itens identificados em auditoria de código, registrados aqui para correção futura, sem urgência:

- Operações que envolvem duas tabelas (ex: criar transação + atualizar saldo de conta) não estão envolvidas em uma transação SQL (`BEGIN`/`COMMIT`). Baixo risco com o volume de uso atual, mas é o tipo de correção que entra como uma das primeiras melhorias pós-publicação.
- A constraint de ícone único por categoria (`categorias_icone_unico`) não está mais presente no banco de produção, e já existem ícones duplicados entre categorias. Precisa resolver as duplicatas antes de recriar a constraint.
- Sem backup automatizado do banco de produção.
- Duplicação de lógica de requisição HTTP no frontend (cada tela repete o mesmo bloco de fetch, headers e tratamento de erro) — merece um client centralizado.

---

## Roadmap de longo prazo

A ordem abaixo segue dependência real entre os itens, não ordem de vontade — cada passo prepara o terreno para o seguinte.

1. **Publicar o repositório** — README de portfólio, LICENSE, schema versionado, decisões documentadas (este passo).
2. **Contas extras** (poupança, dinheiro investido) — reaproveita a tabela `contas` que já existe, adicionando um novo tipo. Esforço baixo, ganho real de visibilidade no dashboard.
3. **Página de dívidas** com abatimento via transações — mesmo padrão já usado para "acerto" (fatura, quitação), aplicado a dívidas com pessoas físicas.
4. **Migração para TypeScript** — decidida para acontecer antes da funcionalidade de famílias, porque a tipagem estática ajuda a não esquecer filtros de isolamento (`usuario_id`/`familia_id`) espalhados pelos repositories quando essa mudança estrutural acontecer.
5. **Famílias / multi-tenant** — criação de usuários, compartilhamento de dados entre uma família específica, isolamento real entre famílias diferentes, e o conceito de saldo compartilhado da família (que só faz sentido depois que família existe como entidade).
6. **Observabilidade (Grafana)** — opcional, não bloqueia nada; ganha mais sentido com mais uso real e mais dado para observar.
7. **Integração Open Finance real** — retomada da branch `feature/open-finance`, agora com o resto do sistema maduro. É neste ponto que uma fila de mensagens (RabbitMQ) passaria a fazer sentido, para processar webhooks bancários de forma assíncrona.
8. **Categorização automática com IA**, com tela de correção e fallback humano — depende de dado chegando automaticamente (item 7), porque só faz sentido categorizar sozinho o que já chega sozinho.

---

## Ideias (sem data definida)

- Editar transações (PATCH) como release futura — hoje é apagar e recriar
- Tabela "icones" com todos os nomes disponíveis, exposta ao frontend para escolha ao criar categoria
- Categorização automática via tabela `categoria_referencias`, aprendendo com cada categorização manual
- Importação de extrato bancário (CSV/OFX) como alternativa mais simples ao Open Finance completo
- Busca de categorias no servidor (com debounce) para telas com volume maior de dados
- Limitar seleção de data até o dia atual em todos os formulários (hoje só implementado na tela de nova transação)
- Corrigir o ícone nativo do seletor de data no mobile
