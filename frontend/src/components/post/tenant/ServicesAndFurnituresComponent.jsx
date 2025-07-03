import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../../constants/color";
import ServiceApi from "../../../api/ServiceApi";
import FurnitureApi from "../../../api/FurnitureApi";

const ServicesAndFurnituresComponent = ({ postDetails }) => {
  const [services, setServices] = useState([]);
  const [furnishings, setFurnishings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [furnishingsData, servicesData] = await Promise.all([
          FurnitureApi.getAllFurniture(),
          ServiceApi.getAllService(),
        ]);

        setFurnishings(furnishingsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm để kiểm tra xem service có trong danh sách không
  const isServiceAvailable = (id) => {
    return postDetails?.services?.includes(id);
  };

  // Hàm để kiểm tra xem furnishing có trong danh sách không
  const isFurnishingAvailable = (id) => {
    return postDetails?.furnitures?.includes(id);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.postServices}>
        <Text style={styles.postTermHeader}>Nội Thất</Text>
      </View>
      {/* Hiển thị danh sách furnishings */}
      <View style={styles.container}>
        {furnishings.map((item, index) => {
          if (index % 2 === 0 && index + 1 < furnishings.length) {
            return (
              <View key={index} style={styles.row}>
                {/* First furnishing */}
                <View style={styles.furnishingItem}>
                  <Text style={styles.text}>{furnishings[index].name}:</Text>
                  {isFurnishingAvailable(furnishings[index]._id) ? (
                    <FontAwesome
                      style={styles.icon}
                      name="check"
                      size={20}
                      color="green"
                    />
                  ) : (
                    <FontAwesome
                      style={styles.icon}
                      name="times"
                      size={20}
                      color="red"
                    />
                  )}
                </View>
                {/* Second furnishing */}
                <View style={styles.furnishingItem}>
                  <Text style={styles.text}>
                    {furnishings[index + 1].name}:
                  </Text>
                  {isFurnishingAvailable(furnishings[index + 1]._id) ? (
                    <FontAwesome
                      style={styles.icon}
                      name="check"
                      size={20}
                      color="green"
                    />
                  ) : (
                    <FontAwesome
                      style={styles.icon}
                      name="times"
                      size={20}
                      color="red"
                    />
                  )}
                </View>
              </View>
            );
          } else if (
            index === furnishings.length - 1 &&
            furnishings.length % 2 !== 0
          ) {
            // Handle the last furnishing if it's odd
            return (
              <View key={index} style={styles.row}>
                <View style={styles.furnishingItem}>
                  <Text style={styles.text}>{furnishings[index].name}:</Text>
                  {isFurnishingAvailable(furnishings[index]._id) ? (
                    <FontAwesome
                      style={styles.icon}
                      name="check"
                      size={20}
                      color="green"
                    />
                  ) : (
                    <FontAwesome
                      style={styles.icon}
                      name="times"
                      size={20}
                      color="red"
                    />
                  )}
                </View>
              </View>
            );
          }
          return null;
        })}
      </View>

      <View style={styles.separator} />

      <View style={styles.postServices}>
        <Text style={styles.postTermHeader}>Dịch Vụ Chung</Text>
      </View>
      {/* Hiển thị danh sách services */}
      <View style={styles.container}>
        {services.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.text}>{item.name}:</Text>
            {isServiceAvailable(item._id) ? (
              <FontAwesome
                style={styles.icon}
                name="check"
                size={20}
                color="green"
              />
            ) : (
              <FontAwesome
                style={styles.icon}
                name="times"
                size={20}
                color="red"
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12,
    paddingRight: 25,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: COLORS.backgroundMain,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  furnishingItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
  },
  icon: {
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  postTermHeader: {
    fontSize: 22,
    marginBottom: 10,
  },
});

export default ServicesAndFurnituresComponent;
