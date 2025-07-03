import AuthorApi from "./baseAPI/AuthorBaseApi";

class ReportAPI {
  constructor() {
    this.url = "/api/report";
  }
  createNewReport = async (reportInfor) => {
    return AuthorApi.post(`${this.url}/create`, reportInfor);
  };
  
}

export default new ReportAPI();
