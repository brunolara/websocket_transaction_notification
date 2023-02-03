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
