import { Request, Response } from 'express';
import { CategoryService } from '../services/category.services.js';

type CategoryType =
  | 'nutrition'
  | 'supplement'
  | 'vitamin'
  | 'superfood'
  | 'herb';

export class CategoryControll {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  createCatrgoryHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const categoryData = req.body;

      const newCategory =
        await this.categoryService.createCategory(categoryData);

      res.status(201).json(newCategory);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Sommething went wrong!' });
      }
    }
  };

  getCategoryByIdHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const category = await this.categoryService.categoryById(id);

      if (!category) {
        res.status(404).json({ message: 'Category Not Found!' });
        return;
      }

      res.status(200).json(category);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Sommething went wrong!' });
      }
    }
  };

  getAllCategoryHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const search = req.query.search as string | undefined;
      const is_active = req.query.is_active as string | undefined;

      const category_type = req.query.category_type as CategoryType | undefined;

      const result = await this.categoryService.getAllCategories({
        page,
        limit,
        search,
        is_active,
        category_type,
      });

      res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Something went wrong!' });
      }
    }
  };
  getAllCategoryAdminHandler = async (req: Request, res: Response) => {
    try {
      const result = await this.categoryService.getAllCategories(
        req.query,
        true, // admin
      );

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  updateHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;

      const category = await this.categoryService.update(id, data);

      if (!category) {
        res.status(404).json({ message: 'Category Not Found!' });
        return;
      }

      res.status(200).json({
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Sommething went wrong!' });
      }
    }
  };

  deleteHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const category = await this.categoryService.disabled(id);

      if (!category) {
        res.status(404).json({ message: 'Category Not Found!' });
        return;
      }

      res.status(200).json({
        message: 'Category disabled successfully',
        data: category,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Sommething went wrong!' });
      }
    }
  };

  restoreHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const category = await this.categoryService.restore(id);

      if (!category) {
        res.status(404).json({ message: 'Category Not Found!' });
        return;
      }

      res.json({
        message: 'Category restored successfully',
        data: category,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Sommething went wrong!' });
      }
    }
  };
}
