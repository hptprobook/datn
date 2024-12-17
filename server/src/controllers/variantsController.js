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

const createManyVariants = async (req, res) => {
  try {
    const variants = req.body;
    const errors = [];
    const successfulVariants = [];

    for (const variantData of variants) {
      try {
        const existingVariant = await variantsModel.getVariantByName(
          variantData.name
        );
        if (variantData._id) {
          if (
            existingVariant &&
            existingVariant._id.toString() !== variantData._id
          ) {
            errors.push({
              name: variantData.name,
              message: 'Biến thể đã tồn tại',
            });
            continue;
          }
          const id = variantData._id;
          delete variantData._id;
          const updatedVariant = await variantsModel.update(id, variantData);
          successfulVariants.push({
            message: 'Cập nhật thành công biến thể: ' + updatedVariant.name,
            data: updatedVariant,
          });
        } else {
          if (existingVariant) {
            errors.push({
              name: variantData.name,
              message: 'Biến thể đã tồn tại',
            });
            continue;
          }

          // Tạo mới biến thể
          const result = await variantsModel.create(variantData);
          successfulVariants.push({
            message: 'Tạo mới thành công biến thể: ' + result.name,
            data: result,
          }); // Lưu lại biến thể thành công
        }
      } catch (error) {
        // Lưu lại lỗi nếu có lỗi xảy ra với biến thể hiện tại
        errors.push({
          name: variantData.name,
          message: error.details
            ? error.details[0].message
            : 'Có lỗi xảy ra khi thêm biến thể',
        });
      }
    }

    // Trả về kết quả
    if (errors.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Một số biến thể không thể thêm được',
        errors,
        successfulVariants,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: 'Tất cả biến thể đã được thêm thành công',
      successfulVariants,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra, xin thử lại sau',
    });
  }
};

export const variantsController = {
  getAllVariants,
  createVariant,
  update,
  deleteVariant,
  deleteAllVariant,
  deleteManyVariant,
  createManyVariants,
};
