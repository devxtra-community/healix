export class CategoryControll {
  categoryService;
  constructor(categoryService) {
    this.categoryService = categoryService;
  }
  createCatrgoryHandler = async (req, res) => {
    try {
      const categoryData = req.body;
      const newCategory =
        await this.categoryService.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Sommething went wrong!' });
      }
    }
  };
  getCategoryByIdHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.categoryById(id);
      if (!category) {
        res.status(404).json({ message: 'Category Not Found!' });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Sommething went wrong!' });
      }
    }
  };
  getAllCategoryHandler = async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search;
      const is_active = req.query.is_active;
      const category_type = req.query.category_type;
      const result = await this.categoryService.getAllCategories({
        page,
        limit,
        search,
        is_active,
        category_type,
      });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Something went wrong!' });
      }
    }
  };
  getAllCategoryAdminHandler = async (req, res) => {
    try {
      const result = await this.categoryService.getAllCategories(
        req.query,
        true,
      );
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  updateHandler = async (req, res) => {
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
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Sommething went wrong!' });
      }
    }
  };
  deleteHandler = async (req, res) => {
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
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Sommething went wrong!' });
      }
    }
  };
  restoreHandler = async (req, res) => {
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
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Sommething went wrong!' });
      }
    }
  };
}
