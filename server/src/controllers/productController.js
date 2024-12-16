/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { productModel } from '~/models/productModel';
import { StatusCodes } from 'http-status-codes';
import { uploadModel } from '~/models/uploadModel';
import path from 'path';
import { hotSearchModel } from '~/models/hotSearchModel';
import { ObjectId } from 'mongodb';
import { redisUtils } from '~/utils/redis';
import { elasticsearchService } from '~/services/elasticsearchService';

const getAllProducts = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const products = await productModel.getProductsAll(pages, limit);
    return res.status(StatusCodes.OK).json(products);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const searchByElasticsearch = async (req, res) => {
  try {
    const {
      keyword,
      minPrice,
      maxPrice,
      colors,
      sizes,
      page = 1,
      limit = 20,
      sort,
    } = req.query;

    // Validate input
    if (!keyword || keyword.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Từ khóa tìm kiếm không được để trống',
      });
    }

    // Parse filters
    const filters = {
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      colors: colors ? colors.split(',') : undefined,
      sizes: sizes ? sizes.split(',') : undefined,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
    };

    // Thực hiện tìm kiếm
    const results = await productModel.searchByElasticsearch(
      keyword.trim(),
      filters,
      sort
    );

    // Lưu từ khóa tìm kiếm vào hot search
    let hotSearch = await hotSearchModel.findHotSearchByKeyword(keyword.trim());
    if (hotSearch) {
      hotSearch = await hotSearchModel.plusCountHotSearch(hotSearch._id);
    } else {
      hotSearch = await hotSearchModel.createHotSearch({
        keyword: keyword.trim(),
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Search error:', error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Có lỗi xảy ra trong quá trình tìm kiếm',
      error: error.message,
    });
  }
};

const increaseView = async (req, res) => {
  try {
    let { slug } = req.params;
    await productModel.increaseViewBySlug(slug);
    return res.status(StatusCodes.OK).json({ message: 'Thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getAllProductsSpecial = async (req, res) => {
  try {
    const products = await productModel.getProductsAllSpecial();
    return res.status(StatusCodes.OK).json({
      products,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy sản phẩm!' });
    }
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel.getProductBySlug(slug);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy sản phẩm!' });
    }
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    let { pages, limit } = req.query;
    const product = await productModel.getProductsByCategory(
      slug,
      pages,
      limit
    );
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy sản phẩm!' });
    }
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getProductsByView = async (req, res) => {
  try {
    const products = await productModel.getProductsByView();

    if (!products) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy sản phẩm!' });
    }
    return res.status(StatusCodes.OK).json(products);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getProductByBrand = async (req, res) => {
  try {
    const { slug } = req.params;
    let { pages, limit } = req.query;

    const product = await productModel.getProductsByBrand(slug, pages, limit);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy sản phẩm!' });
    }
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getProductByCategoryId = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const { id } = req.params;
    const product = await productModel.getProductsByCategoryId(
      id,
      pages,
      limit
    );
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy sản phẩm!' });
    }
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getProductByBrandId = async (req, res) => {
  try {
    const { id } = req.params;
    let { pages, limit } = req.query;
    const product = await productModel.getProductsByBrandId(id, pages, limit);

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy sản phẩm!' });
    }
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      cat_id,
      name,
      description,
      content,
      tags,
      brand,
      status,
      productType,
      weight,
      height,
      statusStock,
      variants,
      price,
      slug,
      seoOption,
    } = req.body;

    if (!req.files['thumbnail'] || !req.files['thumbnail'][0]) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Ảnh đại diện không được để trống' });
    }

    if (!req.files['images'] || !req.files['images'].length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Ảnh không được để trống' });
    }

    if (!req.files['imageVariants'] || !req.files['imageVariants'].length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Ảnh biến thể không được để trống' });
    }
    let thumbnail;
    thumbnail = path.join(
      'uploads/products',
      req.files['thumbnail'][0].filename
    );
    let imagesProduct = [];
    imagesProduct = req.files['images'].map((file) => {
      if (file && file.filename) {
        return path.join('uploads/products', file.filename);
      } else {
        throw new Error('File image không hợp lệ');
      }
    });
    let imageVariantsC = [];
    imageVariantsC = req.files['imageVariants'].map((file) => {
      if (file && file.filename) {
        return path.join('uploads/products', file.filename);
      } else {
        throw new Error('File image không hợp lệ');
      }
    });

    const newTags = JSON.parse(tags);
    const newSeoOption = JSON.parse(seoOption);
    const newProductType = JSON.parse(productType);

    const parsedVars = JSON.parse(variants);
    imageVariantsC.forEach((file, index) => {
      parsedVars[index].image = file;
    });
    const data = {
      cat_id,
      name,
      slug,
      price,
      description,
      content,
      tags: newTags,
      thumbnail,
      images: imagesProduct,
      brand,
      status,
      variants: parsedVars,
      weight,
      height,
      statusStock,
      productType: newProductType,
      seoOption: newSeoOption,
    };

    const dataProduct = await productModel.createProduct(data);

    if (!dataProduct) {
      uploadModel.deleteImg(thumbnail);
      uploadModel.deleteImgs(imagesProduct);
      uploadModel.deleteImgs(imageVariantsC);
      return res.status(StatusCodes.BAD_REQUEST).json(dataProduct.detail);
    }
    return res.status(StatusCodes.OK).json({ dataProduct });
  } catch (error) {
    if (req.files) {
      const thumbnailPath = req.files['thumbnail']?.[0]?.filename;

      const imageVariantsC = req.files['imageVariants']?.map((file) => {
        if (file && file.filename) {
          return path.join('uploads/products', file.filename);
        } else {
          throw new Error('File image không hợp lệ');
        }
      });

      const imagesProduct = req.files['images']?.map((file) => {
        if (file && file.filename) {
          return path.join('uploads/products', file.filename);
        } else {
          throw new Error('File image không hợp lệ');
        }
      });

      if (thumbnailPath) {
        const thumbnail = path.join('uploads/products', thumbnailPath);
        uploadModel.deleteImg(thumbnail);
      }

      if (imagesProduct && imagesProduct.length > 0) {
        uploadModel.deleteImgs(imagesProduct);
      }

      if (imageVariantsC && imageVariantsC.length > 0) {
        uploadModel.deleteImgs(imageVariantsC);
      }
    }

    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cat_id,
      name,
      description,
      content,
      tags,
      brand,
      slug,
      status,
      productType,
      weight,
      height,
      statusStock,
      variants,
      imagesDelete,
      inventory,
      minInventory,
      maxInventory,
      seoOption
      // indexVariants,
      // variantsDelete,
    } = req.body;

    let thumbnail;
    let imagesProduct = [];
    let imageVariantsC = [];

    if (req.files['thumbnail']) {
      thumbnail = path.join(
        'uploads/products',
        req.files['thumbnail'][0].filename
      );
    }

    if (req.files['images']) {
      imagesProduct = req.files['images'].map((file) => {
        if (file && file.filename) {
          return path.join('uploads/products', file.filename);
        } else {
          throw new Error('Images không hợp lệ');
        }
      });
    }
    req.files['imageVariants'] &&
      req.files['imageVariants'].map((file) => {
        if (file && file.filename) {
          imageVariantsC.push(path.join('uploads/products', file.filename));
        }
      });

    const product = await productModel.getProductById(id);
    const oldVariants = product.variants;
    let parsedVariants = [];
    if (!Array.isArray(variants)) {
      parsedVariants = [JSON.parse(variants)];
    } else {
      parsedVariants = variants.map((variant) => JSON.parse(variant));
    }
    // ảnh cũ
    const oldImageVariants = oldVariants.map((v) => v.image);
    // những ảnh k cần xóa
    const imageNoDelete = parsedVariants
      .map((v) => (!v.imageAdd ? v.image : null))
      .filter(Boolean);
    // ảnh cần xóa
    const imageDelete = oldImageVariants.filter(
      (v) => !imageNoDelete.includes(v)
    );
    if (parsedVariants.length > 0) {
      for (const variant of parsedVariants) {
        if (variant.imageAdd) {
          variant.image = imageVariantsC[0];
          imageVariantsC.shift();
          delete variant.imageAdd;
        }

        if (imageVariantsC.length === 0) {
          break;
        }
      }
    }
    // let parsedVariants = [];
    // let oldImageVariants = [];
    // if (Array.isArray(variants)) {
    //   parsedVariants = variants.map((variant, index) => {
    //     let parsedVariant = JSON.parse(variant);
    //     if ('imageAdd' in parsedVariant) {
    //       if ('image' in parsedVariant) {
    //         if (product.variants[index].image === parsedVariant.image) {
    //           oldImageVariants.push(parsedVariant.image);
    //         }
    //       }
    //       delete parsedVariant.imageAdd;
    //     }
    //     return parsedVariant;
    //   });
    // } else {
    //   parsedVariants = JSON.parse(variants);
    //   if ('imageAdd' in parsedVariants) {
    //     if ('image' in parsedVariants) {
    //       const indexVar = indexVariants[0];
    //       if (product.variants[indexVar].image === parsedVariants.image) {
    //         oldImageVariants.push(parsedVariants.image);
    //       }
    //     }
    //     delete parsedVariants.imageAdd;
    //   }
    // }

    // let parsedImageDelete = [];

    // if (Array.isArray(variantsDelete) && variantsDelete.length > 0) {
    //   parsedImageDelete = variantsDelete.map((variant) => JSON.parse(variant));
    // } else if (
    //   typeof variantsDelete === 'string' &&
    //   variantsDelete.trim() !== ''
    // ) {
    //   parsedImageDelete.push(JSON.parse(variantsDelete));
    // }

    // let deleteImgsVars = [];
    // const variantsArray = Array.isArray(product.variants)
    //   ? product.variants
    //   : [product.variants];

    // variantsArray.forEach((v, index) => {
    //   const parsedVar = parsedImageDelete[index];
    //   if (parsedVar && parsedVar.image !== v.image) {
    //     deleteImgsVars.push(parsedVar.image);
    //   }
    // });

    let validImgs = [];
    let deleteImgs = [];

    if (imagesDelete && imagesDelete.length > 0) {
      validImgs = product.images.filter(
        (image) => !imagesDelete.includes(image)
      );
      deleteImgs = product.images.filter((image) =>
        imagesDelete.includes(image)
      );
    } else {
      validImgs = product.images;
    }

    // if (imageVariantsC) {
    //   imageVariantsC.forEach((file, index) => {
    //     const indexVar = indexVariants[index];
    //     parsedVariants[indexVar].image = file;
    //   });
    // }

    const newimgURLs = [...validImgs, ...imagesProduct];

    const newThumbnail = thumbnail ? thumbnail : product.thumbnail;
    const data = {
      cat_id,
      name,
      slug,
      description,
      content,
      tags: JSON.parse(tags),
      thumbnail: newThumbnail,
      images: newimgURLs,
      brand,
      status,
      variants: parsedVariants,
      weight,
      height,
      statusStock,
      inventory,
      minInventory,
      maxInventory,
      seoOption: JSON.parse(seoOption),
      productType: JSON.parse(productType),
    };

    const dataProduct = await productModel.update(id, data);
    if (dataProduct) {
      if (deleteImgs && deleteImgs.length > 0) {
        uploadModel.deleteImgs(deleteImgs);
      }

      if (imageDelete && imageDelete.length > 0) {
        uploadModel.deleteImgs(imageDelete);
      }

      const result = dataProduct.result;
      if (!result) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không tìm thấy sản phẩm!' });
      }
      return res.status(StatusCodes.OK).json(result);
    }
  } catch (error) {
    console.log('error', error);
    if (req.files) {
      const thumbnailPath = req.files['thumbnail']?.[0]?.filename;

      const imageVariantsC = req.files['imageVariants']?.map((file) => {
        if (file && file.filename) {
          return path.join('uploads/products', file.filename);
        } else {
          throw new Error('File image không hợp lệ');
        }
      });

      const imagesProduct = req.files['images']?.map((file) => {
        if (file && file.filename) {
          return path.join('uploads/products', file.filename);
        } else {
          throw new Error('File image không hợp lệ');
        }
      });

      if (thumbnailPath) {
        const thumbnail = path.join('uploads/products', thumbnailPath);
        uploadModel.deleteImg(thumbnail);
      }

      if (imagesProduct && imagesProduct.length > 0) {
        uploadModel.deleteImgs(imagesProduct);
      }

      if (imageVariantsC && imageVariantsC.length > 0) {
        uploadModel.deleteImgs(imageVariantsC);
      }
    }
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error,
    });
  }
};
// const updateTest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { variants } = req.body;
//     const product = await productModel.getProductById(id);
//     const oldVariant = product.variants;
//     const parsedVariants = variants.map((variant) => JSON.parse(variant));
//     // ảnh cũ
//     const oldImageVariants = oldVariant.map((v) => v.image);
//     // những ảnh k cần xóa
//     const imageNoDelete = parsedVariants
//       .map((v) => (!v.imageAdd ? v.image : null))
//       .filter(Boolean);
//     // ảnh cần xóa
//     const imageDelete = oldImageVariants.filter(
//       (v) => !imageNoDelete.includes(v)
//     );
//     // danh sách ảnh up lên
//     const imageVariantsC =
//       req.files['imageVariants'] &&
//       req.files['imageVariants'].map((file) => {
//         if (file && file.filename) {
//           return path.join('uploads/products', file.filename);
//         } else {
//           throw new Error('File image không hợp lệ');
//         }
//       });
//     for (const variant of parsedVariants) {
//       if (variant.imageAdd) {
//         variant.image = imageVariantsC[0];
//         imageVariantsC.shift();
//         delete variant.imageAdd;
//       }

//       if (imageVariantsC.length === 0) {
//         break; // Exit the loop when imageVariantsC is empty
//       }
//     }

//     console.log('variants', parsedVariants);
//     console.log('ảnh không cần xóa ', imageNoDelete);
//     console.log('ảnh cũ', oldImageVariants);
//     console.log('ảnh cần xóa', imageDelete);
//   } catch (error) {
//     console.log('error', error);
//   }
// };
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const dataProduct = await productModel.deleteProduct(id);
  if (dataProduct?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataProduct) {
    if (dataProduct && dataProduct.images && dataProduct.images.length > 0) {
      await uploadModel.deleteImgs(dataProduct.images);
    }
    if (dataProduct && dataProduct.thumbnail) {
      await uploadModel.deleteImg(dataProduct.thumbnail);
    }

    if (dataProduct && dataProduct.variants) {
      const variantsArray = Array.isArray(dataProduct.variants)
        ? dataProduct.variants
        : [dataProduct.variants];

      const imagesVariants = variantsArray.map((v) => {
        return v.image;
      });
      const imagesArray = Array.isArray(imagesVariants)
        ? imagesVariants
        : [imagesVariants];
      await uploadModel.deleteImgs(imagesArray);
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa sản phẩm thành công' });
  }
};

const ratingProduct = async (req, res) => {
  try {
    const {
      userId,
      content,
      orderId,
      productId,
      rating,
      variantColor,
      variantSize,
    } = req.body;

    const data = {
      userId,
      content,
      orderId,
      productId,
      rating,
      variantColor,
      variantSize,
    };

    /*     const data = {
      userId: '672332bb3eb63a6c62287dc6',
      content: '123',
      orderId: '672510f996adbc5a3addec0e',
      productId: '671f8472af7fc5c9ad0485a9',
      rating: 5,
      variantColor: 'Xám',
      variantSize: 'S',
    }; */

    let images = [];

    if (req.files) {
      images = req.files.map((file) =>
        path.join('uploads/products', file.filename)
      );
      data.images = images;
    }

    const isComment = await productModel.isComment(
      data.userId,
      data.productId,
      data.orderId,
      data.variantColor,
      data.variantSize
    );

    if (isComment) {
      if (req.files) {
        uploadModel.deleteImgs(images);
      }
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Đã đánh giá sản phẩm này' });
    }

    const dataProduct = await productModel.ratingProduct(data);
    if (!dataProduct) {
      if (req.files) {
        uploadModel.deleteImgs(images);
      }
      return res.status(StatusCodes.BAD_REQUEST).json(dataProduct.detail);
    }
    return res
      .status(StatusCodes.OK)
      .json({ dataProduct, message: 'Đánh giá thành công' });
  } catch (error) {
    if (req.files) {
      req.files.map((file) => {
        uploadModel.deleteImg(file.path);
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const ratingManyProduct = async (req, res) => {
  try {
    const { userId, orderId, productList } = req.body;
    /*  const data = {
      userId: '672332bb3eb63a6c62287dc6',
      orderId: '672326529e88fc77313144d1',
      productList: [
        {
          content: '123',
          rating: 5,
          productId: '671f8472af7fc5c9ad0485a9',
          name: '123123',
          variantColor: 'Xám',
          variantSize: 'S',
        },
        {
          content: '1234',
          rating: 5,
          productId: '6717bd72e87fcbd1937bbef2',
          name: 'Áo Sơ Mi Kiểu 10609955',
          variantColor: 'Tím',
          variantSize: 'S',
        },
        {
          content: '12345',
          rating: 5,
          productId: '6717bd71e87fcbd1937bbef1',
          name: 'Áo Sơ Mi Croptop 10610046',
          variantColor: 'Xám',
          variantSize: 'S',
        },
      ],
    }; */

    const successfulProducts = [];
    const failedProducts = [];

    for (const product of productList) {
      const { productId, content, rating, variantColor, variantSize, name } =
        product;

      const isComment = await productModel.isComment(userId, productId);

      if (isComment) {
        failedProducts.push({ name, reason: 'Đã đánh giá sản phẩm này' });
        continue;
      }

      try {
        const reviewData = {
          userId: userId,
          orderId: orderId,
          productId,
          content,
          rating,
          variantColor,
          variantSize,
        };

        await productModel.ratingProduct(reviewData);
        successfulProducts.push({ name });
      } catch (error) {
        failedProducts.push({ name, reason: error.message });
      }
    }

    if (failedProducts.length > 0) {
      return res.status(StatusCodes.OK).json({
        message: 'Quá trình đánh giá hoàn tất với một số sản phẩm bị lỗi.',
        successfulProducts,
        failedProducts,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: 'Đánh giá thành công tất cả sản phẩm',
      successfulProducts,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const ratingShopProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const { content } = req.body;

    /*    const data = {
      content: '123',
      user_id: '672332bb3eb63a6c62287dc6',
    }; */

    const data = {
      content,
      user_id,
    };

    const dataProduct = await productModel.ratingShopResponse(id, data);
    if (!dataProduct) {
      return res.status(StatusCodes.BAD_REQUEST).json(dataProduct.detail);
    }
    return res.status(StatusCodes.OK).json({ message: 'Đánh giá thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateRatingProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userId,
      content,
      orderId,
      productId,
      rating,
      imagesDelete,
      variantColor,
      variantSize,
    } = req.body;

    const data = {
      userId,
      content,
      orderId,
      productId,
      rating,
      variantColor,
      variantSize,
    };
    let images = [];

    if (req.files) {
      images = req.files.map((file) =>
        path.join('uploads/products', file.filename)
      );
    }
    const product = await productModel.getProductById(productId);

    if (!product) {
      if (req.files) {
        uploadModel.deleteImgs(images);
      }
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Sản phẩm không tồn tại' });
    }
    const review = product.reviews.find((review) =>
      review._id.equals(new ObjectId(id))
    );

    const combinedImages = [...review.images, ...images];

    data.images = combinedImages;
    const dataProduct = await productModel.updateRatingProduct(id, data);

    if (!dataProduct) {
      if (req.files) {
        uploadModel.deleteImgs(images);
      }
      return res.status(StatusCodes.BAD_REQUEST).json(dataProduct.detail);
    }
    if (imagesDelete && imagesDelete.length > 0) {
      if (Array.isArray(imagesDelete)) {
        uploadModel.deleteImgs(imagesDelete);
      } else {
        uploadModel.deleteImg(imagesDelete);
      }
    }

    return res
      .status(StatusCodes.OK)
      .json({ dataProduct, message: 'Cập nhật đánh giá thành công' });
  } catch (error) {
    if (req.files) {
      req.files.map((file) => {
        uploadModel.deleteImg(file.path);
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin' });
    }
    const result = await productModel.deleteRating(id);
    if (!result) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Xóa đánh giá không thành công' });
    }
    if (result.images && result.images.length > 0) {
      uploadModel.deleteImgs(result.images);
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa đánh giá thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const getProductByAlphabetAZ = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const products = await productModel.getProductByAlphabetAZ(pages, limit);
    return res.status(StatusCodes.OK).json({
      products,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getProductByAlphabetZA = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const products = await productModel.getProductByAlphabetZA(pages, limit);
    return res.status(StatusCodes.OK).json({
      products,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getProductByPriceAsc = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const products = await productModel.getProductByPriceAsc(pages, limit);
    return res.status(StatusCodes.OK).json({
      products,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getProductByPriceDesc = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const products = await productModel.getProductByPriceDesc(pages, limit);
    return res.status(StatusCodes.OK).json({
      products,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getProductByNewest = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const products = await productModel.getProductByNewest(pages, limit);

    return res.status(StatusCodes.OK).json({
      products,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getProductByOldest = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const products = await productModel.getProductByOldest(pages, limit);
    return res.status(StatusCodes.OK).json({
      products,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getProductBySearch = async (req, res) => {
  try {
    let { pages, limit, search } = req.query;
    const products = await productModel.getProductBySearch(
      search,
      pages,
      limit
    );
    return res.status(StatusCodes.OK).json({
      products,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getProductByCategoryFilter = async (req, res) => {
  try {
    let { slug } = req.params;
    const { pages, limit, ...rest } = req.query;

    const products = await productModel.getProductByCategoryFilter(
      slug,
      pages,
      limit,
      rest
    );

    return res.status(StatusCodes.OK).json({
      products,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getProductByEvent = async (req, res) => {
  try {
    const { slug } = req.params;
    let { pages, limit } = req.query;

    // Xử lý giá trị mặc định cho `pages` và `limit` nếu không được truyền
    pages = pages || 1;
    limit = limit || 10;

    // Tạo cache key
    const cacheKey = `products:event:${slug}:pages:${pages}:limit:${limit}`;

    // Kiểm tra cache
    const cachedData = await redisUtils.getCache(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json(cachedData);
    }

    // Truy vấn từ database
    const product = await productModel.getProductsByEvent(slug, pages, limit);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy sản phẩm!' });
    }

    await redisUtils.setCache(cacheKey, product, 1800); // TTL 30 phút

    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra, xin thử lại sau',
      error,
    });
  }
};

const getProductsBySlugAndPriceRange = async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      minPrice,
      maxPrice,
      pages,
      limit,
      colors,
      sizes,
      type,
      tags,
      ...sortCriteria
    } = req.query;

    const parsedColors = colors ? colors.split(',') : [];
    const parsedSizes = sizes ? sizes.split(',') : [];
    const parsedTags = tags ? tags.split(',') : [];

    const products = await productModel.getProductsBySlugAndPriceRange(
      slug,
      parseFloat(minPrice),
      parseFloat(maxPrice),
      parseInt(pages) || 1,
      parseInt(limit) || 20,
      sortCriteria,
      parsedColors,
      parsedSizes,
      type, // Truyền type
      parsedTags // Truyền tags
    );

    return res.status(StatusCodes.OK).json(products);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getProductsBySearchAndFilter = async (req, res) => {
  try {
    const { keyword } = req.query;

    const { minPrice, maxPrice, pages, limit, colors, sizes, ...sortCriteria } =
      req.query;

    const parsedColors = colors ? colors.split(',') : [];
    const parsedSizes = sizes ? sizes.split(',') : [];

    const products = await productModel.getProductsBySearchAndFilter(
      keyword,
      parseFloat(minPrice),
      parseFloat(maxPrice),
      parseInt(pages) || 1,
      parseInt(limit) || 20,
      sortCriteria,
      parsedColors,
      parsedSizes
    );

    let hotSearch = await hotSearchModel.findHotSearchByKeyword(keyword);

    if (hotSearch) {
      hotSearch = await hotSearchModel.plusCountHotSearch(hotSearch._id);
    } else {
      hotSearch = await hotSearchModel.createHotSearch({ keyword });
    }

    // if (!products || products.length === 0) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ message: 'Không tìm thấy sản phẩm!' });
    // }

    return res.status(StatusCodes.OK).json(products);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getMinMaxPrices = async (req, res) => {
  try {
    const priceRange = await productModel.getMinMaxProductPrices();
    return res.status(StatusCodes.OK).json(priceRange);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra khi lấy giá sản phẩm',
      error: error.message,
    });
  }
};
const searchInDashboard = async (req, res) => {
  try {
    const { keyword } = req.query;
    const products = await productModel.searchInDashboard(keyword);
    return res.status(StatusCodes.OK).json(products);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra khi tìm kiếm',
      error: error.message,
    });
  }
};
const getProductByArrayId = async (req, res) => {
  try {
    const { ids } = req.body;
    const product = await productModel.getProductByArrayId(ids);
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const testElasticsearchEndpoint = async (req, res) => {
  try {
    const { query = '' } = req.query;

    // Test kết nối
    const testConnection = await elasticsearchService.client.ping();
    if (!testConnection) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        message: 'Elasticsearch connection failed',
      });
    }

    // Test search và so sánh kết quả
    const results = await productModel.testElasticsearch(query);

    // Phân tích kết quả
    const analysis = {
      elasticsearchConnected: true,
      totalResults: {
        elasticsearch: results.elasticsearchBasic.total,
        elasticsearchFiltered: results.elasticsearchWithFilters.total,
        mongodb: results.mongodb.total,
      },
      matchingIds: {
        elasticsearch: results.elasticsearchBasic.hits.map((hit) => hit._id),
        mongodb: results.mongodb.hits.map((doc) => doc._id.toString()),
      },
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      analysis,
      results,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Test failed',
      error: error.message,
    });
  }
};
const creates = async (req, res) => {
  try {
    const data = req.body;
    const errors = [];
    const successful = [];
    for (const w of data) {
      try {
        if (w._id) {
          const existed = await productModel.getProductById(w._id);
          if (!existed) {
            errors.push({
              message: `Sản với id: ${w._id} không tồn tại`,
            });
            continue;
          }
          const id = w._id;
          delete w._id;
          const existedSlug = await productModel.getProductBySlug(w.slug);
          if (existedSlug && existedSlug._id.toString() !== id) {
            errors.push({
              message: `Slug: ${w.slug} đã tồn tại`,
            });
            continue;
          }
          w.seoOption = existed.seoOption || {
            title: w.name,
            description: w.name,
            alias: w.slug,
          };
          await productModel.update(id, w);
          successful.push({
            message:
              'Cập nhật thành công sản phẩm: ' + w.name + ' với id: ' + id,
          });
          // if (w.imageURL && existed.imageURL !== w.imageURL) {
          //   await uploadModel.deleteImg(existed.imageURL);
          // }
        } else {
          const existedSlug = await productModel.getProductBySlug(w.slug);
          if (existedSlug) {
            errors.push({
              message: `Slug: ${w.slug} đã tồn tại`,
            });
            continue;
          }
          w.seoOption = {
            title: w.name,
            description: w.name,
            alias: w.slug,
          };
          w.images = [w.thumbnail];
          await productModel.createProduct(w);
          successful.push({
            message: 'Tạo mới thành công sản phẩm: ' + w.name,
          });
        }
      } catch (error) {
        errors.push({
          message: error.details
            ? w.name + ': ' + error.details[0].message
            : error.message || 'Có lỗi xảy ra khi thêm sản phẩm',
        });
      }
    }

    // Trả về kết quả
    if (errors.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Một số sản phẩm không thể thêm được',
        errors,
        successful,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: 'Tất cả đã được thêm thành công',
      successful,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra, xin thử lại sau',
    });
  }
};


export const productController = {
  createProduct,
  searchByElasticsearch,
  getAllProducts,
  getProductsByView,
  increaseView,
  getProductById,
  updateProduct,
  ratingProduct,
  deleteProduct,
  updateRatingProduct,
  deleteRating,
  getProductBySlug,
  getProductByCategory,
  getProductByCategoryId,
  getProductByBrandId,
  getProductByBrand,
  getProductByAlphabetAZ,
  getProductByAlphabetZA,
  getProductByPriceAsc,
  getProductByPriceDesc,
  getProductByNewest,
  getProductByOldest,
  getProductBySearch,
  getAllProductsSpecial,
  getProductByCategoryFilter,
  getProductByEvent,
  getProductsBySlugAndPriceRange,
  getProductsBySearchAndFilter,
  getMinMaxPrices,
  ratingShopProduct,
  ratingManyProduct,
  searchInDashboard,
  getProductByArrayId,
  testElasticsearchEndpoint,
  creates
};
