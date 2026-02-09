import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  Dimensions,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/store/userStore";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Profile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  /* ================= STORE ================= */
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  /* ================= FORM STATE ================= */
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [income, setIncome] = useState(
    user?.income !== undefined ? user.income.toString() : ""
  );
  const [monthlySpend, setMonthlySpend] = useState(
    user?.monthlySpend !== undefined ? user.monthlySpend.toString() : ""
  );

  /* ================= MODAL STATE ================= */
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /* ================= KEYBOARD ================= */
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  /* ================= SCROLL REFS ================= */
  const nameInputY = useRef(0);
  const emailInputY = useRef(0);
  const phoneInputY = useRef(0);
  const incomeInputY = useRef(0);
  const monthlySpendInputY = useRef(0);

  /* ================= FORM CHANGE CHECK ================= */
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user) return;

    const modified =
      name !== user.name ||
      email !== user.email ||
      phone !== user.phone ||
      income !== user.income.toString() ||
      monthlySpend !== user.monthlySpend.toString();

    setHasChanges(modified);
  }, [name, email, phone, income, monthlySpend, user]);

  /* ================= KEYBOARD LISTENERS ================= */
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, (e) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });
    
    const hide = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /* ================= MODAL ANIMATION ================= */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: showLogoutModal ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: showLogoutModal ? 0 : SCREEN_HEIGHT,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showLogoutModal]);

  /* ================= HELPERS ================= */
  const scrollToInput = (y: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ 
        y: y - 150, 
        animated: true 
      });
    }, 100);
  };

  const formatDate = (value?: Date | string | null) => {
    if (!value) return "—";

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  /* ================= ACTIONS ================= */
  const onSaveProfile = () => {
    if (!user) return;

    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Email cannot be empty");
      return;
    }

    setUser({
      ...user,
      name,
      email,
      phone,
      income: Number(income) || 0,
      monthlySpend: Number(monthlySpend) || 0,
    });

    Alert.alert("Success", "Profile updated successfully");
    setHasChanges(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    clearUser();
    setShowLogoutModal(false);
    setTimeout(() => router.replace("/Login/Login"), 200);
  };

  if (!user) return null;

  /* ================= UI ================= */
  return (
    <>
      <View style={styles.outerContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            {/* HEADER */}
            <View style={styles.header}>
              <Pressable onPress={() => router.back()} style={styles.backBtn}>
                <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
              </Pressable>
              <Text style={styles.title}>Profile</Text>
              <Pressable onPress={() => setShowLogoutModal(true)} style={styles.logoutBtn}>
                <MaterialCommunityIcons name="logout" size={20} color="#FF5252" />
              </Pressable>
            </View>

            {/* CONTENT */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollContent}
              contentContainerStyle={[
                styles.scrollContentContainer,
                { paddingBottom: keyboardVisible ? keyboardHeight + 20 : 120 }
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              {/* AVATAR */}
              <View style={styles.avatarSection}>
                <MaterialCommunityIcons name="account-circle" size={80} color="#16C784" />
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.statusText}>
                  {user.isActive ? "Active" : "Inactive"}
                </Text>
              </View>

              {/* LAST LOGIN */}
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#888" />
                  <Text style={styles.infoLabel}>Last Login</Text>
                </View>
                <Text style={styles.infoValue}>
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : "—"}
                </Text>
              </View>

              {/* FORM */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                {/* Full Name */}
                <View
                  onLayout={(e) => (nameInputY.current = e.nativeEvent.layout.y)}
                  style={styles.inputGroup}
                >
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="account-outline" size={20} color="#888" />
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#666"
                      onFocus={() => scrollToInput(nameInputY.current)}
                    />
                  </View>
                </View>

                {/* Email */}
                <View
                  onLayout={(e) => (emailInputY.current = e.nativeEvent.layout.y)}
                  style={styles.inputGroup}
                >
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="email-outline" size={20} color="#888" />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#666"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => scrollToInput(emailInputY.current)}
                    />
                  </View>
                </View>

                {/* Phone */}
                <View
                  onLayout={(e) => (phoneInputY.current = e.nativeEvent.layout.y)}
                  style={styles.inputGroup}
                >
                  <Text style={styles.label}>Phone</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="phone-outline" size={20} color="#888" />
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      style={styles.input}
                      placeholder="Phone"
                      placeholderTextColor="#666"
                      keyboardType="phone-pad"
                      onFocus={() => scrollToInput(phoneInputY.current)}
                    />
                  </View>
                </View>
              </View>

              {/* Financial Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Financial Information</Text>

                {/* Annual Income */}
                <View
                  onLayout={(e) => (incomeInputY.current = e.nativeEvent.layout.y)}
                  style={styles.inputGroup}
                >
                  <Text style={styles.label}>Annual Income</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="currency-usd" size={20} color="#888" />
                    <TextInput
                      value={income}
                      onChangeText={setIncome}
                      style={styles.input}
                      placeholder="Annual Income"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      onFocus={() => scrollToInput(incomeInputY.current)}
                    />
                  </View>
                </View>

                {/* Monthly Spend */}
                <View
                  onLayout={(e) => (monthlySpendInputY.current = e.nativeEvent.layout.y)}
                  style={styles.inputGroup}
                >
                  <Text style={styles.label}>Monthly Spend</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="credit-card-outline" size={20} color="#888" />
                    <TextInput
                      value={monthlySpend}
                      onChangeText={setMonthlySpend}
                      style={styles.input}
                      placeholder="Monthly Spend"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      onFocus={() => scrollToInput(monthlySpendInputY.current)}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* SAVE BUTTON - Only show when there are changes AND keyboard is hidden */}
            {!keyboardVisible && hasChanges && (
              <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
                <Pressable onPress={onSaveProfile} style={styles.saveBtn}>
                  <MaterialCommunityIcons name="content-save" size={20} color="#06140F" />
                  <Text style={styles.saveBtnText}>Save Profile</Text>
                </Pressable>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* LOGOUT MODAL */}
      <Modal visible={showLogoutModal} transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowLogoutModal(false)}>
          <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconBg}>
                <MaterialCommunityIcons name="logout" size={32} color="#FF5252" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalDescription}>
              Are you sure you want to logout from your account?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalLogoutBtn} onPress={handleLogout}>
                <Text style={styles.modalLogoutText}>Logout</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },

  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#000000",
  },

  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 16,
  },

  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },

  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,82,82,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,82,82,0.2)",
  },

  scrollContent: {
    flex: 1,
  },

  scrollContentContainer: {
    paddingTop: 16,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },

  userName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
    marginTop: 12,
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },

  infoCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  infoLabel: {
    color: "#888",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },

  infoValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },

  formSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },

  bottomContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.10)",
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#16C784",
    paddingVertical: 16,
    borderRadius: 12,
  },

  saveBtnText: {
    color: "#06140F",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  modalContent: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  modalIconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  modalIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,82,82,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,82,82,0.3)",
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 12,
  },

  modalDescription: {
    color: "#999",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },

  modalCancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
  },

  modalCancelText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },

  modalLogoutBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#FF5252",
    alignItems: "center",
  },

  modalLogoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },
});