const express = require('express');
const router = express.Router();

// =============== RETORNA TODOS OS PEDIDOS =====
router.get('/', (req, resp, next) => {
    resp.status(200).send({
        menssagem: "retorna todos os pedidos"
    });
});

// ============ INSERE UM PEDIDO =============

router.post('/', (req, resp, next) => {

    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }

    resp.status(200).send({
        menssagem: "Pedido inserido!!",
        PedidoCriado: pedido
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