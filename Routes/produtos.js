const express = require("express");
const router = express.Router();
// const bancoDados = require("./BD");

const mysql = require('../mysql').pool;


// ------ METODO GET RETORNA TODOS OSO PRODUTOS   ---------
router.get('/', (req, resp, next) => {

    const query = "select * from produtos;"

    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            (error, results, fields) => {
                conn.release();

                if (error) {
                    resp.status(500).json({
                        error: error,
                        response: null
                    });
                } else {
                    resp.status(200).send({
                        error: null,
                        response: results
                    });
                }

            });
    });

});
// ------- METODO POST INSERI UM PRODUTO --------- 
router.post('/', (req, resp, next) => {

    //----- CONECTANDO MYSQL COM BANCO DE DADOS ---

    //----- query de inserção nuito usado quando temos um aquery muito grande
    const query = `insert into produtos (nome,preco) values (?,?);`;
    //---- Criando o pool de conexao
    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            [req.body.nome, req.body.preco],
            (error, resultado, fields) => {
                conn.release();

                if (error) {
                    resp.status(500).json({
                        error: error,
                        response: null
                    })
                } else {
                    // stado 201 siguinifica um alateração no banco
                    resp.status(201).send({
                        menssagen: "Produto inserido com sucesso",
                        // produtoCriado: produto,
                        id: resultado.insertId
                    });
                }
            });
    });


});
// ======= RETORNA UM PRODUTO COM UM PARAMETRO ESPECIFICO ============

// ==== Usando o get na rota produtos com passagem de parametros ====

router.get('/:id_produto', (req, resp, next) => {

    const query = `select * from produtos where idprodutos =${req.params.id_produto};`

    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            (error, results, fields) => {
                conn.release();

                if (error) {
                    resp.status(500).json({
                        error: error,
                        response: null
                    });
                } else {
                    resp.status(200).send({
                        error: null,
                        response: results
                    });
                }

            });
    });
})

// ========== ALTERA O PRODUTO ============== 
router.patch('/', (req, resp, next) => {
    resp.status(201).send({
        menssagem: "Usando o PATCH dentro da rota de produtos"
    })
})

// ========== DELETA O PRODUTO ==============
router.delete('/', (req, resp, next) => {
    resp.status(201).send({
        menssagem: "Usando o DELETE dentro da rota de produtos"
    })
})


module.exports = router;