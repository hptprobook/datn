/* eslint-disable */

import { redisClient } from '~/server';

const CART_QUEUE_KEY = 'cart:queue';
const CART_PROCESSING_KEY = 'cart:processing';
const ORDER_QUEUE_KEY = 'order:queue';
const ORDER_PROCESSING_KEY = 'order:processing';

export const redisUtils = {
  // Cache data with expiration
  async setCache(key, data, expireSeconds = 3600) {
    try {
      await redisClient.setEx(key, expireSeconds, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Redis setCache error:', error);
      return false;
    }
  },

  // Get cached data
  async getCache(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis getCache error:', error);
      return null;
    }
  },

  // Delete cache
  async deleteCache(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis deleteCache error:', error);
      return false;
    }
  },

  // Add operation to queue
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
      console.error('Redis addToCartQueue error:', error);
      return false;
    }
  },

  // Get and move operation from queue to processing
  async processCartQueue() {
    try {
      const item = await redisClient.rPopLPush(
        CART_QUEUE_KEY,
        CART_PROCESSING_KEY
      );
      if (!item) return null;

      return JSON.parse(item);
    } catch (error) {
      console.error('Redis processCartQueue error:', error);
      return null;
    }
  },

  // Mark operation as completed
  async completeCartOperation() {
    try {
      await redisClient.lPop(CART_PROCESSING_KEY);
      return true;
    } catch (error) {
      console.error('Redis completeCartOperation error:', error);
      return false;
    }
  },

  // Retry operation by moving it back to queue
  async retryCartOperation(order) {
    try {
      await redisClient.lPush(CART_QUEUE_KEY, JSON.stringify(order));
      return true;
    } catch (error) {
      console.error('Redis retryCartOperation error:', error);
      return false;
    }
  },

  // Get the length of the queue
  async getQueueLength() {
    try {
      return await redisClient.lLen(CART_QUEUE_KEY);
    } catch (error) {
      console.error('Redis getQueueLength error:', error);
      return 0;
    }
  },

  // Get the length of the processing queue
  async getProcessingLength() {
    try {
      return await redisClient.lLen(CART_PROCESSING_KEY);
    } catch (error) {
      console.error('Redis getProcessingLength error:', error);
      return 0;
    }
  },

  // Clear the entire queue (for debugging or maintenance)
  async clearQueue() {
    try {
      await redisClient.del(CART_QUEUE_KEY);
      return true;
    } catch (error) {
      console.error('Redis clearQueue error:', error);
      return false;
    }
  },

  // Clear the processing queue
  async clearProcessingQueue() {
    try {
      await redisClient.del(CART_PROCESSING_KEY);
      return true;
    } catch (error) {
      console.error('Redis clearProcessingQueue error:', error);
      return false;
    }
  },

  // Add order to queue
  async addToOrderQueue(orderData) {
    try {
      const queueItem = {
        id: Date.now().toString(),
        orderData,
        timestamp: new Date().toISOString(),
      };
      await redisClient.lPush(ORDER_QUEUE_KEY, JSON.stringify(queueItem));
      return true;
    } catch (error) {
      console.error('Redis addToOrderQueue error:', error);
      return false;
    }
  },

  // Process order from queue
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

  // Complete order processing
  async completeOrderOperation() {
    try {
      await redisClient.lPop(ORDER_PROCESSING_KEY);
      return true;
    } catch (error) {
      console.error('Redis completeOrderOperation error:', error);
      return false;
    }
  },

  // Retry order operation by moving it back to queue
  async retryOrderOperation(order) {
    try {
      await redisClient.lPush(ORDER_QUEUE_KEY, JSON.stringify(order));
      return true;
    } catch (error) {
      console.error('Redis retryOrderOperation error:', error);
      return false;
    }
  },

  // Get the length of the order queue
  async getOrderQueueLength() {
    try {
      return await redisClient.lLen(ORDER_QUEUE_KEY);
    } catch (error) {
      console.error('Redis getOrderQueueLength error:', error);
      return 0;
    }
  },

  // Clear the order queue
  async clearOrderQueue() {
    try {
      await redisClient.del(ORDER_QUEUE_KEY);
      return true;
    } catch (error) {
      console.error('Redis clearOrderQueue error:', error);
      return false;
    }
  },

  // Clear the order processing queue
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
