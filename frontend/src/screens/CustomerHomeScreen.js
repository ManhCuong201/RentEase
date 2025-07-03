import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Image,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PostAPI from "../api/PostAPI";
import RoomList from "../components/common/RoomList";
import { COLORS } from "../constants/color";
import { useSelector } from "react-redux";

function CustomerHomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const user = useSelector((state) => state.user);

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsInfo = await PostAPI.get5NewestPinnedPost();
        if (postsInfo && Array.isArray(postsInfo.posts)) {
          setPosts(postsInfo.posts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        setErrorMsg("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleRoomPress = (postId) => {
    navigation.navigate("ViewPostDetailScreen", { postId });
  };

  const handleSearch = () => {
    navigation.navigate("SearchHouse");
  };

  const handlePressSearchOnMap = () => {
    navigation.navigate("SearchOnMapScreen");
  };


  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../assets/images/Banner.png')}
      />

      <View style={styles.searchWrapper}>
        <TouchableOpacity style={styles.searchContainer} onPress={handleSearch}>
          <Text style={styles.searchInput}>Tìm kiếm tin đăng</Text>
        </TouchableOpacity>
        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: "#BBBBBB",
            paddingBottom: 10,
          }}
        >
          <Text style={styles.searchTrendText}>Xu Hướng tìm kiếm</Text>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleSearch}>
            <Image
              style={{
                color: "#FF6347",
                height: 24,
                width: 24,
              }}
              source={require("../../assets/images/iconLandLords/searchRoom.png")}
            ></Image>
            <Text style={styles.menuText}>Phòng trọ sinh viên</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePressSearchOnMap}
          >
            <Image
              style={{
                color: "#FF6347",
                height: 24,
                width: 24,
              }}
              source={require("../../assets/images/iconLandLords/map.png")}
            ></Image>
            <Text style={styles.menuText}>Tìm phòng trên map</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Image
              style={{
                color: "#FF6347",
                height: 24,
                width: 24,
              }}
              source={require("../../assets/images/iconLandLords/roomCheap.png")}
            ></Image>
            <Text style={styles.menuText}>Phòng trọ giá rẻ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Image
              style={{
                color: "#FF6347",
                height: 24,
                width: 24,
              }}
              source={require("../../assets/images/iconLandLords/pet.png")}
            ></Image>
            <Text style={styles.menuText}>Nuôi thú cưng</Text>
          </TouchableOpacity>
        </View>
      </View>

      {user && user._id && (
        <View style={styles.register}>
          <View
            style={{
              borderBottomWidth: 2,
              borderBottomColor: "#BBBBBB",
              paddingBottom: 10,
            }}
          >
            <Text style={styles.searchTrendText}>Trở thành nhà chủ</Text>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.functionItem}
              onPress={() => handleNavigate("AnnualFee", { isEditMode: false })} // Điều hướng đến Quản lý phòng
            >
              <Image
                style={{
                  color: "#FF6347",
                  height: 24,
                  width: 24,
                }}
                source={require("../../assets/images/iconLandLords/annualFee.png")}
              ></Image>
              <Text style={styles.functionText}>Phí thường niên</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.functionItem}
              onPress={() => handleNavigate("AnnualFee")} // Điều hướng đến Quản lý bài đăng
            >
              <Image
                style={{
                  color: "#FF6347",
                  height: 24,
                  width: 24,
                }}
                source={require("../../assets/images/iconLandLords/vip.png")}
              ></Image>
              <Text style={styles.functionText}>Đăng ký VIP</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Text style={styles.partnerText}>Đề Xuất</Text>

          <RoomList posts={posts} onRoomPress={handleRoomPress} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: 200,
    justifyContent: "center",
  },
  searchWrapper: {
    marginTop: -50,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 3,
  },

  register: {
    marginVertical: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 3,
  },

  row: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  functionItem: {
    alignItems: "center",
    width: 100,
  },
  functionText: {
    fontSize: 12,
    fontWeight: "500",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    textAlign: "left",
    backgroundColor: "#EEEEEE",
    padding: 10,
    borderRadius: 10,
    color: "#BBBBBB",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 30,
  },
  menuItem: {
    alignItems: "center",
  },
  menuText: {
    width: 60,
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
  },
  searchTrendText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  partnerText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default CustomerHomeScreen;
