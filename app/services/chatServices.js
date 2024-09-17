import apiClient, { CREATE_CHAT, GET_CHAT_HISTORY, CREATE_BOT_ANSWER } from './setting'

// Service to create a new bot
export const createMessage = async (payload) => {
  try {
    const response = await apiClient.post(CREATE_CHAT, payload)
    return response.data
  } catch (error) {
    throw new Error(error.response ? error.response.data.msg : error.message)
  }
}

// Service to update an existing bot
export const updateBot = async (id, name, icon, prompt) => {
  try {
    const response = await apiClient.put(`/bot/${id}`, { name, icon, prompt })
    return response.data
  } catch (error) {
    throw new Error(error.response ? error.response.data.msg : error.message)
  }
}

// Service to get a bot by ID
export const getBotById = async (id) => {
  try {
    const response = await apiClient.get(`/bot/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response ? error.response.data.msg : error.message)
  }
}


export const getChatHistoryByUserIdAndBot = async (payload) => {
  try {
    const { botId } = payload
    const response = await apiClient.get(`${GET_CHAT_HISTORY}/${botId}`)
    return response.data
  } catch (error) {
    console.error('message', error)
    throw new Error(error.response ? error.response.data.msg : error.message)
  }
}

export const getChatLatest = async () => {
  try {
    const response = await apiClient.get(`${GET_CHAT_HISTORY}/message/latest`)
    return response.data
  } catch (error) {
    console.error('message', error)
    throw new Error(error.response ? error.response.data.msg : error.message)
  }
}

export const createAnswerFromBot = async (payload) => {
  try {
    const response = await apiClient.post(CREATE_BOT_ANSWER, payload)
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error(error.response ? error.response.data.msg : error.message)
  }
}