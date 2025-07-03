import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Ensure AsyncStorage is imported
import { useFocusEffect } from "@react-navigation/native";

import React from "react";
import { clearUser } from "../../../redux/slices/userSlice";

const introductionText = `
Chào mừng bạn đến với ứng dụng RentEase của chúng tôi! Sứ mệnh của chúng tôi là giúp việc tìm kiếm chỗ ở trở nên dễ dàng hơn bằng cách kết nối bạn với các chủ nhà và hỗ trợ bạn khám phá các phòng trọ, căn hộ, và nhà cho thuê gần đây trực tiếp qua Google Maps.

Với ứng dụng của chúng tôi, bạn có thể:
- Tìm kiếm các phòng trọ có sẵn được chủ nhà ghim trên bản đồ.
- Xem chi tiết và đặt lịch hẹn để tham quan phòng.
- Sử dụng Google Maps tích hợp để tính khoảng cách và chỉ đường đến chỗ ở.

Chúng tôi ở đây để đơn giản hóa quá trình tìm nhà trọ cho tất cả mọi người.
`;

const privacyPolicyText = `
Sự riêng tư của bạn là ưu tiên hàng đầu của chúng tôi. Chúng tôi chỉ thu thập các dữ liệu cần thiết để cung cấp cho bạn trải nghiệm tốt nhất, bao gồm thông tin tài khoản và thông tin đặt lịch hẹn của bạn.

Thu thập dữ liệu:
- Thông tin cá nhân (ví dụ: email) để tạo tài khoản người dùng.
- Dữ liệu sử dụng để cải thiện tính năng của ứng dụng và đề xuất các bất động sản phù hợp.
- Dữ liệu vị trí để tính khoảng cách đến các địa điểm cho thuê gần nhất trên bản đồ.

Chúng tôi cam kết không chia sẻ dữ liệu của bạn với bên thứ ba mà không có sự đồng ý của bạn, trừ khi có yêu cầu pháp lý.
`;

const termsAndServicesText = `
Khi sử dụng ứng dụng Tìm Nhà Trọ, bạn đồng ý với các điều khoản sau đây:

- Bạn có trách nhiệm đảm bảo tính chính xác của thông tin cung cấp khi tạo tài khoản.
- Đặt lịch hẹn không đảm bảo phòng trống, quyết định cuối cùng thuộc về chủ nhà.
- Ứng dụng chỉ được sử dụng cho mục đích cá nhân; nghiêm cấm sử dụng thương mại trái phép.
- Chúng tôi luôn cố gắng cung cấp khoảng cách chính xác, nhưng khoảng cách có thể thay đổi tùy thuộc vào lộ trình di chuyển thực tế.

Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.
`;

export const settingsData = (user, navigation, logout) => [
  user
    ? {
        title: "User",
        data: [
          {
            key: user.email,
            icon: <Ionicons name="person-outline" size={24} color={"black"} />,
            iconfoward: (
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="black"
              />
            ),
            onPress: () => navigation.navigate("Profile", { user }),
          },
        ],
      }
    : {
        title: "",
        data: [
          {
            key: "Đăng nhập",
            icon: <Ionicons name="log-in-outline" size={24} color={"black"} />,
            iconfoward: (
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="black"
              />
            ),
            onPress: () => navigation.navigate("Login"),
          },
        ],
      },
  {
    title: "Về ứng dụng",
    data: [
      {
        key: "Giới thiệu",
        icon: (
          <Ionicons name="information-circle-outline" size={24} color="black" />
        ),
        iconfoward: (
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        ),
        onPress: () => alert(introductionText),
      },
    ],
  },
  user
    ? {
        title: "Hoạt động",
        data: [
          {
            key: "Hẹn lịch đặt phòng",
            icon: <Ionicons name="calendar-outline" size={24} color="black" />,
            iconfoward: (
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="black"
              />
            ),
            onPress: () => navigation.navigate("Appointment"),
          },
          {
            key: "Lịch sử thanh toán",
            icon: <FontAwesome name="history" size={24} color="black" />,
            iconfoward: (
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="black"
              />
            ),
            onPress: () => navigation.navigate("HistoryPayment"),
          },
        ],
      }
    : { title: "", data: [] },

  {
    title: "Bảo mật",
    data: [
      {
        key: "Chính sách bảo mật",
        icon: (
          <Ionicons name="shield-checkmark-outline" size={24} color="black" />
        ),
        iconfoward: (
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        ),
        onPress: () => alert(privacyPolicyText),
      },
      {
        key: "Điều khoản & Dịch vụ",
        icon: <Ionicons name="key-outline" size={24} color="black" />,
        iconfoward: (
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        ),
        onPress: () => alert(termsAndServicesText),
      },
    ],
  },
  user
    ? {
        title: "Tài khoản",
        data: [
          {
            key: "Đổi mật khẩu",
            icon: <Ionicons name="key-outline" size={24} color="black" />,
            iconfoward: (
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="black"
              />
            ),
            onPress: () => alert("Đổi mật khẩu"),
          },
          {
            key: "Đăng xuất",
            icon: <Ionicons name="log-out-outline" size={24} color="black" />,
            onPress: () =>
              Alert.alert("Đăng xuất", "Bạn muốn đăng xuất?", [
                {
                  text: "Hủy",
                  style: "cancel",
                },
                {
                  text: "Đăng xuất",
                  onPress: logout, // Pass setUser to logout
                },
              ]),
          },
        ],
      }
    : { title: "", data: [] },
];
