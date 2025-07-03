import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import BookingAPI from "../../src/api/BookingApi";
import moment from 'moment-timezone';


const ScheduleRoomViewModal = ({ isVisible, onClose, roomId, landlordId, user, post }) => {
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setDatePickerVisibility(false);
    }
  }, [isVisible]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      if (!selectedDate || isNaN(selectedDate.getTime())) {
        throw new Error("Invalid date selected");
      }
  
      const vietnamTime = moment(selectedDate)
        .tz("Asia/Ho_Chi_Minh") 
        .format('YYYY-MM-DDTHH:mm'); 
  
      console.log("Vietnam Time: ", vietnamTime); 
  
      // Gửi thời gian đã được chuyển đổi
      await BookingAPI.createBooking(roomId, vietnamTime, landlordId);
      navigation.navigate("BookingSuccess", {
        post: post,
        user: user,
        reservationDate: vietnamTime,
      });
      onClose(); // Đóng modal khi hoàn tất
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Đặt lịch xem phòng</Text>

              <View style={styles.infoContainer}>
                <View style={styles.personContainer}>
                  <Text style={styles.personRole}>Khách thuê</Text>
                  <Text style={styles.personName}>Duy Hoàng</Text>
                  <Text style={styles.personPhone}>076331065</Text>
                </View>
                <Text style={styles.divider}> - </Text>
                <View style={styles.personContainer}>
                  <Text style={styles.personRole}>Chủ nhà</Text>
                  <Text style={styles.personName}>{user.fullName}</Text>
                  <Text style={styles.personPhone}>{post?.phoneNumber}</Text>
                </View>
              </View>

              <View style={styles.scheduleContainer}>
                <Text>Thời gian xem phòng *</Text>
                <TouchableOpacity onPress={showDatePicker}>
                  <Text>{selectedDate.toLocaleString()}</Text>
                </TouchableOpacity>
              </View>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
              />

              {/* Booking button */}
              <TouchableOpacity
                style={styles.bookButton}
                onPress={handleBooking}
                disabled={isSubmitting}
              >
                <Text style={styles.bookButtonText}>
                  {isSubmitting ? "Đang đặt..." : "Đặt lịch xem phòng"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    minHeight: height * 0.4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 20,
    marginBottom: 20,
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: "#EDEDED",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderColor: "#EDEDED",
  },
  personContainer: {
    alignItems: "center",
  },
  personRole: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  personName: {
    fontSize: 16,
  },
  personPhone: {
    fontSize: 14,
    color: "gray",
  },
  divider: {
    fontSize: 24,
    fontWeight: "bold",
    color: "orange",
  },
  scheduleContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderColor: "#EDEDED",
  },
  bookButton: {
    backgroundColor: "#FF3D00",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ScheduleRoomViewModal;