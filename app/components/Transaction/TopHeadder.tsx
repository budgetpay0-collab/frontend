// TopHeadder.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title?: string;
  subtitle?: string;
  onPressIcon?: () => void; // right icon action
};

const GREEN = "#28F07B";
const BG = "#0B0B0B";

const TopHeadder: React.FC<Props> = ({
  title = "Transactions",
  subtitle = "Track and manage your financial transactions",
  onPressIcon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPressIcon}
        style={styles.iconBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {/* closest icon to the screenshot (swap if you want exact) */}
        <Ionicons name="swap-horizontal" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default TopHeadder;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 70,
    backgroundColor: BG,
    // borderBottomWidth: 1,
    // borderBottomColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // subtle depth like screenshot
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  left: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    color: GREEN,
    fontSize: 30,
    // fontWeight: "900",
    fontFamily:'Poppins-SemiBold',
    letterSpacing: 0.2,
    lineHeight: Platform.OS === "ios" ? 34 : 36,
  },

  subtitle: {
    marginTop: 2,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12.5,
    // fontWeight: "600",
    fontFamily:'Poppins-Regular',
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
