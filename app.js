const express = require('express');
const app = express();

app.use((req, resp, next) => {
    resp.status(200).send({
        menssagem: "Sevidor rodando perfeitamente!!"
    });
});

module.exports = app;