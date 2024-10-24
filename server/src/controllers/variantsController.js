import { StatusCodes } from 'http-status-codes';
import { variantsModel } from '~/models/variantsModel';

const getAllVariants = async (req, res) => {
  try {
    const variants = await variantsModel.getVariantAll();
    return res.status(StatusCodes.OK).json(variants);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const createVariant = async (req, res) => {
  try {
    const data = req.body;
    const formattedName = data.name.toLowerCase().replace(/\s+/g, '_');
    data.name = formattedName;
    const variant = await variantsModel.getVariantByName(data.name);
    if (variant) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Biến thể đã tồn tại',
      });
    }
    const result = await variantsModel.create(data);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const formattedName = data.name.toLowerCase().replace(/\s+/g, '_');
    data.name = formattedName;
    const variant = await variantsModel.getVariantById(id);
    if (!variant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Biến thể không tồn tại',
      });
    }

    if (data.name && data.name !== variant.name) {
      const existingBrand = await variantsModel.getVariantByName(data.name);
      if (existingBrand) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Tên biến thể đã tồn tại',
        });
      }
    }

    const dataVariant = await variantsModel.update(id, data);
    return res.status(StatusCodes.OK).json(dataVariant.data);
  } catch (error) {
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

const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await variantsModel.deleteVariant(id);

    if (data) {
      return res.status(StatusCodes.OK).json({ message: 'Xóa thành công' });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteAllVariant = async (req, res) => {
  try {
    const result = await variantsModel.deleteAllVariant();

    if (result) {
      return res.status(StatusCodes.OK).json({ message: 'Xóa thành công' });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteManyVariant = async (req, res) => {
  try {
    const { ids } = req.body;

    const result = await variantsModel.deleteManyVariants(ids);
    if (result) {
      return res.status(StatusCodes.OK).json({ message: 'Xóa thành công' });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const variantsController = {
  getAllVariants,
  createVariant,
  update,
  deleteVariant,
  deleteAllVariant,
  deleteManyVariant,
};
