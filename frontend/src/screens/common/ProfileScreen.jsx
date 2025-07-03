import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const ProfileScreen = () => {
  const route = useRoute();
  const { user } = route.params;
  return (
    <View style={styles.container}>
      {/* Phần avatar */}
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={50} color="black" />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={user.fullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value="0763310655"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={user.email}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ngày sinh</Text>
          <TextInput style={styles.input} placeholder="Ngày sinh" value={user.dob} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Giới tính</Text>
          <TextInput
            style={styles.input}
            placeholder="Giới tính"
            value={user.gender}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  form: {
    marginHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 6,
    fontWeight: "800",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  verificationSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
  },
  verificationInfo: {
    flex: 1,
    marginLeft: 10,
  },
  verificationTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  verificationDescription: {
    fontSize: 12,
    color: "#808080",
  },
  updateButton: {
    backgroundColor: "#FF3300",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    marginTop: 30,
  },
  updateButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
