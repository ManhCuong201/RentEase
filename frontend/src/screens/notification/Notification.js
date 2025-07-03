import { StyleSheet, Text, View, TextInput, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import axios from "axios";
import ListNotification from "../../components/common/ListNotification";
import NotificationApi from "../../api/NotificationApi";
import { useSelector } from "react-redux";

function Notification({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let response;
        if (user == null) {
          response = await NotificationApi.viewNotificationByUserId("671ced2b340c0010dde6822c"); // Ensure await is used here
        } else {
          response = await NotificationApi.viewNotificationByUserId(user._id); // Ensure await is used here
        }

        if (response && response.data) {
          setNotifications(response.data);
        } else {
          console.error("No data found in the response");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const filteredNotifications = notifications?.filter(notification =>
    notification.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerContent}>THÔNG BÁO</Text>
        <View style={styles.searchContainer}>
          <EvilIcons name="search" size={28} color="#1F6DFF" style={styles.iconSearch} />
          <TextInput
            style={styles.inputSearch}
            placeholder="Tìm kiếm"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ListNotification products={filteredNotifications} navigation={navigation} />
    </View>
  );
}

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#EEE690",
    paddingVertical: 40,
    paddingBottom: 20,
  },
  headerContent: {
    fontSize: 25,
    textAlign: "center",
    color: "#000000",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    position: "relative",
    marginLeft: 20,
    marginRight: 20,
  },
  iconSearch: {
    position: "absolute",
    left: 10,
    zIndex: 1,
    top: 16,
  },
  inputSearch: {
    flex: 1,
    height: 60,
    width: 260,
    fontSize: 18,
    color: "black",
    backgroundColor: "white",
    paddingLeft: 40,
    borderRadius: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
