import { productModel } from '../db';
import { customError } from '../middlewares/error/customError';

class ProductService {
  // 본 파일의 맨 아래에서, new ProductService(productModel) 하면, 이 함수의 인자로 전달됨
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품 목록을 받음.
  async getProducts() {
    return await this.productModel.findAll();
  }

  // 카테고리별 상품 목록을 받음
  async getCategoryProducts(categoryId, page, perPage) {
    return await this.productModel.findByCategory(categoryId, page, perPage);
  }

  // 상품 등록
  async addProduct(productInfo) {
    // db에 저장
    return await this.productModel.create(productInfo);
  }

  // 특정 상품의 상세정보를 받음
  async getProduct(productId) {
    const product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new customError(404, '해당 상품의 id가 없습니다. 다시 한 번 확인해 주세요.');
    }

    return product;
  }

  // 상품 수정
  async setProduct(productId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new customError(404, '해당 상품의 id가 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 상품 업데이트 진행
    return this.productModel.update({
      productId,
      update: toUpdate,
    });
  }

  // 상품 삭제
  async deleteProduct(productId) {
    let product = await productModel.delete(productId);
    if (!product) {
      throw new customError(404, '해당 상품의 id가 없습니다. 다시 한 번 확인해 주세요.');
    }

    return product;
  }

  // 상품 검색
  async searchByProductName(keyword, page, perPage) {
    return await this.productModel.findByKeyword(keyword, page, perPage);
  }
}

const productService = new ProductService(productModel);

export { productService };
