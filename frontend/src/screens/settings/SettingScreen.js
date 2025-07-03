import { StyleSheet, Text, View, SectionList } from "react-native";
import React, { useContext, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { settingsData } from "./dataSetting/dataSetting";
import ListGroupSetting from "../../components/ListGroupSetting";
import { useAuth } from "../../context/authContext";
const Setting = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const DATA = settingsData(user, navigation, logout);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 27, fontWeight: "400" }}>Cài đặt</Text>
      </View>

      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <ListGroupSetting item={item} />}
        renderSectionHeader={({ section: { title } }) =>
          title ? <Text style={styles.header}>{title}</Text> : null
        }
      />
    </SafeAreaView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  header: {
    marginTop: 10,
    fontSize: 15,
    padding: 10,
    color: "#656565",
    backgroundColor: "white",
  },
});
