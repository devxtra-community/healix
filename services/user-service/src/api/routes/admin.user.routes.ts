import { Router } from 'express';
import { UserController } from '../../controllers/user.controller.js';
const router = Router();

const userController = new UserController();

router.get('/users', userController.getAllUsersForAdmin);
router.get('/users/:id', userController.getUserById);
router.patch('/users/:id/toggle', userController.toggleUserStatus);
router.put('/users/:id', userController.updateUser);
// router.delete('/users/:id', userController.deleteUser);

export default router;
