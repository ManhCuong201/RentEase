import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import RoomMarker from "../../../components/post/tenant/onmap/MarkerComponent";
import RoomBottomSheet from "../../../components/post/tenant/onmap/BottomSheetComponent";
import PostAPI from "../../../api/PostAPI";
import { useSelector } from "react-redux";
import { COLORS } from "../../../constants/color";
import { useFocusEffect } from "@react-navigation/native";

const STATUS_OPTIONS = ["all", "draft", "public", "scheduled", "banned"];

const STATUS_LABELS = {
  all: "All",
  draft: "Draft",
  public: "Public",
  scheduled: "Scheduled",
  banned: "Banned",
};

const SearchOnMapScreen = ({ navigation, route }) => {
  const editRoomId = route.params?.roomId;
  const user = useSelector((state) => state.user.user);
  const isEditMode = route.params?.isEditMode ?? false;
  const postId = route.params?.postId ?? false;

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [markerColors, setMarkerColors] = useState({});
  const bottomSheetAnimation = useRef(new Animated.Value(0)).current;
  const [rooms, setRooms] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(
    route.params?.selectedLocation || null
  );
  const [selectedStatus, setSelectedStatus] = useState(
    isEditMode ? null : "public"
  );

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.selectedLocation) {
        setSelectedLocation(route.params.selectedLocation);
      }
    }, [route.params?.selectedLocation])
  );

  useEffect(() => {
    const fetchLocationAndRooms = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      if (isEditMode && editRoomId) {
        const roomInfo = await PostAPI.getPostDetailByIdOnMap(editRoomId);

        // Check if roomInfo.coordinate is null or incomplete, set default values if necessary
        if (
          roomInfo &&
          roomInfo.coordinate != null &&
          roomInfo.coordinate.latitude != null &&
          roomInfo.coordinate.longitude != null
        ) {
          setSelectedLocation(roomInfo.coordinate);
        } else {
          console.log("Setting default coordinate values as fallback");
          // Set default location if coordinate is missing
          setSelectedLocation({
            latitude: currentLocation?.coords?.latitude || 0, // default to a non-null value
            longitude: currentLocation?.coords?.longitude || 0,
          });
        }
      } else if (!isEditMode) {
        fetchRooms();
      }
    };

    fetchLocationAndRooms();
  }, [user, isEditMode, editRoomId]);

  const fetchRooms = async () => {
    if (isEditMode) return;
    try {
      const status = isEditMode
        ? selectedStatus === null
          ? ""
          : selectedStatus
        : selectedStatus === "all"
        ? ""
        : selectedStatus || "public";

      const roomsInfo = await PostAPI.getAllPostInfoOnMapByUser(
        user._id,
        status
      );
      if (roomsInfo && Array.isArray(roomsInfo.posts)) {
        setRooms(roomsInfo.posts);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedStatus, isEditMode]);

  const handleMarkerPress = async (room) => {
    if (isEditMode) return;
    setMarkerColors((prev) => ({
      ...prev,
      [room._id]: "orange",
    }));

    const roomInfo = await PostAPI.getPostDetailByIdOnMap(room._id);
    setSelectedRoom(roomInfo);

    Animated.spring(bottomSheetAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleMapPress = (event) => {
    if (selectedRoom) {
      closeBottomSheet();
    }
    if (isEditMode) {
      setSelectedLocation(event.nativeEvent?.coordinate);
    }
  };

  const closeBottomSheet = () => {
    Animated.spring(bottomSheetAnimation, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setSelectedRoom(null);
      setMarkerColors({});
    });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      // Check the source screen and navigate back to the appropriate screen with the selected location
      if (route.params?.sourceScreen === "EditPostScreen") {
        navigation.navigate("EditPostScreen", { selectedLocation, postId });
      } else {
        navigation.navigate("CreatePost", { selectedLocation });
      }
    } else {
      console.log("No location selected");
    }
  };
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handleDetailPress = (postId) => {
    if (selectedRoom) {
      navigation.navigate("ViewPostDetailScreen", { postId });
    } else {
      closeBottomSheet();
    }
  };

  const handleDirectionPress = (room) => {
    const latitude = room?.coordinate?.latitude;
    const longitude = room?.coordinate?.longitude;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {!isEditMode && (
        <View style={styles.filterContainer}>
          {STATUS_OPTIONS.map((status, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.filterButtonActive,
              ]}
              onPress={() => handleStatusFilter(status)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedStatus === status && styles.activeButtonText,
                ]}
              >
                {STATUS_LABELS[status]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {location ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation?.latitude || location?.coords.latitude,
              longitude:
                selectedLocation?.longitude || location?.coords.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            mapType="standard"
            showsUserLocation={true}
            onPress={handleMapPress}
          >
            {rooms &&
              rooms.map(
                (room) =>
                  room.coordinate?.latitude &&
                  room.coordinate?.longitude && (
                    <RoomMarker
                      key={room._id}
                      room={room}
                      onPress={() => handleMarkerPress(room)}
                      isSelected={selectedRoom?._id === room._id}
                      markerColor={markerColors[room._id] || "orange"}
                    />
                  )
              )}
            {selectedLocation &&
              selectedLocation.latitude &&
              selectedLocation.longitude && (
                <Marker
                  coordinate={selectedLocation}
                  pinColor="orange"
                  title="Selected Location"
                />
              )}
          </MapView>
          {isEditMode && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.paragraph}>{errorMsg || "Loading..."}</Text>
      )}

      {selectedRoom && (
        <RoomBottomSheet
          selectedRoom={selectedRoom}
          handleDetailPress={handleDetailPress}
          handleDirectionPress={handleDirectionPress}
          bottomSheetAnimation={bottomSheetAnimation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "white",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: COLORS.white,
  },
  filterButton: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.background,
    minWidth: 60,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: COLORS.background,
    color: COLORS.white,
  },
  filterButtonText: {
    color: COLORS.text,
  },
  activeButtonText: {
    color: COLORS.white,
  },
  map: {
    flex: 1,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SearchOnMapScreen;
