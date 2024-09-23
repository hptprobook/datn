/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { brandModel } from '~/models/brandModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { createSlug } from '~/utils/createSlug';
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
        message: 'Có lỗi xảy ra, xin thử lại sau'
      });
    }
    return res
      .status(StatusCodes.OK)
      .json(result);
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
    const brands = await brandModel.getBrandsAll();
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
  const { id } = req.params;
  const { name, content, status } = req.body;

  if (!name || !content || !status) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ mgs: 'Ảnh không được để trống' });
  }

  const file = req.file;
  const fileName = file.filename;
  const filePath = path.join('uploads/brands', fileName);

  const brand = await brandModel.getBrandById(id);

  if (!brand) {
    await uploadModel.deleteImg(filePath);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ mgs: 'Thương hiệu chưa được tạo' });
  }

  const slug = createSlug(name);

  const data = {
    name: name,
    slug,
    content: content,
    status: status,
    image: filePath,
  };

  const dataBrand = await brandModel.update(id, data);

  if (dataBrand.error) {
    await uploadModel.deleteImg(filePath);
    return res.status(StatusCodes.BAD_REQUEST).json(dataBrand.detail);
  }

  await uploadModel.deleteImg(brand.image);
  return res
    .status(StatusCodes.OK)
    .json({ dataBrand, mgs: 'Cập nhật thương hiệu thành công' });
};
const deleteBrand = async (req, res) => {
  const { id } = req.params;
  const dataBrand = await brandModel.deleteBrand(id);

  if (dataBrand?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }

  if (dataBrand) {
    if (dataBrand.image) {
      await uploadModel.deleteImg(dataBrand.image);
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa thương hiệu thành công' });
  }
};

export const brandController = {
  getAllBrands,
  createBrand,
  update,
  deleteBrand,
  getBrandById,
  getBrandBySlug,
};
