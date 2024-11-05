import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';
import AddressController from './app/controllers/AddressController';
import FavoriteController from './app/controllers/FavoriteController';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// Rota para listar usuários ativos
routes.get('/sessions/active-users', SessionController.index); 

routes.use(authMiddleware);

// Rotas para produtos
routes.post('/products', uploads.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.show);
routes.put('/products/:id', uploads.single('file'), ProductController.update);
routes.delete('/products/:id', ProductController.delete);

// Rotas para categorias
routes.post('/categories', uploads.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', uploads.single('file'), CategoryController.update);

// Rotas para pedidos
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

// Rotas para endereço
routes.post('/address', AddressController.store);
routes.get('/address', AddressController.show);
routes.put('/address/:id', AddressController.update);

// Rotas para favoritos
routes.post('/favorites', FavoriteController.store); 
routes.get('/favorites', FavoriteController.index); 
routes.delete('/favorites/:product_id', FavoriteController.delete);

export default routes;
