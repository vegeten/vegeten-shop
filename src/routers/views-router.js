import express from 'express';
import path from 'path';

const viewsRouter = express.Router();

viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/register', serveStatic('register'));
viewsRouter.use('/login', serveStatic('login'));
viewsRouter.use('/mypage', serveStatic('mypage'));
viewsRouter.use('/about', serveStatic('about'));
viewsRouter.use('/admin', serveStatic('admin'));
viewsRouter.use('/shop', serveStatic('shop'));
viewsRouter.use('/shop/:productId', serveStatic('detail'));
viewsRouter.use('/order', serveStatic('order'));
viewsRouter.use('/order/:productId', serveStatic('order'));
viewsRouter.use('/cart', serveStatic('cart'));
// views 폴더의 최상단 파일인 rabbit.png, api.js 등을ㅇ 쓸 수 있게 함
viewsRouter.use('/', serveStatic(''));

// views폴더 내의 ${resource} 폴더 내의 모든 파일을 웹에 띄우며,
// 이 때 ${resource}.html 을 기본 파일로 설정함.
function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  // express.static 은 express 가 기본으로 제공하는 함수임
  return express.static(resourcePath, option);
}

export { viewsRouter };
