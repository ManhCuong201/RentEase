import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/color";

const CustomCheckbox = ({ label, onValueChange, value }) => {
  const [checked, setChecked] = React.useState(value);

  const handlePress = () => {
    const newValue = !checked;
    setChecked(newValue); // Cập nhật trạng thái ngay lập tức
    onValueChange(newValue); // Cập nhật giá trị vào Formik
  };

  React.useEffect(() => {
    setChecked(value); // Đồng bộ lại khi giá trị từ ngoài thay đổi
  }, [value]);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <View style={styles.innerCheckbox} />}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  innerCheckbox: {
    borderWidth: 1,
    borderColor: "#000",
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: COLORS.checkBoxColor,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
});

export default CustomCheckbox;
