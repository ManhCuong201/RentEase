import UnauthorBaseApi from "./baseAPI/UnauthorBaseApi";

class NotificationApi {
  constructor() {
    this.url = "/api/notification";
  }
  viewNotificationByUserId = async (userId) => {
    return UnauthorBaseApi.get(`${this.url}/get_by_userId/${userId}`);
  };
}

export default new NotificationApi();
