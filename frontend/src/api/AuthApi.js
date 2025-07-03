import UnauthorApi from "./baseAPI/UnauthorBaseApi";

class AuthAPI {
  constructor() {
    this.url = "/api/auth";
  }

  // Login method: sends email and password to the login endpoint
  login = (email, password) => {
    const body = {
      email: email,
      password: password,
    };
    return UnauthorApi.post(`${this.url}/login`, body);
  };

  register = (fullName, email, password, phoneNumber, gender, dob, role) => {
    const body = {
      fullName: fullName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      gender: gender,
      dob: dob,
    };
    return UnauthorApi.post(`${this.url}/register`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
}

export default new AuthAPI();
