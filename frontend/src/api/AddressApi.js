import Constants from "expo-constants";
import axios from "axios";

const { extra } = Constants.expoConfig;
const cityApi = extra.cityApi;

const fetchCities = async () => {
  try {
    const response = await axios.get(cityApi);

    return response.data; // Make sure this returns the expected array
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error; // Re-throw the error to handle it in your component
  }
};

const districtsApi = extra.districtsApi;

const fetchDistricts = async (cityId) => {
  try {
    const response = await axios.get(`${districtsApi}?cityId=${cityId}`);
    return response.data; // Adjust according to your API response structure
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error; // Re-throw error to handle it in the calling component
  }
};

const wardsApi = extra.wardsApi;

const fetchWards = async (districtId) => {
  try {
    const response = await axios.get(`${wardsApi}?districtId=${districtId}`);
    return response.data; // Adjust according to your API response structure
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error; // Re-throw error to handle it in the calling component
  }
};

export { fetchWards, fetchDistricts, fetchCities };
