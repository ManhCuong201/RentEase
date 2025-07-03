import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/color";

const InputField = ({
  label,
  iconName,
  placeholder,
  onChangeText,
  onBlur,
  value,
  touched,
  error,
  keyboardType = "default",
}) => {
  return (
    <View style={styles.groupInput}>
      <Text style={styles.label}>
        {label} <Text style={styles.requiredStar}>*</Text>
      </Text>
      <View style={styles.inputContainer}>
        {iconName && <Ionicons name={iconName} size={24} color="orange" />}
        <TextInput
          style={[styles.input, touched && error ? styles.errorInput : null]}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
          keyboardType={keyboardType}
        />
      </View>
      {touched && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  groupInput: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "bold",
  },
  requiredStar: {
    color: "red",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderBottomColor: COLORS.note,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: COLORS.description,
    paddingLeft: 10,
  },
  errorInput: {
    borderBottomColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});

export default InputField;
