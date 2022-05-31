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
  async findByCategory(categoryId, page, perPage) {
    // const product = await Product.find({ category: category });
    // return product;

    // total, posts 를 Promise.all 을 사용해 동시에 호출하기
    const [total, products] = await Promise.all([
      Product.countDocuments({ categoryId: categoryId }),
      Product.find({ categoryId: categoryId })
        .sort({ createdAt: -1 }) //최신순
        .skip(perPage * (page - 1)) // 생략할
        .limit(perPage),
    ]);
    const totalPage = Math.ceil(total / perPage);

    return { products, total, totalPage };
  }
  async findById(productId) {
    return await Product.findOne({ shortId: productId });
  }
  async create(productInfo) {
    return await Product.create(productInfo);
  }
  async update({ productId, update }) {
    const option = { returnOriginal: false };
    return await Product.findOneAndUpdate({ shortId: productId }, update, option);
  }
  async delete(productId) {
    return await Product.findOneAndDelete({ shortId: productId });
  }
}
const productModel = new ProductModel();
export { productModel };
