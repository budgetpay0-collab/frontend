// Header.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  tipLine?: string;
  helpLine?: string;
};

const GREEN = "#28F07B";
const BG = "#0B0B0B";

const Header: React.FC<Props> = ({
  tipLine = "Tip: You can also add transactions quickly using our AI chatbot!",
  helpLine = `Just type commands like "Add ₹500 for groceries" in the cmd.`,
}) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <View style={styles.row}>
          {/* Bulb only at start, aligned with first line */}
          <Ionicons name="bulb-outline" size={16} color={GREEN} style={styles.icon} />

          {/* Text column */}
          <View style={styles.textCol}>
            <Text style={styles.tipText}>{tipLine}</Text>
            
          </View>
        </View>
        <Text style={styles.helpText}>{helpLine}</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    backgroundColor: BG,
  },

  bar: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(40,240,123,0.08)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(40,240,123,0.35)",
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  icon: {
    marginTop: 2,
    marginRight: 0,
  },

  textCol: {
    flex: 1,
  },

  tipText: {
    color: GREEN,
    fontSize: 11,
    // fontWeight: "800",
     fontFamily:'Poppins-Regular',
    lineHeight: 16,
  },

  helpText: {
    marginTop: 2,
    color: "rgba(40,240,123,0.85)", // slightly lighter like screenshot
    fontSize: 11,
    // fontWeight: "700",
     fontFamily:'Poppins-Regular',
    lineHeight: 16,
  },
});
