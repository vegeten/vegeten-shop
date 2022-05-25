import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';
const Product = model('products', ProductSchema);
export class ProductModel {
  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }
  async findAll() {
    const products = await Product.find({});
    return products;
  }
  async findById(productId) {
    const product = await Product.findOne({ _id: productId });
    return product;
  }
}
const productModel = new ProductModel();
export { productModel };
