import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../constants/color";

const EstimatedCostsComponent = ({ estimatedCosts }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chi phí dự kiến</Text>
      <View style={styles.table}>
        <View style={styles.cell}>
          <Text style={styles.label}>Điện</Text>
          <Text style={styles.value}>
            {estimatedCosts.electricity || "Không có thông tin"}
          </Text>
          <Text style={styles.unit}>/kWh</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.label}>Nước</Text>
          <Text style={styles.value}>
            {estimatedCosts.water || "Không có thông tin"}
          </Text>
          <Text style={styles.unit}>/m3</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.label}>Wifi</Text>
          <Text style={styles.value}>
            {estimatedCosts.wifi || "Không có thông tin"}
          </Text>
          <Text style={styles.unit}>/phòng</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.label}>Dịch vụ</Text>
          <Text style={styles.value}>
            {estimatedCosts.service || "Không có thông tin"}
          </Text>
          <Text style={styles.unit}>/phòng</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    fontSize: 22,
    marginBottom: 10,
  },
  table: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cell: {
    width: "25%",
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#007bff",
  },
  unit: {
    fontSize: 12,
    color: "#777",
  },
});

export default EstimatedCostsComponent;
