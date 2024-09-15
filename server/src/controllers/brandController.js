/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { brandModel } from '~/models/brandModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { createSlug } from '~/utils/createSlug';
import { uploadModal } from '~/models/uploadModal';

const createBrand = async (req, res) => {
  try {
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
    // const fileName = file ? file.filename : null;
    const fileName = file.filename;
    const slug = createSlug(name);

    const data = {
      name,
      slug,
      image: fileName,
      content,
      status,
    };

    const dataBrand = await brandModel.createBrand(data);

    if (dataBrand.error) {
      await uploadModal.deleteImg(fileName);
      return res.status(StatusCodes.BAD_REQUEST).json(dataBrand.detail);
    }
    return res
      .status(StatusCodes.OK)
      .json({ dataBrand, mgs: 'Thêm thương hiệu thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const brands = await brandModel.getBrandsAll(pages, limit);
    const count = await brandModel.countBrandsAll();
    return res.status(StatusCodes.OK).json({
      brands,
      count,
    });
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
      return res.status(StatusCodes.OK).json({
        brand,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại người dùng' });
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
  const brand = await brandModel.getBrandById(id);

  if (!brand) {
    await uploadModal.deleteImg(fileName);
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
    image: fileName,
  };

  const dataBrand = await brandModel.update(id, data);
  if (dataBrand.error) {
    await uploadModal.deleteImg(fileName);
    return res.status(StatusCodes.BAD_REQUEST).json(dataBrand.detail);
  }
  await uploadModal.deleteImg(brand.image);
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
      await uploadModal.deleteImg(dataBrand.image);
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
};
