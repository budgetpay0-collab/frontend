import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/store/userStore";

const Profile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const clearUser = useUserStore((s)=>s.clearUser)
  const onLogout = async () => {
    try {
      // ✅ clear stored auth/session data (adjust keys if you use specific ones)
      await AsyncStorage.clear();
      clearUser()
      // ✅ go to login (change route if your login file is different)
      router.replace("/Login/Login");
    } catch (e) {
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Top header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color="#FFFFFF"
          />
        </Pressable>

        <Text style={styles.title}>Profile</Text>

        {/* Spacer to keep title centered */}
        <View style={{ width: 44 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Pressable onPress={onLogout} style={styles.logoutBtn}>
          <MaterialCommunityIcons name="logout" size={18} color="#06140F" />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 16,
  },

  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },

  content: {
    flex: 1,
    paddingTop: 18,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#16C784",
    paddingVertical: 12,
    borderRadius: 12,
  },

  logoutText: {
    color: "#06140F",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
});