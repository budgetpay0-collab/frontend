import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import rawData from "../../../store/data.json";

type YearMonth = {
  month: string;
  dynamic: number;
  fixed: number;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const YearGraph = () => {
  const months: YearMonth[] = (rawData as any)?.yearlyExpenses?.months ?? [];

  const defaultIndex = Math.max(0, months.findIndex((m) => m.month === "Mar"));
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const [tipSize, setTipSize] = useState({ w: 200, h: 86 }); // measured onLayout

  const { width: screenW } = useWindowDimensions();

  const yAxisLabelWidth = 44;
  const cardPaddingH = 12 * 2;

  const availableChartWidth = useMemo(() => {
    return Math.max(240, screenW - cardPaddingH - yAxisLabelWidth - 18);
  }, [screenW]);

  const count = Math.max(1, months.length);

  const { barWidth, spacing } = useMemo(() => {
    const denom = count + 0.9 * (count - 1);
    let bw = availableChartWidth / denom;
    bw = clamp(bw, 5, 12);
    const sp = clamp(0.9 * bw, 4, 14);
    return { barWidth: bw, spacing: sp };
  }, [availableChartWidth, count]);

  const chartHeight = 220;

  const chartData = useMemo(() => {
    return months.map((m, idx) => {
      const total = (Number(m.dynamic) || 0) + (Number(m.fixed) || 0);
      return {
        value: total,
        label: m.month,
        dynamic: Number(m.dynamic) || 0,
        fixed: Number(m.fixed) || 0,
        frontColor: idx === selectedIndex ? "#22C55E" : "#E5E7EB",
      };
    });
  }, [months, selectedIndex]);

  const maxValue = useMemo(() => {
    const max = chartData.reduce((m, it) => Math.max(m, it.value), 0);
    const rounded = Math.ceil((max || 500) / 100) * 100;
    return Math.max(500, rounded);
  }, [chartData]);

  const selected = useMemo(() => {
    return chartData[selectedIndex] || null;
  }, [chartData, selectedIndex]);

  /**
   * ✅ Tooltip positioning (like screenshot)
   * x = center of selected bar
   * y = slightly above top of selected bar
   */
  const tooltipPos = useMemo(() => {
    if (!selected) return { left: 0, top: 0 };

    const block = barWidth + spacing;

    // x of bar center (inside plot area)
    const barCenterX = yAxisLabelWidth + barWidth / 2 + selectedIndex * block;

    // y of bar top (inside plot area)
    const barH = maxValue > 0 ? (selected.value / maxValue) * chartHeight : 0;
    const barTopY = chartHeight - barH;

    // place tooltip above bar top
    let left = barCenterX - tipSize.w / 2;
    let top = barTopY - tipSize.h - 10;

    // clamp tooltip within chart container width
    const containerW = yAxisLabelWidth + availableChartWidth;
    left = clamp(left, 6, containerW - tipSize.w - 6);
    top = clamp(top, 6, chartHeight - tipSize.h - 6);

    return { left, top };
  }, [
    selected,
    selectedIndex,
    barWidth,
    spacing,
    yAxisLabelWidth,
    availableChartWidth,
    chartHeight,
    maxValue,
    tipSize.w,
    tipSize.h,
  ]);

  return (
    <View style={styles.outerCard}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      <LinearGradient
        colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.00)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topHighlight}
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.00)", "rgba(0,0,0,0.65)"]}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomShadow}
      />

      <View style={styles.titlePill}>
        <Text style={styles.titlePillText}>Yearly Dynamic/Fixed Expenses</Text>
      </View>

      {/* ✅ Chart + tooltip overlay area */}
      <View style={styles.chartArea}>
        {/* Tooltip INSIDE graph (like screenshot) */}
        {selected ? (
          <View
            style={[styles.tipContainer, { left: tooltipPos.left, top: tooltipPos.top }]}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              if (width && height) setTipSize({ w: width, h: height });
            }}
          >
            <Text style={styles.tipMonth}>{selected.label}</Text>

            <View style={styles.tipBox}>
              <Text style={styles.tipLine}>
                Total:{" "}
                <Text style={[styles.tipValue, { color: "#3B82F6" }]}>
                  ₹{selected.dynamic}
                </Text>
              </Text>
              <Text style={styles.tipLine}>
                Total:{" "}
                <Text style={[styles.tipValue, { color: "#A855F7" }]}>
                  ₹{selected.fixed}
                </Text>
              </Text>
            </View>
          </View>
        ) : null}

<View style={styles.chartWrap}>
        <BarChart
          data={chartData}
          height={chartHeight}
          barWidth={barWidth}
          spacing={spacing}
          roundedTop
          roundedBottom
          yAxisLabelPrefix="₹"
          maxValue={maxValue}
          noOfSections={5}
          rulesType="dashed"
          rulesColor="rgba(255,255,255,0.20)"
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisText}
          xAxisColor="rgba(255,255,255,0.35)"
          yAxisColor="rgba(255,255,255,0.35)"
          yAxisLabelWidth={yAxisLabelWidth}
          xAxisThickness={1}
          yAxisThickness={1}
          showYAxisIndices={false}
          disableScroll
          width={availableChartWidth}
          onPress={(item: any, index: number) => setSelectedIndex(index)}
        />
        </View>
      </View>
    </View>
  );
};

export default YearGraph;

const styles = StyleSheet.create({
  outerCard: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.04)",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    alignSelf: "stretch",
    // paddingBottom: 16,
    marginVertical:15,
  },
  topHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 10,
  },
  bottomShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },

  titlePill: {
    alignSelf: "flex-start",
    marginTop: 12,
    marginLeft: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  titlePillText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },

  chartArea: {
    marginTop: 10,
    paddingHorizontal: 12,
    position: "relative",
  },
chartWrap: {
  marginTop: 10,
//   paddingHorizontal: 12,
  paddingBottom: 18, // ✅ gives room for "Jan Feb..." labels
  position: "relative",
  overflow: "hidden", // ✅ important
},
  yAxisText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  xAxisText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 10,
    fontFamily: "Poppins-Medium",
    // marginTop: 6,
  },

  // ✅ Tooltip styles (like screenshot)
  tipContainer: {
    position: "absolute",
    zIndex: 50,
    alignItems: "center",
  },
  tipMonth: {
    color: "#22C55E",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },
  tipBox: {
    backgroundColor: "rgba(0,0,0,0.78)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    minWidth: 170,
  },
  tipLine: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  tipValue: {
    fontFamily: "Poppins-SemiBold",
  },
});