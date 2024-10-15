import { StatusCodes } from 'http-status-codes';
import { hotSearchModel } from '~/models/hotSearchModel';

const getHotSearch = async (req, res) => {
  try {
    const hotSearch = await hotSearchModel.getHotSearch();
    return res.status(StatusCodes.OK).json(hotSearch);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const createHotSearch = async (req, res) => {
  try {
    const keyword = req.body.keyword.trim();
    console.log(keyword);
    let hotSearch = await hotSearchModel.findHotSearchByKeyword(keyword);
    console.log(hotSearch);

    if (hotSearch) {
      hotSearch = await hotSearchModel.plusCountHotSearch(hotSearch._id);
    } else {
      hotSearch = await hotSearchModel.createHotSearch({ keyword });
    }

    return res.status(StatusCodes.OK).json(hotSearch);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const deleteHotSearch = async (req, res) => {};

const updateHotSearch = async (req, res) => {};

const plusCountHotSearch = async (req, res) => {};

export const hotSearchController = {
  getHotSearch,
  createHotSearch,
  deleteHotSearch,
  updateHotSearch,
  plusCountHotSearch,
};
