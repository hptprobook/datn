import apiClient from './setting'

// Service to create a new bot
export const createBot = async (name, icon, prompt) => {
  try {
    const response = await apiClient.post('/bot', { name, icon, prompt });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.msg : error.message);
  }
};

// Service to update an existing bot
export const updateBot = async (id, name, icon, prompt) => {
  try {
    const response = await apiClient.put(`/bot/${id}`, { name, icon, prompt });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.msg : error.message);
  }
};

// Service to get a bot by ID
export const getBotById = async (id) => {
  try {
    const response = await apiClient.get(`/bot/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.msg : error.message);
  }
};

export const getAllBots = async () => {
  try {
    const response = await apiClient.get('/bot');
    return response.data;
  } catch (error) {
    console.error("message",error)
    throw new Error(error.response ? error.response.data.msg : error.message);
  }
};
