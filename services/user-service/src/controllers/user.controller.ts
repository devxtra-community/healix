import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  /**
   * GET /admin/users
   * Admin - Get all users with pagination, search & filter
   */
  async getAllUsersForAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Number(req.query.limit) || 10);
      const search = req.query.search as string;
      const status = req.query.status as string;

      const result = await userService.getAllUsersForAdmin({
        page,
        limit,
        search,
        status,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /admin/users/:id
   * Admin - Get single user
   */
  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /admin/users/:id/toggle
   * Admin - Activate / Deactivate user
   */
  async toggleUserStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const updatedUser = await userService.toggleUserStatus(id);

      res.status(200).json({
        message: 'User status updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /admin/users/:id
   * Admin - Update user details
   */
  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const payload = req.body;

      const updatedUser = await userService.updateUser(id, payload);

      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserInsights(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const insights = await userService.getUserInsights();

      res.status(200).json(insights);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /admin/users/:id
   * Admin - Soft delete (recommended)
   */
  //   async deleteUser(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction,
  //   ): Promise<void> {
  //     try {
  //       const { id } = req.params;

  //       const deletedUser = await userService.deleteUser(id);

  //       if (!deletedUser) {
  //         res.status(404).json({ message: 'User not found' });
  //         return;
  //       }

  //       res.status(200).json({
  //         message: 'User deleted successfully',
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}

export const userController = new UserController();
