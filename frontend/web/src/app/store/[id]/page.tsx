import React from "react";
import { productService } from "@/src/services/product.service";
import { ProductApiResponse } from "@/src/types/api/product.api";
import {
  ArrowLeft, Search, Upload, Plus, Star, MapPin,
  Home, Package, ShoppingCart, Users, Calendar, MessageSquare, Settings, HelpCircle,
  Truck, Globe, Clock
} from "lucide-react";

// ===== TYPES & MAPPERS =====
type ProductVersionLike = {
  _id?: string;
  name?: string;
  price?: number;
  images?: string[];
};

const S3_BASE = 'https://healix-product-images.s3.ap-south-1.amazonaws.com/';

function resolveImage(src?: string | null) {
  if (!src) return '/placeholder.png';
  if (src.startsWith('http')) return src;
  return `${S3_BASE}${src}`;
}

function pickCurrentVersion(item: ProductApiResponse): ProductVersionLike {
  if (item.current_version && typeof item.current_version === "object") {
    return item.current_version;
  }

  if (
    item.current_version_id &&
    typeof item.current_version_id === "object" &&
    !Array.isArray(item.current_version_id)
  ) {
    return item.current_version_id;
  }

  return {};
}

// ===== PAGE COMPONENT =====
export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("Fetching product ID:", id);

  // ✅ Your API Call
  const item = (await productService.getProduct(id)) as ProductApiResponse;

  // ✅ Your Mapping Logic
  const version = pickCurrentVersion(item);

  const product = {
    id: item._id,
    name: version.name ?? "Product",
    variantId:
      (typeof item.current_version_id === "string" &&
        item.current_version_id) ||
      version._id ||
      "",
    price: version.price ?? 0,
    image: version.images?.[0] ?? null,
    images: version.images ?? [],
    stock: item.stock?.available ?? 0,
  };

  // Static fallback data for UI elements not in your current API response
  const uiPlaceholders = {
    rating: 4.5,
    reviewsCount: 623,
    soldCount: 1919,
    colors: ["Black", "Olive", "Navy", "Gray", "White"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: [
      "Long-sleeve sweatshirt in classic fit featuring ribbed cuffs",
      "Comfortable and quality heavy-weight fabric",
      "Go To Classic pullover for all special occasions"
    ]
  };

  // ===== RENDER =====
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* SIDEBAR */}
    

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Product</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 font-medium">
              <Upload className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium">
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>
        </header>

        {/* CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-auto p-8">
          
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6">
            <ArrowLeft className="w-4 h-4" /> Product Details
          </button>

          {/* TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Images & Store Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="aspect-[6/6] w-full rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img 
                    src={resolveImage(product.image)} 
                    alt={product.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {product.images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-transparent hover:border-green-600 cursor-pointer">
                        <img src={resolveImage(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Store Info Card */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">S</div>
                    <span className="font-semibold">Stylish</span>
                    <span className="text-blue-500 text-xs">✔</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" /> New york, USA
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" /> {uiPlaceholders.rating} <span className="text-gray-400">({(uiPlaceholders.reviewsCount / 1000).toFixed(1)}k reviews)</span>
                  </div>
                  <button className="mt-2 px-4 py-1.5 border border-indigo-200 text-green-600 text-xs font-medium rounded hover:bg-indigo-50">
                    View More
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Info */}
            <div className="lg:col-span-7 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2 block">New Arrival</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h2>
              
              <div className="flex items-center gap-4 text-sm mb-6">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(uiPlaceholders.rating) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="font-semibold">{uiPlaceholders.rating}</span>
                <span className="text-gray-400">{uiPlaceholders.reviewsCount} reviews</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium">{uiPlaceholders.soldCount} Sold</span>
              </div>

              <div className="text-3xl font-bold text-green-600 mb-8">
                ₹ {product.price.toLocaleString()}
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Available Colors</h3>
                <div className="flex gap-2">
                  {uiPlaceholders.colors.map((color, idx) => (
                    <button key={idx} className="px-4 py-2 border rounded-md text-sm hover:border-green-600 hover:text-green-600 transition-colors">
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes & Stock */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm font-semibold">Available Size</h3>
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">Only {product.stock} Stocks Left</span>
                  )}
                  {product.stock === 0 && (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded font-medium">Out of Stock</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {uiPlaceholders.sizes.map((size, idx) => (
                    <button key={idx} className={`w-10 h-10 flex items-center justify-center border rounded-md text-sm font-medium hover:border-green-600 hover:text-green-600 transition-colors ${idx === 0 ? 'border-gray-300' : ''}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-3">Description:</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                  {uiPlaceholders.description.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
                </ul>
              </div>

              {/* Shipping Information */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-4">Shipping Information</h3>
                <div className="flex flex-wrap gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Delivery</p>
                      <p className="text-sm font-medium">Jakarta, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-l pl-6">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Shipping</p>
                      <p className="text-sm font-medium">International Shipping</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-l pl-6">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Arrive</p>
                      <p className="text-sm font-medium">Estimated on 27 Oct 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Added to replace the Add to Cart you had previously) */}
               <div className="flex gap-4 mt-8">
                <button 
                  disabled={product.stock === 0}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}