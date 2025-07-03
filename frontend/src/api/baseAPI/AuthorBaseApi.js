import axios from "axios";
import apiConfig from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const axiosClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers,
});

// Interceptor cho request, thêm token vào header Authorization
axiosClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor cho response, xử lý các trường hợp lỗi
axiosClient.interceptors.response.use(
  (response) => {
    if (response !== undefined && response.data !== undefined) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    const navigation = useNavigation();
    console.error(error);

    // Not Found (404)
    if (error.response && error.response.status === 404) {
      Alert.alert("Error", "Resource not found");
      navigation.navigate("NotFoundScreen");
    }

    // // Token hết hạn (401)
    // if (error.response && error.response.status === 401) {
    //     const originalRequest = error.config;
    //     await AuthApi.refreshToken(); // Gọi API để refresh token
    //     return axiosClient(originalRequest); // Thử lại request với token mới
    // }

    // Không có quyền truy cập (403)
    if (error.response && error.response.status === 403) {
      Alert.alert(
        "Forbidden",
        "You do not have permission to access this resource"
      );
      navigation.navigate("ForbiddenScreen"); // Điều hướng đến màn hình 403
    }

    // Lỗi máy chủ nội bộ (500)
    if (error.response && error.response.status === 500) {
      Alert.alert("Server Error", "Internal server error occurred");
      navigation.navigate("ServerErrorScreen");
    }

    // Xử lý lỗi khác
    throw error;
  }
);

export default axiosClient;
