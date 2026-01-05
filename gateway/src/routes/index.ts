import { Router } from 'express';
import user from './user.route.js';
import profileRoute from './profile.route.js';
import addressRoute from './address.route.js';

const route = Router();
route.use('/auth', user);
route.use('/profile', profileRoute);
route.use('/address', addressRoute);

export default route;
