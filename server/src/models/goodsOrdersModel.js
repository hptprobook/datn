import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_GOODS_ORDERS,
  UPDATE_GOODS_ORDERS,
} from '~/utils/schema/goodsOrdersSchema';

const validateBeforeCreate = async (data) => {
  return await SAVE_GOODS_ORDERS.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_GOODS_ORDERS.validateAsync(data, { abortEarly: false });
};

const getAllGoodsOrders = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  const db = await GET_DB().collection('goodsOrders');
  const result = await db
    .find()
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  return result;
};

const getGoodsOrderById = async (id) => {
  const db = await GET_DB().collection('goodsOrders');
  const result = await db.findOne({
    _id: new ObjectId(id),
  });

  return result;
};

const addOrder = async (dataGoodsOrder) => {
  const validData = await validateBeforeCreate(dataGoodsOrder);
  const db = await GET_DB();
  const collection = db.collection('goodsOrders');
  const data = {
    ...validData,
    userId: new ObjectId(validData.userId),
    warehouseId: new ObjectId(validData.warehouseId),
    supplierId: new ObjectId(validData.supplierId),
    productsList: validData.productsList.map((item) => {
      return {
        ...item,
        _id: new ObjectId(item._id),
      };
    }),
  };
  const result = await collection.insertOne(data);
  return result;
};

const findOrderByCode = async (goodsOrderCode) => {
  const db = await GET_DB().collection('goodsOrders');
  const result = await db.findOne({
    goodsOrderCode: goodsOrderCode,
  });
  return result;
};

const updateOrder = async (id, data) => {
  const validatedData = await validateBeforeUpdate(data);
  const db = GET_DB().collection('goodsOrders');
  validatedData.productsList = validatedData.productsList.map((item) => ({
    ...item,
    _id: new ObjectId(item._id),
  }));
  const result = await db.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...validatedData,
        userId: new ObjectId(validatedData.userId),
        warehouseId: new ObjectId(validatedData.warehouseId),
        supplierId: new ObjectId(validatedData.supplierId),
      },
    },
    { returnDocument: 'after' }
  );
  return result;
};

const getStatusOrder = async (id) => {
  const db = await GET_DB().collection('goodsOrders');
  const result = await db.findOne(
    { _id: new ObjectId(id) },
    { projection: { status: 1 } }
  );
  return result ? result.status : null;
};

const deleteOrder = async (id) => {
  const result = await GET_DB()
    .collection('goodsOrders')
    .deleteOne({
      _id: new ObjectId(id),
    });
  return result;
};

const checkAndUpdateCapacity = async (quantity, id) => {
  const db = await GET_DB().collection('warehouses');

  const result = await db.findOne(
    { _id: new ObjectId(id) },
    { projection: { capacity: 1, currentQuantity: 1 } }
  );

  if (!result) {
    throw new Error('Kho hàng không tồn tại');
  }

  if (result.capacity < result.currentQuantity + quantity) {
    throw new Error('Vượt quá sức chứa của kho');
  }

  const updatedQuantity = result.currentQuantity + quantity;
  await db.updateOne(
    { _id: new ObjectId(id) },
    { $set: { currentQuantity: updatedQuantity } }
  );

  return updatedQuantity;
};

const getCurrentStock = async (productId, color, size) => {
  const db = await GET_DB().collection('products');

  const product = await db.findOne(
    { _id: new ObjectId(productId), 'variants.color': color },
    {
      projection: { 'variants.$': 1 },
    }
  );

  if (!product || !product.variants || product.variants.length === 0) {
    throw new Error(
      'Không tìm thấy sản phẩm hoặc biến thể với thông tin đã cho'
    );
  }

  const variant = product.variants[0];
  const sizeInfo = variant.sizes.find((s) => s.size === size);

  if (!sizeInfo) {
    throw new Error(`Không tìm thấy size ${size} cho màu sắc ${color}`);
  }

  return sizeInfo.stock;
};

const updateStock = async (productId, color, size, quantity) => {
  const db = await GET_DB().collection('products');

  // Lấy sản phẩm và kiểm tra tồn tại của variant
  const product = await db.findOne({ _id: new ObjectId(productId) });
  if (!product) throw new Error('Sản phẩm không tồn tại');

  const variant = product.variants.find((v) => v.color === color);
  if (!variant) throw new Error(`Không tìm thấy variant với màu sắc ${color}`);

  // Xác định stock mới cho color và size
  const updatedVariantStock = variant.stock + quantity;
  const sizeInfo = variant.sizes.find((s) => s.size === size);
  if (!sizeInfo)
    throw new Error(`Không tìm thấy size ${size} cho màu sắc ${color}`);

  const updatedSizeStock = sizeInfo.stock + quantity;

  // Cập nhật stock của color trong variants
  await db.updateOne(
    { _id: new ObjectId(productId), 'variants.color': color },
    {
      $set: { 'variants.$.stock': updatedVariantStock },
    }
  );

  // Cập nhật stock của size trong variants.sizes
  await db.updateOne(
    { _id: new ObjectId(productId), 'variants.color': color },
    {
      $set: { 'variants.$.sizes.$[sizeElement].stock': updatedSizeStock },
    },
    { arrayFilters: [{ 'sizeElement.size': size }] }
  );

  return { colorStock: updatedVariantStock, sizeStock: updatedSizeStock };
};

export const goodsOrdersModel = {
  getAllGoodsOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  checkAndUpdateCapacity,
  updateStock,
  getGoodsOrderById,
  getStatusOrder,
  findOrderByCode,
  getCurrentStock,
};
