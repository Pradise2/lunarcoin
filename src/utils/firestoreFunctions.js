import axios from 'axios';

// Farm Collection Functions
export const addUserToFarm = async (userId, farmData) => {
  try {
    const response = await axios.post('https://lunarapp.thelunarcoin.com/backend/api/farm/add', { userId, farmData });
    return response.data;
  } catch (error) {
    console.error("Error adding user to farm:", error);
    return null;
  }
};

export const getUserFromFarm = async (userId) => {
  try {
    const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/farm/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user from farm:", error);
    return null;
  }
};

