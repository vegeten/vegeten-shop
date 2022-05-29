import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';
const Product = model('products', ProductSchema);
export class ProductModel {
  async findAll(page, perPage) {
    // total, posts 를 Promise.all 을 사용해 동시에 호출하기
    const [total, products] = await Promise.all([
      Product.countDocuments({}),
      Product.find({})
        .sort({ createdAt: -1 }) //최신순
        .skip(perPage * (page - 1)) // 생략할
        .limit(perPage),
    ]);
    const totalPage = Math.ceil(total / perPage);

    return { products, total, totalPage };
  }
  async findByCategory(category, page, perPage) {
    // const product = await Product.find({ category: category });
    // return product;

    // total, posts 를 Promise.all 을 사용해 동시에 호출하기
    const [total, products] = await Promise.all([
      Product.countDocuments({ category: category }),
      Product.find({ category: category })
        .sort({ createdAt: -1 }) //최신순
        .skip(perPage * (page - 1)) // 생략할
        .limit(perPage),
    ]);
    const totalPage = Math.ceil(total / perPage);

    return { products, total, totalPage };
  }
  async findById(productId) {
    const product = await Product.findOne({ _id: productId });
    return product;
  }
  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }
  async update({ productId, update }) {
    const option = { returnOriginal: false };
    const updatedProduct = await Product.findByIdAndUpdate(productId, update, option);
    return updatedProduct;
  }
  async delete(productId) {
    return await Product.findOneAndDelete({ _id: productId });
  }
}
const productModel = new ProductModel();
export { productModel };
