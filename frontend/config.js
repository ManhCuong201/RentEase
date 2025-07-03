import Constants from "expo-constants";

const rentEaseApi = Constants.expoConfig.extra.rentEaseApi;
const cityApi = Constants.expoConfig.extra.cityApi;
const districtsApi = Constants.expoConfig.extra.districtsApi;
const wardsApi = Constants.expoConfig.extra.wardsApi;

const apiConfig = {
  cityApi: cityApi,
  districtsApi: districtsApi,
  wardsApi: wardsApi,
  baseURL: rentEaseApi,
  headers: {
    "Content-Type": "application/json",
  },
};

export default apiConfig;
