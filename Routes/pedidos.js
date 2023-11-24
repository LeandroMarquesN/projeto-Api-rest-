const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool
// -------- RETORNA TODOS PEDIDOS ---------
router.get('/', (req, resp, next) => {
    const query = "select * from pedidos;"
    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            (error, result, fields) => {
                conn.release();
                const response = {
                    quantidade: result.length,
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            id_produto: pedido.id_produto,
                            quantidade: pedido.quantidade,
                            request: {
                                tipo: "GET",
                                descricao: "Retorna detalhes do pedido",
                                url: 'http://localhost:3002/pedidos/' + pedido.id_pedido
                            }
                        }
                    })
                }
                if (error) {
                    resp.status(500).send({
                        error: error,
                        response: null
                    });
                } else {
                    resp.status(202).send({
                        erro: null,
                        response: response
                    })
                }
            });
    });
});
// -------  METHODO POST --------
router.post('/', (req, resp, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return resp.status(500).json({ error: error, response: null }); };
        conn.query(
            `insert into pedidos (id_produto,quantidade) values (?,?)`,
            [req.body.id_produto, req.body.quantidade],
            (error, results, fields) => {
                conn.release();
                if (error) { return resp.status(500).json({ error: error, response: null }); }

                if (results.length == 0) {
                    return resp.status(404).send({
                        menssagen: " Pedido não encontrado!!"
                    });
                }

                // -- CRIANDO UM OBJETO PARA RETORNAR MAIS INFORMAÇÕES --
                const response = {
                    menssagen: "Pedido inserido com sucesso",
                    pedidoCriado: {
                        id_pedido: results.idpedido,
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: "GET",
                            descricao: "RETORNA TODOS OS PEDIDOS",
                            url: 'http://localhost:3002/pedidos'
                        }
                    }
                }
                return resp.status(201).send(response);
                // stado 201 siguinifica um alateração no banco
            });
    });
});
// == RETORNA OS DADOS DE UM PRODUTO ==
router.get('/:id_pedido', (req, resp, next) => {
    const query = `select * from pedidos where id_pedido =${req.params.id_pedido};`

    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            (error, results, fields) => {
                conn.release();

                if (results.length == 0) {
                    return resp.status(404).send({
                        menssagen: "ID invalido!! pedido não encontrado!!"
                    });
                }

                // -- CRIANDO UM OBJETO PARA RETORNAR MAIS INFORMAÇÕES --
                const response = {

                    pedido: {
                        menssagen: "Pedido Encontrado",
                        id_pedido: results[0].id_pedido,
                        Id_produto: results[0].id_produto,
                        quantidade: results[0].quantidade,
                        request: {
                            tipo: "GET",
                            descricao: "Retorna os detalhes de um pedido especifico",
                            url: 'http://localhost:3002/pedidos'
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
                        response: response
                    });
                }

            });
    });
});
// ======= ALTERA UM PEDIDO =============
router.patch('/', (req, resp, next) => {
    const query = 'update pedidos set id_produto=?,quantidade=? where id_pedido =?';

    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            [req.body.id_produto, req.body.quantidade, req.body.id_pedido],
            (error, results, fields) => {
                conn.release();


                const response = {
                    menssagen: 'Pedido atualizado com sucesso!!',
                    produtoAtualizado: {
                        id_pedido: req.body.id_pedido,
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: "GET",
                            descricao: "SELECIONA UM PEDIDO ESEPECIFICO",
                            url: 'http://localhost:3002/PEDIDOS/' + req.body.id_pedido
                        }
                    }
                }
                if (error) {
                    resp.status(500).json({
                        error: error,
                        response: null
                    });
                } else {
                    resp.status(202).send({
                        error: null,
                        response: response
                    });
                }
            });
    });
})

// ========= DELETA um produto ==========
router.delete('/', (req, resp, next) => {
    const query = 'delete from pedidos where id_pedido =?';

    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            [req.body.id_pedido],
            (error, results, fields) => {
                conn.release();
                const response = {
                    menssagen: "Pedido removido com sucesso!!",
                    request: {
                        tipo: "POST",
                        descricao: "INSERI UM PEDIDO ESEPECIFICO",
                        url: 'http://localhost:3002/pedidos/',
                        body: {
                            id_produto: "Number",
                            Quantidade: "Number"
                        }
                    }
                }
                if (error) {
                    resp.status(500).json({
                        error: error,
                        response: null
                    });
                } else {
                    resp.status(200).send({
                        error: null,
                        Response: response

                    });
                }
            });
    });
})
module.exports = router;