<h2>Serviço de websocket para avisar as aplicações do ecommercebank sobre alterações no seus estados.</h2>


- Por enquanto lidando apenas com Confirmado e Estorno

<h3>Exemplo de consumo:</h2>

```html
<script src="socket.io.min.js"></script>
<script>
    const socket = io('http://localhost:3000', {
        query: {token: "JWT_TOKEN"}
    });

    socket.on("transactionPay", (s) => console.log(s));
    socket.on("transactionChargeBack", (s) => console.log(s));

</script>
```
<h3>body esperado </h3>
POST /sendNotification
```json
{
  "id": "123",
  "valor": 30,
  "valorBruto": 40,
  "cotacao": null,
  "parcelas": 1,
  "nomeCliente": "Ronaldo Silva",
  "usuarioId": "123",
  "tipoOperacao": "4",
  "creationDate": "2023-02-23T16:38:32",
  "lastModified": "2023-02-23T16:38:32",
  "usuarioEstornoNome": "",
  "integracaoDadosGN": {
    "nomePessoa": "CASSIO",
    "banco": "Não Informado",
    "documento": "01234567"
  },
  "vencimento": "2023-01-01",
  "nossaCotacao": 5.2577,
  "statusTransacao": 19
}
```
