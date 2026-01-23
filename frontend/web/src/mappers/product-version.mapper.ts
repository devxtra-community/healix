import { ProductVersion } from '../components/admin/products/ProductForm';
import { CreateProductVersionDTO } from '../dtos/product.dtos';

export function mapProductVersionToUpdateDTO(
  version: ProductVersion,
): CreateProductVersionDTO {
  return {
    name: version.name,
    description: version.description,
    brand: version.brand,
    tags: version.tags,
    price: version.price,
    images: version.images,
    status: version.status,
    attributes: version.attributes,
  };
}
