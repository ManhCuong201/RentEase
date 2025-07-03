import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS } from "../../../constants/color";

const PartnerScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đối tác RenRen</Text>
          <Text style={styles.headerSubtitle}>
            Tiếp cận nhiều khách thuê hơn, tăng tỉ lệ chốt phòng và nhiều tiện
            ích khác.
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>
              🏆 Đăng tin không giới hạn: Đăng tin thoải mái, tin của bạn luôn
              hiện lên trang đầu.
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>
              🏆 Tin đăng nổi bật: Tiếp cận nhiều khách thuê tiềm năng, tăng tỉ
              lệ lấp phòng.
            </Text>
          </View>
        </View>

        {/* Pricing Options */}
        <View style={styles.pricing}>
          <Text style={styles.pricingTitle}>Chọn gói đối tác của bạn</Text>
          <View style={styles.priceOptionContainer}>
            <View style={{ alignItems: "center" }}>
              {/* View nho nhỏ phía trên thẻ card */}
              <View style={styles.smallOverlay}>
                <Text style={{ color: COLORS.text, fontSize: 12 }}>
                  Tiết kiệm 50%
                </Text>
              </View>

              {/* Thẻ card */}
              <TouchableOpacity style={styles.priceOption}>
                <Text style={styles.priceText}>12 Tháng</Text>
                <Text style={styles.priceCost}>5.500.000đ</Text>
                <Text style={styles.priceNote}>115.000đ/tuần</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.priceOption}>
              <Text style={styles.priceText}>6 Tháng</Text>
              <Text style={styles.priceCost}>3.300.000đ</Text>
              <Text style={styles.priceNote}>137.000đ/tuần</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.priceOption}>
              <Text style={styles.priceText}>3 Tháng</Text>
              <Text style={styles.priceCost}>2.200.000đ</Text>
              <Text style={styles.priceNote}>183.000đ/tuần</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.packageDetail}>
          <View style={styles.packageItem4}>
            <Text style={styles.packageText}>Hiện tại</Text>
            <View>
              <Text>Miễn phí</Text>
            </View>
          </View>
          <View style={styles.featureItem8}>
            <View>
              <Text>Miễn phí 3 bài đăng</Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 4,
  },
  features: {
    padding: 16,
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  featureItem: {
    marginVertical: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#333",
  },
  pricing: {
    padding: 16,
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  priceOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallOverlay: {
    width: 100,
    height: 20,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    position: "absolute",
    top: 5,
    zIndex: 1,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  priceOption: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 2,
    marginTop: 15,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  priceCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff5722",
    marginVertical: 5,
  },
  priceNote: {
    fontSize: 12,
    color: "#999",
  },
  continueButton: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    margin: 16,
  },
  continueButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },

  packageDetail: {
    padding: 16,
    backgroundColor: "#fff",
    margin: 10,
    marginHorizontal: 18,
    borderRadius: 10,
    elevation: 2,
    flex: 1,
    flexDirection: "row",
  },
  packageItem4: {
    marginVertical: 8,
    flex: 2,
  },
  packageItem8: {
    marginVertical: 8,
    flex: 10,
  },
  packageText: {
    fontSize: 14,
    color: "#333",
  },
});

export default PartnerScreen;
