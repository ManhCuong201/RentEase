import React, { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Button,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";

import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import InputField from "../../../../components/common/InputFieldComponent";
import messages from "../../../../constants/messages";
import { COLORS } from "../../../../constants/color";
import FurnitureApi from "../../../../api/FurnitureApi";
import ServiceApi from "../../../../api/ServiceApi";
import LocationInput from "../../../../components/post/landlord/LocationInputComponent";
import ImagePickerComponent from "../../../../components/post/landlord/ImagePickerComponent";
import { setFurniture } from "../../../../redux/slices/furnituresSlice";
import { setServices } from "../../../../redux/slices/servicesSlice";
import CustomCheckbox from "../../../../components/common/CustomCheckbox";
import { currentTime } from "../../../../utils/time";
import PostAPI from "../../../../api/PostAPI";
import { convertImageToBase64 } from "../../../../utils/convertImageToBase64";

const { extra } = Constants.expoConfig;
const rentEaseApi = extra.rentEaseApi;

const CreatePost = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const route = useRoute();
  const user = useSelector((state) => state.user.user);
  const services = useSelector((state) => state.services?.data);
  const furniture = useSelector((state) => state.furniture?.data);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const formikRef = React.useRef();
  const [locationError, setLocationError] = useState("");

  // Cập nhật selectedLocation khi người dùng chọn vị trí trên bản đồ
  useEffect(() => {
    if (route.params?.selectedLocation) {
      setSelectedLocation(route.params.selectedLocation);
    }
  }, [route.params?.selectedLocation]);

  useEffect(() => {
    if (!furniture || furniture.length === 0) {
      FurnitureApi.getAllFurniture().then((data) => {
        dispatch(setFurniture(data || []));
      });
    }
    if (!services || services.length === 0) {
      ServiceApi.getAllService().then((data) => {
        dispatch(setServices(data || []));
      });
    }
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(messages.ME001),
    detailAddress: Yup.string().required(messages.ME001), // đồng bộ với `initialValues`
    price: Yup.number().required(messages.ME001).positive(messages.ME002),
    squareMeter: Yup.number().required(messages.ME001).positive(messages.ME002),
    phoneNumber: Yup.string()
      .required(messages.ME001)
      .matches(/^[0-9]+$/, messages.ME003),
    capacity: Yup.number().required(messages.ME001).positive(messages.ME002),

    electricity: Yup.number().required(messages.ME001).positive(messages.ME002),
    wifi: Yup.number().required(messages.ME001).positive(messages.ME002),
    water: Yup.number().required(messages.ME001).positive(messages.ME002),
    service: Yup.number().required(messages.ME001).positive(messages.ME002),
    images: Yup.array().min(1, messages.ME012), // Kiểm tra độ dài mảng
    selectedLocation: Yup.object()
      .nullable()
      .test(
        "has-location",
        "Vui lòng chọn vị trí trên bản đồ",
        function (value) {
          // Kiểm tra cụ thể hơn về giá trị
          return (
            value &&
            typeof value.latitude === "number" &&
            typeof value.longitude === "number"
          );
        }
      ),
  });

  const initialValues = {
    title: "",
    city: null,
    district: null,
    ward: null,
    detailAddress: "", // đổi thành `detailAddress` để đồng bộ
    price: "",
    squareMeter: "",
    phoneNumber: "",
    capacity: "",
    description: "",
    images: [],
    services: [],
    furniture: [],
    electricity: "",
    water: "",
    wifi: "",
    service: "",
    selectedLocation: null,
  };

  const handleSubmit = async (values) => {
    try {
      // // Chuyển đổi ảnh thành base64
      // const base64Images = [];
      // for (const imageUri of values.images) {
      //   const base64 = await convertImageToBase64(imageUri);
      //   base64Images.push(base64);
      // }

      const dataPost = {
        title: values.title,
        address: {
          detail: values.detailAddress,
          ward: {
            id: values.ward.wardId,
            name: values.ward.name,
          },
          district: {
            id: values.district.districtId,
            name: values.district.name,
          },
          city: {
            id: values.city.cityId,
            name: values.city.name,
          },
        },
        price: Number(values.price),
        estimatedCosts: {
          electricity: Number(values.electricity),
          water: Number(values.water),
          wifi: Number(values.wifi),
          service: Number(values.service),
        },
        squareMeter: Number(values.squareMeter),
        phoneNumber: values.phoneNumber,
        capacity: Number(values.capacity),
        description: values.description,
        images: values.images, // Mảng các ảnh đã chuyển đổi thành base64
        coordinate: selectedLocation, // Chứa latitude và longitude
        services: values.services, // Danh sách các ObjectId hợp lệ từ FE
        furnitures: values.furniture, // Danh sách các ObjectId hợp lệ từ FE
        status: "draft",
        userId: user._id,
      };

      // console.log(dataPost);

      const size = new Blob([JSON.stringify(dataPost)]).size; // Kiểm tra kích thước dataPost

      const response = await PostAPI.createPost(dataPost);

      // Xử lý response thành công
      Toast.show({
        type: "success",
        text1: `${messages.ME004}`,
        text2: `Phòng ${values.title} đã được tạo.`,
      });
      navigation.navigate("PostManagement", { refresh: true });
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: `${messages.ME005}`,
        text2: `${error}`,
      });
    }
  };

  const handlePressSearchOnMap = () => {
    navigation.navigate("MapMarkScreen", {
      isEditMode: true,
      selectedLocation: selectedLocation,
      sourceScreen: "CreatePost",
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={false} // 1. Đảm bảo Formik không reinitialize với selectedLocation
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              setFieldTouched,
            }) => {
              const handleCheckboxChange = (field, itemId) => {
                const updatedSelection = values[field]?.includes(itemId)
                  ? values[field].filter((id) => id !== itemId)
                  : [...values[field], itemId];
                setFieldValue(field, updatedSelection);
              };

              useEffect(() => {
                if (
                  selectedLocation &&
                  typeof selectedLocation.latitude === "number" &&
                  typeof selectedLocation.longitude === "number"
                ) {
                  // Cập nhật giá trị
                  setFieldValue("selectedLocation", selectedLocation, false);
                  // Reset touched state và validation
                  setFieldTouched("selectedLocation", false, false);
                }
              }, [selectedLocation]);
              return (
                <View style={styles.section}>
                  <View style={styles.headerSection}>
                    <Text style={styles.headerSection_Text}>
                      Thông tin phòng
                    </Text>
                  </View>

                  <InputField
                    label="Số/Tên phòng"
                    iconName="home"
                    placeholder="Nhập số/tên phòng"
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    value={values.title}
                    touched={touched.title}
                    error={errors.title}
                  />

                  <Text style={styles.label}>Địa chỉ</Text>
                  <LocationInput
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                  />

                  <View style={styles.map}>
                    <TouchableOpacity
                      style={styles.mapHeader}
                      onPress={handlePressSearchOnMap}
                    >
                      <MaterialCommunityIcons
                        name="map"
                        size={30}
                        color="orange"
                      />
                      <View style={{ marginLeft: 5 }}>
                        <Text style={styles.mapTitle}>
                          Ghim vị trí trên bản đồ
                        </Text>
                      </View>
                      {selectedLocation && (
                        <View style={{ position: "absolute", right: 10 }}>
                          <AntDesign name="check" size={24} color="green" />
                        </View>
                      )}
                    </TouchableOpacity>

                    <Text style={styles.mapDes}>
                      (Required) Nhấn vào đây để chọn vị trí chính xác trên bản
                      đồ, giúp người thuê nhà tìm phòng của bạn dễ dàng hơn
                    </Text>
                    {/* Hiển thị thông báo lỗi cho latitude và longitude */}
                    {touched.selectedLocation && errors.selectedLocation && (
                      <Text style={styles.errorText}>
                        {errors.selectedLocation}
                      </Text>
                    )}
                  </View>

                  <InputField
                    label="Giá phòng"
                    iconName="cash"
                    placeholder="Nhập giá phòng"
                    keyboardType="numeric"
                    onChangeText={handleChange("price")}
                    onBlur={handleBlur("price")}
                    value={values.price}
                    touched={touched.price}
                    error={errors.price}
                  />

                  <InputField
                    label="Điện"
                    iconName="logo-electron"
                    placeholder="Nhập tiền điện theo Kwh"
                    keyboardType="numeric"
                    onChangeText={handleChange("electricity")}
                    onBlur={handleBlur("electricity")}
                    value={values.electricity}
                    touched={touched.electricity}
                    error={errors.electricity}
                  />

                  <InputField
                    label="Nước"
                    iconName="water"
                    placeholder="Nhập tiền nước theo m3"
                    keyboardType="numeric"
                    onChangeText={handleChange("water")}
                    onBlur={handleBlur("water")}
                    value={values.water}
                    touched={touched.water}
                    error={errors.water}
                  />

                  <InputField
                    label="Wifi"
                    iconName="wifi-outline"
                    placeholder="Nhập tiền wifi/phòng"
                    keyboardType="numeric"
                    onChangeText={handleChange("wifi")}
                    onBlur={handleBlur("wifi")}
                    value={values.wifi}
                    touched={touched.wifi}
                    error={errors.wifi}
                  />

                  <InputField
                    label="Dịch vụ"
                    iconName="leaf-outline"
                    placeholder="Nhập tiền dịch vụ/phòng"
                    keyboardType="numeric"
                    onChangeText={handleChange("service")}
                    onBlur={handleBlur("service")}
                    value={values.service}
                    touched={touched.service}
                    error={errors.service}
                  />

                  <ErrorMessage name="images" style={{ marginBottom: 50 }}>
                    {(msg) => <Text style={styles.errorText}>{msg}</Text>}
                  </ErrorMessage>

                  <ImagePickerComponent
                    onImagesSelected={(images) => {
                      setFieldValue("images", images);
                    }}
                  />

                  <InputField
                    label="Diện tích (m²)"
                    iconName="grid-outline"
                    placeholder="Nhập diện tích"
                    keyboardType="numeric"
                    onChangeText={handleChange("squareMeter")}
                    onBlur={handleBlur("squareMeter")}
                    value={values.squareMeter}
                    touched={touched.squareMeter}
                    error={errors.squareMeter}
                  />

                  <InputField
                    label="Số người ở"
                    iconName="person"
                    placeholder="Nhập số người ở"
                    keyboardType="numeric"
                    onChangeText={handleChange("capacity")}
                    onBlur={handleBlur("capacity")}
                    value={values.capacity}
                    touched={touched.capacity}
                    error={errors.capacity}
                  />

                  <InputField
                    label="Số điện thoại"
                    iconName="call-outline"
                    placeholder="Nhập số điện thoại"
                    keyboardType="numeric"
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                    touched={touched.phoneNumber}
                    error={errors.phoneNumber}
                  />

                  <InputField
                    label="Mô tả"
                    iconName="document-text-outline"
                    placeholder="Nhập mô tả"
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    touched={touched.description}
                    error={errors.description}
                  />

                  {/* Dịch Vụ */}
                  <View>
                    <Text style={styles.sectionTitle}>Dịch Vụ</Text>
                    {services &&
                      services.map((item, index) => (
                        <View style={styles.row} key={item._id}>
                          <View style={styles.column}>
                            <CustomCheckbox
                              label={item.name}
                              value={values.services.includes(item._id)}
                              onValueChange={() =>
                                handleCheckboxChange("services", item._id)
                              }
                            />
                          </View>
                        </View>
                      ))}
                  </View>

                  {/* Nội Thất */}
                  <View>
                    <Text style={styles.sectionTitle}>Nội Thất</Text>
                    {furniture &&
                      furniture.map((item, index) => (
                        <View style={styles.row} key={item._id}>
                          <View style={styles.column}>
                            <CustomCheckbox
                              label={item.name}
                              value={values.furniture.includes(item._id)}
                              onValueChange={() =>
                                handleCheckboxChange("furniture", item._id)
                              }
                            />
                          </View>
                        </View>
                      ))}
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.postButton}
                      onPress={() => handleSubmit()} // Directly call handleSubmit
                    >
                      <Text style={styles.buttonText}>Tạo tin đăng</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  map: {
    marginVertical: 5,
    backgroundColor: COLORS.backgroundMain,
    borderRadius: 15,
    padding: 5,
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomColor: COLORS.note,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  mapDes: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontSize: 14,
    color: COLORS.note,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.backgroundMain,
  },
  headerContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
    marginVertical: 10,
    borderRadius: 5,
  },
  section: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  headerSection: {
    justifyContent: "center",
    paddingVertical: 12,
  },
  headerSection_Text: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10, // Khoảng cách giữa các hàng checkbox
  },
  column: {
    flex: 1, // Mỗi cột chiếm 50% không gian của dòng
    paddingHorizontal: 5, // Khoảng cách ngang giữa các checkbox
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "400",
    flex: 1,
    textAlign: "center",
    paddingRight: 150,
  },
  headerIcon: {
    padding: 8,
  },

  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 150,
  },
  postButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 150,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "500",
    textAlign: "center",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  requiredStar: {
    color: "red",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderBottomColor: COLORS.note,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: COLORS.description,
    paddingLeft: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  errorInput: {
    borderBottomColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 2,
  },
  groupInput: {
    marginBottom: 16,
  },
});

export default CreatePost;
