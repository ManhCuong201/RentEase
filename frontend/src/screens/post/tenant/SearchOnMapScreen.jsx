import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Animated, Linking } from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import RoomMarker from "../../../components/post/tenant/onmap/MarkerComponent";
import RoomBottomSheet from "../../../components/post/tenant/onmap/BottomSheetComponent";
import PostAPI from "../../../api/PostAPI";

const SearchOnMapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [markerColors, setMarkerColors] = useState({});
  const bottomSheetAnimation = useRef(new Animated.Value(0)).current;
  const [rooms, setRooms] = useState(null);

  const handleDetailPress = (postId) => {
    if (selectedRoom) {
      navigation.navigate("ViewPostDetailScreen", { postId });
    } else {
      closeBottomSheet();
    }
  };

  const handleDirectionPress = (room) => {
    const latitude = room.coordinate.latitude;
    const longitude = room.coordinate.longitude;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    const fetchLocationAndRooms = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const roomsInfo = await PostAPI.getAllPostInfoOnMap();
      if (roomsInfo && Array.isArray(roomsInfo.posts)) {
        setRooms(roomsInfo.posts);
      } else {
        setRooms([]);
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    fetchLocationAndRooms();
  }, []);

  const handleMarkerPress = async (room) => {
    setMarkerColors((prev) => ({
      ...prev,
      [room._id]: "#FDD35E",
    }));

    const roomInfo = await PostAPI.getPostDetailByIdOnMap(room._id);
    setSelectedRoom(roomInfo);

    Animated.spring(bottomSheetAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleMapPress = () => {
    if (selectedRoom) {
      closeBottomSheet();
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

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          mapType="standard"
          showsUserLocation={true}
          onPress={handleMapPress}
        >
          {rooms.map((room) => (
            <RoomMarker
              key={room._id}
              room={room}
              onPress={() => handleMarkerPress(room)}
              isSelected={selectedRoom?._id === room._id}
              markerColor={markerColors[room._id] || "#007BFF"}
            />
          ))}
        </MapView>
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
  map: {
    width: "100%",
    height: "100%",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default SearchOnMapScreen;
