/* eslint-disable no-console */

import { Client } from '@elastic/elasticsearch';
import { env } from '~/config/environment';
import { GET_DB } from '~/config/mongodb';

// Khởi tạo Elasticsearch client
const client = new Client({
  node: env.ELASTICSEARCH_NODE,
  auth: {
    apiKey: env.ELASTICSEARCH_API_KEY || '',
  },
});

// Kiểm tra kết nối
const checkConnection = async () => {
  try {
    const result = await client.ping();
    return result;
  } catch (error) {
    console.error('Elasticsearch connection failed:', error);
    return false;
  }
};

// Khởi tạo index và mapping
const initializeProductIndex = async () => {
  try {
    const indexExists = await client.indices.exists({ index: 'products' });

    if (!indexExists) {
      await client.indices.create({
        index: 'products',
        body: {
          settings: {
            analysis: {
              analyzer: {
                vietnamese_analyzer: {
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding'],
                },
                ngram_analyzer: {
                  tokenizer: 'ngram_tokenizer',
                  filter: ['lowercase', 'asciifolding'],
                },
              },
              tokenizer: {
                ngram_tokenizer: {
                  type: 'ngram',
                  min_gram: 2,
                  max_gram: 3,
                  token_chars: ['letter', 'digit'],
                },
              },
            },
          },
          mappings: {
            properties: {
              name: {
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                fields: {
                  keyword: { type: 'keyword' },
                  ngram: {
                    type: 'text',
                    analyzer: 'ngram_analyzer',
                  },
                  suggest: {
                    type: 'completion',
                    analyzer: 'vietnamese_analyzer',
                  },
                },
              },
              slug: {
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              description: { type: 'text', analyzer: 'vietnamese_analyzer' },
              content: { type: 'text', analyzer: 'vietnamese_analyzer' },
              price: { type: 'float' },
              variants: {
                type: 'nested',
                properties: {
                  warehouseId: { type: 'keyword' },
                  stock: { type: 'integer' },
                  price: { type: 'float' },
                  marketPrice: { type: 'float' },
                  capitalPrice: { type: 'float' },
                  onlinePrice: { type: 'float' },
                  saleOff: { type: 'float' },
                  sellCount: { type: 'integer' },
                  sku: { type: 'keyword' },
                  color: { type: 'keyword' },
                  image: { type: 'keyword' },
                  sizes: {
                    type: 'nested',
                    properties: {
                      size: { type: 'keyword' },
                      price: { type: 'float' },
                      stock: { type: 'integer' },
                      sale: { type: 'integer' },
                      trading: { type: 'integer' },
                      sku: { type: 'keyword' },
                    },
                  },
                },
              },
            },
          },
        },
      });
      console.log('Products index created successfully');
    }
  } catch (error) {
    console.error('Failed to initialize Elasticsearch:', error);
    throw error;
  }
};

// Đồng bộ dữ liệu từ MongoDB
const syncProductsToElasticsearch = async () => {
  try {
    const db = await GET_DB();
    const products = await db.collection('products').find().toArray();

    const operations = products.flatMap((product) => {
      const reviews = product.reviews || [];
      const totalComment = reviews.length;
      const averageRating =
        totalComment > 0
          ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
            totalComment
          : 0;

      return [
        { index: { _index: 'products', _id: product._id.toString() } },
        {
          name: product.name,
          slug: product.slug,
          description: product.description,
          thumbnail: product.thumbnail,
          content: product.content,
          price: product.price,
          tags: product.tags || [], // Giữ lại tags
          productType: product.productType || '', // Giữ lại productType
          averageRating, // Tính toán từ reviews
          totalComment, // Tính toán từ reviews
          statusStock: product.statusStock || '',
          variants: product.variants.map((variant) => ({
            ...variant,
            sizes: variant.sizes.map((size) => ({
              ...size,
            })),
          })),
        },
      ];
    });

    if (operations.length > 0) {
      const result = await client.bulk({ refresh: true, operations });
      console.log(`Synchronized ${result.items.length} products`);
    }
  } catch (error) {
    console.error('Failed to sync products:', error);
    throw error;
  }
};

// Hàm xử lý tiêu chí sắp xếp
const buildSortCriteria = (sort) => {
  const sortQuery = [];

  if (sort) {
    switch (sort) {
      case 'price-asc':
        sortQuery.push({ price: 'asc' });
        break;
      case 'price-desc':
        sortQuery.push({ price: 'desc' });
        break;
      case 'alphabet-az':
        sortQuery.push({ 'name.keyword': 'asc' });
        break;
      case 'alphabet-za':
        sortQuery.push({ 'name.keyword': 'desc' });
        break;
      case 'createdAt-newest':
        sortQuery.push({ createdAt: 'desc' });
        break;
      case 'createdAt-oldest':
        sortQuery.push({ createdAt: 'asc' });
        break;
      case 'bestseller':
        sortQuery.push({
          'variants.sellCount': {
            order: 'desc',
            nested: {
              path: 'variants', // Thêm nested context
            },
          },
        });
        break;
      case 'averageRating-desc':
        sortQuery.push({ averageRating: 'desc' });
        break;
      case 'averageRating-asc':
        sortQuery.push({ averageRating: 'asc' });
        break;
      default:
        sortQuery.push({ _score: 'desc' }); // Mặc định sắp xếp theo độ phù hợp
    }
  } else {
    sortQuery.push({ _score: 'desc' }); // Mặc định sắp xếp theo độ phù hợp
  }

  return sortQuery;
};

// Hàm tìm kiếm sản phẩm
const searchProducts = async (keyword, options = {}) => {
  try {
    const {
      minPrice,
      maxPrice,
      colors,
      sizes,
      tags,
      productType,
      page = 1,
      limit = 20,
      sort,
    } = options;

    const processedKeyword = keyword?.toLowerCase() || '';

    const must = [
      {
        bool: {
          should: [
            {
              multi_match: {
                query: processedKeyword,
                fields: ['name.keyword^4', 'slug.keyword^4'],
                type: 'best_fields',
                boost: 4,
              },
            },
            {
              multi_match: {
                query: processedKeyword,
                fields: ['name^3', 'slug^3'],
                type: 'best_fields',
                operator: 'or',
                boost: 3,
              },
            },
            {
              match: {
                'name.ngram': {
                  query: processedKeyword,
                  boost: 2,
                },
              },
            },
            {
              multi_match: {
                query: processedKeyword,
                fields: ['description^1', 'content^1'],
                type: 'best_fields',
                fuzziness: 'AUTO',
                boost: 1,
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
    ];

    // Bộ lọc giá
    if (minPrice !== undefined || maxPrice !== undefined) {
      must.push({
        range: {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      });
    }

    // Bộ lọc màu sắc và kích thước
    if (colors?.length > 0 || sizes?.length > 0) {
      const variantFilter = {
        nested: {
          path: 'variants',
          query: {
            bool: {
              must: [],
            },
          },
        },
      };

      if (colors?.length > 0) {
        variantFilter.nested.query.bool.must.push({
          terms: { 'variants.color': colors },
        });
      }

      if (sizes?.length > 0) {
        variantFilter.nested.query.bool.must.push({
          nested: {
            path: 'variants.sizes',
            query: {
              bool: {
                must: [
                  {
                    terms: { 'variants.sizes.size': sizes },
                  },
                  {
                    range: {
                      'variants.sizes.stock': { gt: 0 },
                    },
                  },
                ],
              },
            },
          },
        });
      }

      must.push(variantFilter);
    }

    // Bộ lọc tags
    if (tags?.length > 0) {
      must.push({
        terms: {
          'tags.keyword': tags, // Tìm kiếm chính xác với keyword
        },
      });
    }

    // Bộ lọc productType
    if (productType) {
      must.push({
        term: {
          'productType.keyword': productType, // Tìm kiếm chính xác với keyword
        },
      });
    }

    const query = {
      bool: {
        must,
      },
    };

    const { hits } = await client.search({
      index: 'products',
      body: {
        query,
        sort: buildSortCriteria(sort),
        from: (page - 1) * limit,
        size: limit,
      },
    });

    return {
      products: hits.hits.map((hit) => ({
        ...hit._source,
        _id: hit._id,
        score: hit._score,
      })),
      total: hits.total.value,
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Hàm tìm kiếm đề xuất
const getSuggestions = async (keyword, limit = 5) => {
  try {
    const processedKeyword = keyword?.toLowerCase() || '';

    const { hits } = await client.search({
      index: 'products',
      body: {
        size: limit,
        _source: ['name', 'slug'],
        query: {
          bool: {
            should: [
              {
                prefix: {
                  'name.keyword': {
                    value: processedKeyword,
                    boost: 4,
                  },
                },
              },
              {
                match: {
                  'name.ngram': {
                    query: processedKeyword,
                    boost: 2,
                  },
                },
              },
              {
                match: {
                  name: {
                    query: processedKeyword,
                    fuzziness: 'AUTO',
                    boost: 1,
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
      },
    });

    const suggestions = [...new Set(hits.hits.map((hit) => hit._source.name))];
    return suggestions;
  } catch (error) {
    console.error('Suggestion error:', error);
    throw error;
  }
};

export const elasticsearchService = {
  client,
  checkConnection,
  initializeProductIndex,
  syncProductsToElasticsearch,
  searchProducts,
  buildSortCriteria,
  getSuggestions,
};
