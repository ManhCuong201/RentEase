import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DetailRoomOnwerScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <Image
        source={require("../../assets/images/4128209.jpg")}
        style={{ height: 170, width: "100%", resizeMode: "cover" }}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thông tin chủ trọ</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/user/userIcon.png")}
          style={styles.profile}
        />
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
          Nguyễn Thế Hùng
        </Text>
      </View>
      <View style={styles.informationProfile}>
        <View style={styles.information}>
          <View style={styles.boxInformation}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="phone" size={20} color="#71a4fb" />
              <Text style={styles.textIcon}>Điện thoại</Text>
            </View>
            <Text style={styles.textInfomation}>+84 123 456 789</Text>
          </View>
          <View style={styles.boxInformation}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="mail-open" size={20} color="orange" />
              <Text style={styles.textIcon}>Email</Text>
            </View>
            <Text style={styles.textInfomation}>+84 123 456 789</Text>
          </View>
        </View>
      </View>
      <View style={styles.bodyBlog}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
          Tin đã đăng
        </Text>
      </View>
    </ScrollView>
  );
};
export default DetailRoomOnwerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    position: "absolute",
  },
  headerText: {
    marginLeft: 30,
    fontSize: 20,
    color: "#f7f7f7",
  },
  profileContainer: {
    alignItems: "center",
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white",
    marginTop: -50,
  },
  informationProfile: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  information: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boxInformation: {
    backgroundColor: "#f7f7f7",
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    width: "47%",
  },
  textIcon: {
    color: "#afafaf",
    fontSize: 15,
    marginLeft: 10,
  },
  textInfomation: {
    color: "black",
    fontSize: 15,
    paddingTop: 30,
    fontWeight: "bold",
  },
  bodyBlog: {
    marginTop: 20,
    marginHorizontal: 15,
  },
});
