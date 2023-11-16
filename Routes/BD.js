const sequenc = {
    _id: 1,
    get id() { return this._id++ }
}
const Produtos = {}

function cadastrarProduto(produto) {
    if (!produto.id) produto.id = sequenc.id
    Produtos[produto.id] = produto
    return produto
}
module.exports = { cadastrarProduto }