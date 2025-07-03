import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AppRegistry } from "react-native";
import { AuthProvider } from "./src/context/authContext";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import ProfileScreen from "./src/screens/common/ProfileScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import PartnerScreen from "./src/screens/post/landlord/PartnerScreen";
import { name as appName } from "./app.json";
import DetailRoomOnwerScreen from "./src/screens/DetailRoomOnwerScreen";
import ViewPostDetailScreen from "./src/screens/post/tenant/ViewPostDetailScreen";
import NotificationDetail from "./src/screens/notification/NofiticationDetail";
import Appointment from "./src/screens/appointment/Appointment";
import CustomerReportScreen from "./src/screens/CustomerReportScreen";
import BookingSuccessScreen from "./src/screens/BookingSuccessful";
import Toast from "react-native-toast-message";
import HomeTabsComponent from "./src/components/common/HomeTabsComponent";
import SearchOnMapScreen from "./src/screens/post/tenant/SearchOnMapScreen";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostManagement from "./src/screens/post/landlord/ManagePost/PostManagementScreen";
import EditPostScreen from "./src/screens/post/landlord/ManagePost/EditPost";
import CreatePost from "./src/screens/post/landlord/ManagePost/CreatePost";
import AnnualFee from "./src/screens/post/landlord/PaymentScreens/AnnualFee";
import HistoryPaymentScreen from "./src/screens/HistoryPaymentScreen";
import AuthHOC from "./src/hoc/AuthHOC";
import MapMarkScreen from "./src/screens/post/landlord/MapMarkScreen";
import { EvilIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import ViewLandlordInfo from "./src/screens/post/tenant/ViewLandlordInfo";
import AfterPayment from "./src/screens/post/landlord/PaymentScreens/AfterPayment";
import SearchPublicPost from "./src/screens/post/tenant/SearchPublicPost";
const Stack = createStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={"Home"}>
              {/* Cách dùng HOC
              <Stack.Screen
                name="RoomManagement"
                component={AuthHOC(RoomManagement, ['Admin', 'Landlord'])}
                options={{ headerShown: true, title: "Quản lý phòng" }}
              />
              Cách dùng HOC */}

              <Stack.Screen
                name="Home"
                component={HomeTabsComponent}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  title: "Cập nhật thông tin",
                  headerTitleAlign: "center",
                }}
              />
              <Stack.Screen
                name="Partner"
                component={PartnerScreen}
                options={{ title: "Hồ sơ cá nhân", headerTitleAlign: "center" }}
              />
              <Stack.Screen
                name="PostManagement"
                component={PostManagement}
                options={{ headerShown: true, title: "Quản lý tin" }}
              />
              <Stack.Screen
                name="CreatePost"
                component={CreatePost}
                options={{ headerShown: true, title: "Thêm tin" }}
              />
              <Stack.Screen
                name="EditPostScreen"
                component={EditPostScreen}
                options={{ headerShown: true, title: "Sửa tin tức" }}
              />
              <Stack.Screen
                name="NotificationDetail"
                component={NotificationDetail}
                options={{
                  title: "Chi tiết thông báo",
                  headerStyle: {
                    backgroundColor: "#EEE690", // Đặt màu nền cho header ở đây
                  },
                }}
              />
              <Stack.Screen
                name="DetailRoomOnwer"
                component={DetailRoomOnwerScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="AnnualFee" component={AnnualFee} />
              <Stack.Screen name="AfterPayment" component={AfterPayment} />
              <Stack.Screen
                name="Appointment"
                component={Appointment}
                options={{
                  title: "Quản lý lịch hẹn",
                  headerRight: () => (
                    <TouchableOpacity
                      style={{ marginRight: 15 }}
                      onPress={() => console.log("Search pressed!")}
                    >
                      <EvilIcons name="search" size={30} color="#1F6DFF" />
                    </TouchableOpacity>
                  ),
                }}
              />

              <Stack.Screen
                name="CustomerReportScreen"
                component={CustomerReportScreen}
                options={{ title: "Báo cáo trọ" }}
              />

              <Stack.Screen
                name="SearchHouse"
                component={SearchPublicPost}
                options={{ title: "Tìm Phòng" }}
              />
              <Stack.Screen
                name="SearchOnMapScreen"
                component={SearchOnMapScreen}
                options={{
                  headerTitle: "Khám Phá Phòng",
                  headerTitleAlign: "center",
                }}
              />
              <Stack.Screen
                name="MapMarkScreen"
                component={MapMarkScreen}
                options={{
                  headerTitle: "Phòng của tôi trên map",
                  headerTitleAlign: "center",
                }}
              />

              <Stack.Screen
                name="ViewPostDetailScreen"
                component={ViewPostDetailScreen}
                options={{
                  headerTitle: "Chi tiết phòng",
                  headerBackTitle: "Back",
                }}
              />
              <Stack.Screen
                name="BookingSuccess"
                component={BookingSuccessScreen}
                options={{
                  headerTitle: "Đặt lịch thành công",
                }}
              />
              <Stack.Screen
                name="HistoryPayment"
                component={HistoryPaymentScreen}
                options={{
                  headerTitle: "Lịch sử giao dịch",
                  headerStyle: {
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  },
                }}
              />

              <Stack.Screen
                name="ViewLandlordInfo"
                component={ViewLandlordInfo}
                options={{ title: "Thông tin chủ trọ" }}
              />
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
