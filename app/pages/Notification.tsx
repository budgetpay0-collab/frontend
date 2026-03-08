import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/* ================= MAIN COMPONENT ================= */

const Notification = () => {
  const router = useRouter();

  /* ── Entrance Animations ── */
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  const emptyFade = useRef(new Animated.Value(0)).current;
  const emptyScale = useRef(new Animated.Value(0.88)).current;
  const emptySlide = useRef(new Animated.Value(30)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    /* Header slides in from top */
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        damping: 18,
        stiffness: 130,
        useNativeDriver: true,
      }),
    ]).start();

    /* Empty state fades + scales in with delay */
    Animated.parallel([
      Animated.timing(emptyFade, {
        toValue: 1,
        duration: 480,
        delay: 220,
        useNativeDriver: true,
      }),
      Animated.spring(emptyScale, {
        toValue: 1,
        damping: 16,
        stiffness: 110,
        delay: 220,
        useNativeDriver: true,
      }),
      Animated.spring(emptySlide, {
        toValue: 0,
        damping: 18,
        stiffness: 120,
        delay: 220,
        useNativeDriver: true,
      }),
    ]).start();

    /* Gentle infinite pulse on the bell ring */
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  useEffect(() => {
  const backAction = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/"); // go to home screen
    }
    return true;
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);

  /* ── Back button press animation ── */
  const backScale = useRef(new Animated.Value(1)).current;

  const handleBackPressIn = () => {
    Animated.spring(backScale, {
      toValue: 0.88,
      useNativeDriver: true,
      damping: 15,
      stiffness: 200,
    }).start();
  };

  const handleBackPressOut = () => {
    Animated.spring(backScale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 12,
      stiffness: 180,
    }).start(() => router.back());
  };

  /* ================= UI ================= */

  return (
    <View style={styles.screen}>

      {/* ── Top Area ── */}
      <Animated.View
        style={[
          styles.topArea,
          {
            opacity: headerFade,
            transform: [{ translateY: headerSlide }],
          },
        ]}
      >
        <View style={styles.headerRow}>
          {/* Back Button */}
          <Animated.View style={{ transform: [{ scale: backScale }] }}>
            <TouchableOpacity
              style={styles.backBtn}
              onPressIn={handleBackPressIn}
              onPressOut={handleBackPressOut}
              activeOpacity={1}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.headerTitle}>Notifications</Text>

          {/* Spacer to balance layout */}
          <View style={styles.headerSpacer} />
        </View>
      </Animated.View>

      {/* ── Bottom Sheet ── */}
      <View style={styles.bottomSheet}>
        <View style={styles.handleWrap}>
          <View style={styles.handle} />
        </View>

        {/* ── Empty State ── */}
        <Animated.View
          style={[
            styles.emptyContainer,
            {
              opacity: emptyFade,
              transform: [
                { scale: emptyScale },
                { translateY: emptySlide },
              ],
            },
          ]}
        >
          {/* Bell icon with pulsing ring */}
          <View style={styles.bellOuter}>
            <Animated.View
              style={[
                styles.bellRing,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={styles.bellInner}>
              <Text style={styles.bellEmoji}>🔔</Text>
            </View>
          </View>

          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySubtitle}>
            You have no notifications right now.{"\n"}
            We'll let you know when something comes up.
          </Text>

        
        </Animated.View>
      </View>
    </View>
  );
};

export default Notification;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },

  /* ── Top Area ── */
  topArea: {
    backgroundColor: "#0f0f0f",
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#1a1a1a",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.3,
  },

  headerSpacer: {
    width: 40,
  },

  /* ── Bottom Sheet ── */
  bottomSheet: {
    flex: 1,
    backgroundColor: "#000",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    marginTop: 8,
  },

  handleWrap: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
  },

  handle: {
    width: 92,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  /* ── Empty State ── */
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
    paddingHorizontal: 32,
  },

  bellOuter: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  bellRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "rgba(34,197,94,0.3)",
    backgroundColor: "rgba(34,197,94,0.05)",
  },

  bellInner: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#222",
  },

  bellEmoji: {
    fontSize: 32,
  },

  emptyTitle: {
    fontSize: 20,
    // fontWeight: "700",
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    letterSpacing: -0.4,
    marginBottom: 10,
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#555",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: 21,
  },

  dotsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 28,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 99,
  },
});