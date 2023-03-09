const Product = require('../models/product');

const products = async () => {
  const product = await Product.findAll();

  const seedProduct = {
    name: 'Chair',
    description: 'Good',
    stock: 1,
    price: 10,
    condition: 'New',
    seller_id: 1,
    is_deleted: false,
  };
  if (product.length === 0) {
    await Product.create(seedProduct);
  }
};

module.exports = products;
