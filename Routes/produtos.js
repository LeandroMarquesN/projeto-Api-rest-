const express = require("express");
const router = express.Router();
// const bancoDados = require("./BD");
const mysql = require('../mysql').pool;

// ------ METODO GET RETORNA TODOS OS PRODUTOS   ---------
router.get('/', (req, resp, next) => {

    const query = "select * from produtos;"

    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            (error, results, fields) => {
                conn.release();

                const response = {
                    quantidade: results.length,
                    produtos: results.map(prod => {
                        return {
                            id_produto: prod.idprodutos,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: "GET",
                                descricao: "",
                                url: 'http://localhost:3002/produtos/' + prod.idprodutos
                            }
                        }
                    })
                }

                if (error) {
                    resp.status(500).json({
                        error: error,
                        response: null
                    });
                } else {
                    resp.status(200).send({
                        error: null,
                        response: response
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
//---- METODO GET RETORNA UM PRODUTO COM UM PARAMETRO ESPECIFICO ----

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
                    resp.status(201).send({
                        error: null,
                        response: results
                    });
                }

            });
    });
})

//---- METODO PATCH ALTERA O PRODUTO------- 


router.patch('/', (req, resp, next) => {

    const query = 'update produtos set nome=?,preco=? where idProdutos =?';

    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            [req.body.nome, req.body.preco, req.body.idProdutos],
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
                        menssagen: 'Produto atualizado com sucesso!!',

                    });
                }
            });
    });
});

//---- METODO DELETE DELETA UM  PRODUTO -----
router.delete('/', (req, resp, next) => {
    const query = 'delete from produtos where idProdutos =?';

    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            [req.body.idProdutos],
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
                        menssagen: 'Produto removido com sucesso!!',

                    });
                }
            });
    });
})


module.exports = router;