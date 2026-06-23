Rota -> Controller -> Service -> Repository -> Banco

Exemplo de payload do Asaas:
{
"id": "evt_e633de3138cfbe837b624a32f8b242a7&16589304",
"event": "TRANSFER_CREATED",
"dateCreated": "2026-06-20 17:27:56",
"account": {
"id": "1cfc82c9-c0c4-4b4b-a6a5-b8d6f5724e89",
"ownerId": null
},
"transfer": {
"object": "transfer",
"id": "ee7394ae-6dd9-451b-8757-67a1d04a80b7",
"value": 5,
"netValue": 5,
"transferFee": 0,
"dateCreated": "2026-06-20",
"status": "PENDING",
"effectiveDate": null,
"confirmedDate": null,
"endToEndIdentifier": null,
"transactionReceiptUrl": null,
"operationType": "PIX",
"failReason": null,
"walletId": null,
"description": null,
"externalReference": null,
"authorized": false,
"scheduleDate": "2026-06-20",
"type": "BANK_ACCOUNT",
"bankAccount": {
"bank": {
"code": "260",
"name": "NU PAGAMENTOS S.A. - INSTITUIÇÃO DE PAGAMENTO",
"ispb": "18236120"
},
"accountName": null,
"ownerName": "Keagan Feest",
"cpfCnpj": "**\*.911.111-**",
"type": "CHECKING_ACCOUNT",
"agency": "0",
"agencyDigit": null,
"account": "00000000",
"accountDigit": "0",
"pixAddressKey": "99991111140"
},
"recurring": null,
"canBeCancelled": true
}
}

A gente precisa reconhecer o usuario, reconhecer a categoria, se houver, e fazer o insert associando corretamente.

FRONT-END:

- npm create vite@latest frontend -- --template react
  (Criamos o projeto frontend para o front, com Vite)
- Cria /src/pages (Onde teremos Login.tsx, Dash.tsx, as páginas)
- npm install react-router-dom
  (Registra as rotas para o front (Que podem ser mascaras para as do back))
- Atualiza o main.jsx, com as rotas das páginas, importando elas

Sobre o react:

- useState: Serve para reconstruir a página, quando algo atualiza e precisa ser exibido
- useEffect: Em combo com fetch, usamos para req para o back. Sempre precisa do useState, pois roda depois do componente renderizar, logo, precisa atualizar a página com is novos dados vindos da rota.
- .then, vem da parada das promisses, sobre concorrência.
- components: São funções que se repetem no projeto, logo viram componentes para serem reaproveitados.
- props: Parametros que são passados aos componentes, mas são props ({nome})...<h1>Olá {nome}!</h1>

Para rodar o front fazendo requisições (usando ngrok):

- npm install @fastify/cors
- fastify.register(fastifyCors, {
  origin: "\*", // Libera tudo por enquanto, em produção restringe
  });
- E o fetch no front precisamos: headers: { "ngrok-skip-browser-warning": "true" }

Para conseguir armazenar o JWT, após o Login, precisamos utilizar o localStorage para lembrar disso para as requisições:
localStorage.setItem('token', 'eyJhbGc...')
localStorage.getItem('token')
localStorage.removeItem('token') // pra fazer logout

Como redirecionar:
O React Router tem um hook chamado useNavigate pra isso:
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// depois do login:
navigate('/dashboard')

Vamos usar tailwind para estilização:
npm install tailwindcss @tailwindcss/vite
Depois configura no vite.config.js e importa no index.css. Pesquisa "tailwind vite setup" — a doc oficial tem o passo a passo certinho.
Configura: vite.config.js

    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";
    import tailwindcss from "@tailwindcss/vite";

    // https://vite.dev/config/
    export default defineConfig({
    plugins: [react(), tailwindcss()],
    });

E em: index.css, deixa só: @import "tailwindcss";
