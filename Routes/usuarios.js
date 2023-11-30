const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');


// ------- CRIANDO A ROTA DE CADASTRO USANDO O POST -----
router.post('/cadastro', (req, resp, next) => {
    mysql.getConnection((err, conn) => {
        if (err) { return resp.status(500).send({ error: err }) };
        conn.query(
            `select * from usuarios where email = ?`,
            req.body.email,
            (error, results) => {
                if (error) { return resp.status(500).send({ error: error }) };
                if (results.length > 0) {
                    resp.status(401).send({
                        menssagem: "Usuario ja Cadastrado!!"
                    })
                } else {
                    bcrypt.hash(req.body.senha, 10, (errorBcrypt, hash) => {
                        if (errorBcrypt) {
                            return resp.status(500).send({
                                error: errorBcrypt
                            })
                        };
                        conn.query(
                            `insert into usuarios (email,senha) values(?,?)`,
                            [req.body.email, hash],
                            (error, results) => {
                                conn.release();
                                if (error) { return resp.status(500).send({ error: error }) };

                                const response = {
                                    menssagem: "usuario Criado com sucesso!",
                                    usuarioCriado: {
                                        id_ususario: results.insertId,
                                        email: req.body.email
                                    }
                                }
                                return resp.status(201).send(response);
                            }
                        )

                    });
                }
            }
        )

    });
});





module.exports = router;