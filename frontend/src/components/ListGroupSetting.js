import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const ListGroupSetting = ({ item }) => {
  return (
    <View>
      <TouchableOpacity onPress={item.onPress} style={styles.listForm}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {item.icon}
          <Text style={{ marginLeft: 10, fontSize: 15 }}>{item.key}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {item.value && <Text>{item.value}</Text>}
          {item.component && item.component}
          {item.action && <Text>{item.action}</Text>}
          {item.iconfoward}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ListGroupSetting;

const styles = StyleSheet.create({
  listForm: {
    padding: 10,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    justifyContent: "flex-end",
  },
});
