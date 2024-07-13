/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { categoryModel } from "~/models/categoryModel";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "~/utils/errorMessage";
import { ObjectId } from "mongodb";

const getCurrentUser = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await categoryModel.getUserID(user_id);

    if (user) {
      return res.status(StatusCodes.OK).json({
        user,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Không tồn tại người dùng" });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json("Có lỗi xảy ra xin thử lại sau");
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await categoryModel.getUserID(id);
    if (user) {
      return res.status(StatusCodes.OK).json({
        user,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Không tồn tại người dùng" });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json("Có lỗi xảy ra xin thử lại sau");
  }
};

const getUserByEmail = async (req, res) => {
  // use
  try {
    const { email } = req.params;
    const user = await categoryModel.getUserEmail(email);
    if (user) {
      return res.status(StatusCodes.OK).json({
        user,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Không tồn tại người dùng" });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json("Có lỗi xảy ra xin thử lại sau");
  }
};

const createCategory = async (req, res) => {
  const { title, name, imageURL, description, slug, parentId } = req.body;
  if (!title) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }
  const conversationId = "sadasdsad";

  const data = {
    title,
    name: name,
    imageURL: conversationId,
  };
  const dataCategory = await categoryModel.createCategory(data);
  // if (dataCategory.acknowledged) {
  //   return res.status(StatusCodes.OK).json({ message: 'Đăng kí thành công' });
  // }
  return res.status(StatusCodes.OK).json({ dataCategory });
  // return res
  //   .status(StatusCodes.BAD_REQUEST)
  //   .json({ message: 'Đăng kí thất bại' });
};

const updateCurrentUser = async (req, res) => {
  const { user_id } = req.user;
  const data = req.body;
  if (data.password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Lỗi bảo mật" });
  }
  const dataUser = await categoryModel.update(user_id, data);
  if (dataUser?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Có lỗi xảy ra xin thử lại sau" });
  }
  if (dataUser) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "Cập nhật thông tin thành công", dataUser });
  }
};
// admin

const getAllUsers = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const user = await categoryModel.getUserAll(pages, limit);
    const countUsers = await categoryModel.countUserAll();
    return res.status(StatusCodes.OK).json({
      user,
      countUsers,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json("Có lỗi xảy ra xin thử lại sau");
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (data.password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Lỗi bảo mật" });
  }
  const dataUser = await categoryModel.update(id, data);
  if (dataUser?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Có lỗi xảy ra xin thử lại sau" });
  }
  if (dataUser) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "Cập nhật thông tin thành công", dataUser });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const dataUser = await categoryModel.deleteUser(id);
  if (dataUser?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Có lỗi xảy ra xin thử lại sau" });
  }
  if (dataUser) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xóa người dùng thành công" });
  }
};
const test = async (req, res) => {
  return res.status(StatusCodes.OK).json({ vip: "vip" });
};

export const categoryController = {
  createCategory,
  test,
  getUserById,
  getCurrentUser,
  getUserByEmail,
  updateCurrentUser,
  updateUser,
  getAllUsers,
  deleteUser,
};
