// AuthContext.js
import React, { createContext, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import AuthApi from "../api/AuthApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../redux/slices/userSlice"; // Giả sử bạn đã có userSlice

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  // useEffect(() => {
  //   loadUserData();
  // }, []);

  // const loadUserData = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("jwtToken");
  //     if (token) {
  //       const decodedUser = jwtDecode(token);
  //       dispatch(setUser(decodedUser));
  //     }
  //   } catch (error) {
  //     console.error("Error loading user data:", error);
  //   }
  // };

  const login = async (email, password) => {
    try {
      const response = await AuthApi.login(email, password);

      if (response.token) {
        await AsyncStorage.setItem("jwtToken", response.token);
        const decodedUser = jwtDecode(response.token);
        dispatch(setUser(decodedUser));
        return { status: response.status, message: response.message };
      } else {
        return { status: "error", message: response.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { status: "error", message: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken");
      dispatch(clearUser());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
