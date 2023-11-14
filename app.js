const express = require('express');
const app = express();

const rotasProdutos = require('./Routes/produtos')
const rotasPedidos = require('./Routes/pedidos')

// ===  ROTAS DE PRODUTOS =======
app.use('/produtos', rotasProdutos);
// === ROTAS DE PEDIDOS ======
app.use('/pedidos', rotasPedidos)
// app.use((req, resp, next) => {
//     resp.status(200).send({
//         menssagem: "Sevidor rodando perfeitamente!!"
//     });
// });

module.exports = app;