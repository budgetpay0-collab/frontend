// StreakBox.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  streakDays?: number;              // e.g. 3
  daysRow?: number[];               // e.g. [3,4,5,6,7]
  subtitle?: string;                // 2-line text
  unlocked?: boolean;               // if true, show "unlocked" state
  onPressUnlock?: () => void;       // CTA action
};

const StreakBox: React.FC<Props> = ({
  streakDays = 3,
  daysRow = [3, 4, 5, 6, 7],
  subtitle = "Track your daily expenses logging\nand unlock smart guidance",
  unlocked = false,
  onPressUnlock,
}) => {
  return (
    <LinearGradient
      colors={["#1B1B1B", "#0F0F0F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.topRow}>
        {/* Left gradient sparkle icon */}
        <View style={styles.leftIconWrap}>
         <Image style={{width:70, height:70}} source={require("@/assets/images/Gloss.png")}/>
        </View>

        {/* Right content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            {streakDays} Days <Text style={styles.titleAccent}>streak</Text>
          </Text>

          <Text style={styles.subtitle}>{subtitle}</Text>

          
        </View>
      </View>
{/* Progress row */}
          <View style={styles.progressRow}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={18} color="#0B0B0B" />
            </View>

            <MaterialCommunityIcons
              name="fire"
              size={34}
              color={GREEN}
              style={styles.flame}
            />

            <View style={styles.daysRow}>
              {daysRow.map((d) => (
                <View key={d} style={styles.dayCircle}>
                  <Text style={styles.dayText}>{d}</Text>
                </View>
              ))}
            </View>
          </View>
      {/* CTA */}
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
          {unlocked ? "Super Guidance unlocked" : "Unlock Super Guidance with AI Bot"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default StreakBox;

const GREEN = "#28F07B";

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "#121212",

    // shadow (iOS) + elevation (Android)
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
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

  sparkleBg: {
    width: 62,
    height: 62,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  plusBadge: {
    position: "absolute",
    top: 2,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingTop: 2,
  },

  title: {
    fontSize: 26,
    lineHeight: 30,
    // fontWeight: "800",
    color: "#FFFFFF",
    fontFamily:'ProtestRiot-Regular'
  },

  titleAccent: {
    color: GREEN,
    fontFamily:'ProtestRiot-Regular'
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12.5,
    fontFamily:'Poppins-Regular',
    lineHeight: 16,
    color: "white",
  },

  progressRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'center'
  },

  checkCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  flame: {
    marginRight: 10,
  },

  daysRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "nowrap",
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

  dayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.95,
  },

  cta: {
    marginTop: 12,
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
