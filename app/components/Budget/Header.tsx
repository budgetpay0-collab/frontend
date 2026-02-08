import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  title?: string;
  subtitle?: string;
  onTagPress?: () => void;
};

const Header: React.FC<Props> = ({
  title = "Budget Overview",
  subtitle = "Track your spending progress across all categories",
  onTagPress,
}) => {
  return (
    <>
    <View style={styles.wrap}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onTagPress}
        style={styles.iconBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Feather name="tag" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      
    </View>
    <View style={{backgroundColor: "rgba(255,255,255,0.42)", width: '100%', height: 1}}/>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#101010",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 14 : 12,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    // fontWeight: "800",
    fontFamily:'Poppins-SemiBold',
    color: "#34D399", // green like screenshot
    letterSpacing: 0.2,
  },
  subtitle: {
    // marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "rgba(255,255,255,0.65)",
    // fontWeight: "500",
    fontFamily:'Poppins-Regular',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});