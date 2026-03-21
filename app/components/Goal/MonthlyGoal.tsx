import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  moneyLeft: number;
  goal: number;
  income: number;
  totalSpent: number;
};


const formatINR = (n: number) => {
  try {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

const LAST_MONTH_PCT = 80;

const MonthlyGoal: React.FC<Props> = ({ moneyLeft, goal, income, totalSpent }) => {
  const goalLost = moneyLeft < goal && moneyLeft <= 0;

  const pct = LAST_MONTH_PCT;

  const SIZE = 200;
  const STROKE = 20;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - pct / 100);

  const ringColor = "#2FE67A";

  if (goalLost) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="radio-outline" size={19} color="#fff" />
          <Text style={styles.headerText}>Monthly Savings Goal Progress</Text>
        </View>

        <View style={styles.lostContainer}>
          <View style={styles.lostIconWrap}>
            <Ionicons name="close-circle" size={72} color="#FF4D4D" />
          </View>
          <Text style={styles.lostTitle}>Savings Goal Lost</Text>
          <Text style={styles.lostSub}>
            You've spent more than your income this month.
          </Text>
          <View style={styles.lostStatsRow}>
            <View style={styles.lostStat}>
              <Text style={styles.lostStatLabel}>Income</Text>
              <Text style={styles.lostStatValue}>₹{formatINR(income)}</Text>
            </View>
            <View style={styles.lostStatDivider} />
            <View style={styles.lostStat}>
              <Text style={styles.lostStatLabel}>Spent</Text>
              <Text style={[styles.lostStatValue, { color: "#FF4D4D" }]}>
                ₹{formatINR(totalSpent)}
              </Text>
            </View>
            <View style={styles.lostStatDivider} />
            <View style={styles.lostStat}>
              <Text style={styles.lostStatLabel}>Goal</Text>
              <Text style={styles.lostStatValue}>₹{formatINR(goal)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="radio-outline" size={19} color="#fff" />
        <Text style={styles.headerText}>Monthly Savings Goal Progress</Text>
      </View>

      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke="#E6E6E6"
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={ringColor}
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
          <Text style={[styles.percentText, { color: ringColor }]}>{pct}%</Text>
          <Text style={styles.lastMonthLabel}>last month</Text>
        </View>
      </View>

      <Text style={styles.goalTitle}>Almost There!</Text>
      <Text style={styles.goalSub}>80% of savings goal achieved</Text>
      <Text style={styles.currentMonthNote}>Current month results available at month end</Text>
    </View>
  );
};

export default MonthlyGoal;

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
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
    fontSize: 15,
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
    fontSize: 42,
    fontFamily: "OpenSans-Bold",
  },
  goalTitle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 30,
    fontFamily: "Poppins-Medium",
  },
  goalSub: {
    marginTop: -15,
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
  },
  missedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: "rgba(245,166,35,0.12)",
    marginHorizontal: 16,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(245,166,35,0.3)",
  },
  missedText: {
    color: "#F5A623",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  // Lost state styles
  lostContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lostIconWrap: {
    marginBottom: 12,
    shadowColor: "#FF4D4D",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  lostTitle: {
    color: "#FF4D4D",
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },
  lostSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  lostStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,77,77,0.2)",
    width: "100%",
  },
  lostStat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  lostStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  lostStatLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontFamily: "Poppins-Regular",
  },
  lostStatValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  lastMonthContainer: {
    marginTop: 10,
    marginBottom: 6,
  },
  lastMonthDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  lastMonthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  lastMonthLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lastMonthLabel: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  lastMonthRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lastMonthBarBg: {
    width: 100,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  lastMonthBarFill: {
    height: "100%",
    backgroundColor: "#21C36B",
    borderRadius: 3,
  },
  lastMonthPct: {
    color: "#21C36B",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
  lastMonthStatus: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  currentMonthNote: {
    textAlign: "center",
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    marginTop: 6,
    marginBottom: 14,
  },
});
