import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const YearGraph = ({ transactions }: { transactions: any[] }) => {

  const defaultIndex = new Date().getMonth();
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [tipSize, setTipSize] = useState({ w: 200, h: 86 });

  const { width: screenW } = useWindowDimensions();

  const yAxisLabelWidth = 44;
  const cardPaddingH = 12 * 2;

  const availableChartWidth = useMemo(() => {
    return Math.max(240, screenW - cardPaddingH - yAxisLabelWidth - 18);
  }, [screenW]);

  /**
   * =============================
   * BUILD MONTH DATA FROM TXNS
   * =============================
   */

  const monthsData = useMemo(() => {

    const months = MONTHS.map((m) => ({
      month: m,
      values: [] as number[],
      total: 0,
      min: 0,
      max: 0,
    }));

    transactions?.forEach((t) => {
      const date = new Date(t.createdAt);
      const m = date.getMonth();
      const amt = Number(t.amount) || 0;

      months[m].values.push(amt);
    });

    months.forEach((m) => {
      if (m.values.length === 0) {
        m.total = 0;
        m.min = 0;
        m.max = 0;
      } else {
        m.total = m.values.reduce((a, b) => a + b, 0);
        m.min = Math.min(...m.values);
        m.max = Math.max(...m.values);
      }
    });

    return months;

  }, [transactions]);

  const count = monthsData.length;

  /**
   * =============================
   * BAR WIDTH CALCULATION
   * =============================
   */

  const { barWidth, spacing } = useMemo(() => {

    const denom = count + 0.9 * (count - 1);
    let bw = availableChartWidth / denom;

    bw = clamp(bw, 6, 14);

    const sp = clamp(0.9 * bw, 6, 16);

    return { barWidth: bw, spacing: sp };

  }, [availableChartWidth, count]);

  const chartHeight = 220;

  /**
   * =============================
   * CHART DATA
   * =============================
   */

  const chartData = useMemo(() => {

    return monthsData.map((m, idx) => {

      const isZero = m.total === 0;

      const fakeValue = isZero
        ? Math.floor(Math.random() * 80) + 20
        : m.total;

      return {
        value: fakeValue,
        realValue: m.total,
        label: m.month,
        min: m.min,
        max: m.max,
        frontColor: isZero
          ? "rgba(255,255,255,0.25)"
          : idx === selectedIndex
          ? "#22C55E"
          : "#E5E7EB",
      };
    });

  }, [monthsData, selectedIndex]);

  /**
   * =============================
   * DYNAMIC Y AXIS
   * =============================
   */

  const maxValue = useMemo(() => {

    const max = monthsData.reduce((m, it) => Math.max(m, it.total), 0);

    if (max === 0) return 500;

    const rounded = Math.ceil(max / 100) * 100;

    return rounded;

  }, [monthsData]);

  const selected = chartData[selectedIndex] || null;

  /**
   * =============================
   * TOOLTIP POSITION
   * =============================
   */

  const tooltipPos = useMemo(() => {

    if (!selected) return { left: 0, top: 0 };

    const block = barWidth + spacing;

    const barCenterX =
      yAxisLabelWidth + barWidth / 2 + selectedIndex * block;

    const barH =
      maxValue > 0 ? (selected.value / maxValue) * chartHeight : 0;

    const barTopY = chartHeight - barH;

    let left = barCenterX - tipSize.w / 2;
    let top = barTopY - tipSize.h - 10;

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
        <Text style={styles.titlePillText}>Yearly Expenses</Text>
      </View>

      <View style={styles.chartArea}>

        {selected && (
          <View
            style={[styles.tipContainer, { left: tooltipPos.left, top: tooltipPos.top }]}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setTipSize({ w: width, h: height });
            }}
          >
            <Text style={styles.tipMonth}>{selected.label}</Text>

            <View style={styles.tipBox}>
              <Text style={styles.tipLine}>
                Total: <Text style={styles.tipValue}>₹{selected.realValue}</Text>
              </Text>

              <Text style={styles.tipLine}>
                Min: <Text style={styles.tipValue}>₹{selected.min}</Text>
              </Text>

              <Text style={styles.tipLine}>
                Max: <Text style={styles.tipValue}>₹{selected.max}</Text>
              </Text>
            </View>
          </View>
        )}

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
    fontSize: 13,
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