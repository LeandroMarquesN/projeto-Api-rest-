const http = require('http');
const app = require('./app');
const port = process.env.PORTT || 3003;

const server = http.createServer(app);
server.listen(port, () => console.log(`Servidor Rodando na porta ${port}`));