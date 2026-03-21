// StreakBox.tsx
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const GREEN = "#28F07B";
const STORAGE_PREFIX = "expense_streak_v2";

type StoredStreak = {
  streakDays: number;
  lastMarkedDate: string | null; // YYYY-MM-DD
  longestStreak: number;
};

type Props = {
  userId: string;
  subtitle?: string;
  unlocked?: boolean;
  onPressUnlock?: () => void;
};

export type StreakBoxRef = {
  markTodayComplete: () => Promise<void>;
  reloadStreak: () => Promise<void>;
  resetStreak: () => Promise<void>;
};

const DEFAULT_SUBTITLE =
  "Track your daily expenses logging\nand unlock smart guidance";

const StreakBox = forwardRef<StreakBoxRef, Props>(
  (
    {
      userId,
      subtitle = DEFAULT_SUBTITLE,
      unlocked = false,
      onPressUnlock,
    },
    ref
  ) => {
    const [loading, setLoading] = useState(true);
    const [streakDays, setStreakDays] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [lastMarkedDate, setLastMarkedDate] = useState<string | null>(null);

    const storageKey = useMemo(() => `${STORAGE_PREFIX}:${userId}`, [userId]);

    const getTodayString = () => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const diffInDays = (fromDate: string, toDate: string) => {
      const from = new Date(`${fromDate}T00:00:00`);
      const to = new Date(`${toDate}T00:00:00`);
      const diff = to.getTime() - from.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    const readStoredStreak = useCallback(async (): Promise<StoredStreak> => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);

        if (!raw) {
          return {
            streakDays: 0,
            lastMarkedDate: null,
            longestStreak: 0,
          };
        }

        const parsed = JSON.parse(raw) as StoredStreak;

        return {
          streakDays: parsed?.streakDays ?? 0,
          lastMarkedDate: parsed?.lastMarkedDate ?? null,
          longestStreak: parsed?.longestStreak ?? 0,
        };
      } catch (error) {
        console.log("readStoredStreak error", error);
        return {
          streakDays: 0,
          lastMarkedDate: null,
          longestStreak: 0,
        };
      }
    }, [storageKey]);

    const writeStoredStreak = useCallback(
      async (data: StoredStreak) => {
        try {
          await AsyncStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
          console.log("writeStoredStreak error", error);
        }
      },
      [storageKey]
    );

/**
 * Loads the stored streak AND marks today in one atomic pass.
 * This prevents the race where loadStreak sets state with stale values
 * before markTodayComplete can update them.
 */
const loadStreak = useCallback(async () => {
  if (!userId) {
    setStreakDays(0);
    setLongestStreak(0);
    setLastMarkedDate(null);
    setLoading(false);
    return;
  }

  const stored = await readStoredStreak();
  const today = getTodayString();

  let nextStreak: number;

  if (!stored.lastMarkedDate) {
    // First ever open → day 1
    nextStreak = 1;
  } else {
    const gap = diffInDays(stored.lastMarkedDate, today);

    if (gap === 0) {
      // Already marked today, keep current streak
      nextStreak = stored.streakDays;
    } else if (gap === 1) {
      // Opened on consecutive day → extend streak
      nextStreak = stored.streakDays + 1;
    } else {
      // Missed one or more days → restart at 1
      nextStreak = 1;
    }
  }

  const nextData: StoredStreak = {
    streakDays: nextStreak,
    lastMarkedDate: today,
    longestStreak: Math.max(stored.longestStreak || 0, nextStreak),
  };

  await writeStoredStreak(nextData);

  // Single state update — UI always shows correct post-mark values
  setStreakDays(nextData.streakDays);
  setLongestStreak(nextData.longestStreak);
  setLastMarkedDate(nextData.lastMarkedDate);
}, [diffInDays, readStoredStreak, userId, writeStoredStreak]);

/**
 * Kept for external ref consumers. Safe to call multiple times —
 * gap === 0 branch is a no-op.
 */
const markTodayComplete = useCallback(async () => {
  await loadStreak();
}, [loadStreak]);

    const resetStreak = useCallback(async () => {
      const resetData: StoredStreak = {
        streakDays: 0,
        lastMarkedDate: null,
        longestStreak: 0,
      };

      await writeStoredStreak(resetData);
      setStreakDays(0);
      setLongestStreak(0);
      setLastMarkedDate(null);
    }, [writeStoredStreak]);

    useImperativeHandle(
      ref,
      () => ({
        markTodayComplete,
        reloadStreak: loadStreak,
        resetStreak,
      }),
      [loadStreak, markTodayComplete, resetStreak]
    );

    // ✅ Daily app-open streak logic
useEffect(() => {
  const init = async () => {
    setLoading(true);
    await loadStreak(); // ← handles mark + load atomically
    setLoading(false);
  };

  init();
}, [loadStreak]);

    const progressDays = useMemo(() => {
      const totalSlots = 7;

      return Array.from({ length: totalSlots }, (_, i) => {
        const dayNumber = i + 1;
        const completed = dayNumber < streakDays;
        const active = dayNumber === streakDays && streakDays > 0;

        return {
          dayNumber,
          completed,
          active,
        };
      });
    }, [streakDays]);

    if (loading) {
      return (
        <LinearGradient
          colors={["#1B1B1B", "#0F0F0F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, styles.loaderWrap]}
        >
          <ActivityIndicator size="small" color={GREEN} />
        </LinearGradient>
      );
    }

    return (
      <LinearGradient
        colors={["#1B1B1B", "#0F0F0F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={styles.leftIconWrap}>
            <Image
              style={{ width: 70, height: 70 }}
              source={require("@/assets/images/Gloss.png")}
              resizeMode="contain"
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              {streakDays} Days <Text style={styles.titleAccent}>streak</Text>
            </Text>

            <Text style={styles.subtitle}>{subtitle}</Text>

            <Text style={styles.metaText}>
              Last open: {lastMarkedDate ?? "Not started"}
              {"\n"}
              Best streak: {longestStreak} day{longestStreak === 1 ? "" : "s"}
            </Text>
          </View>
        </View>

        {/* Progress Row */}
        <View style={styles.progressTrack}>
          {progressDays.map((item) => (
            <View key={item.dayNumber} style={styles.progressItem}>
              <View
                style={[
                  styles.dayCircle,
                  item.completed && styles.dayCircleCompleted,
                  item.active && styles.dayCircleActive,
                ]}
              >
                {item.completed ? (
                  <Ionicons name="checkmark" size={18} color="#0B0B0B" />
                ) : item.active ? (
                  <MaterialCommunityIcons
                    name="fire"
                    size={22}
                    color={GREEN}
                  />
                ) : (
                  <Text style={styles.dayText}>{item.dayNumber}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPressUnlock}
          disabled={unlocked}
          style={[styles.cta, unlocked && styles.ctaDisabled]}
        >
          <Ionicons
            name={unlocked ? "checkmark-circle" : "lock-closed"}
            size={16}
            color={GREEN}
          />
          <Text style={styles.ctaText}>
            {unlocked
              ? "Super Guidance unlocked"
              : "Unlock Super Guidance with AI Bot"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
);

export default StreakBox;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "#121212",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  loaderWrap: {
    minHeight: 140,
    justifyContent: "center",
    alignItems: "center",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  leftIconWrap: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  content: {
    flex: 1,
    paddingTop: 2,
  },

  title: {
    fontSize: 26,
    lineHeight: 30,
    color: "#FFFFFF",
    fontFamily: "ProtestRiot-Regular",
  },

  titleAccent: {
    color: GREEN,
    fontFamily: "ProtestRiot-Regular",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    lineHeight: 16,
    color: "white",
  },

  metaText: {
    marginTop: 8,
    fontSize: 11.5,
    lineHeight: 16,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Poppins-Regular",
  },

  progressTrack: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "nowrap",
  },

  progressItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  dayCircleCompleted: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  dayCircleActive: {
    borderColor: "rgba(40,240,123,0.7)",
    backgroundColor: "rgba(40,240,123,0.08)",
  },

  dayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.95,
  },

  cta: {
    marginTop: 14,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.3,
    borderColor: "rgba(40,240,123,0.55)",
    backgroundColor: "rgba(40,240,123,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  ctaDisabled: {
    opacity: 0.9,
  },

  ctaText: {
    color: GREEN,
    fontSize: 13.5,
    fontWeight: "800",
  },
});