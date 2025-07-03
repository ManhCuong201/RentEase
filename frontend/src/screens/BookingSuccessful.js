import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const BookingSuccessScreen = ({ route }) => {
  const navigation = useNavigation();
  const { roomId, landlordId, reservationDate, user, post } = route.params;
  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="done" size={24} color="green" />
      <Text style={styles.title}>Đặt lịch thành công</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Phòng trọ</Text>
        <Text style={styles.value}>{post?.title}</Text>
        <Text style={styles.label}>Họ và tên chủ</Text>
        <Text style={styles.value}>{user.fullName}</Text>

        <Text style={styles.label}>Số điện thoại</Text>
        <Text style={styles.value}>{post?.phoneNumber}</Text>

        <Text style={styles.label}>Thời gian xem phòng</Text>
        <Text style={styles.value}>{reservationDate}</Text>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>Đóng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  recommendationContainer: {
    width: "100%",
    marginBottom: 20,
  },
  recommendationTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#C0C0C0",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingSuccessScreen;
