import { Router } from 'express';
import { CategoryControll } from '../../controllers/category.controllers.js';
import { CategoryRepository } from '../../repositories/category.repositories.js';
import { CategoryModel } from '../../models/category.model.js';
import { CategoryService } from '../../services/category.services.js';

const route = Router();
const repo = new CategoryRepository(CategoryModel);
const service = new CategoryService(repo);
const controller = new CategoryControll(service);
route.post('/', controller.createCatrgoryHandler);
route.get('/', controller.getAllCategoryHandler);
route.get('/:id', controller.getCategoryByIdHandler);
route.patch('/:id', controller.updateHandler);
route.delete('/:id', controller.deleteHandler);
route.patch('/:id/restore', controller.restoreHandler);
export default route;
