import axios from "axios";
import apiConfig from "../../../config.js";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const axiosClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers,
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response !== undefined && response.data !== undefined) {
      // Get all response
      return response.data;
    }
    return response;
  },
  async (error) => {
    // // Refresh token is expired
    // if (error.response && error.response.status === 404) {
    //   await AsyncStorage.clear(); 
    //   throw new Error('Token expired or not found'); 
    // }

    // Unauthorized
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized error:", error);
      throw new Error("Either email address or password is incorrect. Please try again");
    }

    // Handle other errors
    throw error;
  }
);

export const get = (url, params = {}) => {
  return axiosClient.get(url, { params });
};

export default axiosClient;
