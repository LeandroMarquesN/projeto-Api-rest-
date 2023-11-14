const express = require("express");
const router = express.Router();



router.get('/', (req, resp, next) => {
    resp.status(200).send({
        menssagen: "USANDO O GET DENTRO DA ROTAS DE PRODUTOS"
    })
});

router.post('/', (req, resp, next) => {
    resp.status(200).send({
        menssagen: "metodo post dentro da rota de produtos"
    })
});
// ======================================================================================================================

// Usando o get na rota produtos com passagem de parametros

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


module.exports = router;