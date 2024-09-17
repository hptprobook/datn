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

const createProduct = async (req, res) => {
  try {
    const {
      catId,
      name,
      description,
      content,
      tags,
      brandId,
      status,
      productType,
      weight,
      height,
      statusStock,
      variants,
    } = req.body;

    if (
      !name ||
      !description ||
      !catId ||
      !content ||
      !brandId ||
      !status ||
      !weight ||
      !height ||
      !statusStock
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

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

    const thumbnail = path.join(
      'uploads/products',
      req.files['thumbnail'][0].filename
    );

    let filenames = req.files['images'].map((file) => {
      if (file && file.filename) {
        return path.join('uploads/products', file.filename);
      } else {
        throw new Error('File image không hợp lệ');
      }
    });

    const parsedVars = variants.map((v) => JSON.parse(v));

    const slug = createSlug(name);

    const data = {
      catId,
      name: name,
      slug,
      description,
      content,
      tags,
      thumbnail,
      images: filenames,
      brandId,
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
      await uploadModel.deleteImgs(filenames);
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
    catId,
    name,
    description,
    content,
    tags,
    brandId,
    status,
    productType,
    weight,
    height,
    statusStock,
    variants,
    imagesDelete,
  } = req.body;

  if (
    !name ||
    !description ||
    !catId ||
    !content ||
    !brandId ||
    !status ||
    !weight ||
    !height ||
    !statusStock ||
    !variants
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const product = await productModel.getProductById(id);
  const parsedVars = variants.map((v) => JSON.parse(v));

  const slug = createSlug(name);

  let deleteImgs = [];

  let validImgs = [];
  if (imagesDelete && imagesDelete.length > 0) {
    validImgs = product.images.filter((image) =>
      new Set(imagesDelete).has(image)
    );
    deleteImgs = product.images.filter(
      (image) => !new Set(imagesDelete).has(image)
    );
  } else {
    validImgs = product.images;
  }

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

  const thumbnail = path.join(
    'uploads/products',
    req.files['thumbnail'][0].filename
  );

  let filenames = req.files['images'].map((file) => {
    if (file && file.filename) {
      return path.join('uploads/products', file.filename);
    } else {
      throw new Error('File image không hợp lệ');
    }
  });

  const newimgURLs = [...filenames, ...validImgs];

  const data = {
    catId,
    name: name,
    slug,
    description,
    content,
    tags,
    thumbnail,
    images: newimgURLs,
    brandId,
    status,
    variants: parsedVars,
    weight,
    height,
    statusStock,
    productType,
  };

  const dataProduct = await productModel.update(id, data);
  if (dataProduct.error) {
    await uploadModel.deleteImg(thumbnail);
    await uploadModel.deleteImgs(filenames);
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
    if (thumbnail) {
      await uploadModel.deleteImg(product.thumbnail);
    }
    const result = dataProduct.result;
    return res.status(StatusCodes.OK).json({
      message: 'Cập nhật sản phẩm thành công',
      dataProduct: result,
    });
  }
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
};
