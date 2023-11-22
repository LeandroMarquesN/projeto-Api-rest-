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

                // -- CRIANDO UM OBJETO PARA RETORNAR MAIS INFORMAÇÕES --
                const response = {
                    quantidade: results.length,
                    produtos: results.map(prod => {
                        return {
                            id_produto: prod.idprodutos,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: "GET",
                                descricao: "Retorna todos os produtos",
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

    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    }
    const query = `insert into produtos (nome,preco) values (?,?);`
    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            [produto.nome, req.body.preco],
            (error, results, fields) => {
                conn.release();

                // -- CRIANDO UM OBJETO PARA RETORNAR MAIS INFORMAÇÕES --
                const response = {
                    menssagen: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: results.idprodutos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: "POST",
                            descricao: "Insere um produto",
                            url: 'http://localhost:3002/produtos'
                        }
                    }
                }



                if (error) {
                    resp.status(500).json({
                        error: error,
                        response: null
                    });
                } else {
                    resp.status(201).send({
                        error: null,
                        menss: "produto inserido",
                        response: response

                    });
                }
                // stado 201 siguinifica um alateração no banco

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