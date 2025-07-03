import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  DrawerLayoutAndroid,
  TextInput,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";
import CustomButton from "../../../components/common/CustomButton";
import FurnitureAPI from "../../../api/FurnitureApi";
import ServiceAPI from "../../../api/ServiceApi";
import { fetchCities } from "../../../api/AddressApi";
import PostAPI from "../../../api/PostAPI";
import RoomList from "../../../components/common/RoomList";
import NavigationDrawer from "../../../components/post/tenant/NavigationDrawer"; 

function SearchPublicPost({ navigation }) {
  const [noiThat, setNoiThat] = useState([]);
  const [tienNghi, setTienNghi] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cities, setCities] = useState([]);
  const [drawerKey, setDrawerKey] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchFurnitures, setSearchFurnitures] = useState([]);
  const [searchServices, setSearchServices] = useState([]);
  const [cityId, setCityId] = useState("");
  const drawer = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const [citiesData, furniture, services] = await Promise.all([
        fetchCities(),
        FurnitureAPI.getAllFurniture(),
        ServiceAPI.getAllService(),
      ]);

      setCities(citiesData);
      setNoiThat(furniture);
      setTienNghi(services);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const response = await PostAPI.getPostBySearch(
          searchKey,
          8,
          searchServices,
          searchFurnitures,
          sortOption,
          priceRange,
          cityId
        );
        setRooms(response.posts);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRoomsData();
  }, [searchKey, sortOption, priceRange, cityId, searchFurnitures, searchServices]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setTimeout(() => {
        setDrawerKey((prevKey) => prevKey + 1);
        if (drawer.current) {
          drawer.current.closeDrawer();
        }
      }, 100); // Delay 100ms
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <DrawerLayoutAndroid
      key={drawerKey}
      ref={drawer}
      drawerWidth={250}
      drawerPosition="right"
      renderNavigationView={() => (
        <NavigationDrawer
          searchFurnitures={searchFurnitures}
          setSearchFurnitures={setSearchFurnitures}
          searchServices={searchServices}
          setSearchServices={setSearchServices}
          tienNghi={tienNghi}
          noiThat={noiThat}
          drawer={drawer}
        />
      )}
    >
      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <EvilIcons name="search" size={30} color="black" style={styles.iconSearch} />
          <TextInput
            style={styles.inputSearch}
            placeholder="Nhập tiêu đề tin đăng"
            placeholderTextColor="#888"
            value={searchKey}
            onChangeText={(text) => setSearchKey(text)}
          />
        </View>
        <View style={styles.filterBar}>
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "Sắp xếp theo", value: "" },
              { label: "Giá tăng dần", value: "priceUp" },
              { label: "Giá giảm dần", value: "priceDown" },
              { label: "Bảng chữ cái", value: "title" },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Sắp xếp theo"
            value={sortOption}
            onChange={(item) => setSortOption(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "Khoảng giá", value: "" },
              { label: "Dưới 1 triệu", value: "under1m" },
              { label: "1-3 triệu", value: "1to3m" },
              { label: "Trên 3 triệu", value: "above3m" },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Khoảng giá"
            value={priceRange}
            onChange={(item) => setPriceRange(item.value)}
          />
          <TouchableOpacity onPress={() => drawer.current.openDrawer()} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <FontAwesome name="filter" size={20} color="#F6D700" />
            <Text style={styles.filterText}>Lọc</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", margin: 10, borderRadius: 15, borderWidth: 1, borderColor: "gray", alignItems: "center" }}>
          <FontAwesome style={{ marginLeft: 20 }} name="map-pin" size={24} color="#F6D700" />
          <Dropdown
            style={[styles.dropdown_place, { flex: 1, marginLeft: 10 }]}
            data={cities.map((city) => ({ label: city.name, value: city.cityId }))}
            labelField="label"
            valueField="value"
            placeholder="Khu vực tìm kiếm"
            value={cityId || ""}
            onChange={(item) => setCityId(item.value)}
          />
        </View>
        <RoomList posts={rooms} onRoomPress={(postId) => navigation.navigate("ViewPostDetailScreen", { postId })} />
      </ScrollView>
    </DrawerLayoutAndroid>
  );
}

export default SearchPublicPost;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 65,
  },
  iconSearch: {
    position: "absolute",
    left: 10,
    zIndex: 1,
    top: 16,
    paddingTop: 63,
  },
  inputSearch: {
    flex: 1,
    height: 60,
    fontSize: 18,
    color: "black",
    backgroundColor: "white",
    paddingLeft: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "gray",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },
  filterText: {
    paddingLeft: 5,
    paddingTop: 3,
  },
  dropdown: {
    height: 50,
    width: 150,
    backgroundColor: "white",
    padding: 12,
  },
  dropdown_place: {
    height: 50,
    width: "90%",
    padding: 12,
  },
});
