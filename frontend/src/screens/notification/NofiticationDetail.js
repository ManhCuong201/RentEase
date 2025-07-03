import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import React from "react";

const NotificationDetail = ({ route }) => {
  const { title, message } = route.params;

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/asfgaega.png')} style={styles.image} />
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={{backgroundColor: "black", height: 1, width: 340, margin: 20}}></Text>
      <Text style={styles.content}>
        {message}
      </Text>
    </View>
  );
};

export default NotificationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 230,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    maxWidth: "100%", // Giới hạn chiều rộng tối đa cho tiêu đề
    flexWrap: 'wrap', // Cho phép xuống dòng
  },
  content: {
    fontSize: 16,
    color: "#555",
    maxWidth: "100%", // Giới hạn chiều rộng tối đa cho nội dung
    flexWrap: 'wrap', // Cho phép xuống dòng
  },
});
