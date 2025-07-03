import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

const ListNotification = ({ products, navigation }) => {
  return (
    <View style={styles.notificationContainer}>
      {products?.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.notificationItem}
          onPress={() => navigation.navigate("NotificationDetail", item)}
        >
          <View>
            <Image source={require('../../../assets/images/asfgaega.png')} style={styles.image} />
          </View>
          <View style={styles.textContainer}>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
              {item.title}
            </Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.content}>
              {item.message}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    // Add any necessary styles for the container
  },
  notificationItem: {
    backgroundColor: "#f5f5f5",
    padding: 5,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1, 
    borderBottomColor: "#212121", 
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    margin: 10,
  },
  textContainer: {
    flex: 1, 
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    maxWidth: 300,
  },
  content: {
    fontSize: 14,
    color: "#555",
    maxWidth: 300,
  },
});

export default ListNotification;
