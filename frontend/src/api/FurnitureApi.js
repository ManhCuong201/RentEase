import UnauthorApi from "./baseAPI/UnauthorBaseApi";
import AuthorApi from "./baseAPI/AuthorBaseApi";

class FurnitureAPI {
  constructor() {
    this.url = "/api/furniture";
  }

  getAllFurniture = async () => {
    return UnauthorApi.get(`${this.url}`);
  };
  
}

export default new FurnitureAPI();
