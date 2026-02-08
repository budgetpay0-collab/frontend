import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title?: string;
  current: number;   // e.g. 560
  target: number;    // e.g. 10000
  percentOverride?: number; // optional (0-100)
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const MonthlyGoal: React.FC<Props> = ({
  title = "Monthly Savings Goal Progress",
  current,
  target,
  percentOverride,
}) => {
  // ✅ Dynamic percent
  const pct = useMemo(() => {
    if (typeof percentOverride === "number") return clamp(percentOverride, 0, 100);
    if (!target || target <= 0) return 0;
    return clamp(Math.round((current / target) * 100), 0, 100);
  }, [current, target, percentOverride]);

  // Ring config
  const SIZE = 220;
  const STROKE = 22;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;

  // ✅ This makes the ring fill exactly pct%
  const dashOffset = useMemo(() => C * (1 - pct / 100), [C, pct]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="radio-outline" size={22} color="#fff" />
        <Text style={styles.headerText}>{title}</Text>
      </View>

      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          {/* Track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke="#E6E6E6"
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
          />

          {/* Progress (dynamic) */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke="#0B5B18"
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${C} ${C}`}
            strokeDashoffset={dashOffset}
            rotation={-110}
            originX={SIZE / 2}
            originY={SIZE / 2}
          />
        </Svg>

        <View style={styles.centerText}>
          <Text style={styles.percentText}>{pct}%</Text>
        </View>
      </View>

      <Text style={styles.goalTitle}>Goal</Text>
      <Text style={styles.goalSub}>
        ₹{current}/₹{target}
      </Text>
    </View>
  );
};

export default MonthlyGoal;

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 18,
    // padding: 18,
    // backgroundColor: "#111111",
    borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.06)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    // fontWeight: "800",
    fontFamily: "Poppins-Medium",
  },
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  svg: {
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  percentText: {
    color: "#FFFFFF",
    fontSize: 52,
    fontFamily: "OpenSans-Bold",
  },
  goalTitle: {
    // marginTop: 6,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 40,
    // fontWeight: "900",
    fontFamily: "Poppins-Medium",
  },
  goalSub: {
    marginTop: -15,
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
    fontSize: 20,
    // fontWeight: "700",
    fontFamily: "Poppins-SemiBold",
  },
});