const express = require("express");
const router = express.Router();


//======= RETORNA TODOS OS PRODUTOS =================================
router.get('/', (req, resp, next) => {
    resp.status(200).send({
        menssagen: "USANDO O GET DENTRO DA ROTAS DE PRODUTOS",
        menssagen: "retorna todos os  produtos"
    })
});
// ====== INSERI UM PRODUTO  ========================================
router.post('/', (req, resp, next) => {
    resp.status(200).send({
        menssagen: "metodo post dentro da rota de produtos"
    })
});
// ======= RETORNA UM PRODUTO COM UM PARAMETRO ESPECIFICO ============

// ==== Usando o get na rota produtos com passagem de parametros ====

router.get('/:id_produto', (req, resp, next) => {
    const id = req.params.id_produto

    if (id === 'especial') {

        resp.status(200).send({
            menssagen: "voce encontrou o id especial",
            parametro_id: id
        })
    } else {
        resp.status(200).send({
            menssagen: "voce passou um id que não é especial!",
            parametro_id: `voce colocou o id ${id} e ele não é especial`
        })
    }
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