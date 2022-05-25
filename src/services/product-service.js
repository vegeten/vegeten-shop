import { productModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class ProductService {
  // 본 파일의 맨 아래에서, new ProductService(productModel) 하면, 이 함수의 인자로 전달됨
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품 목록을 받음.
  async getProducts() {
    const products = await this.productModel.findAll();

    // // db에 등록된 상품이 하나도 없을 때, 에러 메시지 반환
    // if (products.length === 0) {
    //   throw new Error('등록된 상품 내역이 없습니다. 새 상품을 등록해주세요.');
    // }

    return products;
  }

  // 특정 상품의 상세정보를 받음
  async getProduct(productId) {
    const product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      const e = new Error('해당 상품의 id가 없습니다. 다시 한 번 확인해 주세요.');
      e.status = 404;
      throw e;
    }

    return product;
  }

  // 상품 등록
  async addProduct(productInfo) {
    // 객체 destructuring
    const { productName, price, description, company, category } = productInfo;

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

  // 상품 정보 수정
  async setProduct(productId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      const e = new Error('해당 상품의 id가 없습니다. 다시 한 번 확인해 주세요.');
      e.status = 404;
      throw e;
    }

    // 상품 업데이트 진행
    product = await this.productModel.update({
      productId,
      update: toUpdate,
    });

    return product;
  }

  // 특정 상품 삭제
  async deleteProduct(productId) {
    let product = await productModel.delete(productId);
    if (!product) {
      const e = new Error('해당 상품의 id가 없습니다. 다시 한 번 확인해 주세요.');
      e.status = 404;
      throw e;
    }

    return product;
  }
}

const productService = new ProductService(productModel);

export { productService };
