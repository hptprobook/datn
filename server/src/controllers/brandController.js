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
    const brand = await brandModel.getBrandBySlug(data.slug);
    if (brand) {
      uploadModel.deleteImg(filePath);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Thương hiệu đã tồn tại',
      });
    }
    const result = await brandModel.create(data);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    if (req.file) {
      uploadModel.deleteImg(req.file.path);
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
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Ảnh không được để trống' });
    }
    const file = req.file;
    const fileName = file.filename;
    const filePath = path.join('uploads/brands', fileName);

    const brand = await brandModel.getBrandById(id);
    if (!brand) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Thương hiệu không tồn tại',
      });
    }

    if (data.slug && data.slug !== brand.slug) {
      const existingBrand = await brandModel.getBrandBySlug(data.slug);
      if (existingBrand) {
        uploadModel.deleteImg(filePath);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Thương hiệu đã tồn tại',
        });
      }
    }

    const dataBrand = await brandModel.update(id, data);
    uploadModel.deleteImg(brand.image);

    return res.status(StatusCodes.OK).json(dataBrand.data);
  } catch (error) {
    if (req.file) {
      uploadModel.deleteImg(req.file.path);
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
