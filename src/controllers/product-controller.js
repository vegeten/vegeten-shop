import { productService } from '../services';

// 상품 전체 조회
export async function getProducts(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);

    let products = await productService.getProducts();

    let arr = [];
    // 카테고리가 활성화 된 상품만 보여줌
    for (let i = 0; i < products.length; i++) {
      if (products[i].categoryId.active === 'active') {
        arr.push(products[i]);
      }
    }
    const productsPerPage = arr.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
    const total = arr.length;
    const totalPage = Math.ceil(total / perPage);
    products = productsPerPage;
    res.status(200).json({
      status: 200,
      message: '전체 상품 목록 조회 성공',
      data: {
        totalPage: totalPage,
        productCount: total,
        products,
      },
    });
  } catch (error) {
    next(error);
  }
}

// 어드민 상품 전체 조회
export async function getProductsAdmin(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);

    let products = await productService.getProducts();

    const productsPerPage = products.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
    const total = products.length;
    const totalPage = Math.ceil(total / perPage);
    products = productsPerPage;

    res.status(200).json({
      status: 200,
      message: '전체 상품 목록 조회 성공',
      data: {
        totalPage: totalPage,
        productCount: total,
        products,
      },
    });
  } catch (error) {
    next(error);
  }
}

// 상품 id로 조회
export async function getProduct(req, res, next) {
  try {
    const product = await productService.getProduct(req.params.productId);
    res.status(200).json({
      status: 200,
      message: '상품 정보 조회 성공',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

// 상품 등록
export async function createProduct(req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    const newProduct = await productService.addProduct(req.body);

    res.status(201).json({
      status: 201,
      message: '상품 등록 성공',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
}

// 상품 수정
export async function updateProduct(req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    const { productId } = req.params;
    const { productName, price, description, company, categoryId, image, detailImage, quantity } = req.body;

    const toUpdate = {
      ...(productName && { productName }),
      ...(price && { price }),
      ...(description && { description }),
      ...(company && { company }),
      ...(categoryId && { categoryId }),
      ...(image && { image }),
      ...(detailImage && { detailImage }),
      ...(quantity && { quantity }),
    };

    const updatedProductInfo = await productService.setProduct(productId, toUpdate);

    res.status(200).json({
      status: 200,
      message: '상품 정보 수정 성공',
      data: updatedProductInfo,
    });
  } catch (error) {
    next(error);
  }
}

// 상품 삭제
export async function deleteProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const deleteProduct = await productService.deleteProduct(productId);

    res.status(200).json({
      status: 200,
      message: '상품 삭제 성공',
      data: {
        deleteProduct,
      },
    });
  } catch (error) {
    next(error);
  }
}
