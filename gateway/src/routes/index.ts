import { Router } from 'express';
import user from './user.route.ts';
import profileRoute from './profile.route.ts';

const route = Router();
route.use('/auth', user);
route.use('/profile', profileRoute);

export default route;
