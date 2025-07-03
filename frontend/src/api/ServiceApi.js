import UnauthorApi from "./baseAPI/UnauthorBaseApi";
import AuthorApi from "./baseAPI/AuthorBaseApi";

class ServiceAPI {
  constructor() {
    this.url = "/api/service";
  }

  getAllService = async () => {
    return UnauthorApi.get(`${this.url}`);
  };
  
}

export default new ServiceAPI();
