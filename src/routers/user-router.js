import { Router } from 'express';
import { loginRequired, adminAuth } from '../middlewares';
import { userController } from '../controllers/user-controller';

const userRouter = Router();

userRouter.get('/refresh', userController.refreshUser);
userRouter.post('/register/send-mail', userController.authenticateEmail);
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/reset-password', userController.resetPassword);
userRouter.post('/password', loginRequired, userController.checkPassword);
userRouter.get('/list', adminAuth, userController.getUsers);
userRouter.get('/', loginRequired, userController.getUser);
userRouter.patch('/', loginRequired, userController.updateUser);
userRouter.patch('/address', loginRequired, userController.updateUserAddress);
userRouter.delete('/', loginRequired, userController.deleteUser);

export { userRouter };
