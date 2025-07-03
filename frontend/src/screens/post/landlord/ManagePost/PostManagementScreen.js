import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  Modal,
  Alert,
  Image,
  LayoutAnimation,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios"; // Thêm axios để gọi API
import CardComponent from "../../../../components/post/landlord/CardComponent";
import { COLORS } from "../../../../constants/color";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import messages from "../../../../constants/messages";
import PostAPI from "../../../../api/PostAPI";
import { useSelector } from "react-redux";
import SearchComponent from "../../../../components/SearchComponent";
import ConfirmModal from "../../../../components/Utils/ConfirmModalComponent";
import { currentTime } from "../../../../utils/time";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../redux/slices/userSlice";

const PostManagement = () => {
  const route = useRoute();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [expandedIds, setExpandedIds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("draft");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [searchText, setSearchText] = useState("");
  const dateNow = currentTime();

  useEffect(() => {
    if (user && user?._id) {
      const fetchPosts = async () => {
        setLoading(true);
        const userId = user?._id;
        const status = selectedTab;

        try {
          // Gọi API lấy danh sách bài đăng với searchText
          const response = await PostAPI.getAllPostByOwnerId(
            userId,
            searchText,
            status
          );
          setPosts(response);
          setExpandedIds([]); // Đặt expandedIds thành mảng rỗng khi tải trang
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Lỗi khi tải danh sách bài đăng",
            text2: error.message,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [selectedTab, user, searchText, , route.params?.refresh]); // Thêm searchText vào đây để gọi lại API khi thay đổi

  // Reset `refresh` về `false` sau khi gọi API
  useEffect(() => {
    if (route.params?.refresh) {
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);
  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds(
      (prevIds) => (prevIds.includes(id) ? [] : [id]) // If already expanded, close it; otherwise, open only this item
    );
  };

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  // Hàm để xử lý sự kiện tìm kiếm
  const handleSearch = (text) => {
    setSearchText(text); // Cập nhật giá trị searchText, bao gồm cả chuỗi trống
  };

  const [modalConfig, setModalConfig] = useState({
    isVisible: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    if (selectedPost && modalType) {
      let config = {
        isVisible: true,
        onConfirm: null,
        title: "",
        message: "",
      };

      switch (modalType) {
        case "delete":
          config.title = "Xóa bài đăng";
          config.message = "Bạn có chắc chắn muốn xóa bài đăng này?";
          config.onConfirm = handleDeletePost;
          break;
        case "post":
          config.title = "Đăng bài";
          config.message = "Bạn có chắc chắn muốn đăng bài này?";
          config.onConfirm = handlePostPost;
          break;
        case "remove":
          config.title = "Gỡ bài đăng";
          config.message = "Bạn có chắc chắn muốn gỡ bài đăng này?";
          config.onConfirm = handleRemovePost;
          break;
        case "pin":
          const pinStatus = posts.find(
            (post) => post._id === selectedPost
          )?.pin;
          const action = pinStatus ? "gỡ ghim" : "ghim";
          config.title = `${
            action.charAt(0).toUpperCase() + action.slice(1)
          } bài đăng`;
          config.message = `Bạn có chắc chắn muốn ${action} bài đăng này?`;
          config.onConfirm = handlePinPost;
          break;
      }

      setModalConfig(config);
    }
  }, [selectedPost, modalType]);

  const showModal = (type, item) => {
    setSelectedPost(item); // Cập nhật bài đăng được chọn
    setModalType(type); // Cập nhật loại modal
  };

  const handleDeletePost = async () => {
    try {
      await PostAPI.deletePost(selectedPost);
      setPosts(posts.filter((post) => post._id !== selectedPost));
      Toast.show({
        type: "success",
        text1: `${messages.ME009}`,
      });
      setExpandedIds([]); // Reset expandedIds

      handleCloseModal();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${messages.ME008}`,
        text2: error.message,
      });
      handleCloseModal();
    } finally {
      setModalConfig({ ...modalConfig, isVisible: false });
    }
  };

  const handlePostPost = async () => {
    try {
      const data = {
        status: "public",
        userId: user._id,
      };
      await PostAPI.changeStatusPost(selectedPost, data);
      setPosts(posts.filter((post) => post._id !== selectedPost));
      setExpandedIds([]); // Reset expandedIds

      Toast.show({
        type: "success",
        text1: "Đăng bài thành công",
      });
      handleCloseModal();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Đăng bài thất bại",
        text2: error.message,
      });
      handleCloseModal();
    } finally {
      setModalConfig({ ...modalConfig, isVisible: false });
    }
  };

  const handleRemovePost = async () => {
    try {
      const data = {
        status: "draft",
        userId: user._id,
      };

      // Check if the selected post was pinned
      const selectedPostData = posts.find((post) => post._id === selectedPost);
      const wasPinned = selectedPostData?.pin;

      await PostAPI.changeStatusPost(selectedPost, data);
      setPosts(posts.filter((post) => post._id !== selectedPost));
      setExpandedIds([]); // Reset expandedIds

      // Show a success toast notification
      Toast.show({
        type: "success",
        text1: "Gỡ bài thành công",
      });

      // Update the user package's pinRemaind if the post was pinned
      if (wasPinned) {
        const updatedUser = {
          ...user,
          package: {
            ...user.package,
            pinRemaind: user.package.pinRemaind + 1, // Increment pinRemaind
          },
        };

        // Dispatch the updated user to the Redux store
        dispatch(setUser(updatedUser));
      }

      handleCloseModal();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Gỡ bài thất bại",
        text2: error.message,
      });
      handleCloseModal();
    } finally {
      setModalConfig({ ...modalConfig, isVisible: false });
    }
  };

  const handlePinPost = async () => {
    try {
      const userId = user._id;
      const id = selectedPost;

      const selectedPostData = posts.find((post) => post._id === selectedPost);
      const isPinned = selectedPostData?.pin;

      // Dispatch action để cập nhật số lần ghim trong Redux store
      const pinRemaindChange = isPinned
        ? user.package.pinRemaind + 1
        : user.package.pinRemaind - 1;

      // Kiểm tra điều kiện trước khi cho phép ghim
      setExpandedIds([]); // Reset expandedIds

      if (!isPinned) {
        if (user.package.pinRemaind === 0) {
          Toast.show({
            type: "error",
            text1: "Bạn đã hết lượt đẩy tin!",
          });
          return; // Ngừng thực hiện nếu hết lượt đẩy tin
        }

        if (!user.package.Vip) {
          Toast.show({
            type: "error",
            text1: "Bạn không phải người dùng VIP!",
          });
          return; // Ngừng thực hiện nếu không phải VIP
        }
      }

      const result = await PostAPI.changePinPost(id, userId);
      setPosts(
        posts.map((post) =>
          post._id === selectedPost ? { ...post, pin: !post.pin } : post
        )
      );
      setExpandedIds([]); // Reset expandedIds

      Toast.show({
        type: "success",
        text1: result.result.message,
      });

      if (result.result.type !== "error") {
        const updatedUser = {
          ...user,
          package: {
            ...user.package,
            pinRemaind: pinRemaindChange, // Cập nhật pinRemaind tùy theo trạng thái ghim
          },
        };

        // Cập nhật user trong Redux store
        dispatch(setUser(updatedUser));
      }

      handleCloseModal();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
      handleCloseModal();
    } finally {
      setModalConfig({ ...modalConfig, isVisible: false });
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isVisible: false });
    setSelectedPost(null); // Reset selectedPost để modal có thể mở lại với giá trị mới
    setModalType(null); // Reset modalType để xử lý lại lần nhấn tiếp theo
  };

  return (
    <View style={styles.container}>
      <SearchComponent searchText={searchText} onSearch={handleSearch} />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "draft" && styles.activeTab]}
          onPress={() => handleTabPress("draft")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "draft" && styles.activeTabText,
            ]}
          >
            Draft
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "public" && styles.activeTab]}
          onPress={() => handleTabPress("public")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "public" && styles.activeTabText,
            ]}
          >
            Public
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "scheduled" && styles.activeTab]}
          onPress={() => handleTabPress("scheduled")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "scheduled" && styles.activeTabText,
            ]}
          >
            Scheduled
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "banned" && styles.activeTab]}
          onPress={() => handleTabPress("banned")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "banned" && styles.activeTabText,
            ]}
          >
            Banned
          </Text>
        </TouchableOpacity>
      </View>
      {user.package &&
        user.package.Vip === true &&
        Date(user.package.endDate) > dateNow && (
          <View style={styles.pinComponent}>
            <Text style={styles.pinText}>
              Hiện bạn còn {user.package.pinRemaind} lượt đẩy tin
            </Text>
          </View>
        )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : posts && posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <CardComponent
              item={item}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onPost={(item) => showModal("post", item)}
              onRemove={(item) => showModal("remove", item)}
              onDelete={(item) => showModal("delete", item)}
              onEdit={(item) => {
                navigation.navigate("EditPostScreen", { postId: item });
              }}
              onView={(item) => {
                navigation.navigate("ViewPostDetailScreen", { postId: item });
              }}
              onPin={(item) => {
                showModal("pin", item);
              }}
            />
          )}
          keyExtractor={(item) => item._id}
          style={styles.listPostContainer}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Không có bài đăng nào.</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => {
          requestAnimationFrame(() => {
            navigation.navigate("CreatePost");
          });
        }}
        style={{ flex: 1 }}
      >
        <View style={styles.addAction}>
          <AntDesign name="plus" size={30} color="white" />
        </View>
      </TouchableOpacity>

      <ConfirmModal
        isVisible={modalConfig.isVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={handleCloseModal} // Sử dụng hàm này để reset khi đóng modal
        onConfirm={modalConfig.onConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundMain,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
    marginVertical: 10,
    borderRadius: 5,
  },
  listPostContainer: {
    marginHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "400",
    flex: 1,
    textAlign: "center",
    paddingRight: 200,
  },
  icon: {
    width: 24,
    height: 24,
  },

  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginHorizontal: 5,
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  tabText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "400",
  },
  activeTab: {
    backgroundColor: COLORS.background,
  },
  activeTabText: {
    color: COLORS.white,
  },
  addAction: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginBottom: 20,
    marginRight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  pinComponent: {
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  pinText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default PostManagement;
