import { productModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class ProductService {
  // 본 파일의 맨 아래에서, new ProductService(productModel) 하면, 이 함수의 인자로 전달됨
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품 등록
  async addProduct(ProductInfo) {
    // 객체 destructuring
    const { productName, price, description, company, category } = ProductInfo;

    const newProductInfo = {
      productName,
      price,
      description,
      company,
      category,
    };
    // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);

    return createdNewProduct;
  }

  // 상품 목록을 받음.
  async getProducts() {
    const products = await this.productModel.findAll();
    return products;
  }

  // 특정 상품의 상세정보를 받음
  async getProduct(productId) {
    const product = await this.productModel.findById(productId);
    return product;
  }
}

const productService = new ProductService(productModel);

export { productService };
