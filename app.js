// ======IMPORTANDO MODULOS ===
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json) //comentada pois se esta linnha estiver descomentada o codigo não vai funcionar


// ========= ROTAS =============
const rotasProdutos = require('./Routes/produtos')
const rotasPedidos = require('./Routes/pedidos')


app.use(morgan('dev'));


// ========= TRATANDO ERROS CORS ========





// ===  ROTAS DE PRODUTOS =======
app.use('/produtos', rotasProdutos);
// === ROTAS DE PEDIDOS ======
app.use('/pedidos', rotasPedidos)


// ===== QUANDO A ROTA NÃO É ENCONTRADA CAI AQUI!!=====
app.use((req, resp, next) => {

    const erro = new Error("Rota não Encontrada!! verifique a url digitada!!");

    erro.status = 404;
    next(erro);
})

app.use((error, req, resp, next) => {
    resp.status(error.status || 500);
    return resp.send({
        erro: {
            menssagem: error.message
        }
    })
})


//Exemplo par testar o  servidor por isso que está comentado
// app.use((req, resp, next) => {
//     resp.status(200).send({
//         menssagem: "Sevidor rodando perfeitamente!!"
//     });
// });

module.exports = app;