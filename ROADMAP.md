# Roadmap do SePoupe

Este documento é a trajetória completa do projeto: de onde começou, o que mudou de rumo, o que está pronto hoje e para onde vai. Não é um roadmap escrito de uma vez só no início e esquecido: é atualizado conforme o projeto evolui, e existe pra registrar decisões, não só tarefas.

---

## A história do projeto

O SePoupe começou como um sistema financeiro mais ambicioso do que acabou sendo o v1: a ideia inicial era ter Open Finance desde o começo, integrando com o Pluggy para captar transações automaticamente do banco. O backend foi desenhado em Fastify com arquitetura em camadas (controller → service → repository), o frontend em React + Vite + Tailwind, e o banco em PostgreSQL.

No meio do caminho, a integração com Pluggy travou o projeto: testar webhook de Open Finance é difícil (depende de transação real, ngrok, payload que só traz um link em vez dos dados), e a complexidade acabou drenando o ânimo de continuar. Antes disso, uma tentativa com Asaas também foi descartada: o cartão de débito não tinha webhook próprio e a solução dependia de manter uma conta Asaas como banco principal, o que não fazia sentido.

A virada foi reconhecer que **Open Finance não era pré-requisito de MVP**. O produto de verdade (saber para onde o dinheiro está indo) funciona com entrada 100% manual. Cortar o escopo pra isso, documentar a decisão, e usar o app de verdade no dia a dia foi o que destravou o projeto e levou ao deploy em produção.

Depois do deploy, o projeto seguiu evoluindo com uso real: telas de lançamento e listagem de transações, dashboard com métricas reais, sistema de contas (cartão de crédito, cheque especial, vale-alimentação) com saldo calculado a partir das transações, filtros e navegação por mês, gráfico de gastos diários. Cada peça nasceu de uma necessidade concreta de uso, não de planejamento antecipado, inclusive o próprio conceito de "acerto" (fatura de cartão, quitação de cheque), que surgiu de perceber que contar esses valores como gasto duplicava o número real.

Mais tarde veio a tela de Capital, com conta corrente e poupança (investir e resgatar). Ao longo do caminho o código passou por três auditorias: 64/100, depois 71/100 (pré-publicação) e depois 58/100 (após a feature de Capital). Desde então foram feitas duas rodadas grandes de correção, cujo resultado está na seção de estado atual.

---

## Decisões de arquitetura e por quê

**Camadas (controller → service → repository), consistente em todos os módulos.** Controller só desestrutura a requisição e devolve a resposta, service valida e aplica regra de negócio, repository só executa query. Um service pode consultar o repository de outro domínio quando faz sentido (ex: `transacaoService` consulta `categoriaRepository` para derivar o tipo da transação). Como regra, um service não chama o service de outro domínio, para evitar acoplamento cruzado entre features. Existe uma exceção deliberada: `transacaoService` chama `registrarMovimentacao` e `reverterMovimentacao` do `contaService`. Criar ou apagar uma transação precisa atualizar o saldo das contas na mesma transação SQL, e a regra de qual conta muda (por método de pagamento, por categoria de acerto, por categoria "VA") é do domínio de contas. Duplicar essa regra no `transacaoService` seria pior do que a dependência; por isso a chamada existe, recebe o mesmo `client` da transação SQL aberta, e vai só nessa direção (`contaService` não conhece transações).

**Sem isolamento de dados por usuário: decisão deliberada, não esquecimento.** O v1 é um financeiro compartilhado entre duas pessoas de confiança (o casal). Todos os usuários cadastrados enxergam as mesmas transações e contas. `usuario_id` existe, mas serve apenas como atribuição de quem gastou, não como filtro de visibilidade. Multi-tenant real (famílias isoladas entre si) é trabalho futuro, não uma correção pendente.

**Sem edição de transação (PATCH) no v1.** Com um formulário de poucos campos, corrigir um lançamento errado é mais simples apagando e recriando do que construindo uma tela de edição inteira. Fica para uma release futura, se o uso real mostrar necessidade.

**Tipo da transação (entrada/saída/acerto) é derivado da categoria no backend, nunca confiado ao valor que vem do front.** O mesmo vale para o nome da categoria (consultado no banco a partir do `categoriaId`, em vez de vir junto no corpo) e para `usuario_id`, extraído do token JWT no controller em vez de vir no corpo da requisição. O front nunca decide, sozinho, dados que afetam regra de negócio ou identidade.

**Contas com saldo calculado por movimentação, não por consulta agregada em tempo real.** São cinco tipos: `credito`, `cheque_especial`, `va`, `conta_corrente` e `poupanca`. Cada transação atualiza o saldo das contas correspondentes via `contaService`, com uma função de registrar e outra de reverter (usada no delete). Cartão e cheque têm limite e saldo usado; VA funciona como carteira sem limite fixo (o crédito do vale aumenta o limite, cada compra aumenta o usado). A conta corrente é alimentada por transações em PIX, Débito e Dinheiro: incluir Dinheiro foi uma simplificação consciente. A poupança só se movimenta por investimento e resgate, sempre contra a conta corrente.

**Operações que tocam mais de uma tabela ou conta são atômicas (`BEGIN`/`COMMIT`/`ROLLBACK`).** Criar transação, apagar transação, investir e resgatar abrem uma conexão própria do pool, fazem todas as escritas dentro do mesmo bloco e desfazem tudo se qualquer passo falhar. Os repositories recebem o `client` como parâmetro opcional (com o `pool` como padrão), então a mesma query serve dentro e fora de transação. Em investir e resgatar, o saldo é lido com `SELECT ... FOR UPDATE`, para que duas operações simultâneas não usem o mesmo saldo duas vezes.

**"Acerto" como tipo de transação separado de entrada e saída.** Pagar a fatura do cartão ou quitar o cheque especial não é um gasto novo: é liquidar algo que já foi contado quando a compra aconteceu. Contar os dois duplicaria o valor. O dashboard recebe `entradas`, `saidas` (gastos reais) e `acertos` como três métricas separadas. O card de saldo disponível é `entradas - saidas`, de propósito; os acertos aparecem num card separado, "Total com acertos" (gastos + acertos).

**Módulo de dashboard separado do CRUD.** Ele não pertence a nenhuma entidade específica, consome dado agregado de várias tabelas; por isso vive em seu próprio `dashboardController → dashboardService → dashboardRepository`, devolvendo tudo que a tela precisa numa única rota (`GET /dashboard?mes=`). A tela de Capital segue o mesmo raciocínio, com `GET /capital` para leitura; as escritas (investir e resgatar) ficam em `/contas`, porque alteram contas.

**Cookie httpOnly para o JWT, nunca localStorage.** Evita acesso via JavaScript malicioso (XSS). O cookie é sempre `secure`, porque tanto produção quanto desenvolvimento rodam com SSL; o `sameSite` é `lax` em produção (mesmo domínio) e `none` em desenvolvimento. O localStorage guarda só uma marcação de "logado" e o nome para a saudação, usados pela interface, nunca para autenticar.

**Um único client HTTP no frontend.** Toda chamada ao backend passa por `frontend/src/lib/api.js`, que envia o cookie, serializa o corpo, mostra o erro devolvido pelo backend e, em caso de `401` fora do login, limpa a marcação de sessão e volta para a tela de login.

---

## Estado atual

### Backend

- Autenticação JWT via cookie httpOnly, `maxAge` de 7 dias, com logout (`POST /auth/logout`) limpando o cookie
- Rate limit na rota de login: 5 tentativas por minuto por IP (com `trustProxy`, para enxergar o IP real atrás do Nginx)
- Servidor se recusa a subir se o `SECRET` estiver ausente ou tiver menos de 32 caracteres
- CRUD completo de categorias, com ícone, cor primária e cor secundária (categorias novas recebem ícone e cores padrão)
- Transações: criar, listar (com filtro por tipo, ordenação por data ou criação, filtro por mês), deletar
- Sistema de contas com saldo atualizado automaticamente por movimentação, e revertido no delete
- Capital: patrimônio (conta corrente + poupança), investir e resgatar, com validação de saldo disponível
- Atomicidade com `BEGIN`/`COMMIT`/`ROLLBACK` em criar e apagar transação, investir e resgatar, e `FOR UPDATE` na leitura de saldo
- Dashboard com resumo do mês (entradas, saídas, acertos), ranking de gastos por categoria, gráfico de gastos diários
- Arquitetura em camadas consistente, SQL sempre parametrizado (sem SQL injection)

### Frontend

- Tela de login, e botão de logout no Dashboard
- Tela de nova transação: valor em centavos com formatação de moeda em tempo real, seletor de categoria com busca (sem acento) e ícones dinâmicos, criação de categoria na própria tela, seletor de método de pagamento, campo de data
- Tela de listagem de transações: filtros por tipo, ordenação, navegação por mês (setas e seletor em grid, com limites de data respeitados), exclusão com confirmação
- Dashboard com métricas do mês, saldo de contas, ranking de gastos, gráfico de gastos diários
- Tela de Capital: patrimônio total, conta corrente, poupança, e painel para investir ou resgatar
- Client HTTP centralizado (`lib/api.js`), com tratamento único de erro e de sessão expirada
- Estados de carregamento no Dashboard e na listagem de transações, e botões de envio travados até a resposta (sem duplo clique gerando lançamento duplicado)
- Data de hoje calculada no fuso local do aparelho (`lib/data.js`), em vez de UTC, para não lançar no dia errado à noite
- Formatação de moeda centralizada (`lib/formatarBRL.js`)
- PWA instalável no celular

### Infraestrutura

- Deploy em VPS própria (Hetzner Cloud), com PostgreSQL, Nginx como proxy reverso, PM2 mantendo o backend no ar
- Domínio próprio com HTTPS (Cloudflare), com SSL ponta a ponta
- CI/CD via GitHub Actions: merge na main dispara deploy automático via SSH
- `package-lock.json` versionado no backend e no frontend, com `npm ci` no deploy (instalação reproduzível)
- Firewall restrito às portas necessárias (SSH, HTTP, HTTPS)

### Preparação para publicação

- `schema.sql` gerado a partir do banco de produção, reproduzível do zero
- `.env.example` (raiz e `frontend/`) documentando as variáveis necessárias
- Três auditorias de código: 64/100, 71/100 (pré-publicação) e 58/100 (após a feature de Capital). Os itens que bloqueavam publicação foram corrigidos antes de abrir o repositório (schema versionado, variáveis de ambiente documentadas, licença, README de portfólio, correção de enumeração de usuário na mensagem de erro de login). Depois da terceira, vieram duas rodadas grandes de correção

---

## Pendências conhecidas (não bloqueiam o uso)

Itens identificados em auditoria de código, registrados aqui para correção futura, sem urgência:

- A constraint de ícone único por categoria (`categorias_icone_unico`) não está mais presente no banco de produção, e já existem ícones duplicados entre categorias. Precisa resolver as duplicatas antes de recriar a constraint.
- Sem backup automatizado do banco de produção.
- Sem seed: um banco novo não tem as contas nem as categorias de que as regras de conta dependem, e elas precisam ser inseridas à mão (o passo a passo está no README). Planejado junto com as migrations.
- As regras de conta dependem de nomes de categoria fixos no código (`VA`, `Fatura Inter`, `Fatura Caixa`, em `contaService`). Renomear uma dessas categorias quebra a regra sem nenhum aviso.

---

## Roadmap de longo prazo

A ordem abaixo segue dependência real entre os itens, não ordem de vontade: cada passo prepara o terreno para o seguinte. Publicar o repositório e as contas extras (conta corrente e poupança, com a tela de Capital) já saíram desta lista e estão em [Estado atual](#estado-atual).

1. **Testes automatizados**: hoje não existe nenhum teste no repositório.
2. **Robustez do backend e segurança**: validação de entrada por schema nas rotas, tratamento central de erros (em vez de um `try/catch` por controller), headers de segurança, migrations e seed no lugar do `schema.sql` gerado por dump, e um ledger de movimentações das contas (hoje o saldo existe só como número acumulado na tabela `contas`).
3. **CI como portão do deploy, e fluxo com branch `dev`**: hoje o push na main faz deploy direto, sem nenhuma verificação antes. A ideia é que o deploy só aconteça se o CI passar, com uma branch `dev` antes da main.
4. **Importação de extrato bancário (CSV/OFX)**: alternativa mais simples ao Open Finance completo.
5. **Migração para TypeScript**: decidida para acontecer antes da funcionalidade de famílias, porque a tipagem estática ajuda a não esquecer filtros de isolamento (`usuario_id`/`familia_id`) espalhados pelos repositories quando essa mudança estrutural acontecer.
6. **Famílias / multi-tenant**: criação de usuários, compartilhamento de dados entre uma família específica, isolamento real entre famílias diferentes, e o conceito de saldo compartilhado da família (que só faz sentido depois que família existe como entidade).
7. **Observabilidade (Grafana)**: opcional, não bloqueia nada; ganha mais sentido com mais uso real e mais dado para observar.
8. **Integração Open Finance real**: retomada da branch `feature/open-finance`, agora com o resto do sistema maduro. É neste ponto que uma fila de mensagens (RabbitMQ) passaria a fazer sentido, para processar webhooks bancários de forma assíncrona.
9. **Categorização automática com IA**, com tela de correção e fallback humano: depende de dado chegando automaticamente (item 8), porque só faz sentido categorizar sozinho o que já chega sozinho.

---

## Ideias (sem data definida)

- Editar transações (PATCH) como release futura; hoje é apagar e recriar
- Página de dívidas com abatimento via transações, no mesmo padrão já usado para "acerto" (fatura, quitação), aplicado a dívidas com pessoas físicas
- Tabela "icones" com todos os nomes disponíveis, exposta ao frontend para escolha ao criar categoria
- Categorização automática via tabela `categoria_referencias`, aprendendo com cada categorização manual
- Busca de categorias no servidor (com debounce) para telas com volume maior de dados
- Limitar a seleção de data até o dia atual no formulário de nova transação (a navegação por mês já respeita esse limite, o campo de data ainda não)
- Corrigir o ícone nativo do seletor de data no mobile
