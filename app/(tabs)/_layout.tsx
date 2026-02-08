import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from '@expo/vector-icons/Octicons';

import { HapticTab } from "@/components/haptic-tab";

const ACTIVE = "#FFFFFF";
const INACTIVE = "rgba(255,255,255,0.6)";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const BASE_HEIGHT = 60;
  const BASE_PADDING_BOTTOM = 10;
  const BASE_PADDING_TOP = 10;

  const extraBottom = Math.max(insets.bottom , 0);

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
          // paddingTop: BASE_PADDING_TOP,
          // paddingBottom: BASE_PADDING_BOTTOM + extraBottom,
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
              size={30}
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
              size={30}
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
            <Octicons name="goal" size={32} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />

      <Tabs.Screen
        name="Budget"
        options={{
          title: "Categories",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="tag-outline" size={30} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />
    </Tabs>
  );
}