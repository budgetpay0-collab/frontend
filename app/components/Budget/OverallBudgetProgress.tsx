import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  monthlyAllocated: number;
  monthlySpent: number;
};

const OverallBudgetProgress: React.FC<Props> = ({
  monthlyAllocated,
  monthlySpent,
}) => {
  const pct = useMemo(() => {
    if (monthlyAllocated <= 0) return 0;
    return Math.min((monthlySpent / monthlyAllocated) * 100, 100);
  }, [monthlyAllocated, monthlySpent]);

  const pctLabel = `${Math.round(pct)}% Used`;

  return (
    <View style={styles.wrapper}>
      <View style={styles.cardOuter}>
        {/* <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} /> */}

        {/* <LinearGradient
          colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.00)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.topHighlight}
        />

        <LinearGradient
          colors={["rgba(255,255,255,0.06)", "rgba(0,0,0,0.55)"]}
          start={{ x: 0.2, y: 0.0 }}
          end={{ x: 0.6, y: 1 }}
          style={styles.depth}
        /> */}

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.title}>Overall Budget Progress</Text>

            <View style={styles.pill}>
              <Text style={styles.pillText}>{pctLabel}</Text>
            </View>
          </View>

          <View style={styles.barWrap}>
  <View style={styles.barTrack}>
    <View style={[styles.barFill, { width: `${pct}%` }]} />
  </View>
</View>
        </View>
      </View>
    </View>
  );
};

export default OverallBudgetProgress;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 6,
    paddingTop: 12,
  },

  cardOuter: {
    height: 92,
    // borderRadius: 18,
    // overflow: "hidden",
    // borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.22)",
    // backgroundColor: "rgba(255,255,255,0.03)",

    // shadowColor: "#000",
    // shadowOpacity: 0.55,
    // shadowRadius: 18,
    // shadowOffset: { width: 0, height: 10 },
    // elevation: 10,
  },

  topHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 10,
  },

  depth: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  content: {
  flex: 1,
  paddingHorizontal: 14,
  paddingTop: 12,
  paddingBottom: 14,
  justifyContent: "flex-start", // ✅ was "space-between"
},

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  title: {
    flex: 1,
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },

  pill: {
    paddingHorizontal: 14,
    paddingTop: 3,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: "rgba(88, 160, 255, 0.85)",
    backgroundColor: "rgba(40, 120, 255, 0.10)",
  },

  pillText: {
    color: "rgba(110, 175, 255, 0.95)",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
 barWrap: {
    marginTop: 10, // 👈 move bar up (try -4, -6, -8)
  },
  barTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.75)",
    overflow: "hidden",
    // marginTop:-10,
  },

  barFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(80, 155, 255, 1)", // blue fill like screenshot
  },
});