// components/TopHeader.tsx
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title?: string;
  subtitle?: string;
};

const TopHeader: React.FC<Props> = ({
  title = "Monthly Savings Goal",
  subtitle = "Your journey to financial freedom",
}) => {
  return (
    
      <View style={styles.wrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
      </View>
    
  );
};

export default TopHeader;

const styles = StyleSheet.create({
  
  wrap: {
    backgroundColor: "#024000",
    marginTop:20,
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",

    // slight shadow like the screenshot
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    // fontWeight: "800",
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.2,
  },
  subTitle: {
    // marginTop: 4,
    color: "rgba(255,255,255,0.75)",
    marginTop: -8,
    fontSize: 12.5,
    // fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },
});