import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useUserStore } from "@/store/userStore";

const Index = () => {
  const user = useUserStore((s)=>s.user)
  useEffect(() => {
    const t = setTimeout(() => {
      if(user){
        router.replace("/(tabs)")
      }
      else{router.replace("/Login/Login");} // ✅ change this route if you want
    }, 3000);

    return () => clearTimeout(t);
  }, []);

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
          source={require("@/assets/images/Icon2.png")} // <-- change path/name
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>BudgetPay</Text>
        <Text style={styles.text1}>with AI Integration</Text>
      </View>
    </LinearGradient>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 26,
    // fontWeight: "700",
    // fontFamily: "Poppins-Bold",
    fontFamily: "Roboto-SemiBold",
    textAlign: "center",
    // lineHeight: 34,
  },
  text1: {
    color: "#FFFFFF",
    fontSize: 14,
    // fontWeight: "700",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    // lineHeight: 34,
  },
});
