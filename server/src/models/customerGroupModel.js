import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
    SAVE_CUSTOMER_GROUP,
    UPDATE_CUSTOMER_GROUP,
    UPDATE_USER_CUSTOMER_GROUP,
} from '~/utils/schema/customerGroupSchema';

const validateBeforeCreate = async (data) => {
    return await SAVE_CUSTOMER_GROUP.validateAsync(data, { abortEarly: false });
};

const getAllCG = async (page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('customerGroup');
    const result = await db
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        // .project({ _id: 0, age:1 })
        .toArray();
    return result;
};

const findOneCG = async (idCG) => {
    const db = await GET_DB().collection('customerGroup');
    const result = await db.findOne({ _id: new ObjectId(idCG) });
    return result;
};

const createCG = async (dataCG) => {
    const validData = await validateBeforeCreate(dataCG);
    const db = await GET_DB();
    const collection = db.collection('customerGroup');
    const result = await collection.insertOne(validData);
    return result;
};

const validateBeforeUpdate = async (data) => {
    return await UPDATE_CUSTOMER_GROUP.validateAsync(data, {
        abortEarly: false,
    });
};

const updateCG = async (id, dataCG) => {
    const data = await validateBeforeUpdate(dataCG);
    const db = await GET_DB();
    const collection = db.collection('customerGroup');
    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' }
    );
    return result;
};

const validateBeforeAddCustomer = async (data) => {
    return await UPDATE_USER_CUSTOMER_GROUP.validateAsync(data, {
        abortEarly: false,
    });
};
// List customer
const addUsersCG = async (id, listUser) => {
    const data = await validateBeforeAddCustomer(listUser);
    const newData = data.map((user) => ({
      ...user,
      id: new ObjectId(user.id),
    }));
    const db = await GET_DB();
    const collection = db.collection('customerGroup');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $push: { listCustomer: { $each: newData } } },
      { returnDocument: 'after' }
    );
    return result;
  };

const delCustomers = async (id, listUser) => {
    const db = await GET_DB();
    const collection = db.collection('customerGroup');
    const data = await validateBeforeAddCustomer(listUser);
    const newData = data.map((user) => ({
        ...user,
        id: new ObjectId(user.id),
    }));
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $pull: { listCustomer: { $in: newData } } },
        { returnDocument: 'after' }
    );
    return result;
};

const delOnceCustomer = async (id, idUser) => {
    const db = await GET_DB();
    const collection = db.collection('customerGroup');
    const newId = new ObjectId(idUser);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { listCustomer: { id: newId } } },
      { returnDocument: 'after' }
    );
    return result;
  };
const deleteCG = async (idCG) => {
    const db = GET_DB().collection('customerGroup');
    const result = await db.deleteOne({ _id: new ObjectId(idCG) });
    return result;
};

export const customerGroupModel = {
    getAllCG,
    createCG,
    updateCG,
    deleteCG,
    findOneCG,
    addUsersCG,
    delCustomers,
    delOnceCustomer,
};
