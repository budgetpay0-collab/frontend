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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/store/userStore";
import { updateUser } from "@/apiCalls/Login";

const Index = () => {
  const [loading, setLoading] = useState(true);

  const userData = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  /* ================= MODAL STATE ================= */

  const [showModal, setShowModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(420)).current;

  const [nameInput, setNameInput] = useState("");
  const [incomeInput, setIncomeInput] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  // 🔒 GUARANTEE MODAL SHOWS ONLY ONCE
  const hasShownProfileModal = useRef(false);

  /* ================= LOADING ================= */

  useEffect(() => {
    if (userData) {
      setLoading(false);
    }
  }, [userData]);

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

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        BackHandler.exitApp();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  /* ================= SHOW MODAL (ONCE) ================= */

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
    }).start(() => {
      setShowModal(false);
    });
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
        <TopHeader name={name} onPressBell={() => {}} />
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
            monthlySpend={monthlySpend}
            saving={saving}
          />

          <StreakBox />

          <FirstGraph
            labels={["Week1", "Week2", "Week3", "Week4"]}
            pointsPerLabel={7}
            enableWeekFilter
          />

          <View style={{ height: 900 }} />
        </ScrollView>
      </View>

      {/* ================= MODAL ================= */}

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

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleSaveProfile}
            >
              <Text style={styles.primaryText}>Save & Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
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
});
