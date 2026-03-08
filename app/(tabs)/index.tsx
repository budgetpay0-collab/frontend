import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  BackHandler,
} from "react-native";

import TopHeader from "../components/Home/TopHeader";
import Header from "../components/Home/Header";
import GlassEffectBoxes from "../components/Home/GlassEffectBoxes";
import StreakBox from "../components/Home/StreakBox";
import FirstGraph from "../components/Home/FirstGraph";

import { useUserStore } from "@/store/userStore";
import { updateUser } from "@/apiCalls/Login";
import PieGraph from "../components/Home/PieGraph";
import YearGraph from "../components/Home/YearGraph";
import TopCategories from "../components/Home/TopCategories";
import HealthOverall from "../components/Home/HealthOverall";
import { fetchTransactions } from "@/apiCalls/Transactions/fetchTransactions";
import { baseURL } from "@/store/baseURL";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const userData = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [transactions, setTransactions] = useState([]);
  const hydration = useUserStore((s) => s.hydration);

  useEffect(() => {
    async function getTransactions() {
      if (!userData) return;
      const fetchedTransactions = await fetchTransactions(userData._id, baseURL.nihal);
      setTransactions(fetchedTransactions || []);
      const totalAmount =
        fetchedTransactions?.reduce((sum: any, item: any) => sum + item.amount, 0) || 0;
      setMonthlySpent(totalAmount);
      const updatedUserData = { monthlySpend: totalAmount };
      const updatedUser = await updateUser(userData?._id, updatedUserData);
      if (updatedUser) setUser(updatedUser);
    }
    getTransactions();
    setLoading(false);
  }, [hydration]);

  /* ================= PROFILE MODAL STATE ================= */

  const [showModal, setShowModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(420)).current;
  const [nameInput, setNameInput] = useState("");
  const [incomeInput, setIncomeInput] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const hasShownProfileModal = useRef(false);

  /* ================= EXIT MODAL STATE ================= */

  const [showExitModal, setShowExitModal] = useState(false);
  const exitBackdropFade = useRef(new Animated.Value(0)).current;
  const exitCardScale = useRef(new Animated.Value(0.82)).current;
  const exitCardFade = useRef(new Animated.Value(0)).current;
  const exitCardSlide = useRef(new Animated.Value(28)).current;

  const openExitModal = () => {
    setShowExitModal(true);
    Animated.parallel([
      Animated.timing(exitBackdropFade, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(exitCardFade, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.spring(exitCardScale, {
        toValue: 1,
        damping: 15,
        stiffness: 140,
        useNativeDriver: true,
      }),
      Animated.spring(exitCardSlide, {
        toValue: 0,
        damping: 18,
        stiffness: 130,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeExitModal = (andThen?: () => void) => {
    Animated.parallel([
      Animated.timing(exitBackdropFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(exitCardFade, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(exitCardScale, {
        toValue: 0.88,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // reset for next open
      exitCardScale.setValue(0.82);
      exitCardSlide.setValue(28);
      exitBackdropFade.setValue(0);
      exitCardFade.setValue(0);
      setShowExitModal(false);
      andThen?.();
    });
  };

  /* ================= KEYBOARD LISTENERS ================= */

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardOffset(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardOffset(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  /* ================= ANDROID BACK HANDLER ================= */

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      openExitModal();
      return true; // prevent default exit
    });
    return () => backHandler.remove();
  }, []);

  /* ================= SHOW PROFILE MODAL (ONCE) ================= */

  useEffect(() => {
    if (!userData) return;
    if (hasShownProfileModal.current) return;
    if (userData.income === 0 || userData.income == null) {
      hasShownProfileModal.current = true;
      const timer = setTimeout(() => {
        setNameInput(userData.name ?? "");
        setShowModal(true);
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 120,
          useNativeDriver: true,
        }).start();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  /* ================= SAVE PROFILE ================= */

  const handleSaveProfile = async () => {
    if (!nameInput.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!incomeInput || Number(incomeInput) <= 0) {
      alert("Please enter a valid monthly income");
      return;
    }
    const updatedUserData = {
      name: nameInput.trim(),
      income: Number(incomeInput),
    };
    const updatedUser = await updateUser(userData?._id, updatedUserData);
    if (!updatedUser) {
      alert("Failed to save data");
      return;
    }
    setUser(updatedUser);
    Animated.timing(slideAnim, {
      toValue: 420,
      duration: 260,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  /* ================= LOADING UI ================= */

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  /* ================= DERIVED DATA ================= */

  const monthlyIncome = userData?.income ?? 0;
  const monthlySpend = userData?.monthlySpend ?? 0;
  const saving = monthlyIncome - monthlySpend;
  const name = userData?.name ?? "User";

  /* ================= UI ================= */

  return (
    <View style={styles.screen}>
      <View style={styles.topArea}>
        <TopHeader name={name} />
        <Header />
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.handleWrap}>
          <View style={styles.handle} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <GlassEffectBoxes
            monthlyIncome={monthlyIncome}
            monthlySpend={monthlySpent}
            saving={saving}
          />
          <StreakBox />
          <View style={{ marginBottom: 20 }} />
          <FirstGraph
            labels={["Week1", "Week2", "Week3", "Week4"]}
            pointsPerLabel={7}
            enableWeekFilter
          />
          <PieGraph />
          <YearGraph />
          <TopCategories />
          <HealthOverall />
        </ScrollView>
      </View>

      {/* ================= PROFILE MODAL ================= */}

      <Modal visible={showModal} transparent animationType="none">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBackdrop}
        >
          <Animated.View
            style={[
              styles.modalCard,
              {
                transform: [{ translateY: slideAnim }],
                marginBottom: keyboardOffset,
              },
            ]}
          >
            <Text style={styles.modalTitle}>Complete your profile</Text>
            <Text style={styles.modalSubtitle}>
              Just one step before you continue 🚀
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter your name"
                placeholderTextColor="#666"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Income</Text>
              <TextInput
                value={incomeInput}
                onChangeText={setIncomeInput}
                placeholder="₹ 0"
                keyboardType="numeric"
                placeholderTextColor="#666"
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSaveProfile}>
              <Text style={styles.primaryText}>Save & Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ================= EXIT CONFIRMATION MODAL ================= */}

      <Modal visible={showExitModal} transparent animationType="none">
        <Animated.View style={[styles.exitBackdrop, { opacity: exitBackdropFade }]}>
          <Animated.View
            style={[
              styles.exitCard,
              {
                opacity: exitCardFade,
                transform: [
                  { scale: exitCardScale },
                  { translateY: exitCardSlide },
                ],
              },
            ]}
          >
            {/* Icon */}
            <View style={styles.exitIconWrap}>
              <Text style={styles.exitIcon}>👋</Text>
            </View>

            <Text style={styles.exitTitle}>Leaving so soon?</Text>
            <Text style={styles.exitSubtitle}>
              Are you sure you want to close the app?
            </Text>

            {/* Divider */}
            <View style={styles.exitDivider} />

            {/* Buttons */}
            <View style={styles.exitBtnRow}>
              <TouchableOpacity
                style={styles.exitBtnNo}
                activeOpacity={0.75}
                onPress={() => closeExitModal()}
              >
                <Text style={styles.exitBtnNoText}>Stay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exitBtnYes}
                activeOpacity={0.75}
                onPress={() => closeExitModal(() => BackHandler.exitApp())}
              >
                <Text style={styles.exitBtnYesText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default Index;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
  },

  topArea: {
    backgroundColor: "#0f0f0f",
    paddingBottom: 10,
  },

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

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* ── Profile Modal ── */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#111",
    padding: 22,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    color: "#999",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: "#fff",
  },

  primaryBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
  },

  primaryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  /* ── Exit Modal ── */
  exitBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  exitCard: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },

  exitIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  exitIcon: {
    fontSize: 30,
  },

  exitTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: -0.3,
  },

  exitSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },

  exitDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 22,
  },

  exitBtnRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  exitBtnNo: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  exitBtnNoText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  exitBtnYes: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  exitBtnYesText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
});