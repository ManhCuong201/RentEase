import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: "center",
    backgroundColor: "#F6D700",
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonText: {
    fontSize: 16,
  },
});

export default CustomButton;
