/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { productModal } from '~/models/productModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { ObjectId } from 'mongodb';
import { uploadModal } from '~/models/uploadModel';

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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModal.getProductById(id);
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
    const { cat_id, name, description, price, brand, stock, tags, slug, vars } =
      req.body;

    if (!name || !description || !cat_id || !price || !stock) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const images = req.files['images'];
    const varsImg = req.files['varsImg'];

    let filenames = [];
    if (images) {
      filenames = images.map((file) => file.filename);
    }

    const parsedVars = vars.map((v) => JSON.parse(v));
    varsImg.forEach((file, index) => {
      parsedVars[index].imageURL = file.filename;
    });
    const data = {
      cat_id: new ObjectId(cat_id),
      name: name,
      description: JSON.parse(description),
      imgURLs: filenames,
      price: price,
      brand: brand,
      stock: stock,
      tags: tags,
      slug: slug,
      vars: parsedVars,
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
  const {
    cat_id,
    name,
    description,
    price,
    brand,
    stock,
    tags,
    slug,
    vars,
    imagesDelete,
    indexVars,
  } = req.body;

  if (!name || !description || !cat_id || !price || !stock) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const product = await productModal.getProductById(id);
  const parsedVars = vars.map((v) => JSON.parse(v));
  let deleteImgs = [];

  let validImgs = [];
  if (imagesDelete && imagesDelete.length > 0) {
    validImgs = product.imgURLs.filter((image) =>
      new Set(imagesDelete).has(image)
    );
    deleteImgs = product.imgURLs.filter(
      (image) => !new Set(imagesDelete).has(image)
    );
  } else {
    validImgs = product.imgURLs;
  }
  let deleteImgsVars = [];
  product.vars.map((v, index) => {
    const parsedVar = parsedVars[index];
    if (parsedVar.imageURL !== v.imageURL) {
      deleteImgsVars.push(v.imageURL);
    }
  });

  const images = req.files['imagesAdd'];
  const varsImg = req.files['varsImg'];

  let filenames = [];
  if (images) {
    filenames = images.map((file) => file.filename);
  }

  const newimgURLs = [...filenames, ...validImgs];

  if (varsImg) {
    varsImg.forEach((file, index) => {
      const indexVar = indexVars[index];
      parsedVars[indexVar].imageURL = file.filename;
    });
  }

  const data = {
    cat_id: new ObjectId(cat_id),
    name: name,
    description: JSON.parse(description),
    imgURLs: newimgURLs,
    price: parseFloat(price),
    brand: brand,
    stock: parseFloat(stock),
    tags: tags,
    slug: slug,
    vars: parsedVars,
  };

  const dataProduct = await productModal.update(id, data);
  if (dataProduct?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataProduct) {
    if (deleteImgsVars && deleteImgsVars.length > 0) {
      await uploadModal.deleteImgs(deleteImgsVars);
    }
    if (deleteImgs && deleteImgs.length > 0) {
      await uploadModal.deleteImgs(deleteImgs);
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
    if (dataProduct && dataProduct.imgURLs && dataProduct.imgURLs.length > 0) {
      await uploadModal.deleteImgs(dataProduct.imgURLs);
    }
    if (dataProduct && dataProduct.vars && dataProduct.vars.length > 0) {
      for (const v of dataProduct.vars) {
        await uploadModal.deleteImg(v.imageURL);
      }
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa sản phẩm thành công' });
  }
};

export const productController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
