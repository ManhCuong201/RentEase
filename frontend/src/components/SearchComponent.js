import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../constants/color";

const SearchComponent = ({ searchText, onSearch }) => {
  const [inputText, setInputText] = useState(searchText); // Khởi tạo giá trị với searchText từ prop
  const debounceTimeoutRef = useRef(null); // Tạo tham chiếu cho timeout để debounce

  // Mỗi khi searchText thay đổi từ bên ngoài, cập nhật inputText
  useEffect(() => {
    setInputText(searchText); // Cập nhật giá trị của inputText khi searchText thay đổi
  }, [searchText]);

  // Xử lý khi người dùng thay đổi nội dung ô tìm kiếm
  const handleInputChange = (text) => {
    setInputText(text);

    // Nếu đã có timeout trước đó, xóa nó để thiết lập lại
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Thiết lập timeout mới, sau 300ms mới thực hiện tìm kiếm
    debounceTimeoutRef.current = setTimeout(() => {
      onSearch(text); // Gửi giá trị mới, kể cả khi là chuỗi trống
    }, 500); // 300ms debounce
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.functionsContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập tiêu đề, địa chỉ..."
            value={inputText} // Hiển thị giá trị inputText
            onChangeText={handleInputChange} // Cập nhật inputText khi người dùng nhập liệu
          />
          <TouchableOpacity
            onPress={() => onSearch(inputText)}
            style={styles.iconContainer}
          >
            <AntDesign
              name="search1"
              size={24}
              color={COLORS.gray}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  functionsContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    height: 30,
    paddingHorizontal: 10,
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default SearchComponent;
