import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

type CardItem = {
  id: string;
  title: string;
  value: string;
  valueColor: string;
  subText: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
};

type Props = {
  monthEndDate: string;     
  daysLeft: number;          // 15
  dailyTarget: number;       // 2000
  incomePercent: number;     // 33.8
};

const formatINR = (n: number) => {
  try {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

const StatsCardsRow: React.FC<Props> = ({
  monthEndDate,
  daysLeft,
  dailyTarget,
  incomePercent,
}) => {
  const cards: CardItem[] = useMemo(
    () => [
      {
        id: "monthEnd",
        title: "MONTH END",
        value: monthEndDate,
        valueColor: "#5AA2FF",
        subText: `${daysLeft} Days Left`,
        icon: "calendar-outline",
        iconColor: "#5AA2FF",
      },
      {
        id: "dailyTarget",
        title: "DAILY TARGET",
        value: `₹${formatINR(dailyTarget)}`,
        valueColor: "#2FE67A",
        subText: "To Reach Goal",
        icon: "wallet-outline",
        iconColor: "#2FE67A",
      },
      {
        id: "incomePct",
        title: "FROM MONTHLY\nINCOME",
        value: `${incomePercent.toFixed(1)}%`,
        valueColor: "#B77BFF",
        subText: "Of Monthly Income",
        icon: "trending-up-outline",
        iconColor: "#B77BFF",
      },
    ],
    [monthEndDate, daysLeft, dailyTarget, incomePercent]
  );

  return (
    <View style={styles.row}>
      {cards.map((c) => (
        <View key={c.id} style={styles.cardOuter}>
          {/* Glass layers */}
          <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />

          <LinearGradient
            colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.00)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.topHighlight}
          />

          <LinearGradient
            colors={["rgba(0,0,0,0.00)", "rgba(0,0,0,0.70)"]}
            start={{ x: 0.5, y: 0.2 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.bottomShade}
          />

          {/* Border glow (looks like screenshot) */}
          <View style={styles.borderGlow} />

          <View style={styles.content}>
            <Ionicons name={c.icon} size={26} color={c.iconColor} />
            <Text style={styles.title}>{c.title}</Text>
            <Text style={[styles.value, { color: c.valueColor }]}>{c.value}</Text>
            <Text style={styles.sub}>{c.subText}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default StatsCardsRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    marginTop: 14,
  },

  cardOuter: {
    flex: 1,
    height: 150,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  borderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  topHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 10,
  },

  bottomShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },

  content: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 5,
    justifyContent: "flex-start",
  },

  title: {
  marginTop: 10,
  color: "rgba(255,255,255,0.90)",
  fontSize: 11,
  letterSpacing: 0.6,
  fontFamily: "Poppins-Medium",
  lineHeight: 14,      // ✅ line height
  minHeight: 28,       // ✅ 14 * 2 lines = 28 (reserves 2 lines space)
},

  value: {
    marginTop: 5,
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },

  sub: {
    marginTop: 12,
    color: "rgba(255,255,255,0.80)",
    fontSize: 9,
    fontFamily: "Poppins-Regular",
  },
});