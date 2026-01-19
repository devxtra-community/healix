import { Router } from 'express';
import user from './user-service-routes/user.route.js';
import admin from './user-service-routes/admin.route.js';
import profileRoute from './user-service-routes/profile.route.js';
import addressRoute from './user-service-routes/address.route.js';
import categoryRoute from './product-service-routes/category.route.js';
import productRoute from './product-service-routes/product.route.js';
import stockRoute from './product-service-routes/stock.route.js';
import priceRoute from './product-service-routes/pricing.route.js';
import cartRoute from './checkout-service-routes/cart.route.js';

const route = Router();

//USER SERVICE
route.use('/auth/user', user);
route.use('/auth/admin', admin);
route.use('/profile', profileRoute);
route.use('/address', addressRoute);

//PRODUCT SERVICE
route.use('/product', productRoute);
route.use('/category', categoryRoute);
route.use('/product/stocks', stockRoute);
route.use('/product/price', priceRoute);

//CHECKOUT SERVICE
route.use('/cart', cartRoute);
export default route;
