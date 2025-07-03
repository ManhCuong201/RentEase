import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { COLORS } from "../../../constants/color";
import {
  fetchCities,
  fetchDistricts,
  fetchWards,
} from "../../../api/AddressApi";

const LocationInput = ({
  values,
  setFieldValue,
  errors,
  touched,
  handleBlur,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [detailAddress, setDetailAddress] = useState("");

  useEffect(() => {
    fetchCities().then(setCities);
  }, []);

  useEffect(() => {
    if (values.city) {
      fetchDistricts(values.city.cityId).then(setDistricts);
    }
  }, [values.city]);

  useEffect(() => {
    if (values.district) {
      fetchWards(values.district.districtId).then(setWards);
    }
  }, [values.district]);

  const handleSelect = (item) => {
    switch (step) {
      case 0:
        setFieldValue("city", item);
        setStep(1);
        break;
      case 1:
        setFieldValue("district", item);
        setStep(2);
        break;
      case 2:
        setFieldValue("ward", item);
        setStep(3);
        break;
      default:
        break;
    }
  };

  const handleDetailAddressSubmit = () => {
    setFieldValue("detailAddress", detailAddress);
    setModalVisible(false);
    setStep(0);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <FlatList
            data={cities}
            renderItem={renderItem}
            keyExtractor={(item) => item.cityId}
          />
        );
      case 1:
        return (
          <FlatList
            data={districts}
            renderItem={renderItem}
            keyExtractor={(item) => item.districtId}
          />
        );
      case 2:
        return (
          <FlatList
            data={wards}
            renderItem={renderItem}
            keyExtractor={(item) => item.wardId}
          />
        );
      case 3:
        return (
          <View>
            <TextInput
              style={styles.input}
              onChangeText={setDetailAddress}
              value={detailAddress}
              placeholder="Nhập địa chỉ chi tiết"
              multiline
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={handleDetailAddressSubmit}
              >
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const getFullAddress = () => {
    if (values.city && values.district && values.ward && values.detailAddress) {
      return `${values.detailAddress}, ${values.ward.name}, ${values.district.name}, ${values.city.name}`;
    }
    return "Chọn địa chỉ";
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text>{getFullAddress()}</Text>
      </TouchableOpacity>
      {touched.city && errors.city && (
        <Text style={styles.errorText}>{errors.city}</Text>
      )}
      {touched.district && errors.district && (
        <Text style={styles.errorText}>{errors.district}</Text>
      )}
      {touched.ward && errors.ward && (
        <Text style={styles.errorText}>{errors.ward}</Text>
      )}
      {touched.detailAddress && errors.detailAddress && (
        <Text style={styles.errorText}>{errors.detailAddress}</Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        style={styles.modelContainer}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {step === 0
              ? "Chọn Tỉnh/Thành phố"
              : step === 1
              ? "Chọn Quận/Huyện"
              : step === 2
              ? "Chọn Phường/Xã"
              : "Nhập địa chỉ chi tiết"}
          </Text>
          {renderContent()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: COLORS.description,
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    justifyContent: "center",
    marginVertical: 5,
  },
  modelContainer: {
    backgroundColor: "orange",
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  button: {
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 150,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default LocationInput;
