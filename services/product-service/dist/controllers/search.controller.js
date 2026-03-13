import { esClient } from '../config/elasticsearch.js';
export async function searchProducts(req, res) {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);
    const result = await esClient.search({
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
