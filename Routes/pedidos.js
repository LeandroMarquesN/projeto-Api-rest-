const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool
// =============== RETORNA TODOS OS PEDIDOS =====
router.get('/', (req, resp, next) => {
    const query = "select * from pedidos;"
    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            (error, result, fields) => {
                conn.release();
                const response = {
                    qunatidade: result.length,
                    pedidos: result.map(pedido => {
                        return {
                            idpedidos: pedido.idpedidos,
                            quantidade: pedido.quantidade,
                            produtos_idprodutos: pedido.produtos_idprodutos,
                            request: {
                                tipo: "GET",
                                descricao: "Retorna detalhes do pedido",
                                url: 'http://localhost:3002/pedidos/' + pedido.idpedidos
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

    const query = `insert into pedidos (id_produto,quantidade) values (?,?)`;
    mysql.getConnection((error, conn) => {
        if (error) { return resp.status(500).json({ error: error, response: null }); }
        conn.query(
            query,
            [req.body.id_produto, req.body.quantidade],
            (error, results, fields) => {
                conn.release();
                if (error) { return resp.status(500).json({ error: error, response: null }); }
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

// ============== RETORNA OS DADOS DE UM PRODUTO ==
router.get('/:id_pedido', (req, resp, next) => {
    const id = req.params.id_pedido;

    if (id === "show") {
        resp.status(200).send({
            menssagem: `Você descobriu o id show que é  o => ${id}`
        });
    } else {
        resp.status(200).send({
            mennsagem: `Voce nao colocou o id especial!vc colcocou ${id}`
        });
    }
});
// ======= ALTERA UM PRODUTO =============
router.patch('/', (req, resp, next) => {
    resp.status(201).send({
        menssagem: "Altera um pedido"
    })
})

// ========= DELETA um produto ==========
router.delete('/', (req, resp, next) => {
    resp.status(201).send({
        menssagem: "Deleta um pedido!"
    })
})
module.exports = router;