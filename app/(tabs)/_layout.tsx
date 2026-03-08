import React, { useEffect } from "react";
import { BackHandler } from "react-native";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";

import { HapticTab } from "@/components/haptic-tab";

const ACTIVE = "#FFFFFF";
const INACTIVE = "rgba(255,255,255,0.6)";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const BASE_HEIGHT = 65;
  const extraBottom = Math.max(insets.bottom+5, 0);

  useEffect(() => {
    const onBackPress = () => {
      const isOnDashboard =
        pathname === "/(tabs)" ||
        pathname === "/(tabs)/" ||
        pathname === "/(tabs)/index" ||
        pathname === "/";

      if (!isOnDashboard) {
        router.replace("/(tabs)");
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [pathname, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 0.5,
          borderTopColor: "rgba(255,255,255,0.14)",
          height: BASE_HEIGHT + extraBottom,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12.5,
          fontFamily: "Poppins-Medium",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              size={30}
              color={focused ? ACTIVE : INACTIVE}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "briefcase" : "briefcase-outline"}
              size={25}
              color={focused ? ACTIVE : INACTIVE}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Transcation"
        options={{
          title: "Transaction",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={25}
              color={focused ? ACTIVE : INACTIVE}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Goal"
        options={{
          title: "Goal",
          tabBarIcon: ({ focused }) => (
            <Octicons
              name="goal"
              size={25}
              color={focused ? ACTIVE : INACTIVE}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Budget"
        options={{
          title: "Categories",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="tag-outline"
              size={25}
              color={focused ? ACTIVE : INACTIVE}
            />
          ),
        }}
      />
    </Tabs>
  );
}