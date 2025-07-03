import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { COLORS } from "../../../constants/color";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CardComponent = ({
  item,
  expandedIds,
  toggleExpand,
  onView,
  onDelete,
  onPost,
  onRemove,
  onPin,
  onEdit,
}) => {
  const isExpanded = expandedIds.includes(item._id);

  const navigation = useNavigation();

  const handlePress = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleExpand(id);
  };

  return (
    <View>
      <Pressable onPress={() => handlePress(item._id)}>
        <View style={styles.postContainer}>
          {item.status === "public" && item.pin && (
            <View
              style={[
                styles.planeIconContainer,
                {
                  position: "absolute",
                  zIndex: 2,
                  padding: 0,
                  margin: 0,
                  width: 40,
                  height: 40,
                },
              ]}
            >
              <Image
                style={{
                  color: "#FF6347",
                  height: 40,
                  width: 40,
                }}
                source={require("../../../../assets/images/recommendation.png")}
              ></Image>
            </View>
          )}

          <View style={styles.postContent}>
            <View></View>
            <Image
              style={styles.thumbnail}
              source={{
                uri: item.images[0],
              }}
            />
            <View style={styles.details}>
              <Text style={styles.title}>{item?.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="attach-money"
                  style={styles.infoIcon}
                  color="red"
                />
                <Text style={styles.price}>{item?.price} / tháng</Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={styles.info}>
                  <Feather
                    name="maximize"
                    color="#666"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoText}>{item?.squareMeter} m²</Text>
                </View>
                <View style={styles.info}>
                  <FontAwesome5
                    name="user-alt"
                    color="#666"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoText}>{item.capacity}</Text>
                </View>
              </View>
              <View style={styles.info}>
                <FontAwesome6
                  name="location-dot"
                  color={COLORS.background}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoText}>{item?.address}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Phần mở rộng */}
      {isExpanded &&
        item.status !== "banned" &&
        item.status !== "scheduled" && (
          <View style={styles.actionButtons}>
            {item.status === "public" ? (
              <Pressable
                style={styles.button}
                onPress={() => onView(item?._id)}
              >
                <MaterialIcons
                  name="preview"
                  size={24}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Xem chi tiết</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.button}
                onPress={() => onPost(item?._id)}
              >
                <AntDesign
                  name="caretcircleoup"
                  size={24}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Đăng tin</Text>
              </Pressable>
            )}

            {item.status === "public" ? (
              item.pin === true ? (
                <Pressable
                  style={styles.button}
                  onPress={() => onPin(item?._id)}
                >
                  <Entypo
                    name="aircraft-landing"
                    size={24}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Gỡ Ghim</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.button}
                  onPress={() => onPin(item?._id)}
                >
                  <Entypo
                    name="aircraft-take-off"
                    size={24}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Ghim</Text>
                </Pressable>
              )
            ) : (
              <Pressable
                style={styles.button}
                onPress={() => onEdit(item?._id)}
              >
                <MaterialIcons
                  name="edit"
                  style={styles.buttonIcon}
                  size={24}
                />
                <Text style={styles.buttonText}>Sửa</Text>
              </Pressable>
            )}

            {item.status === "public" ? (
              <Pressable
                style={styles.button}
                onPress={() => onRemove(item._id)}
              >
                <AntDesign
                  name="downcircleo"
                  style={styles.buttonIcon}
                  size={24}
                />
                <Text style={styles.buttonText}>Gỡ</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.button}
                onPress={() => onDelete(item._id)}
              >
                <AntDesign name="delete" style={styles.buttonIcon} size={24} />
                <Text style={styles.buttonText}>Xóa</Text>
              </Pressable>
            )}
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 0,
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: "#f1f1f1",
  },
  planeIconContainer: {
    // Bổ sung các thuộc tính cần thiết cho biểu tượng máy bay
    zIndex: 2, // Đảm bảo rằng biểu tượng được ưu tiên hiển thị trên các thành phần khác
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    height: 50,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    color: "#FF6347",
  },
  buttonText: {
    justifyContent: "center",
    color: COLORS.text,
    fontSize: 10,
  },
  postContainer: {
    position: "relative", // Để đảm bảo các thành phần con có thể được định vị tuyệt đối bên trong nó

    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  postContent: {
    flexDirection: "row",
    position: "relative", // Để có thể chèn biểu tượng ở vị trí tuyệt đối
  },
  thumbnail: {
    width: 140,
    height: 110,
    marginRight: 10,
    borderRadius: 15,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "400",
    color: COLORS.text,
    paddingLeft: 6,
  },
  infoGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  infoIcon: { padding: 1, marginVertical: 4, marginHorizontal: 1 },
  infoText: {
    fontSize: 12,
    color: COLORS.description,
  },
  price: {
    color: "red",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default CardComponent;
