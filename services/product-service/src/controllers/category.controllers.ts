import { Request, Response } from 'express';
import { CategoryService } from '../services/category.services.js';
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
      const category = await this.categoryService.getAllCategories(req.query);
      if (category.length === 0) {
        res.status(200).json([]);
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
  //user
  getActiveCategoriesHandler = async (req: Request, res: Response) => {
  const categories =
    await this.categoryService.getActiveCategories();

  res.status(200).json(categories);
};

  updateHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;
      const category = await this.categoryService.update(id, data);
      if (!category) {
        res.status(404).json({ message: 'Category Not Found!' });
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
      }
      res.status(200).json({
        message: 'Category deleted successfully',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
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
