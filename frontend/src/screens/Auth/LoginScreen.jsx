import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";

import { useAuth } from "../../context/authContext";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(true);

  const handleLogin = async (values) => {
    const { email, password } = values;

    const response = await login(email, password);

    Toast.show({
      type: response.status,
      text1: response.message,
    });

    if (response.status === "success") {
      setTimeout(() => {
        navigation.navigate("Rent");
      }, 500);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBack}
        >
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.containerImage}>
          <Image
            source={require("../../../assets/images/—Pngtree—homestay icon_5394514.png")}
            resizeMode="cover"
            style={{ height: "100%", width: "100%" }}
          />
        </View>

        {/* KeyboardAvoidingView để tránh bàn phím che mất nội dung */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.containerForm}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.textLogin}> Đăng nhập </Text>
            </View>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleLogin(values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.inputForm}>
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                  {touched.email && errors.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}

                  <View style={styles.inputPassword}>
                    <TextInput
                      placeholder="Password"
                      style={styles.input}
                      secureTextEntry={showPassword}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={24}
                        color="gray"
                        style={styles.eye}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  ) : null}
                  <TouchableOpacity
                    style={styles.btnLogin}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.btnText}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View>
              <Text style={{ marginTop: 20, textAlign: "center" }}>
                Bạn chưa có tài khoản?{" "}
                <Text
                  onPress={() => navigation.navigate("Register")}
                  style={{ color: "blue" }}
                >
                  Đăng ký
                </Text>
              </Text>
              <Text style={{ marginTop: 20, textAlign: "center" }}>
                Hoặc đăng nhập với
              </Text>
              <View>
                <TouchableOpacity
                  style={{ alignItems: "center", marginBottom: 20 }}
                >
                  <Image
                    source={require("../../../assets/images/avesbl6oq.webp")}
                    style={{
                      width: 40,
                      height: 40,
                      marginTop: 20,
                      marginHorizontal: 20,
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 999,
  },
  containerImage: {
    alignItems: "center",
    height: 200,
    width: width - 100,
    marginTop: 50,
    marginBottom: 10,
    marginHorizontal: 50,
  },
  containerForm: {
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
    backgroundColor: "white",
    width: width,
  },
  inputForm: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  inputPassword: {
    flexDirection: "row",
  },
  eye: {
    position: "absolute",
    right: 10,
    top: 12,
    zIndex: 998,
  },
  input: {
    marginBottom: 20,
    width: width - 40,
    height: 50,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 10,
    paddingLeft: 20,
  },
  textLogin: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  btnLogin: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
