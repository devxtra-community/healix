import { Router } from 'express';
import { CategoryControll } from '../../controllers/category.controllers';
import { CategoryRepository } from '../../repositories/category.repositories';
import { CategoryModel } from '../../models/category.model';
import { CategoryService } from '../../services/category.services';

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
