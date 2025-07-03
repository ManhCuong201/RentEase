import { FlatList, StyleSheet, TextInput, View } from "react-native";
import React from "react";
import CardHistoryPaymentComponent from "../components/CardHistoryPaymentComponent";
import Icon from "react-native-vector-icons/Ionicons";
const HistoryPaymentScreen = () => {
  const data = [
    {
      key: "1",
    },
    {
      key: "2",
    },
    {
      key: "3",
    },
    {
      key: "4",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="#999"
        />
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <CardHistoryPaymentComponent />}
      />
    </View>
  );
};

export default HistoryPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f5f5f5",
    margin: 16,
    borderRadius: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});
