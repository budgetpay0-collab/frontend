import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const GREEN = "#28F07B";
const BG = "#0B0B0B";
const screenWidth = Dimensions.get("window").width;

// Fixed sizing — horizontal ScrollView handles overflow (same pattern as YearGraph)
const Y_AXIS_WIDTH = 44;
const SPACING = 72;
const INITIAL_SPACING = 20;
const END_SPACING = 20;
const DATA_POINTS = 7;

// plot area width (what the LineChart `width` prop expects — excludes y-axis)
const CHART_PLOT_WIDTH =
  SPACING * (DATA_POINTS - 1) + INITIAL_SPACING + END_SPACING;

// total content width the horizontal ScrollView holds
const CHART_CONTENT_WIDTH = CHART_PLOT_WIDTH + Y_AXIS_WIDTH;

// card horizontal padding × 2
const CONTAINER_WIDTH = screenWidth - 16 * 2;

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const days: Date[] = [];
    for (let i = 0; i < DATA_POINTS; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }

    const totals: Record<string, number> = {};
    days.forEach((d) => { totals[d.toDateString()] = 0; });

    transactions.forEach((t) => {
      const d = new Date(t.createdAt);
      const key = d.toDateString();
      if (totals[key] !== undefined) totals[key] += t.amount;
    });

    const chartData = days.map((d) => ({
      value: totals[d.toDateString()] || 0,
      label: `${DAY_NAMES[d.getDay()]}\n${d.getDate()}`,
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
        <View style={styles.titlePill}>
          <Text style={styles.titleText}>Spending Trends</Text>
        </View>

        {/* Horizontal ScrollView wraps the chart — same pattern as YearGraph */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={CHART_CONTENT_WIDTH > CONTAINER_WIDTH}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <View style={{ width: CHART_CONTENT_WIDTH }}>
            <LineChart
              data={chartData}
              width={CHART_PLOT_WIDTH}
              height={190}
              thickness={2.2}
              color={GREEN}
              maxValue={maxValue}
              disableScroll
              yAxisColor="rgba(255,255,255,0.75)"
              xAxisColor="rgba(255,255,255,0.75)"
              yAxisTextStyle={styles.yAxisText}
              yAxisLabelPrefix="₹"
              yAxisLabelWidth={Y_AXIS_WIDTH}
              xAxisLabelTextStyle={styles.xAxisText}
              xAxisLabelsVerticalShift={6}
              rulesType="dashed"
              rulesColor="rgba(255,255,255,0.18)"
              rulesThickness={1}
              noOfSections={5}
              initialSpacing={INITIAL_SPACING}
              endSpacing={END_SPACING}
              spacing={SPACING}
              hideDataPoints
              pointerConfig={{
                pointerStripHeight: 150,
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
                  const safeIndex = Number.isFinite(pointerIndex) ? pointerIndex : 0;
                  const dateLabel = getDateFromIndex(safeIndex);
                  const value = Number.isFinite(items?.[0]?.value) ? items[0].value : 0;

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
        </ScrollView>

        <View style={styles.weekRow}>
          {DAY_NAMES.map((l, i) => (
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
  wrap: {
    width: "100%",
  },

  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  titlePill: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 8,
    marginLeft: 4,
  },

  titleText: {
    color: BG,
    fontWeight: "800",
    fontSize: 14,
  },

  scrollView: {
    marginTop: 4,
  },

  scrollContent: {
    paddingBottom: 14,
  },

  yAxisText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "700",
  },

  xAxisText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    fontWeight: "800",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 4,
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
