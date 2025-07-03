import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const AppointmentItem = ({ item, onAccept, onReject }) => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ViewPostDetailScreen", { postId: item.roomId._id });
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleDateString('vi-VN'); // Format date
    const formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); // Format time
    return `${formattedDate} ${formattedTime}`;
  };


  return (
    <TouchableOpacity onPress={handlePress} style={styles.appointmentItem}>
      <Image 
        source={{ uri: item.roomId.images[0] }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      <View style={styles.appointmentDetails}>
        <Text style={styles.name}>{item.roomId.title}</Text>
        <Text style={styles.phone}>Ngày đặt: {formatDate(item.reservationDate)}</Text>
        <Text style={styles.description}>{user?.role === "tenant" && item.roomId.phoneNumber}</Text>
      </View>

      {/* Nút "Hủy lịch hẹn" */}
      <View style={styles.actions}>
        {item.status === 'Pending' && (
          <>
            {user?.role === "landlord" && (
              <TouchableOpacity style={styles.acceptButton} onPress={() => onAccept(item._id)}>
                <Text style={styles.acceptButtonText}>Chấp nhận lịch</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.cancelButton} onPress={() => onReject(item._id)}>
              <Text style={styles.cancelButtonText}>Hủy lịch hẹn</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'Rejected' && (
          <Text style={[styles.statusText, styles.rejectedText]}>Cancelled</Text>
        )}
        {item.status === 'Accepted' && (
          <Text style={[styles.statusText, styles.acceptedText]}>Accepted</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  appointmentItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  appointmentDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phone: {
    color: '#999',
    marginBottom: 4,
  },
  description: {
    color: '#555',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  acceptButton: {
    backgroundColor: 'green',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  acceptButtonText: {
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  rejectedText: {
    color: 'red',
  },
  acceptedText: {
    color: 'green',
  },
});

export default AppointmentItem;