import React, { useState, useEffect } from "react";
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
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
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
import PostAPI from "../../../../api/PostAPI";
import Toast from "react-native-toast-message";

const EditPost = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { selectedLocation: mapSelectedLocation } = route.params || {}; // Pass selectedLocation from route params
  const [postId, setPostId] = useState(route.params?.postId || "");

  const user = useSelector((state) => state.user.user);
  const services = useSelector((state) => state.services?.data);
  const furniture = useSelector((state) => state.furniture?.data);
  const [selectedLocation, setSelectedLocation] = useState();
  const [initialValues, setInitialValues] = useState(null);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  useEffect(() => {
    // Fetch the post data
    const fetchPostData = async () => {
      if (dataFetched) return; // Avoid refetching data if it's already fetched

      try {
        const postData = await PostAPI.getPostDetailToEdit(postId);

        setInitialValues({
          title: postData.title,
          city: postData.address.city,
          district: postData.address.district,
          ward: postData.address.ward,
          detailAddress: postData.address.detail,
          price: postData.price.toString(),
          squareMeter: postData.squareMeter.toString(),
          phoneNumber: postData.phoneNumber,
          capacity: postData.capacity.toString(),
          description: postData.description,
          images: postData.images,
          services: postData.services,
          furniture: postData.furnitures,
          electricity: postData.estimatedCosts.electricity.toString(),
          water: postData.estimatedCosts.water.toString(),
          wifi: postData.estimatedCosts.wifi.toString(),
          service: postData.estimatedCosts.service.toString(),

          // Add coordinate to initial values
          coordinate: {
            latitude: postData?.coordinate?.latitude ?? 0,
            longitude: postData?.coordinate?.longitude ?? 0,
          },
        });

        setSelectedLocation({
          latitude: postData?.coordinate?.latitude ?? 0,
          longitude: postData?.coordinate?.longitude ?? 0,
        }); // Set initial selected location
        setDataFetched(true); // Set data as fetched
      } catch (error) {
        console.error("Error fetching post data:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load post data",
        });
      }
    };

    fetchPostData();

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
  }, [dispatch, postId, dataFetched]);

  useEffect(() => {
    if (mapSelectedLocation) {
      setSelectedLocation(mapSelectedLocation); // Update selected location from map selection
    }
  }, [mapSelectedLocation]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(messages.ME001),
    detailAddress: Yup.string().required(messages.ME001), // đồng bộ với `initialValues`
    price: Yup.number().required(messages.ME001).positive(messages.ME002),
    squareMeter: Yup.number().required(messages.ME001).positive(messages.ME002),
    phoneNumber: Yup.string()
      .required(messages.ME001)
      .matches(/^[0-9]+$/, messages.ME003),
    capacity: Yup.number().required(messages.ME001).positive(messages.ME002),
    coordinate: Yup.object().shape({
      latitude: Yup.number().nullable().required(messages.ME013), // Kiểm tra latitude
      longitude: Yup.number().nullable().required(messages.ME013), // Kiểm tra longitude
    }),
    //   .required(messages.ME013), // Kiểm tra object `coordinate` không được rỗng
    electricity: Yup.number().required(messages.ME001).positive(messages.ME002),
    wifi: Yup.number().required(messages.ME001).positive(messages.ME002),
    water: Yup.number().required(messages.ME001).positive(messages.ME002),
    service: Yup.number().required(messages.ME001).positive(messages.ME002),
    images: Yup.array().min(1, messages.ME012), // Kiểm tra độ dài mảng
  });

  const handleSubmit = async (values) => {
    try {
      const updatedPost = {
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
        images: values.images,
        coordinate: selectedLocation,
        services: values.services,
        furnitures: values.furniture,
      };

      const response = await PostAPI.updatePost(postId, updatedPost);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Post "${values.title}" has been updated.`,
      });

      navigation.navigate("PostManagement");
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Failed to update post: ${error.message}`,
      });
    }
  };

  const handlePressSearchOnMap = () => {
    navigation.navigate("MapMarkScreen", {
      isEditMode: true,
      selectedLocation: selectedLocation,
      sourceScreen: "EditPostScreen",
      postId: postId, // Pass the postId to MapMarkScreen
    });
  };

  if (!initialValues) {
    return <Text>Loading...</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={false} // Không reset lại các giá trị trong Formik khi initialValues thay đổi
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => {
              const handleCheckboxChange = (field, itemId) => {
                const updatedSelection = values[field]?.includes(itemId)
                  ? values[field].filter((id) => id !== itemId)
                  : [...values[field], itemId];
                setFieldValue(field, updatedSelection);
              };

              useEffect(() => {
                if (selectedLocation) {
                  setFieldValue(
                    "coordinate.latitude",
                    selectedLocation.latitude
                  ); // Update latitude in Formik
                  setFieldValue(
                    "coordinate.longitude",
                    selectedLocation.longitude
                  ); // Update longitude in Formik
                }
              }, [selectedLocation]); // Re-run effect when selectedLocation changes

              return (
                <View style={styles.section}>
                  <View style={styles.headerSection}>
                    <Text style={styles.headerSection_Text}>
                      Edit Post Information
                    </Text>
                  </View>

                  <InputField
                    label="Room Number/Name"
                    iconName="home"
                    placeholder="Enter room number/name"
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    value={values.title}
                    touched={touched.title}
                    error={errors.title}
                  />

                  <Text style={styles.label}>Address</Text>
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
                        // <Text style={styles.selectedLocationText}>
                        //   Đã chọn vị trí: {selectedLocation.latitude.toFixed(6)}
                        //   , {selectedLocation.longitude.toFixed(6)}
                        // </Text>
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
                    <View style={{ paddingLeft: 15 }}>
                      <ErrorMessage name="coordinate.latitude">
                        {(msg) => <Text style={styles.errorText}>{msg}</Text>}
                      </ErrorMessage>
                    </View>
                  </View>

                  <InputField
                    label="Room Price"
                    iconName="cash"
                    placeholder="Enter room price"
                    keyboardType="numeric"
                    onChangeText={handleChange("price")}
                    onBlur={handleBlur("price")}
                    value={values.price}
                    touched={touched.price}
                    error={errors.price}
                  />
                  <InputField
                    label="Electricity"
                    iconName="logo-electron"
                    placeholder="Enter electricity price per kWh"
                    keyboardType="numeric"
                    onChangeText={handleChange("electricity")}
                    onBlur={handleBlur("electricity")}
                    value={values.electricity}
                    touched={touched.electricity}
                    error={errors.electricity}
                  />

                  <InputField
                    label="Water"
                    iconName="water"
                    placeholder="Enter water price per m3"
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
                    placeholder="Enter wifi price per room"
                    keyboardType="numeric"
                    onChangeText={handleChange("wifi")}
                    onBlur={handleBlur("wifi")}
                    value={values.wifi}
                    touched={touched.wifi}
                    error={errors.wifi}
                  />

                  <InputField
                    label="Service"
                    iconName="leaf-outline"
                    placeholder="Enter service price per room"
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
                    initialImages={values.images}
                    onImagesSelected={(images) => {
                      setFieldValue("images", images);
                    }}
                  />

                  <InputField
                    label="Area (m²)"
                    iconName="grid-outline"
                    placeholder="Enter area"
                    keyboardType="numeric"
                    onChangeText={handleChange("squareMeter")}
                    onBlur={handleBlur("squareMeter")}
                    value={values.squareMeter}
                    touched={touched.squareMeter}
                    error={errors.squareMeter}
                  />

                  <InputField
                    label="Capacity"
                    iconName="person"
                    placeholder="Enter number of people"
                    keyboardType="numeric"
                    onChangeText={handleChange("capacity")}
                    onBlur={handleBlur("capacity")}
                    value={values.capacity}
                    touched={touched.capacity}
                    error={errors.capacity}
                  />

                  <InputField
                    label="Phone Number"
                    iconName="call-outline"
                    placeholder="Enter phone number"
                    keyboardType="numeric"
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                    touched={touched.phoneNumber}
                    error={errors.phoneNumber}
                  />

                  <InputField
                    label="Description"
                    iconName="document-text-outline"
                    placeholder="Enter description"
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    touched={touched.description}
                    error={errors.description}
                  />

                  {/* Services */}
                  <View>
                    <Text style={styles.sectionTitle}>Services</Text>
                    {services &&
                      services.map((item) => (
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

                  {/* Furniture */}
                  <View>
                    <Text style={styles.sectionTitle}>Furniture</Text>
                    {furniture &&
                      furniture.map((item) => (
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
                      <Text style={styles.buttonText}>Sửa tin</Text>
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
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
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

export default EditPost;
