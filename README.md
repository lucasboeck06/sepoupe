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
