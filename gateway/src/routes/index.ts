import { Router } from 'express';
import user from './user.route.js';
import profileRoute from './profile.route.js';

const route = Router();
route.use('/auth', user);
route.use('/profile', profileRoute);

export default route;
