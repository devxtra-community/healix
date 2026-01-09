import { Router } from 'express';
import user from './user.route.js';
import admin from './admin.route.js';
import profileRoute from './profile.route.js';
import addressRoute from './address.route.js';
import categoryRoute from './category.route.js';

const route = Router();

//USER SERVICE
route.use('/auth/user', user);
route.use('/auth/admin', admin);
route.use('/profile', profileRoute);
route.use('/address', addressRoute);

//PRODUCT SERVICE
route.use('/category', categoryRoute);

export default route;
