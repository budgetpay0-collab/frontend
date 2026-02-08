import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";

type Props = {
  name?: string;
  onPressBell?: () => void;
  onPressProfile?: () => void; // optional override
};

const TopHeader: React.FC<Props> = ({
  name = "Nihal Sharma",
  onPressBell,
  onPressProfile,
}) => {
  const router = useRouter();

  const handleProfilePress = () => {
  if (onPressProfile) return onPressProfile();

  console.log("Profile pressed ✅");
  router.push({ pathname: "/pages/Profile" });
};

  return (
    <LinearGradient
      colors={["#101010", "#101010"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.row}>
          {/* Left Text */}
          <View style={styles.left}>
            <Text style={styles.hello}>Hello,</Text>
            <Text style={styles.name}>{name}</Text>
          </View>

          {/* Right Icons */}
          <View style={styles.right}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onPressBell}
              style={styles.iconBtn}
            >
              <Octicons name="bell-fill" size={26} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleProfilePress}
              style={styles.iconBtn}
            >
              <Ionicons name="person" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TopHeader;

const styles = StyleSheet.create({
  gradient: { width: "100%" },
  safe: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  row: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  left: { justifyContent: "center" },
  hello: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    opacity: 0.95,
    lineHeight: 22,
  },
  name: {
    color: "#21C36B",
    fontSize: 28,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 34,
    marginTop: 2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
});