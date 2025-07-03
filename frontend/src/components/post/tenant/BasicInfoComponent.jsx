import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { COLORS } from "../../../constants/color";

const BasicInfoComponent = ({ postData }) => {
  return (
    <View style={styles.postDetails}>
      <View style={styles.postDetailsHeader}>
        <Text style={styles.postName}>
          {postData?.title || "Không có thông tin"}
        </Text>
        <Text style={styles.postPrice}>
          Giá: {postData?.price || "Không có thông tin"}đ/tháng
        </Text>
      </View>
      <View style={styles.postDetailsBody}>
        <View style={styles.infoRow}>
          <FontAwesome
            style={{ marginRight: 5 }}
            name="building-o"
            size={24}
            color="black"
          />
          <Text style={styles.infoText}>
            Diện Tích: {postData?.squareMeter || "Không có thông tin"} m²
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Entypo name="location" size={24} color="#D89300" />
          <Text style={styles.infoText}>
            {postData?.address || "Không có thông tin"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="human-male" size={24} color="black" />
          <Text style={styles.infoText}>
            Sức chứa: {postData?.capacity || "Không có thông tin"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome5 name="money-bill-wave-alt" size={22} color="black" />
          <Text style={styles.infoText}>
            Tiền đặt cọc: {postData?.deposit || "Không có thông tin"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Entypo name="phone" size={24} color="#6C93FA" />
          <Text style={styles.infoText}>
            Số Điện Thoại: {postData?.phoneNumber || "Không có thông tin"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postDetails: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12,
    paddingRight: 25,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: COLORS.backgroundMain,
  },
  postName: {
    fontSize: 30,
    fontWeight: "bold",
  },
  postPrice: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "bold",
    color: "#A41617",
  },
  postDetailsBody: {
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 0,
    paddingLeft: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  infoText: {
    marginLeft: 10,
  },
});

export default BasicInfoComponent;
