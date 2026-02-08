// FirstGraph.tsx (STATIC) - Correct week mapping + Week labels on X axis
import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const GREEN = "#28F07B";
const BG = "#0B0B0B";

const FirstGraph = () => {
  // ✅ 16 points = 4 weeks * 4 points
  const rawData = [120, 80, 200, 160, 240, 180, 400, 245, 110, 160, 210, 180, 260, 380, 280, 400];
  const labels = ["Week1", "Week2", "Week3", "Week4"];
  const maxValue = 500;

  const POINTS_PER_WEEK = Math.floor(rawData.length / labels.length); // 4

  // ✅ Put x-axis labels at the *center* of each week
  // Week1 center index = 2, Week2 = 6, Week3 = 10, Week4 = 14
  const labelIndexes = useMemo(() => {
    const set = new Set<number>();
    for (let w = 0; w < labels.length; w++) {
      const start = w * POINTS_PER_WEEK;
      const center = start + Math.floor(POINTS_PER_WEEK / 2);
      set.add(center);
    }
    return set;
  }, []);

  // ✅ Gifted chart supports "label" per data item for X-axis
  const chartData = useMemo(() => {
    return rawData.map((v, i) => {
      const weekIndex = Math.min(labels.length - 1, Math.floor(i / POINTS_PER_WEEK));
      return {
        value: v,
        label: labelIndexes.has(i) ? labels[weekIndex] : "", // show only 4 labels on axis
      };
    });
  }, [labelIndexes]);

  const getWeekFromIndex = (index: number) => {
    const i = Math.max(0, Math.min(rawData.length - 1, index));
    const weekIndex = Math.min(labels.length - 1, Math.floor(i / POINTS_PER_WEEK));
    return labels[weekIndex];
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        {/* Title pill */}
        <View style={styles.titlePill}>
          <Text style={styles.titleText}>Spending Trends</Text>
        </View>

        {/* Chart */}
        <View style={styles.chartWrap}>
          <LineChart
            data={chartData}
            height={170}
            thickness={2.2}
            color={GREEN}
            maxValue={maxValue}
            adjustToWidth
            disableScroll

            // axes
            yAxisColor="rgba(255,255,255,0.75)"
            xAxisColor="rgba(255,255,255,0.75)"
            yAxisTextStyle={styles.yAxisText}
            yAxisLabelPrefix="₹"
            yAxisLabelWidth={42}
            xAxisLabelTextStyle={styles.xAxisText}
            xAxisLabelsVerticalShift={10}
            xAxisTextNumberOfLines={1}

            // dashed grid
            rulesType="dashed"
            rulesColor="rgba(255,255,255,0.18)"
            rulesThickness={1}
            noOfSections={5}

            // spacing
            initialSpacing={12}
            spacing={22}

            // ✅ Hide dots on the line
            hideDataPoints

            // ✅ Pointer / tooltip (tap anywhere -> snaps to nearest point)
            pointerConfig={{
              pointerStripHeight: 140,
              pointerStripWidth: 1.2,
              pointerStripColor: "rgba(40,240,123,0.6)",
              pointerColor: "#FFFFFF",
              radius: 6,
              pointerStripUptoDataPoint: true,

              // ✅ show instantly on touch (better than long press)
              activatePointersOnLongPress: false,
              activatePointersInstantlyOnTouch: true,
              activatePointersDelay: 0,

              autoAdjustPointerLabelPosition: true,

              // ✅ IMPORTANT: use pointerIndex (3rd param) to know which point user touched
              pointerLabelComponent: (items: any[], _secondary: any, pointerIndex: number) => {
                const safeIndex = Number.isFinite(pointerIndex) ? pointerIndex : 0;
                const week = getWeekFromIndex(safeIndex);

                const valueFromItem = items?.[0]?.value;
                const value = Number.isFinite(valueFromItem)
                  ? valueFromItem
                  : rawData[Math.max(0, Math.min(rawData.length - 1, safeIndex))];

                return (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipTop}>{week.toLowerCase()}</Text>

                    <View style={styles.tooltipRow}>
                      <Text style={styles.tooltipText}>Amount :</Text>
                      <Text style={styles.tooltipValue}> ₹{value}</Text>
                    </View>

                    <View style={styles.tooltipNub} />
                  </View>
                );
              },
            }}
          />
        </View>

        {/* Week pills (UI only) */}
        <View style={styles.weekRow}>
          {labels.map((l, i) => (
            <TouchableOpacity key={`${l}-${i}`} activeOpacity={0.9} style={styles.weekPill}>
              <Text style={styles.weekText}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FirstGraph;

const styles = StyleSheet.create({
  wrap: { width: "100%" },

  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    padding: 12,
  },

  titlePill: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 8,
  },
  titleText: {
    color: BG,
    fontWeight: "800",
    fontSize: 14,
  },

  chartWrap: {
    borderRadius: 14,
    overflow: "hidden",
    paddingTop: 4,
  },

  yAxisText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "700",
  },
  xAxisText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "800",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  weekPill: {
    flex: 1,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  weekText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "800",
    fontSize: 13,
  },

  // Tooltip
  tooltip: {
    backgroundColor: BG,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.75)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 140,
  },
  tooltipTop: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 4,
    textTransform: "lowercase",
  },
  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tooltipText: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "800",
    fontSize: 12,
  },
  tooltipValue: {
    color: GREEN,
    fontWeight: "900",
    fontSize: 12,
  },
  tooltipNub: {
    position: "absolute",
    bottom: -6,
    left: 22,
    width: 10,
    height: 10,
    backgroundColor: BG,
    borderRightWidth: 1.2,
    borderBottomWidth: 1.2,
    borderColor: "rgba(255,255,255,0.75)",
    transform: [{ rotate: "45deg" }],
  },
});
