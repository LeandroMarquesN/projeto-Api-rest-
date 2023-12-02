const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// ------- CRIANDO A ROTA DE LOGIN USANDO O POST -----
router.post('/login', (req, res, next) => {
    mysql.getConnection((error1, conn) => {

        if (error1) { return res.status(500).send({ error: error1, menss: "erro1" }) };

        const query = 'select * from usuarios where email =?';

        conn.query(query, [req.body.email], (error2, results, fields) => {
            conn.release();
            if (error2) { return res.status(500).send({ error: error2, menss: "erro2" }) };

            if (results.length < 1) {
                return res.status(401).send({ menssagem: "Falha na autenticação! error results.length < 0" });
            }

            // validando senhas string com a senha hash que é criptografada
            bcrypt.compare(req.body.senha, results[0].senha, (error3, results) => {
                if (error3) {
                    return res.status(401).send({ menss: 'falha na autenticação!', menss: error3 });
                }
                if (results) {
                    const token = jwt.sign({
                        id_usuario: results.id_usuario,
                        email: results.email
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"

                        });
                    return res.status(200).send({ menss: 'Autenticado com Sucesso!!', request: { email: req.body.email, menss: "token de acesso", token: token } });

                }
                return res.status(401).send({ menss: 'Falha na autenticação ' });
            });
        });
    });
})


module.exports = router;