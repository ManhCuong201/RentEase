import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const CardHistoryPaymentComponent = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="time-outline" size={18} color="black" />
          <Text style={{ marginLeft: 5 }}>19:23</Text>
        </View>
        <View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerBox}>
        <Text>Mã hóa đơn: HD00001 </Text>
        <Text>Thời gian GD: 19:23 19/09/2022</Text>
        <Text>Người nhận: Nguyễn Thế Nhi</Text>
        <Text>So tien: 100.000 VND</Text>
      </View>
    </View>
  );
};

export default CardHistoryPaymentComponent;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  containerBox: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
