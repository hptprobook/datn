import { GET_DB } from '~/config/mongodb';
const getProvinces = async() => {
    const db = await GET_DB();
    const collection = db.collection('provinces');
    const result = await collection.find().toArray();
    return result;
};
const getDistricts = async(ProvinceID) => {
    const db = await GET_DB();
    const collection = db.collection('districts');
    const result = await collection
        .find({
            ProvinceID: Number(ProvinceID),
        })
        .toArray();
    return result;
};
const getWards = async(DistrictID) => {
    const db = await GET_DB();
    const collection = db.collection('wards');
    const result = await collection
        .find({
            DistrictID: Number(DistrictID),
        })
        .toArray();
    return result;
};
export const addressModel = {
    getProvinces,
    getDistricts,
    getWards,
};