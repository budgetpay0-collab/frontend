import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type CategoryItem = {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string; // border + progress color
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type Props = {
  title?: string;
  categories?: CategoryItem[];
};

const formatINR = (n: number) => {
  try {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

const DynamicCategory: React.FC<Props> = ({
  title = "Dynamic Categories",
  categories = [],
}) => {
  const computed = useMemo(() => {
    return categories.map((c) => {
      const pct =
        c.allocated > 0 ? Math.min((c.spent / c.allocated) * 100, 100) : 0;
      const remaining = Math.max(c.allocated - c.spent, 0);
      return { ...c, pct, remaining };
    });
  }, [categories]);

  const hasData = computed.length > 0;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>{title}</Text>

      {!hasData ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <MaterialCommunityIcons
              name="shape-outline"
              size={26}
              color="rgba(255,255,255,0.85)"
            />
          </View>

          <Text style={styles.emptyTitle}>No categories yet</Text>
          <Text style={styles.emptySubtitle}>
            Create a category to track allocated vs spent and stay on budget.
          </Text>

          {/* little decorative chips */}
          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <MaterialCommunityIcons
                name="chart-donut"
                size={14}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.chipText}>Track</Text>
            </View>

            <View style={styles.chip}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={14}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.chipText}>Budget</Text>
            </View>

            <View style={styles.chip}>
              <MaterialCommunityIcons
                name="check-decagram-outline"
                size={14}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.chipText}>Control</Text>
            </View>
          </View>
        </View>
      ) : (
        computed.map((c) => (
          <View key={c.id} style={[styles.card, { borderColor: c.color }]}>
            {/* Header row */}
            <View style={styles.cardTop}>
              <View style={styles.leftHead}>
                <MaterialCommunityIcons name={c.icon} size={18} color={c.color} />
                <Text style={[styles.catName, { color: c.color }]}>{c.name}</Text>
                <Text style={styles.sep}>—</Text>
                <Text style={[styles.pctText, { color: c.color }]}>
                  {Math.round(c.pct)}%
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${c.pct}%`, backgroundColor: c.color },
                ]}
              />
            </View>

            {/* Bottom stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Allocated</Text>
                <Text style={styles.statValue}>₹{formatINR(c.allocated)}</Text>
              </View>

              <View style={styles.statColCenter}>
                <Text style={styles.statLabel}>Spent</Text>
                <Text style={styles.statValue}>₹{formatINR(c.spent)}</Text>
              </View>

              <View style={styles.statColRight}>
                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={[styles.statValue, styles.remaining]}>
                  ₹{formatINR(c.remaining)}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

export default DynamicCategory;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  heading: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 12,
  },

  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.02)",
    marginBottom: 14,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  catName: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },

  sep: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    marginHorizontal: 2,
  },

  pctText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },

  progressTrack: {
    height: 10,
    borderRadius: 999,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.16)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  statCol: { width: "33%" },
  statColCenter: { width: "33%", alignItems: "center" },
  statColRight: { width: "33%", alignItems: "flex-end" },

  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12.5,
    fontFamily: "Poppins-Medium",
    marginBottom: 6,
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },

  remaining: {
    color: "#22C55E",
  },

  // ✅ Empty State
  emptyCard: {
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.02)",
    marginBottom: 14,
  },

  emptyIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 10,
  },

  emptyTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },

  emptySubtitle: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 12.8,
    fontFamily: "Poppins-Medium",
    lineHeight: 18,
    marginBottom: 12,
  },

  chipsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  chipText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12.5,
    fontFamily: "Poppins-Medium",
  },
});