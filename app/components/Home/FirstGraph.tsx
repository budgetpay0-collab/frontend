// FirstGraph.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const GREEN = "#28F07B";
const BG = "#0B0B0B";

const FirstGraph = ({
  transactions,
  filter,
}: {
  transactions: any[];
  filter: string;
}) => {
  const isDayFilter = filter === "day";

  const weekData = useMemo(() => {
    if (!isDayFilter) return { chartData: [], maxValue: 100 };

    const today = new Date();

    // Start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const days: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }

    // Initialize totals
    const totals: Record<string, number> = {};

    days.forEach((d) => {
      totals[d.toDateString()] = 0;
    });

    // Aggregate transactions
    transactions.forEach((t) => {
      const d = new Date(t.createdAt);
      const key = d.toDateString();

      if (totals[key] !== undefined) {
        totals[key] += t.amount;
      }
    });

    const chartData = days.map((d) => ({
      value: totals[d.toDateString()] || 0,
      label: d.getDate().toString(),
      date: d,
    }));

    const maxTransaction = Math.max(...chartData.map((d) => d.value), 0);

    return {
      chartData,
      maxValue: maxTransaction === 0 ? 100 : maxTransaction * 1.2,
    };
  }, [transactions, filter]);

  const chartData = weekData.chartData;
  const maxValue = weekData.maxValue;

  const getDateFromIndex = (index: number) => {
    if (!chartData[index]) return "";
    const d = chartData[index].date;
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        {/* Title */}
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
            yAxisColor="rgba(255,255,255,0.75)"
            xAxisColor="rgba(255,255,255,0.75)"
            yAxisTextStyle={styles.yAxisText}
            yAxisLabelPrefix="₹"
            yAxisLabelWidth={42}
            xAxisLabelTextStyle={styles.xAxisText}
            xAxisLabelsVerticalShift={6}
            rulesType="dashed"
            rulesColor="rgba(255,255,255,0.18)"
            rulesThickness={1}
            noOfSections={5}
            initialSpacing={10}
            spacing={40}
            hideDataPoints
            pointerConfig={{
              pointerStripHeight: 140,
              pointerStripWidth: 1.2,
              pointerStripColor: "rgba(40,240,123,0.6)",
              pointerColor: "#FFFFFF",
              radius: 6,
              pointerStripUptoDataPoint: true,
              activatePointersOnLongPress: false,
              activatePointersInstantlyOnTouch: true,
              activatePointersDelay: 0,
              autoAdjustPointerLabelPosition: true,

              pointerLabelComponent: (
                items: any[],
                _secondary: any,
                pointerIndex: number
              ) => {
                const safeIndex = Number.isFinite(pointerIndex)
                  ? pointerIndex
                  : 0;

                const dateLabel = getDateFromIndex(safeIndex);

                const valueFromItem = items?.[0]?.value;
                const value = Number.isFinite(valueFromItem)
                  ? valueFromItem
                  : 0;

                return (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipTop}>{dateLabel}</Text>

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

        {/* Week labels */}
        <View style={styles.weekRow}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((l, i) => (
            <TouchableOpacity key={i} style={styles.weekPill}>
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
    paddingTop: 4,
    paddingBottom: 12, // prevents label clipping
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
  },

  weekPill: {
    flex: 1,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },

  weekText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "800",
    fontSize: 13,
  },

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