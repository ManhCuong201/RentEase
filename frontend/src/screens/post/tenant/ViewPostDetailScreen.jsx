import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../constants/color";
import ImagesCarouselComponent from "../../../components/post/tenant/ImagesCarouselComponent";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import TermsComponent from "../../../components/post/tenant/TermsComponent";
import ServicesAndFurnituresComponent from "../../../components/post/tenant/ServicesAndFurnituresComponent";
import EstimatedCostsComponent from "../../../components/post/tenant/EstimatedCostsComponent";
import BasicInfoComponent from "../../../components/post/tenant/BasicInfoComponent";
import BookingModal from "../../../components/BookingModal";
import PostAPI from "../../../api/PostAPI";
import { useSelector } from "react-redux";
import ReportApi from "../../../api/ReportApi";
import PostOwnerInfo from "../../../components/post/tenant/PostOwnerInfo";

function ViewPostDetailScreen({ route, navigation }) {
  const { postId } = route.params;
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [postOnwer, setPostOnwer] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState({
    roomNotExist: false,
    noContact: false,
    photoNotMatch: false,
    illegalPost: false,
  });
  const [otherIssue, setOtherIssue] = useState("");
  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  const handleCheckboxToggle = (issue) => {
    setSelectedIssues({
      ...selectedIssues,
      [issue]: !selectedIssues[issue],
    });
  };

  const handleModalClose = () => setBookingModalVisible(false);
  const handleModalOpen = () => {
    if (user === null) {
      Alert.alert("Vui lòng đăng nhập để thực hiện chức năng này!");
    } else if (user.role === "tenant") {
      setBookingModalVisible(true);
    }
  };
  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        const [postData, postOwnerInfo] = await Promise.all([
          PostAPI.getPostDetailById(postId),
          PostAPI.getLandlordInfoByPostId(postId),
        ]);
        setPostData(postData);
        setPostOnwer(postOwnerInfo);
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setLoading(false); // Dừng trạng thái loading dù có lỗi hay không
      }
      // console.log(postData)
      // console.log(postOnwer)
    };
    fetchPostData();
  }, [postId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const handleReport = async () => {
    const title = "Phản ánh từ người dùng về Post";
    const message =
      "Người dùng: " +
      user.fullName +
      " đã phản ánh về post có id là: " +
      postId +
      " về việc " +
      JSON.stringify(selectedIssues) + // Chuyển selectedIssues thành chuỗi để dễ dàng hiển thị
      ". Vấn đề khác: " +
      otherIssue;
    const senderId = user._id;

    // Định nghĩa reportInfor như một biến cục bộ
    const reportInfor = {
      title,
      message,
      senderId,
      receiverId,
      postId,
    };
    const response = ReportApi.createNewReport(reportInfor);
    console.log(response);
    Alert.alert(response.message);
    setModalVisible(!modalVisible);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImagesCarouselComponent
          images={postData?.images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <BasicInfoComponent postData={postData} />
        <EstimatedCostsComponent estimatedCosts={postData?.estimatedCosts} />
        <ServicesAndFurnituresComponent postDetails={postData} />
        <PostOwnerInfo user={postOnwer} navigation={navigation} />
        <TermsComponent />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            if (user == null) {
              Alert.alert("Vui lòng đăng nhập để thực hiện chức năng này!");
            } else {
              setModalVisible(true);
            }
          }}
          style={styles.reportButton}
        >
          <Text style={styles.reportButtonText}>Báo cáo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleModalOpen}
          style={styles.bookingButton}
        >
          <Text style={styles.bookingButtonText}>Đặt lịch xem phòng</Text>
        </TouchableOpacity>

        <BookingModal
          isVisible={bookingModalVisible}
          onClose={handleModalClose}
          roomId={postId}
          landlordId={postOnwer?._id}
          user={postOnwer}
          post={postData}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <MaterialIcons name="report-gmailerrorred" size={60} color="red" />
            <Text style={styles.modalTitle}>BÁO CÁO VI PHẠM</Text>
            {/* Checkboxes */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleCheckboxToggle("roomNotExist")}
              >
                <View style={styles.checkbox}>
                  {selectedIssues.roomNotExist && (
                    <View style={styles.checkedBox} />
                  )}
                </View>
                <Text style={styles.checkboxText}>Phòng không tồn tại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleCheckboxToggle("noContact")}
              >
                <View style={styles.checkbox}>
                  {selectedIssues.noContact && (
                    <View style={styles.checkedBox} />
                  )}
                </View>
                <Text style={styles.checkboxText}>
                  Không liên hệ được chủ nhà
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleCheckboxToggle("photoNotMatch")}
              >
                <View style={styles.checkbox}>
                  {selectedIssues.photoNotMatch && (
                    <View style={styles.checkedBox} />
                  )}
                </View>
                <Text style={styles.checkboxText}>Phòng không giống ảnh</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleCheckboxToggle("illegalPost")}
              >
                <View style={styles.checkbox}>
                  {selectedIssues.illegalPost && (
                    <View style={styles.checkedBox} />
                  )}
                </View>
                <Text style={styles.checkboxText}>Đăng bài trái phép</Text>
              </TouchableOpacity>
            </View>

            {/* Input for other issue */}
            <TextInput
              style={styles.input}
              placeholder="Nội dung vi phạm khác"
              value={otherIssue}
              onChangeText={setOtherIssue}
              multiline={true}
              numberOfLines={4}
            />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleReport()}
              >
                <Text style={styles.submitButtonText}>Gửi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ViewPostDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: COLORS.backgroundMain,
  },
  reportButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#DD9A8B",
    width: 120,
    alignItems: "center",
  },
  reportButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  bookingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#F6D700",
  },
  bookingButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  checkboxContainer: {
    marginBottom: 15,
    width: "100%",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkedBox: {
    width: 12,
    height: 12,
    backgroundColor: "#FF6347",
  },
  checkboxText: {
    fontSize: 16,
  },
  input: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
