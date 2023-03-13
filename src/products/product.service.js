const connectDB = require('../core/database.js');
const db = require('../models/index');
const { BadRequest } = require('http-errors');
const fs = require('fs/promises');
const { buildPagination } = require('../core/utils/paginantion.utils')

async function createProduct(body) {
    const newProduct = await db.Product.create(body);
    return newProduct;
}

async function updateProduct(id, body) {
    const product = await db.Product.findOne({
        where: { id: id }
    })
    // console.log(product)
    if (!product) {
        throw new BadRequest('Product not found');
    }
    if (body.img1) {
        fs.unlink(__dirname, '../../public/product/image', product.img1).catch(error => console.log(error));
        fs.unlink(__dirname, '../../public/product/image', product.img2).catch(error => console.log(error));
    }
    const newProduct = await product.update({ ...body })
    return newProduct;
}

async function getProduct(id) {
    const product = await db.Product.findOne({
        where: { id: id }
    })
    if (!product) throw new BadRequest('Product not found');
    return product;
}

async function deleteProduct(id) {
    const product = await db.Product.findOne({
        where: { id: id }
    })
    if (!product) throw new BadRequest('Product not found');

    await product.destroy();
}

async function getProducts(req) {
    const query = buildPagination(req);
    const { rows, count } = await db.Product.findAndCountAll({
        ...query
    });
    return { totalPage: Math.ceil(count / req.limit), products: rows };
}

module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    getProducts
}