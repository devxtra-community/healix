import { ProductDetails } from '../components/admin/products/ProductForm';
import { CreateProductDetailsDTO } from '../dtos/product.dtos';

export function mapProductDetailsToCreateDTO(
  details: ProductDetails,
): CreateProductDetailsDTO {
  return {
    nutrition_facts: details.nutrition_facts,
    ingredients: details.ingredients,
    benefits: details.benefits,
    suitable_for: details.suitable_for,
  };
}
