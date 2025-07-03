import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";

const RoomList = ({ posts, onRoomPress }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item._id}
      style={styles.roomCard}
      onPress={() => onRoomPress(item._id)}
    >
      {item.pin && ( // Kiểm tra nếu pin == true thì hiển thị icon
        <View
          style={[
            styles.planeIconContainer,
            {
              position: "absolute",
              top: 0, // Đặt icon ở góc trên bên trái
              left: 0,
              zIndex: 2,
              padding: 0,
              margin: 0,
              width: 40,
              height: 40,
            },
          ]}
        >
          <Image
            style={{
              height: 40,
              width: 40,
            }}
            source={require("../../../assets/images/recommendation.png")}
          />
        </View>
      )}
      <Image source={{ uri: item.image }} style={styles.roomImage} />
      <View style={styles.roomInfo}>
        <Text
          style={styles.roomTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>

        <View style={styles.infoRow}>
          <Image
            style={styles.icon}
            source={require("../../../assets/images/dollar_icon.png")}
          />
          <Text style={styles.roomPrice}>{item.price}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoSubRow}>
            <Image
              style={styles.icon}
              source={require("../../../assets/images/meter_icon.png")}
            />
            <Text style={styles.roomDetail}>{item.squareMeter} m²</Text>
          </View>
          <View style={styles.infoSubRow}>
            <Image
              style={styles.icon}
              source={require("../../../assets/images/people_icon.png")}
            />
            <Text style={styles.roomDetail}>{item.capacity}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Image
            style={styles.icon}
            source={require("../../../assets/images/location_icon.png")}
          />
          <Text style={styles.roomLocation}>{item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {posts.map((item) => (
        <View key={item._id}>{renderItem({ item })}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  roomCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  roomImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  roomInfo: {
    marginLeft: 10,
    justifyContent: "center",
    flex: 1,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flexWrap: "wrap",
    maxWidth: "90%",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  infoSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15, 
  },
  icon: {
    width: 18,
    height: 17,
    marginRight: 5,
  },
  roomPrice: {
    fontSize: 14,
    color: "green",
  },
  roomDetail: {
    fontSize: 10,
    color: "#555",
  },
  roomLocation: {
    fontSize: 10,
    color: "#555",
    flexWrap: "wrap",
    maxWidth: "90%",
  },
});

export default RoomList;
