import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_GOODS_ORDERS,
  UPDATE_GOODS_ORDERS,
} from '~/utils/schema/warehouseReceiptSchema';

const validateBeforeCreate = async (data) => {
  return await SAVE_GOODS_ORDERS.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_GOODS_ORDERS.validateAsync(data, { abortEarly: false });
};

const getAllGoodsOrders = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  const db = await GET_DB().collection('warehouseReceipt');
  const count = await db.countDocuments();
  const result = await db
    .find()
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  return {
    result,
    count
  };
};

const getGoodsOrderById = async (id) => {
  const db = await GET_DB().collection('warehouseReceipt');
  const result = await db.findOne({
    _id: new ObjectId(id),
  });

  return result;
};

const add = async (dataGoodsOrder) => {
  const validData = await validateBeforeCreate(dataGoodsOrder);
  const db = await GET_DB();
  const collection = db.collection('warehouseReceipt');
  const data = {
    ...validData,
    staffId: new ObjectId(validData.staffId),
    warehouseId: new ObjectId(validData.warehouseId),
    supplierId: new ObjectId(validData.supplierId),
    // productsList: validData.productsList.map((item) => {
    //   return {
    //     ...item,
    //     _id: new ObjectId(item._id),
    //   };
    // }),
  };
  const result = await collection.insertOne(data);
  return result;
};

const findBy = async (by, value) => {
  const db = await GET_DB().collection('warehouseReceipt');
  if (by === '_id') {
    value = new ObjectId(value);
  }
  const result
    = await db.findOne({
      [by]: value
    });
  return result;
};

const update = async (id, data) => {
  const validatedData = await validateBeforeUpdate(data);
  const db = GET_DB().collection('warehouseReceipt');
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
  const db = await GET_DB().collection('warehouseReceipt');
  const result = await db.findOne(
    { _id: new ObjectId(id) },
    { projection: { status: 1 } }
  );
  return result ? result.status : null;
};

const remove = async (id) => {
  const result = await GET_DB()
    .collection('warehouseReceipt')
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

const getCurrentStock = async (productId, sku, size) => {
  const db = await GET_DB().collection('products');

  const product = await db.findOne(
    { _id: new ObjectId(productId), 'variants.sku': sku },
    {
      projection: { 'variants': 1 },
    }
  );

  if (!product || !product.variants || product.variants.length === 0) {
    throw new Error(
      'Không tìm thấy sản phẩm hoặc biến thể với thông tin đã cho'
    );
  }
  const variant = product.variants.find((v) => v.sku === sku);
  if (!variant) {
    throw new Error(`Không tìm thấy biến thể với sku ${sku}`);
  }
  const sizeInfo = variant.sizes.find((s) => s.size === size);
  if (!sizeInfo) {
    throw new Error(`Không tìm thấy size ${size} cho sản phẩm có mã ${sku}`);
  }
  return sizeInfo.stock;
};

const updateStock = async (sku, size, quantity) => {
  const db = await GET_DB().collection('products');
  // Lấy sản phẩm và kiểm tra tồn tại của variant
  const product = await db.findOne({
    variants: { $elemMatch: { sku: sku } }
  });
  if (!product) throw new Error('Sản phẩm không tồn tại');

  // Xác định stock mới cho color và size
  const variant = product.variants.find((v) => v.sku === sku);
  const updatedVariantStock = variant.stock + quantity;
  const sizeInfo = variant.sizes.find((s) => s.size === size);
  if (!sizeInfo)
    throw new Error(`Không tìm thấy size ${size} cho màu sắc ${variant.color}`);

  const updatedSizeStock = sizeInfo.stock + quantity;

  // Cập nhật stock của color trong variants
  const variantsUpdate = product.variants.map((v) => {
    if (v.sku === sku) {
      return {
        ...v, stock: updatedVariantStock, sizes: v.sizes.map((s) => {
          if (s.size === size) {
            return { ...s, stock: updatedSizeStock };
          }
          return s;
        }
        )
      };
    }
    return v;
  });


  // Cập nhật stock của size trong variants.sizes
  await db.updateOne(
    { _id: new ObjectId(product._id) },
    {
      $set: {
        variants: variantsUpdate
      }
    },
  );
  return product._id;
};

export const warehouseReceiptModel = {
  getAllGoodsOrders,
  add,
  update,
  remove,
  checkAndUpdateCapacity,
  updateStock,
  getGoodsOrderById,
  getStatusOrder,
  findBy,
  getCurrentStock,
};
