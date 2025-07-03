import UnauthorApi from "./baseAPI/UnauthorBaseApi";
import AuthorApi from "./baseAPI/AuthorBaseApi";

class PostAPI {
  constructor() {
    this.url = "/api/post";
  }

  getPostDetailById = async (id) => {
    return UnauthorApi.get(`${this.url}/detail/${id}`);
  };

  getPostDetailByIdOnMap = async (id) => {
    return UnauthorApi.get(`${this.url}/on_map/detail/${id}`);
  };

  getAllPostInfoOnMap = async (id) => {
    return UnauthorApi.get(`${this.url}/on_map/all_post`);
  };

  getAllPostInfo = async (id) => {
    return UnauthorApi.get(`${this.url}/all_post`);
  };

  get5NewestPinnedPost = async (id) => {
    return UnauthorApi.get(`${this.url}/post-pin`);
  };

  getAllPostByOwnerId = async (userId, searchText, status) => {
    return AuthorApi.get(`${this.url}/post-manager`, {
      params: {
        userId: userId, // Sửa từ id thành userId
        searchText: searchText,
        status: status,
      },
    });
  };

  getPostBySearch = async (searchKey, numberOfRoom, furniture, service, orderBy, priceRange, cityId) => {
    const body = {
      searchKey,
      numberOfRoom,
      furniture,
      service,
      orderBy,
      priceRange,
      cityId
    };
    return UnauthorApi.post(`${this.url}/search_post`, body);
  };


  getAllPostInfoOnMapByUser = async (userId, status) => {
    return UnauthorApi.get(`${this.url}/on_map/manager`, {
      params: {
        userId: userId, // Sửa từ id thành userId
        status: status,
      },
    });
  };

  createPost = async (formData) => {
    return AuthorApi.post(`${this.url}`, formData);
  };

  getPostDetailToEdit = async (id) => {
    return AuthorApi.get(`${this.url}/detail/edit/${id}`);
  };

  updatePost = async (id, formData) => {
    return AuthorApi.put(`${this.url}/edit/${id}`, formData);
  };

  deletePost = async (id) => {
    return AuthorApi.delete(`${this.url}/delete/${id}`);
  };

  changeStatusPost = async (id, data) => {
    return AuthorApi.put(`${this.url}/${id}/status`, data);
  };

  changePinPost = async (id, userId) => {
    return AuthorApi.put(`${this.url}/${id}/pin`, { userId: userId });
  };

  getLandlordInfoByPostId = async (postId) => {
    return AuthorApi.get(`${this.url}/detail/landlord-info/${postId}`);
  };

  getLandlordFullInfoByLandlordId = async (landlordId) => {
    return AuthorApi.get(`${this.url}/landlord-full-info/${landlordId}`);
  };


}

export default new PostAPI();
