const express = require('express');
const app = express();

const rotasProdutos = require('./Routes/produtos')

app.use('/produtos', rotasProdutos);

// app.use((req, resp, next) => {
//     resp.status(200).send({
//         menssagem: "Sevidor rodando perfeitamente!!"
//     });
// });

module.exports = app;