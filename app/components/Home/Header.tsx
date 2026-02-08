// components/Header.tsx
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

type RangeKey = "D" | "W" | "M" | "Y";

const Header = () => {
  const tabs = useMemo<RangeKey[]>(() => ["D", "W", "M", "Y"], []);
  const [active, setActive] = useState<RangeKey>("D"); // ✅ default selected = D

  return (
    <View style={styles.wrap}>
      {/* Left text */}
      <View style={styles.left}>
        <Text style={styles.title}>Financial Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome back! Here&apos;s your monthly overview.
        </Text>
      </View>

      {/* Right buttons */}
      <View style={styles.tabs}>
        {tabs.map((t) => {
          const isActive = active === t;
          return (
            <Pressable
              key={t}
              onPress={() => setActive(t)}
              style={({ pressed }) => [
                styles.tabBtn,
                isActive && styles.tabBtnActive,
                pressed && styles.tabBtnPressed,
              ]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrap: {
    // backgroundColor: "#0B0B0B",
    paddingHorizontal: 16,
    // paddingTop: 14,
    // paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderBottomWidth: 1,
    // borderBottomColor: "rgba(255,255,255,0.08)",
  },

  left: {
    flex: 1,
    // paddingRight: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    // fontWeight: "800",
    fontFamily:'Poppins-SemiBold',
    letterSpacing: 0,
  },

  subtitle: {
    marginTop: -4,
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontFamily:'Poppins-Regular',
  },

  tabs: {
    flexDirection: "row",
    gap: 2,
  },

  tabBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#1B1B1B",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  tabBtnActive: {
    backgroundColor: "#20C777", // ✅ green
    borderColor: "rgba(32,199,119,0.9)",
  },

  tabBtnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },

  tabText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  tabTextActive: {
    color: "#0B0B0B", // looks nice on green (change to #fff if you want)
  },
});
