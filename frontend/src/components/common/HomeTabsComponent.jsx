import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import CustomerHomeScreen from "../../screens/CustomerHomeScreen";
import SearchPublicPost from "../../screens/post/tenant/SearchPublicPost"; 
import Setting from "../../screens/settings/SettingScreen";
import Notification from "../../screens/notification/Notification";
import Entypo from "@expo/vector-icons/Entypo";
import HomeLandLord from "../../screens/post/landlord/HomeLandLordScreen";

import PostManagement from "../../screens/post/landlord/ManagePost/PostManagementScreen";
import { useAuth } from "../../context/authContext";
const Tab = createBottomTabNavigator();

export default function HomeTabsComponent() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="Rent"
      screenOptions={{
        headerShown: false,
      }}
    >
      {
      user && user?.role == "landlord" 
      ? (
        <Tab.Screen
          name="Rent"
          component={HomeLandLord}
          options={{
            title: "Trang Chủ",
            tabBarIcon: ({ size, color }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Rent"
          component={CustomerHomeScreen}
          options={{
            title: "Trang Chủ",
            tabBarIcon: ({ size, color }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
      )}

      {user && user?.role == "landlord" ? (
        <Tab.Screen
          name="PostManagement"
          component={PostManagement}
          options={{
            headerShown: true,
            title: "Quản Lý Tin",
            headerTitleAlign: "center",
            tabBarIcon: ({ size, color }) => (
              <Entypo name="shop" size={24} color={color} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="SearchHouse"
          component={SearchPublicPost}
          options={{
            title: "Tìm Phòng",
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="search-sharp" size={size} color={color} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Nofitication"
        component={Notification}
        options={{
          title: "Thông Báo",
          tabBarIcon: ({ size, color }) => (
            <Ionicons
              name="notifications-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          title: "Tài Khoản",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
