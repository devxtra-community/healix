import { Request, Response } from 'express';
import { esClient } from '../config/elasticsearch.js';

type ProductDoc = Record<string, unknown>;

export async function searchProducts(req: Request, res: Response) {
  try {
    const q = req.query.q as string;
    if (!q) return res.json([]);

    const result = await esClient.search<ProductDoc>({
      index: 'products',
      query: {
        multi_match: {
          query: q,
          fields: ['name', 'brand', 'tags'],
          fuzziness: 'AUTO',
        },
      },
    });

    const products = result.hits.hits.map((hit) => ({
      id: hit._id,
      ...(hit._source ?? {}),
    }));

    res.json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Search failed' });
  }
}
