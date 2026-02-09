import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { login ,signUpUser} from "@/apiCalls/Login";
import { useUserStore } from "@/store/userStore";

const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [email , setEmail] = useState("")
  const [pass , setPassword] = useState("")
  const [signUp , setSignUp] = useState(false)
  const [confirm , setConfirm] = useState("")
  const [buttonLoading, setButtonLoading] = useState(false);
  const setUser = useUserStore((s)=>s.setUser)
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardOffset(e.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardOffset(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useEffect(() => {
  if (Platform.OS !== "android") return;

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      BackHandler.exitApp(); // 🚪 exit app
      return true; // ⛔ prevent default behavior
    }
  );

  return () => backHandler.remove();
}, []);
  const openModal = () => {
    setShowModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 18,
    }).start();
  };

  const closeModal = () => {
    Keyboard.dismiss();
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };
  const openSignupModal = () => {
    setSignUp(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 18,
    }).start();
  };

  const closeSignupModal = () => {
    Keyboard.dismiss();
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSignUp(false));
  };

const handleSignup = async() => {
  setButtonLoading(true);
  const trimmedEmail = email.trim();
  const trimmedPassword = pass.trim();
  const trimmedConfirmPassword = confirm.trim();

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ❌ Email checks
  if (!trimmedEmail) {
    alert("Email is required");
    setButtonLoading(false);
    return;
  }

  if (!emailRegex.test(trimmedEmail)) {
    alert("Please enter a valid email address");
    setButtonLoading(false);
    return;
  }

  // ❌ Password checks
  if (!trimmedPassword) {
    alert("Password is required");
    setButtonLoading(false);
    return;
  }

  if (trimmedPassword.length < 6) {
    alert("Password must be at least 6 characters");
    setButtonLoading(false);
    return;
  }

  // ❌ Confirm password checks
  if (!trimmedConfirmPassword) {
    alert("Confirm password is required");
    setButtonLoading(false);
    return;
  }

  if (trimmedPassword !== trimmedConfirmPassword) {
    alert("Passwords do not match");
    setButtonLoading(false);
    return;
  }
   const response = await signUpUser(trimmedEmail, trimmedPassword);
 
 if(!response){
   alert("Cannot generate Profile")
  setButtonLoading(false);
  return
  }
  if(response === "Email already exists"){
  alert("Email already exists")
  setButtonLoading(false);
  return
  }
  setUser(response)
  setButtonLoading(false);
  router.replace("/(tabs)")
  // ✅ All validations passed
  
};


  const handleLogin = async() => {
  // Trim to avoid spaces
  setButtonLoading(true);
  const trimmedEmail = email.trim();
  const trimmedPassword = pass.trim();

  // Email regex (industry standard)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ❌ Email validation
  if (!trimmedEmail) {
    alert("Email is required");
    setButtonLoading(false);
    return;
  }

  if (!emailRegex.test(trimmedEmail)) {
    alert("Please enter a valid email");
    setButtonLoading(false);
    return;
  }

  // ❌ Password validation
  if (!trimmedPassword) {
    alert("Password is required");
    setButtonLoading(false);
    return;
  }

  if (trimmedPassword.length < 6) {
    alert("Password must be at least 6 characters");
    setButtonLoading(false);
    return;
  }

  // ✅ All validations passed → call login
 const response = await login(trimmedEmail, trimmedPassword);
 
 if(!response){
  alert("Credentials are incorrect");
  setButtonLoading(false);
  return;
 }
 setUser(response)
 setButtonLoading(false);
 router.replace("/(tabs)")
};
  return (
    <LinearGradient
      colors={["#000000", "#023C01"]}
      locations={[0.1, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.center}>
        <Image
          source={require("@/assets/images/Icon2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>BudgetPay</Text>
        <Text style={styles.text1}>with AI Integration</Text>

        <View style={styles.hr} />

        <Text style={styles.text}>Your Money.</Text>
        <Text style={styles.text}>Now Intelligent</Text>
      </View>

      {/* Background corner squares */}
      <View style={{ position: "absolute", top: 80, left: -100, right: 0 }}>
        <Image
          source={require("@/assets/images/CornerSquare.png")}
          style={styles.bglogo}
          resizeMode="contain"
        />
      </View>
      <View style={{ position: "absolute", top: -100, right: 0 }}>
        <Image
          source={require("@/assets/images/CornerSquare.png")}
          style={styles.bglogo}
          resizeMode="contain"
        />
      </View>
      <View style={{ position: "absolute", top: 400, right: -110 }}>
        <Image
          source={require("@/assets/images/CornerSquare.png")}
          style={styles.bglogo}
          resizeMode="contain"
        />
      </View>
      <View style={{ position: "absolute", bottom: 100, left: -110 }}>
        <Image
          source={require("@/assets/images/CornerSquare.png")}
          style={styles.bglogo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.btn, styles.googleBtn]}
          onPress={() => {
            // TODO: handle google login
          }}
        >
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.btn, styles.loginBtn]}
          onPress={openModal}
        >
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signupCTA}
          onPress={openSignupModal}
        >
          <Text style={styles.signupText}>New to BudgetPay ?</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent animationType="none">
        <Pressable style={styles.backdrop} onPress={closeModal} />

        <Animated.View
          style={[
            styles.modalContainer,
            { 
              transform: [{ translateY: slideAnim }],
              marginBottom: keyboardOffset, // This pushes modal up when keyboard appears
            },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View style={styles.dragIndicator} />

            <Text style={styles.modalTitle}>Welcome Back</Text>
            <Text style={styles.modalSubtitle}>
              Login to continue to BudgetPay
            </Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
              onChangeText={setPassword}
            />

            <TouchableOpacity 
              style={styles.modalLoginBtn}
              onPress={() => {
                // Handle login
                handleLogin()
                Keyboard.dismiss();
               
              }}
            >
              {buttonLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.modalLoginText}>Login</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </Modal>



      {/* SignUP modal */}
      <Modal visible={signUp} transparent animationType="none">
        <Pressable style={styles.backdrop} onPress={closeSignupModal} />

        <Animated.View
          style={[
            styles.modalContainer,
            { 
              transform: [{ translateY: slideAnim }],
              marginBottom: keyboardOffset, // This pushes modal up when keyboard appears
            },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View style={styles.dragIndicator} />

            <Text style={styles.modalTitle}>Welcome Back</Text>
            <Text style={styles.modalSubtitle}>
              Signup to continue to BudgetPay
            </Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
              onChangeText={setPassword}
            />
               <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
              onChangeText={setConfirm}
            />
            <TouchableOpacity 
              style={styles.modalLoginBtn}
              onPress={() => {
                // Handle login
                handleSignup()
                Keyboard.dismiss();
               
              }}
            >
             {buttonLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.modalLoginText}>Signup</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </Modal>
    </LinearGradient>
  );
};

export default Login;

// ... rest of your styles remain the same

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },

  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    color: "#111",
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },

  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 15,
    color : 'black'
  },

  modalLoginBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1E7A1B",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  modalLoginText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },

  signupCTA: {
    alignItems: "center",
    marginTop: 8,
  },

  signupText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textDecorationLine: "underline",
  },

  container: { flex: 1, position: "relative" },

  center: {
    flex: 1,
    paddingTop: 200,
    alignItems: "center",
    paddingHorizontal: 24,
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },

  bglogo: {
    width: 210,
    height: 210,
    marginBottom: 8,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 26,
    fontFamily: "Roboto-SemiBold",
    textAlign: "center",
  },

  text1: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },

  hr: {
    width: 160,
    height: 1,
    backgroundColor: "#FFFFFF",
    marginVertical: 12,
    opacity: 0.5,
  },

  bottomArea: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 40,
    gap: 12,
    paddingBottom: Platform.OS === "ios" ? 10 : 0,
  },

  btn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  googleBtn: {
    backgroundColor: "#FFFFFF",
  },

  googleBtnText: {
    color: "#111111",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },

  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  loginBtn: {
    backgroundColor: "#1E7A1B",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
});