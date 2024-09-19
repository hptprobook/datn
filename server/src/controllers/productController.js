/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { productModel } from '~/models/productModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModel } from '~/models/uploadModel';
import { createSlug } from '~/utils/createSlug';
import path from 'path';

const getAllProducts = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const products = await productModel.getProductsAll(pages, limit);
    const countProducts = await productModel.countProductAll();
    return res.status(StatusCodes.OK).json({
      products,
      countProducts,
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
    if (product) {
      return res.status(StatusCodes.OK).json({
        product,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại sản phẩm' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel.getProductBySlug(slug);
    if (product) {
      return res.status(StatusCodes.OK).json({
        product,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại sản phẩm' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel.getProductsByCategory(slug);
    if (product) {
      return res.status(StatusCodes.OK).json({
        product,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại sản phẩm' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
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
    } = req.body;

    if (!req.files['thumbnail'] || !req.files['thumbnail'][0]) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ mgs: 'Ảnh đại diện không được để trống' });
    }

    if (!req.files['images'] || !req.files['images'].length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ mgs: 'Ảnh không được để trống' });
    }

    if (!req.files['imageVariants'] || !req.files['imageVariants'].length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ mgs: 'Ảnh biến thể không được để trống' });
    }

    const thumbnail = path.join(
      'uploads/products',
      req.files['thumbnail'][0].filename
    );

    let imagesProduct = req.files['images'].map((file) => {
      if (file && file.filename) {
        return path.join('uploads/products', file.filename);
      } else {
        throw new Error('File image không hợp lệ');
      }
    });

    let imageVariantsC = req.files['imageVariants'].map((file) => {
      if (file && file.filename) {
        return path.join('uploads/products', file.filename);
      } else {
        throw new Error('File image không hợp lệ');
      }
    });

    if (
      !name ||
      !description ||
      !cat_id ||
      !content ||
      !brand ||
      !status ||
      !weight ||
      !height ||
      !statusStock
    ) {
      await uploadModel.deleteImg(thumbnail);
      await uploadModel.deleteImgs(imagesProduct);
      await uploadModel.deleteImgs(imageVariantsC);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const parsedVars = variants.map((v) => JSON.parse(v));
    imageVariantsC.forEach((file, index) => {
      parsedVars[index].image = file;
    });
    const slug = createSlug(name);

    const data = {
      cat_id,
      name: name,
      slug,
      description,
      content,
      tags,
      thumbnail,
      images: imagesProduct,
      brand,
      status,
      variants: parsedVars,
      weight,
      height,
      statusStock,
      productType,
    };

    const dataProduct = await productModel.createProduct(data);

    if (dataProduct.error) {
      await uploadModel.deleteImg(thumbnail);
      await uploadModel.deleteImgs(imagesProduct);
      await uploadModel.deleteImgs(imageVariantsC);
      return res.status(StatusCodes.BAD_REQUEST).json(dataProduct.detail);
    }
    return res
      .status(StatusCodes.OK)
      .json({ dataProduct, mgs: 'Thêm sản phẩm thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
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
    imagesDelete,
    indexVariants,
    variantsDelete,
  } = req.body;

  if (!req.files['thumbnail'] || !req.files['thumbnail'][0]) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ mgs: 'Ảnh đại diện không được để trống' });
  }

  if (!req.files['images'] || !req.files['images'].length) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ mgs: 'Ảnh không được để trống' });
  }

  if (!req.files['imageVariants'] || !req.files['imageVariants'].length) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ mgs: 'Ảnh biến thể không được để trống' });
  }

  const thumbnail = path.join(
    'uploads/products',
    req.files['thumbnail'][0].filename
  );

  let imagesProduct = req.files['images'].map((file) => {
    if (file && file.filename) {
      return path.join('uploads/products', file.filename);
    } else {
      throw new Error('Images không hợp lệ');
    }
  });

  let imageVariantsC = req.files['imageVariants'].map((file) => {
    if (file && file.filename) {
      return path.join('uploads/products', file.filename);
    } else {
      throw new Error('File image không hợp lệ');
    }
  });

  if (
    !name ||
    !description ||
    !cat_id ||
    !content ||
    !brand ||
    !status ||
    !weight ||
    !height ||
    !statusStock ||
    !variants
  ) {
    await uploadModel.deleteImg(thumbnail);
    await uploadModel.deleteImgs(imagesProduct);
    await uploadModel.deleteImgs(imageVariantsC);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const product = await productModel.getProductById(id);
  let parsedVariants = [];

  if (Array.isArray(variants)) {
    parsedVariants.push(variants.map((variant) => JSON.parse(variant)));
  } else {
    parsedVariants.push(JSON.parse(variants));
  }

  let parsedImageDelete = [];

  if (Array.isArray(variantsDelete)) {
    parsedImageDelete.push(
      variantsDelete.map((variant) => JSON.parse(variant))
    );
  } else {
    parsedImageDelete.push(JSON.parse(variantsDelete));
  }

  let deleteImgsVars = [];
  product.variants.map((v, index) => {
    const parsedVar = parsedImageDelete[index];
    if (parsedVar !== v) {
      deleteImgsVars.push(v.image);
    }
  });

  let validImgs = [];

  if (imagesDelete && imagesDelete.length > 0) {
    validImgs = product.images.filter((image) =>
      new Set(imagesDelete).has(image)
    );
  } else {
    validImgs = product.images;
  }

  if (imageVariantsC) {
    imageVariantsC.forEach((file, index) => {
      const indexVar = indexVariants[index];
      parsedVariants[indexVar].image = file.filename;
      delete parsedVariants[indexVar].imageAdd;
    });
  }

  console.log(deleteImgsVars);

  const newimgURLs = [...imagesProduct, ...validImgs];

  const slug = createSlug(name);

  const data = {
    cat_id,
    name: name,
    slug,
    description,
    content,
    tags,
    thumbnail,
    images: newimgURLs,
    brand,
    status,
    variants: parsedVariants,
    weight,
    height,
    statusStock,
    productType,
  };
  /* const dataProduct = await productModel.update(id, data);
  console.log(dataProduct);

  if (dataProduct.error) {
    await uploadModel.deleteImg(thumbnail);
    await uploadModel.deleteImgs(imagesProduct);
    await uploadModel.deleteImgs(imageVariantsC);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataProduct) {
    if (deleteImgs && deleteImgs.length > 0) {
      await uploadModel.deleteImgs(deleteImgs);
    } else {
      await uploadModel.deleteImg(deleteImgs);
    }
    if (deleteImgsVars && deleteImgsVars.length > 0) {
      await uploadModel.deleteImgs(deleteImgsVars);
    } else {
      await uploadModel.deleteImg(deleteImgsVars);
    }
    if (thumbnail) {
      await uploadModel.deleteImg(product.thumbnail);
    }

    const result = dataProduct.result;
    return res.status(StatusCodes.OK).json({
      message: 'Cập nhật sản phẩm thành công',
      dataProduct: result,
    });
  } */
};

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
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa sản phẩm thành công' });
  }
};

const ratingProduct = async (req, res) => {
  try {
    const { userId, content, orderId, productId, rating } = req.body;

    if (!userId || !content || !orderId || !productId || !rating) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const data = {
      userId,
      content,
      orderId,
      productId,
      rating,
    };

    const dataProduct = await productModel.ratingProduct(data);
    if (dataProduct.error) {
      return res.status(StatusCodes.BAD_REQUEST).json(dataProduct.detail);
    }
    return res
      .status(StatusCodes.OK)
      .json({ dataProduct, mgs: 'Đánh giá thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateRatingProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, content, orderId, productId, rating } = req.body;

    if (!userId || !content || !orderId || !productId || !rating) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const data = {
      userId,
      content,
      orderId,
      productId,
      rating,
    };

    const dataProduct = await productModel.updateRatingProduct(id, data);

    if (dataProduct.error) {
      return res.status(StatusCodes.BAD_REQUEST).json(dataProduct.detail);
    }
    return res
      .status(StatusCodes.OK)
      .json({ dataProduct, mgs: 'Cập nhật đánh giá thành công' });
  } catch (error) {
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
    await productModel.deleteRating(id);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa đánh giá thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

export const productController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  ratingProduct,
  deleteProduct,
  updateRatingProduct,
  deleteRating,
  getProductBySlug,
  getProductByCategory,
};
