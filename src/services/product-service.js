import { productModel } from "../db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class ProductService {
  // 본 파일의 맨 아래에서, new ProductService(productModel) 하면, 이 함수의 인자로 전달됨
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품등록
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
}

const productService = new ProductService(productModel);

export { productService };
