import { Router } from 'express';
import { CategoryControll } from '../../controllers/category.controllers.js';
import { CategoryRepository } from '../../repositories/category.repositories.js';
import { CategoryModel } from '../../models/category.models.js';
import { CategoryService } from '../../services/category.services.js';
import { adminOnly } from '../middlewares/auth.middleware.js';

const route = Router();
const repo = new CategoryRepository(CategoryModel);
const service = new CategoryService(repo);
const controller = new CategoryControll(service);
route.post('/', adminOnly, controller.createCatrgoryHandler);
route.get('/', controller.getAllCategoryHandler);
route.get('/:id', controller.getCategoryByIdHandler);
route.patch('/:id', adminOnly, controller.updateHandler);
route.delete('/:id', adminOnly, controller.deleteHandler);
route.patch('/:id/restore', adminOnly, controller.restoreHandler);
export default route;
