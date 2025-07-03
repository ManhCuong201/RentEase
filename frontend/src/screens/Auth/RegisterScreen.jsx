import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import AuthApi from "../../api/AuthApi";

const { width } = Dimensions.get("window");

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Quản lý modal
  const [modalMessage, setModalMessage] = useState(""); // Thông báo cho modal

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
      .required("Vui lòng nhập số điện thoại"),
    fullName: Yup.string().required("Vui lòng nhập họ và tên"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu"),
    gender: Yup.string().required("Vui lòng chọn giới tính"),
    dob: Yup.date().required("Vui lòng chọn ngày sinh"),
  });

  // Function to show DatePicker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Handle date selection from DatePicker
  const onChange = (event, selectedDate, setFieldValue) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFieldValue("dob", selectedDate);
    }
  };

  // Handle the registration process
  const handleRegister = async (values) => {
    setLoading(true);
    const { email, phoneNumber, fullName, password, gender, dob } = values;

    try {
      const response = await AuthApi.register(
        fullName,
        email,
        password,
        phoneNumber,
        gender,
        dob
      );
      setLoading(false);
      if (response) {
        setModalMessage(
          "Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực."
        );
        setModalVisible(true);
      } else {
        alert("Đăng ký thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Đã xảy ra lỗi khi kết nối với server.");
      }
    }
  };

  // Đóng modal và điều hướng về trang login sau khi người dùng đã xác thực email
  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image
          source={require("../../../assets/images/—Pngtree—homestay icon_5394514.png")}
          resizeMode="cover"
          style={{ height: "100%", width: "100%" }}
        />
      </View>

      <View style={styles.containerForm}>
        <ScrollView>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.textLogin}>Tạo tài khoản</Text>
          </View>

          {/* Formik Form */}
          <Formik
            initialValues={{
              email: "",
              phoneNumber: "",
              fullName: "",
              password: "",
              gender: "Male",
              dob: date,
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.inputForm}>
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <TextInput
                  placeholder="Số điện thoại"
                  style={styles.input}
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  value={values.phoneNumber}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}

                <TextInput
                  placeholder="Họ và tên"
                  style={styles.input}
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  value={values.fullName}
                />
                {touched.fullName && errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}

                {/* Date Picker Field */}
                <TouchableOpacity onPress={showDatepicker}>
                  <TextInput
                    placeholder="Chọn ngày sinh (dd/mm/yyyy)"
                    style={styles.input}
                    value={date.toLocaleDateString("vi-VN")}
                    editable={false}
                  />
                </TouchableOpacity>
                {touched.dob && errors.dob && (
                  <Text style={styles.errorText}>{errors.dob}</Text>
                )}

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) =>
                      onChange(event, selectedDate, setFieldValue)
                    }
                  />
                )}

                <View style={styles.inputPassword}>
                  <TextInput
                    placeholder="Mật khẩu"
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
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {/* Gender Picker */}
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.gender}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setFieldValue("gender", itemValue)
                    }
                  >
                    <Picker.Item label="Nam" value="Male" />
                    <Picker.Item label="Nữ" value="Female" />
                    <Picker.Item label="Khác" value="Other" />
                  </Picker>
                  {touched.gender && errors.gender && (
                    <Text style={styles.errorText}>{errors.gender}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.btnLogin}
                  onPress={handleSubmit}
                >
                  <Text style={styles.btnLoginText}>Đăng ký</Text>
                </TouchableOpacity>

                {loading && (
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={{ marginTop: 20 }}
                  />
                )}

                <View>
                  <Text style={{ marginVertical: 20, textAlign: "center" }}>
                    Bạn đã có tài khoản?{" "}
                    <Text
                      onPress={() => navigation.navigate("Login")}
                      style={{ color: "blue" }}
                    >
                      Đăng nhập
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>

        {/* Modal Pop-up */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal} // Đóng Modal khi bấm nút back
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={handleCloseModal}
              >
                <Text style={styles.textStyle}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  btnLoginText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 10,
  },
  picker: {
    height: 50,
    width: width - 40,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
