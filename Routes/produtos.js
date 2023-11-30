const express = require("express");
const router = express.Router();
// const bancoDados = require("./BD");
const mysql = require('../mysql').pool;

const multer = require('multer');

const storage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, 'upload/');

    },
    filename: function (req, file, callback) {

        callback(null, new Date().toISOString() + '   ' + file.originalname)
    }
});

const upload = multer({

    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5  // Aqui o valor est limitado para 5 megaBytes
    }
});

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
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: "GET",
                                descricao: "Retorna detalhes do produto",
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
router.post('/', upload.single('produto_imagem'), (req, resp, next) => {
    console.log(req.file)
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco,
        produto_imagem: req.file.path
    }
    const query = `insert into produtos (nome,preco,imagem_produto) values (?,?,?);`
    mysql.getConnection((error, conn) => {
        conn.query(
            query,
            [produto.nome, req.body.preco, req.file.path],
            (error, results, fields) => {
                conn.release();

                // -- CRIANDO UM OBJETO PARA RETORNAR MAIS INFORMAÇÕES --
                const response = {
                    menssagen: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: results.idprodutos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request: {
                            tipo: "GET",
                            descricao: "seleciona todos os produtos",
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
                // stado 201 siguinifica uma alteração no banco

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
                console.log(results[0], fields)
                conn.release();

                if (results.length == 0) {
                    return resp.status(404).send({
                        menssagen: "ID invalido!! produto não encontrado!!"
                    });
                }

                // -- CRIANDO UM OBJETO PARA RETORNAR MAIS INFORMAÇÕES --
                const response = {

                    produto: {
                        menssagen: "Produto Encontrado",
                        id_produto: results[0].idprodutos,
                        nome: results[0].nome,
                        preco: results[0].preco,
                        imagem_produto: results[0].imagem_produto,
                        request: {
                            tipo: "GET",
                            descricao: "Retorna os detalhes de um produto especifico",
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
                        response: response
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
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, results, fields) => {
                conn.release();


                const response = {
                    menssagen: 'Produto atualizado com sucesso!!',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: `R$ ${req.body.preco}`,
                        request: {
                            tipo: "GET",
                            descricao: "SELECIONA UM PRODUTO ESEPECIFICO",
                            url: 'http://localhost:3002/produtos/' + req.body.id_produto
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
});

//---- METODO DELETE DELETA UM  PRODUTO -----
router.delete('/', (req, resp, next) => {

    mysql.getConnection((error, conn) => {
        const query = 'delete from produtos where idProdutos =?';
        conn.query(
            query,
            [req.body.id_produto],
            (error, results, fields) => {
                conn.release();
                const response = {
                    menssagen: "Produlto removido com sucesso!!",
                    request: {
                        tipo: "POST",
                        descricao: "INSERI UM PRODUTO ESEPECIFICO",
                        url: 'http://localhost:3002/produtos/',
                        body: {
                            nome: "String",
                            preco: "Number"
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