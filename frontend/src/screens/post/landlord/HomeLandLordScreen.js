import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { COLORS } from "../../../constants/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import RoomList from "../../../components/common/RoomList";
import PostAPI from "../../../api/PostAPI";
import Feather from '@expo/vector-icons/Feather';
function HomeLandLord({ navigation }) {
  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  const user = useSelector((state) => state.user);
  return (
    <SafeAreaView>
      <ScrollView >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Xin Chào {user?.user?.fullName}</Text>
          </View>

          <TouchableOpacity onPress={handleSearch} accessible={false}>
            <View style={styles.functionsContainer}>
              <View style={styles.searchContainer}>
                <View>
                  <Text>Tìm kiếm tin đăng</Text>
                </View>
                <View style={styles.iconContainer}>
                  <AntDesign
                    name="search1"
                    size={24}
                    color={COLORS.gray}
                  // style={{ position: "absolute", right: 0 }}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.containerTable}>
            <View style={styles.row2}>
              <Text style={styles.columnLeft}>Phí thường niên duy trì đến ngày: </Text>
              <Text style={styles.columnRight}>
                {formatDate(user.user.package.endDate)}
              </Text>
            </View>

            {user.user.package.Vip ? (
              <>
                <View style={styles.row2}>
                  <Text style={styles.columnLeft}>Trạng thái gói VIP:</Text>
                  <Text style={styles.columnRight}>Đã đăng ký</Text>
                </View>
                <View style={styles.row2}>
                  <Text style={styles.columnLeft}>+ Số lần đẩy tin còn:</Text>
                  <Text style={styles.columnRight}>{user.user.package.pinRemaind}</Text>
                </View>

              </>
            ) : (
              <View style={styles.row2}>
                <Text style={styles.columnLeft}>Trạng thái gói VIP:</Text>
                <Text style={styles.columnRight}>Chưa đăng ký</Text>
              </View>
            )}
          </View>


          {/* Quản lý cho thuê */}
          <View style={styles.managementContainer}>
            <Text style={styles.managementContainerHeader}>Quản lý cho thuê</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.functionItem}
                onPress={() =>
                  navigation.navigate("MapMarkScreen", { isEditMode: false })
                } // Điều hướng đến Quản lý phòng
              >
                <Image
                  style={{
                    color: "#FF6347",
                    height: 24,
                    width: 24,
                  }}
                  source={require("../../../../assets/images/iconLandLords/map.png")}
                ></Image>
                <Text style={styles.functionText}>Quản lý tin trên map</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.functionItem}
                onPress={() => handleNavigate("PostManagement")} // Điều hướng đến Quản lý bài đăng
              >
                <Image
                  style={{
                    color: "#FF6347",
                    height: 24,
                    width: 24,
                  }}
                  source={require("../../../../assets/images/iconLandLords/post.png")}
                ></Image>
                <Text style={styles.functionText}>Quản lý tin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.functionItem}
                onPress={() => handleNavigate("Appointment")}
              >
                <Image
                  style={{
                    color: "#FF6347",
                    height: 24,
                    width: 24,
                  }}
                  source={require("../../../../assets/images/iconLandLords/schedule.png")}
                ></Image>
                <Text style={styles.functionText}>Lịch hẹn xem phòng</Text>
              </TouchableOpacity>
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
                  source={require("../../../../assets/images/iconLandLords/annualFee.png")}
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
                  source={require("../../../../assets/images/iconLandLords/vip.png")}
                ></Image>
                <Text style={styles.functionText}>Đăng ký VIP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
            <Text style={styles.partnerText}>Đề Xuất</Text>

            <RoomList posts={posts} onRoomPress={handleRoomPress} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  header: {
    borderRadius: 5,
    backgroundColor: COLORS.background,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: COLORS.white,
    fontSize: 18,
  },
  functionsContainer: {
    flexDirection: "row",
    position: "relative",
    marginTop: 20,
    backgroundColor: COLORS.white,
    padding: 16,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    paddingTop: 20,
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
  partnerText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  managementContainer: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    paddingHorizontal: 10,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  managementContainerHeader: {
    paddingTop: 10,
  },
  containerTable: {
    padding: 15,
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  columnLeft: {
    fontSize: 16,
    color: '#333',
    flex: 2,
  },
  columnRight: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  noVipText: {
    fontSize: 16,
    color: '#c62828',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    alignItems: "center",
    textAlign: "center",
  },
});

export default HomeLandLord;
