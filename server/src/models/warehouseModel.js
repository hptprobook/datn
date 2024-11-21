import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
    SAVE_WAREHOUSES,
    UPDATE_WAREHOUSES,
} from '~/utils/schema/warehouseSchema';

const validateBeforeCreate = async (data) => {
    return await SAVE_WAREHOUSES.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
    return await UPDATE_WAREHOUSES.validateAsync(data, { abortEarly: false });
};

const createWarehouse = async (data) => {
    const validData = await validateBeforeCreate(data);
    const db = await GET_DB();
    const collection = db.collection('warehouses');
    const result = await collection.insertOne(validData);
    return result;
};

const getWarehousesAll = async () => {
    const db = await GET_DB().collection('warehouses');
    const result = await db
        .find()
        .sort({ createdAt: -1 })
        .toArray();
    return result;
};

const getWarehouseById = async (id) => {
    const db = await GET_DB().collection('warehouses');
    const warehouse = await db.findOne({ _id: new ObjectId(id) });
    return warehouse;
};

const getAllProductsByWareHouse = async (page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('products');
    const total = await db
        .aggregate([
            { $unwind: '$variants' },
            // { $unwind: '$variants.sizes' },
            { $count: 'totalCount' },
        ])
        .toArray();
    const totalCount = total.length > 0 ? total[0].totalCount : 0;
    const results = await db
        .aggregate([
            { $unwind: '$variants' },
            // { $unwind: '$variants.sizes' },
            // {
            //     $match: {
            // 'variants.color': 'Đỏ',
            // sku: '379876',
            //     },
            // },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    sku: '$variants.sku',
                    stockColor: '$variants.stock',
                    color: '$variants.color',
                    sizes: '$variants.sizes',
                },
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ])
        .toArray();
    return { results, total: totalCount };
};

// note
const update = async (id, data) => {
    const db = GET_DB().collection('warehouses');
    const validData = await validateBeforeUpdate(data);
    const result = await db.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: validData },
        { returnDocument: 'after' }
    );
    return result;
};

const deleteWarehouse = async (id) => {
    // const db = GET_DB().collection('warehouses');
    // const warehouse = await db.findOne({ _id: new ObjectId(id) });
    // await db.deleteOne({ _id: new ObjectId(id) });
    // return warehouse;

    const db = GET_DB().collection('warehouses');
    const result = await db.deleteOne({ _id: new ObjectId(id) });
    return result;
};
const getWardByName = async (name, id) => {
    const db = await GET_DB().collection('wards');
    const ward = await db.findOne({
        WardName: { $regex: new RegExp(name, 'i') },
        DistrictID: id
    });
    return ward.WardID;
}
const getDistrictByName = async (name, provinceId) => {
    const db = await GET_DB().collection('districts');
    const district = await db.findOne({
        DistrictName: { $regex: new RegExp(name, 'i') },
        ProvinceID: provinceId
    });
    return district.DistrictID;
}
const getProvinceByName = async (name) => {
    const db = await GET_DB().collection('provinces');
    const province = await db.findOne({
        ProvinceName: { $regex: new RegExp(name, 'i') },
    });
    return province.ProvinceID;
}
export const warehouseModel = {
    getWarehousesAll,
    createWarehouse,
    update,
    getWarehouseById,
    getAllProductsByWareHouse,
    deleteWarehouse,
    getWardByName,
    getProvinceByName,
    getDistrictByName
};
