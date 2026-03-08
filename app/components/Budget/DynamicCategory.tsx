import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type CategoryItem = {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type Props = {
  title?: string;
  categories?: CategoryItem[];
  onDelete?: (name: string) => void;
  onEdit?: (name: string) => void;
};

const formatINR = (n: number) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

const DynamicCategory: React.FC<Props> = ({
  title = "Dynamic Categories",
  categories = [],
  onDelete,
  onEdit,
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

  const handleDelete = (name: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete && onDelete(name),
        },
      ]
    );
  };

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
        </View>
      ) : (
        computed.map((c) => (
          <View key={c.id} style={[styles.card, { borderColor: c.color }]}>
            {/* Header */}
            <View style={styles.cardTop}>
              <View style={styles.leftHead}>
                <MaterialCommunityIcons
                  name={c.icon}
                  size={18}
                  color={c.color}
                />
                <Text style={[styles.catName, { color: c.color }]}>
                  {c.name}
                </Text>
                <Text style={styles.sep}>—</Text>
                <Text style={[styles.pctText, { color: c.color }]}>
                  {Math.round(c.pct)}%
                </Text>
              </View>

              {/* 🔥 ACTION BUTTONS */}
              <View style={styles.actionsRow}>
                {onEdit && (
                  <Pressable
                    onPress={() => onEdit(c.name)}
                    style={styles.iconBtn}
                  >
                    <MaterialCommunityIcons
                      name="pencil-outline"
                      size={18}
                      color="rgba(255,255,255,0.85)"
                    />
                  </Pressable>
                )}

                {onDelete && (
                  <Pressable
                    onPress={() => handleDelete(c.name)}
                    style={styles.iconBtn}
                  >
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={18}
                      color="#EF4444"
                    />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${c.pct}%`, backgroundColor: c.color },
                ]}
              />
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Allocated</Text>
                <Text style={styles.statValue}>
                  ₹{formatINR(c.allocated)}
                </Text>
              </View>

              <View style={styles.statColCenter}>
                <Text style={styles.statLabel}>Spent</Text>
                <Text style={styles.statValue}>
                  ₹{formatINR(c.spent)}
                </Text>
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

/* ================= STYLES ================= */

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

  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },

  iconBtn: {
    padding: 6,
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
  },
});
