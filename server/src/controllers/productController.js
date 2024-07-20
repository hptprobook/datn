/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { productModal } from '~/models/productModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { ObjectId } from 'mongodb';
import { uploadModal } from '~/models/uploadModal';

const getAllProducts = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const products = await productModal.getProductsAll(pages, limit);
    const countProducts = await productModal.countProductAll();
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

const createProduct = async (req, res) => {
  try {
    const { cat_id, name, description, price, brand, stock, tags, slug, vars } =
      req.body;

    if (!name || !description || !cat_id || !price || !stock) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const files = req.files;
    let filenames = [];
    if (files) {
      filenames = files.map((file) => file.filename);
    }

    const parsedVars = vars.map((v) => JSON.parse(v));
    const updatedVars = parsedVars.map((v) => ({
      ...v,
      stock: v.stock.toString(),
    }));

    const data = {
      cat_id: cat_id,
      name: name,
      description: JSON.parse(description),
      imgURLs: filenames,
      price: price,
      brand: brand,
      stock: stock,
      tags: tags,
      slug: slug,
      vars: updatedVars,
    };
    const dataProduct = await productModal.createProduct(data);

    return res.status(StatusCodes.OK).json({ dataProduct });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { cat_id, name, description, price, brand, stock, tags, slug, vars } =
    req.body;

  if (!name || !description || !cat_id || !price || !stock) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const files = req.files;
  let filenames = [];
  if (files) {
    filenames = files.map((file) => file.filename);
  }

  const parsedVars = vars.map((v) => JSON.parse(v));
  const updatedVars = parsedVars.map((v) => ({
    ...v,
    stock: v.stock.toString(),
  }));

  const data = {
    cat_id: cat_id,
    name: name,
    description: JSON.parse(description),
    imgURLs: filenames,
    price: price,
    brand: brand,
    stock: stock,
    tags: tags,
    slug: slug,
    vars: updatedVars,
  };

  const dataProduct = await productModal.update(id, data);
  if (dataProduct?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataProduct) {
    if (
      dataProduct &&
      dataProduct.imageURL.length > 0 &&
      filenames.length > 0
    ) {
      await uploadModal.deleteImgs(dataProduct.imageURL);
    }
    const result = dataProduct.result;
    return res.status(StatusCodes.OK).json({
      message: 'Cập nhật thông tin thành công',
      dataProduct: result,
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const dataProduct = await productModal.deleteProduct(id);
  if (dataProduct?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataProduct) {
    if (dataProduct && dataProduct.length > 0) {
      await uploadModal.deleteImgs(dataProduct);
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa sản phẩm thành công' });
  }
};

export const productController = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
