import React from 'react';
import { productService } from '@/src/services/product.service';
import {
  ProductApiResponse,
  ProductVersion,
} from '@/src/types/api/product.api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductPurchaseSection from '@/src/components/store/ProductPurchaseSection';
import RelatedProducts from '@/src/components/store/RelatedProducts';
import ProductReviews from '@/src/components/store/ProductReviews';

const S3_BASE = 'https://healix-product-images.s3.ap-south-1.amazonaws.com/';

function resolveImage(src?: string | null) {
  if (!src) return '/placeholder.png';
  if (src.startsWith('http')) return src;
  return `${S3_BASE}${src}`;
}

function getCurrentVersion(item: ProductApiResponse): ProductVersion | null {
  if (item.current_version) return item.current_version;

  if (item.current_version_id && typeof item.current_version_id === 'object') {
    return item.current_version_id as ProductVersion;
  }

  return null;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = (await productService.getProduct(id)) as ProductApiResponse;

  const version = getCurrentVersion(item);

  if (!version) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not available</p>
      </div>
    );
  }

  const stock = item.stock?.available ?? 0;

  return (
    <div className=" bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Back */}
        <Link
          href="/store"
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT: Images */}
          <div>
            <div className="aspect-square bg-white rounded-xl border overflow-hidden">
              <img
                src={resolveImage(version.images?.[0])}
                alt={version.name}
                className="w-full h-full object-contain"
              />
            </div>

            {version.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {version.images.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden border bg-white"
                  >
                    <img
                      src={resolveImage(img)}
                      alt={`Image ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="bg-white p-8 rounded-xl border">
            {version.brand && (
              <p className="text-sm text-gray-500 mb-2">{version.brand}</p>
            )}

            <h1 className="text-2xl font-semibold mb-4">{version.name}</h1>

            <div className="text-3xl font-bold text-green-600 mb-6">
              ₹ {version.price.toLocaleString()}
            </div>

            {/* Attributes */}
            {(version.attributes?.flavor ||
              version.attributes?.pack_size ||
              version.attributes?.form) && (
              <div className="mb-6 space-y-2 text-sm text-gray-600">
                {version.attributes.flavor && (
                  <p>
                    <span className="font-medium">Flavor:</span>{' '}
                    {version.attributes.flavor}
                  </p>
                )}
                {version.attributes.pack_size && (
                  <p>
                    <span className="font-medium">Pack Size:</span>{' '}
                    {version.attributes.pack_size}
                  </p>
                )}
                {version.attributes.form && (
                  <p>
                    <span className="font-medium">Form:</span>{' '}
                    {version.attributes.form}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            {version.description && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {version.description}
                </p>
              </div>
            )}

            {/* Qty + Add To Cart */}
            <ProductPurchaseSection
              productId={item._id}
              variantId={version._id}
              stock={stock}
              price={version.price}
            />
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews
          productId={item._id}
          productName={version.name || 'Product'}
        />

        {/* Related Products Section */}
        <RelatedProducts
          categoryId={item.category_id as string}
          currentProductId={item._id}
        />
      </div>
    </div>
  );
}
