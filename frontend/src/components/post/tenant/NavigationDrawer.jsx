import React, { memo } from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import CustomButton from "../../../components/common/CustomButton";

const NavigationDrawer = memo(({ searchFurnitures, setSearchFurnitures, searchServices, setSearchServices, tienNghi, noiThat, drawer }) => {
  const handleFurnitureSelect = (id) => {
    setSearchFurnitures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleServiceSelect = (id) => {
    setSearchServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.separator} />
      <Text style={styles.sectionTitle}>Tiện Nghi</Text>
      <Text style={styles.separator} />
      <View style={styles.itemContainer}>
        {tienNghi?.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => handleFurnitureSelect(item._id)}
            style={[
              styles.itemButton,
              {
                backgroundColor: searchFurnitures.includes(item._id) ? "#FFE5A2" : "#FFF9E2",
              },
            ]}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.separator, styles.sectionMargin]} />
      <Text style={styles.sectionTitle}>Nội Thất</Text>
      <Text style={styles.separator} />
      <View style={styles.itemContainer}>
        {noiThat?.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => handleServiceSelect(item._id)}
            style={[
              styles.itemButton,
              {
                backgroundColor: searchServices.includes(item._id) ? "#FFE5A2" : "#FFF9E2",
              },
            ]}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Lọc"
          onPress={() => {
            drawer.current.closeDrawer();
          }}
        />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 30,
    padding: 10,
  },
  separator: {
    width: "100%",
    backgroundColor: "black",
    height: 1,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 10,
  },
  itemButton: {
    marginHorizontal: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  itemText: {
    fontSize: 14,
  },
  sectionMargin: {
    marginTop: 20,
  },
  buttonContainer: {
    margin: 8,
    marginBottom: 20,
  },
});

export default NavigationDrawer;
