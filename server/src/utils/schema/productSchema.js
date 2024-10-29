import Joi from 'joi';

export const SAVE_PRODUCT_SCHEMA = Joi.object({
  cat_id: Joi.alternatives().try(
    Joi.string().trim().min(1).required().messages({
      'string.empty': 'Danh mục không được để trống',
      'any.required': 'Danh mục là bắt buộc',
    }),
    Joi.array().items(
      Joi.string().trim().min(1).required().messages({
        'string.empty': 'Danh mục không được để trống',
        'any.required': 'Danh mục là bắt buộc',
      })
    )
  ),
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Tên không được để trống',
    'any.required': 'Tên là bắt buộc',
  }),
  slug: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Slug không được để trống',
    'any.required': 'Slug là bắt buộc',
  }),
  description: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Mô tả ngắn không được để trống',
    'any.required': 'Mô tả ngắn là bắt buộc',
  }),
  content: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Nội dung ngắn không được để trống',
    'any.required': 'Nội dung ngắn là bắt buộc',
  }),
  price: Joi.number().precision(2).min(1).required().messages({
    'string.empty': 'Giá không được để trống',
    'any.required': 'Giá là bắt buộc',
  }),
  tags: Joi.array().default([]),
  thumbnail: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Ảnh đại diện không được để trống',
    'any.required': 'Ảnh đại diện là bắt buộc',
  }),
  images: Joi.array()
    .items(
      Joi.string().trim().min(1).required().messages({
        'string.empty': 'Ảnh không được để trống',
        'any.required': 'Ảnh là bắt buộc',
      })
    )
    .required()
    .messages({
      'any.required': 'Ảnh là bắt buộc',
    }),
  brand: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Thương hiệu không được để trống',
    'any.required': 'Thương hiệu là bắt buộc',
  }),
  status: Joi.boolean().required().messages({
    'any.required': 'Trạng thái là bắt buộc',
  }),
  views: Joi.number().integer().default(0),
  inventory: Joi.number().integer().default(0),
  minInventory: Joi.number().integer().default(0),
  maxInventory: Joi.number().integer().default(0),
  variants: Joi.alternatives().try(
    Joi.object(),
    Joi.array().items(
      Joi.object({
        price: Joi.number().precision(2).min(1).required().messages({
          'string.empty': 'Giá không được để trống',
          'any.required': 'Giá là bắt buộc',
        }),
        saleOff: Joi.number().precision(2).required().messages({
          'string.empty': 'Giá giảm không được để trống',
          'any.required': 'Giá giảm là bắt buộc',
        }),
        marketPrice: Joi.number().precision(2).min(1).required().messages({
          'string.empty': 'Giá chợ không được để trống',
          'any.required': 'Giá chợ là bắt buộc',
        }),
        capitalPrice: Joi.number().precision(2).min(1).required().messages({
          'string.empty': 'Giá gốc không được để trống',
          'any.required': 'Giá gốc là bắt buộc',
        }),
        onlinePrice: Joi.number().precision(2).min(1).required().messages({
          'string.empty': 'Giá online không được để trống',
          'any.required': 'Giá online là bắt buộc',
        }),
        stock: Joi.number().integer().required().messages({
          'string.empty': 'Tồn kho không được để trống',
          'any.required': 'Tồn kho là bắt buộc',
        }),
        sellCount: Joi.number().integer().default(0),
        sku: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Sku không được để trống',
          'any.required': 'Sku là bắt buộc',
        }),
        warehouseId: Joi.string().required().messages({
          'string.base': 'ID nhà kho phải là một chuỗi.',
          'any.required': 'ID nhà kho là bắt buộc.',
        }),
        color: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Màu sắc không được để trống',
          'any.required': 'Màu sắc là bắt buộc',
        }),
        sizes: Joi.array().items(
          Joi.object({
            size: Joi.string().trim().min(1).required().messages({
              'string.empty': 'Kích thước không được để trống',
              'any.required': 'Kích thước là bắt buộc',
            }),
            price: Joi.number().precision(2).min(1).required().messages({
              'string.empty': 'Giá không được để trống',
              'any.required': 'Giá là bắt buộc',
            }),
            stock: Joi.number().integer().required().messages({
              'string.empty': 'Tồn kho không được để trống',
              'any.required': 'Tồn kho là bắt buộc',
            }),
            sale: Joi.number().integer().required().messages({
              'string.empty': 'Có thể bán không được để trống',
              'any.required': 'Có thể bán là bắt buộc',
            }),
            trading: Joi.number().integer().default(0).messages({
              'string.empty': 'Đang giao dịch không được để trống',
            }),
            sku: Joi.string().trim().min(1).required().messages({
              'string.empty': 'Sku không được để trống',
              'any.required': 'Sku là bắt buộc',
            }),
          })
        ),
        image: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Ảnh biến thể không được để trống',
          'any.required': 'Ảnh biến thể là bắt buộc',
        }),
      })
    )
  ),
  reviews: Joi.array().items(
    Joi.object({
      userId: Joi.string().trim().min(1).required().messages({
        'string.empty': 'Người dùng không được để trống',
        'any.required': 'Người dùng là bắt buộc',
      }),
      orderId: Joi.string().trim().min(1).required().messages({
        'string.empty': 'Đơn hàng không được để trống',
        'any.required': 'Đơn hàng là bắt buộc',
      }),
      productId: Joi.string().trim().min(1).required().messages({
        'string.empty': 'Sản phẩm không được để trống',
        'any.required': 'Sản phẩm là bắt buộc',
      }),
      content: Joi.string().trim().min(1).required().messages({
        'string.empty': 'Nội dung ngắn không được để trống',
        'any.required': 'Nội dung ngắn là bắt buộc',
      }),
      rating: Joi.number().integer().min(1).required().messages({
        'string.empty': 'Đánh giá không được để trống',
        'any.required': 'Đánh giá là bắt buộc',
      }),
      createdAt: Joi.date().timestamp('javascript').default(Date.now),
      updatedAt: Joi.date().timestamp('javascript').default(Date.now),
    })
  ),
  weight: Joi.number().precision(2).default(1).messages({
    'number.base': 'Cân nặng phải là một số',
  }),
  height: Joi.number().precision(2).min(1).required().messages({
    'string.empty': 'Chiều cao không được để trống',
    'any.required': 'Chiều cao là bắt buộc',
  }),
  statusStock: Joi.string()
    .valid('stock', 'outStock', 'preOrder')
    .trim()
    .not()
    .empty()
    .required()
    .messages({
      'string.base': 'Trạng thái sản phẩm phải là một chuỗi văn bản.',
      'string.empty': 'Trạng thái sản phẩm không được để trống.',
      'any.only':
        'Trạng thái sản phẩm phải là một trong các giá trị sau: stock, outStock, preOrder.',
      'any.required': 'Trạng thái sản phẩm là bắt buộc.',
    }),
  productType: Joi.array().items(
    Joi.string().trim().min(1).required().messages({
      'string.empty': 'Loại sản phẩm không được để trống',
      'any.required': 'Loại sản phẩm là bắt buộc',
    })
  ),
  seoOption: Joi.object({
    title: Joi.string().trim().min(1).max(70).required().messages({
      'string.empty': 'Tiêu đề không được để trống',
      'string.min': 'Tiêu đề phải có ít nhất 1 ký tự',
      'string.max': 'Tiêu đề tối đa 70 ký tự',
      'any.required': 'Tiêu đề là bắt buộc',
    }),
    description: Joi.string().trim().min(1).max(320).required().messages({
      'string.empty': 'Mô tả không được để trống',
      'string.min': 'Mô tả phải có ít nhất 1 ký tự',
      'string.max': 'Mô tả tối đa 320 ký tự',
      'any.required': 'Mô tả là bắt buộc',
    }),
    alias: Joi.string().trim().min(1).required().messages({
      'string.empty': 'Đường dẫn không được để trống',
      'string.min': 'Đường dẫn phải có ít nhất 1 ký tự',
      'any.required': 'Đường dẫn là bắt buộc',
    }),
  })
    .required()
    .messages({
      'any.required': 'SEO là bắt buộc',
    }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_PRODUCT = Joi.object({
  cat_id: Joi.alternatives().try(
    Joi.string().trim().min(1).messages({
      'string.empty': 'Danh mục không được để trống',
    }),
    Joi.array().items(
      Joi.string().trim().min(1).messages({
        'string.empty': 'Danh mục không được để trống',
      })
    )
  ),
  name: Joi.string().trim().min(1).messages({
    'string.empty': 'Tên không được để trống',
  }),
  slug: Joi.string().trim().min(1).messages({
    'string.empty': 'Slug không được để trống',
  }),
  description: Joi.string().trim().min(1).messages({
    'string.empty': 'Mô tả ngắn không được để trống',
  }),
  price: Joi.number().precision(2).min(1).messages({
    'string.empty': 'Giá không được để trống',
  }),
  content: Joi.string().trim().min(1).messages({
    'string.empty': 'Nội dung ngắn không được để trống',
  }),
  tags: Joi.array().items(
    Joi.string().trim().min(1).messages({
      'string.empty': 'Tag không được để trống',
    })
  ),
  thumbnail: Joi.string().trim().min(1).messages({
    'string.empty': 'Ảnh không được để trống',
  }),
  images: Joi.array().items(
    Joi.string().trim().min(1).messages({
      'string.empty': 'Ảnh không được để trống',
    })
  ),
  brand: Joi.string().trim().min(1).messages({
    'string.empty': 'Thương hiệu không được để trống',
  }),
  status: Joi.boolean(),
  views: Joi.number().integer().default(0),
  inventory: Joi.number().integer().default(0),
  minInventory: Joi.number().integer().default(0),
  maxInventory: Joi.number().integer().default(0),
  variants: Joi.alternatives().try(
    Joi.object(),
    Joi.array().items(
      Joi.object({
        price: Joi.number().precision(2).min(1).messages({
          'string.empty': 'Giá không được để trống',
        }),
        saleOff: Joi.number().precision(2).messages({
          'string.empty': 'Giá giảm không được để trống',
        }),
        marketPrice: Joi.number().precision(2).min(1).messages({
          'string.empty': 'Giá chợ không được để trống',
        }),
        capitalPrice: Joi.number().precision(2).min(1).messages({
          'string.empty': 'Giá gốc không được để trống',
        }),
        onlinePrice: Joi.number().precision(2).min(1).messages({
          'string.empty': 'Giá online không được để trống',
        }),
        stock: Joi.number().integer().messages({
          'string.empty': 'Tồn kho không được để trống',
        }),
        sellCount: Joi.number().integer().default(0),
        sku: Joi.string().trim().min(1).messages({
          'string.empty': 'Sku không được để trống',
        }),
        warehouseId: Joi.string().messages({
          'string.base': 'ID nhà kho phải là một chuỗi.',
        }),
        color: Joi.string().trim().min(1).messages({
          'string.empty': 'Màu sắc không được để trống',
        }),
        sizes: Joi.array().items(
          Joi.object({
            size: Joi.string().trim().min(1).messages({
              'string.empty': 'Kích thước không được để trống',
            }),
            price: Joi.number().precision(2).min(1).messages({
              'string.empty': 'Giá không được để trống',
            }),
            stock: Joi.number().integer().messages({
              'string.empty': 'Tồn kho không được để trống',
            }),
            sale: Joi.number().integer().messages({
              'string.empty': 'Có thể bán không được để trống',
            }),
            trading: Joi.number().integer().default(0).messages({
              'string.empty': 'Đang giao dịch không được để trống',
            }),
            sku: Joi.string().trim().min(1).messages({
              'string.empty': 'Sku không được để trống',
            }),
          })
        ),
        image: Joi.string().trim().min(1).messages({
          'string.empty': 'Ảnh biến thể không được để trống',
        }),
      })
    )
  ),
  reviews: Joi.array().items(
    Joi.object({
      userId: Joi.string().trim().min(1).messages({
        'string.empty': 'Người dùng không được để trống',
      }),
      orderId: Joi.string().trim().min(1).messages({
        'string.empty': 'Đơn hàng không được để trống',
      }),
      productId: Joi.string().trim().min(1).messages({
        'string.empty': 'Sản phẩm không được để trống',
      }),
      content: Joi.string().trim().min(1).messages({
        'string.empty': 'Nội dung ngắn không được để trống',
      }),
      rating: Joi.number().integer().min(1).messages({
        'string.empty': 'Đánh giá không được để trống',
      }),
      createdAt: Joi.date().timestamp('javascript').default(Date.now),
      updatedAt: Joi.date().timestamp('javascript').default(Date.now),
    })
  ),
  weight: Joi.number().precision(2).min(1).messages({
    'string.empty': 'Cân nặng không được để trống',
  }),
  height: Joi.number().precision(2).min(1).messages({
    'string.empty': 'Chiều cao không được để trống',
  }),
  statusStock: Joi.string()
    .valid('stock', 'outStock', 'preOrder')
    .trim()
    .not()
    .empty()
    .messages({
      'string.base': 'Trạng thái sản phẩm phải là một chuỗi văn bản.',
      'string.empty': 'Trạng thái sản phẩm không được để trống.',
      'any.only':
        'Trạng thái sản phẩm phải là một trong các giá trị sau: stock, outStock, preOrder.',
    }),
  productType: Joi.array().items(
    Joi.string().trim().min(1).messages({
      'string.empty': 'Loại sản phẩm không được để trống',
    })
  ),
  seoOption: Joi.object({
    title: Joi.string().trim().min(1).max(70).messages({
      'string.empty': 'Tiêu đề không được để trống',
      'string.min': 'Tiêu đề phải có ít nhất 1 ký tự',
      'string.max': 'Tiêu đề tối đa 70 ký tự',
    }),
    description: Joi.string().trim().min(1).max(320).messages({
      'string.empty': 'Mô tả không được để trống',
      'string.min': 'Mô tả phải có ít nhất 1 ký tự',
      'string.max': 'Mô tả tối đa 320 ký tự',
    }),
    alias: Joi.string().trim().min(1).messages({
      'string.empty': 'Đường dẫn không được để trống',
      'string.min': 'Đường dẫn phải có ít nhất 1 ký tự',
    }),
  }),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const REVIEW_PRODUCT = Joi.object({
  userId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Người dùng không được để trống',
    'any.required': 'Người dùng là bắt buộc',
  }),
  orderId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Đơn hàng không được để trống',
    'any.required': 'Đơn hàng là bắt buộc',
  }),
  productId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Sản phẩm không được để trống',
    'any.required': 'Sản phẩm là bắt buộc',
  }),
  content: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Nội dung không được để trống',
    'any.required': 'Nội dung là bắt buộc',
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Đánh giá phải là số',
    'number.min': 'Đánh giá phải từ 1 đến 5',
    'number.max': 'Đánh giá phải từ 1 đến 5',
    'any.required': 'Đánh giá là bắt buộc',
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
})
  .required()
  .messages({
    'any.required': 'Đánh giá là bắt buộc',
  });

export const UPDATE_REVIEW_PRODUCT = Joi.object({
  userId: Joi.string().trim().min(1).messages({
    'string.empty': 'Người dùng không được để trống',
  }),
  orderId: Joi.string().trim().min(1).messages({
    'string.empty': 'Đơn hàng không được để trống',
  }),
  productId: Joi.string().trim().min(1).messages({
    'string.empty': 'Sản phẩm không được để trống',
  }),
  content: Joi.string().trim().min(1).messages({
    'string.empty': 'Nội dung không được để trống',
  }),
  rating: Joi.number().integer().min(1).max(5).messages({
    'number.base': 'Đánh giá phải là số',
    'number.min': 'Đánh giá phải từ 1 đến 5',
    'number.max': 'Đánh giá phải từ 1 đến 5',
  }),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
