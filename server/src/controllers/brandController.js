/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { brandModel } from '~/models/brandModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModel } from '~/models/uploadModel';
import path from 'path';

const createBrand = async (req, res) => {
  try {
    const data = req.body;
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Ảnh không được để trống' });
    }
    const file = req.file;
    const fileName = file.filename;
    const filePath = path.join('uploads/brands', fileName);

    data.image = filePath;

    const result = await brandModel.create(data);

    if (!result) {
      await uploadModel.deleteImg(filePath);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Có lỗi xảy ra, xin thử lại sau',
      });
    }
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const file = req.file;
    if (file) {
      const fileName = file.filename;
      const filePath = path.join('uploads/brands', fileName);
      await uploadModel.deleteImg(filePath);
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const brands = await brandModel.getBrandsAll(pages, limit);
    return res.status(StatusCodes.OK).json(brands);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await brandModel.getBrandById(id);
    if (brand) {
      return res.status(StatusCodes.OK).json(brand);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại thương hiệu' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getBrandBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const brand = await brandModel.getBrandBySlug(slug);
    if (brand) {
      return res.status(StatusCodes.OK).json({
        brand,
      });
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại thương hiệu' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!req.file) {
      const dataBrand = await brandModel.update(id, data);
      return res.status(StatusCodes.OK).json(dataBrand.data);
    }
    const file = req.file;
    const fileName = file.filename;
    const filePath = path.join('uploads/brands', fileName);
    data.image = filePath;

    const dataBrand = await brandModel.update(id, data);

    await uploadModel.deleteImg(dataBrand.image);
    return res.status(StatusCodes.OK).json(dataBrand.data);
  } catch (error) {
    if (req.file) {
      const file = req.file;
      const fileName = file.filename;
      const filePath = path.join('uploads/brands', fileName);
      await uploadModel.deleteImg(filePath);
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await brandModel.deleteBrand(id);

    if (data) {
      if (data.image) {
        await uploadModel.deleteImg(data.image);
      }
      return res.status(StatusCodes.OK).json(data.brands);
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteAllBrand = async (req, res) => {
  try {
    const result = await brandModel.deleteAllBrands();

    if (result) {
      result.map((result) => {
        uploadModel.deleteImg(result.image);
      });

      return res.status(StatusCodes.OK).json({ message: 'Xóa thành công' });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteManyBrand = async (req, res) => {
  try {
    const { ids } = req.body;

    const { images } = await brandModel.deleteManyBrands(ids);

    uploadModel.deleteImgs(images);

    return res.status(StatusCodes.OK).json({
      message: 'Xóa thành công',
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const brandController = {
  getAllBrands,
  createBrand,
  update,
  deleteBrand,
  getBrandById,
  getBrandBySlug,
  deleteAllBrand,
  deleteManyBrand,
};
