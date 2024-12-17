/* eslint-disable */

import { redisClient } from '~/server';

const CART_QUEUE_KEY = 'cart:queue';
const CART_PROCESSING_KEY = 'cart:processing';
const ORDER_QUEUE_KEY = 'order:queue';
const ORDER_PROCESSING_KEY = 'order:processing';

export const redisUtils = {
  // xét cache với thời gian hết hạn
  async setCache(key, data, expireSeconds = 3600) {
    try {
      await redisClient.setEx(key, expireSeconds, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Lỗi xảy ra khi xét cache:', error);
      return false;
    }
  },

  // lấy dữ liệu cache
  async getCache(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Lỗi xảy ra khi lấy dữ liệu cache:', error);
      return null;
    }
  },

  // xóa cache
  async deleteCache(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Lỗi xảy ra khi xóa cache:', error);
      return false;
    }
  },

  // thêm giỏ hàng vào hàng đợi
  async addToCartQueue(orderData) {
    try {
      const queueItem = {
        id: Date.now().toString(),
        orderData,
        timestamp: new Date().toISOString(),
      };
      await redisClient.lPush(CART_QUEUE_KEY, JSON.stringify(queueItem));
      return true;
    } catch (error) {
      console.error('Lỗi xảy ra khi thêm giỏ hàng vào hàng đợi:', error);
      return false;
    }
  },

  // lấy và di chuyển giỏ hàng từ hàng đợi để xử lý
  async processCartQueue() {
    try {
      const item = await redisClient.rPopLPush(
        CART_QUEUE_KEY,
        CART_PROCESSING_KEY
      );
      if (!item) return null;

      return JSON.parse(item);
    } catch (error) {
      console.error(
        'Lỗi xảy ra khi lấy và di chuyển giỏ hàng từ hàng đợi để xử lý:',
        error
      );
      return null;
    }
  },

  // đánh dấu giỏ hàng đã được xử lý
  async completeCartOperation() {
    try {
      await redisClient.lPop(CART_PROCESSING_KEY);
      return true;
    } catch (error) {
      console.error('Lỗi xảy ra khi đánh dấu giỏ hàng đã được xử lý:', error);
      return false;
    }
  },

  // đưa giỏ hàng trở lại hàng đợi
  async retryCartOperation(order) {
    try {
      await redisClient.lPush(CART_QUEUE_KEY, JSON.stringify(order));
      return true;
    } catch (error) {
      console.error('Lỗi xảy ra khi thử lại giỏ hàng:', error);
      return false;
    }
  },

  // lấy độ dài của hàng đợi
  async getQueueLength() {
    try {
      return await redisClient.lLen(CART_QUEUE_KEY);
    } catch (error) {
      console.error('Lỗi xảy ra khi lấy độ dài của hàng đợi:', error);
      return 0;
    }
  },

  // lấy độ dài của hàng đợi xử lý
  async getProcessingLength() {
    try {
      return await redisClient.lLen(CART_PROCESSING_KEY);
    } catch (error) {
      console.error('Lỗi xảy ra khi lấy độ dài của hàng đợi xử lý:', error);
      return 0;
    }
  },

  // xóa hàng đợi hoàn toàn (dành cho debug hoặc bảo trì)
  async clearQueue() {
    try {
      await redisClient.del(CART_QUEUE_KEY);
      return true;
    } catch (error) {
      console.error('Lỗi xảy ra khi xóa hàng đợi hoàn toàn:', error);
      return false;
    }
  },

  // xóa hàng đợi xử lý
  async clearProcessingQueue() {
    try {
      await redisClient.del(CART_PROCESSING_KEY);
      return true;
    } catch (error) {
      console.error('Lỗi xảy ra khi xóa hàng đợi xử lý:', error);
      return false;
    }
  },

  // thêm đơn hàng vào hàng đợi
  async addToOrderQueue(orderData) {
    try {
      const queueItem = {
        id: Date.now().toString(),
        orderData,
        timestamp: new Date().toISOString(),
      };
      await redisClient.lPush(ORDER_QUEUE_KEY, JSON.stringify(queueItem));
      console.log(
        `[Order Queue] Thêm đơn hàng vào hàng đợi thành công: ${queueItem.id}`
      );
      return true;
    } catch (error) {
      console.error('[Order Queue] Thêm đơn hàng vào hàng đợi lỗi:', error);
      return false;
    }
  },

  // lấy và di chuyển đơn hàng từ hàng đợi để xử lý
  async processOrderQueue() {
    try {
      const item = await redisClient.rPopLPush(
        ORDER_QUEUE_KEY,
        ORDER_PROCESSING_KEY
      );
      if (!item) return null;

      return JSON.parse(item);
    } catch (error) {
      console.error('Redis processOrderQueue error:', error);
      return null;
    }
  },

  // đánh dấu đơn hàng đã được xử lý
  async completeOrderOperation() {
    try {
      await redisClient.lPop(ORDER_PROCESSING_KEY);
      return true;
    } catch (error) {
      console.error('Redis completeOrderOperation error:', error);
      return false;
    }
  },

  // đưa đơn hàng trở lại hàng đợi
  async retryOrderOperation(order) {
    try {
      await redisClient.lPush(ORDER_QUEUE_KEY, JSON.stringify(order));
      return true;
    } catch (error) {
      console.error('Redis retryOrderOperation error:', error);
      return false;
    }
  },

  // lấy độ dài của hàng đợi
  async getOrderQueueLength() {
    try {
      return await redisClient.lLen(ORDER_QUEUE_KEY);
    } catch (error) {
      console.error('Redis getOrderQueueLength error:', error);
      return 0;
    }
  },

  // xóa hàng đợi
  async clearOrderQueue() {
    try {
      await redisClient.del(ORDER_QUEUE_KEY);
      return true;
    } catch (error) {
      console.error('Redis clearOrderQueue error:', error);
      return false;
    }
  },

  // xóa hàng đợi xử lý
  async clearOrderProcessingQueue() {
    try {
      await redisClient.del(ORDER_PROCESSING_KEY);
      return true;
    } catch (error) {
      console.error('Redis clearOrderProcessingQueue error:', error);
      return false;
    }
  },
};
