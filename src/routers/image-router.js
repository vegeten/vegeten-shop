import { Router } from 'express';
import { productService } from '../services';
import { upload } from '../middlewares/upload';

const imageRouter = Router();

imageRouter.get('/', upload.single('file'), async (req, res, next) => {
  try {
    console.log(123);
  } catch (error) {
    next(error);
  }
});

export { imageRouter };
