// components/Goal/SavingTip.tsx
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager,Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TipItem = {
  id: string;
  title: string;
  desc: string;
};

type Props = {
  tips?: TipItem[];
};

const SavingTip: React.FC<Props> = ({ tips }) => {
  const data = useMemo<TipItem[]>(
    () =>
      tips ?? [
        {
          id: "t1",
          title: "Track Monthly Spending",
          desc: "Write down every expense (even small ones). Review weekly to find where money leaks happen and set limits for the next week.",
        },
        {
          id: "t2",
          title: "Avoid Impulse Purchases",
          desc: "Use the 24-hour rule: add it to your cart, wait a day, and buy only if it still feels necessary. This simple pause saves a lot.",
        },
        {
          id: "t3",
          title: "Use Category Budgets",
          desc: "Fix monthly limits for food, travel, shopping, and bills. When a category reaches its limit, stop spending there until next month.",
        },
        {
          id: "t4",
          title: "Plan for Expenses",
          desc: "Keep a small buffer for emergencies and upcoming bills. Planning reduces last-minute borrowing and protects your savings goal.",
        },
      ],
    [tips]
  );

  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../../../assets/images/Piggy.png")} style={styles.icon} />
        <Text style={styles.headerText}>Savings Tips</Text>
      </View>

      {/* Accordion Cards */}
      <View style={styles.list}>
        {data.map((item) => {
          const isOpen = openId === item.id;
          return (
            <View key={item.id} style={styles.cardOuter}>
              <Pressable onPress={() => toggle(item.id)} style={styles.cardPress}>
                <Text style={styles.title}>{item.title}</Text>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="rgba(255,255,255,0.85)"
                />
              </Pressable>

              {isOpen ? (
                <View style={styles.body}>
                  <Text style={styles.desc}>{item.desc}</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
      <View style={styles.header1}>
        <Image source={require("../../../assets/images/Piggy.png")} style={styles.icon} />
        <Text style={styles.headerText}>AI tips through ai</Text>
      </View>
    </View>
  );
};

export default SavingTip;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: -28,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
   header1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 25,
  },
  icon: {
  width: 20,
  height: 20,
  resizeMode: "contain",
},

  headerText: {
    color: "#2FE67A",
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
  },

  list: {
    gap: 12,
  },

  cardOuter: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  cardPress: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },

  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.10)",
  },

  desc: {
    marginTop: 12,
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Poppins-Regular",
  },
});