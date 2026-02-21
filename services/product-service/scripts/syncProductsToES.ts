import mongoose from 'mongoose';
import { esClient } from '../src/config/elasticsearch.ts';
import { ProductModel } from '../src/models/product.models.ts';
import { ProductVersionModel } from '../src/models/product-version.models.ts';
import { env } from '../src/config/env.ts';

const MONGO_URI = env.mongoUri;



async function sync() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");

  const products = await ProductModel.find({ is_delete: false });

  console.log(`🔄 Found ${products.length} products`);

  for (const p of products) {
    if (!p.current_version_id) continue;

    const version = await ProductVersionModel.findById(p.current_version_id);

    if (!version) continue;

    await esClient.index({
      index: "products",
      id: p._id.toString(),
      document: {
        name: version.name,
        brand: version.brand,
        price: version.price,
        tags: version.tags,
        image: version.images?.[0],
        productId: p._id.toString(),
      },
    });

    console.log("Indexed:", version.name);
  }

  console.log("✅ Elasticsearch sync complete");
  process.exit(0);
}

sync().catch(console.error);












