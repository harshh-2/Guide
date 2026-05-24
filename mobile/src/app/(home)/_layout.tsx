import { useAuth } from '@clerk/expo'
import { Redirect, Stack, Tabs } from 'expo-router'
import { TabsScreen } from 'react-native-screens/lib/typescript/components/tabs/screen'
import { COLORS } from "../../../constants/colors";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />
  }

  return <Tabs
  screenOptions={{
    headerShown:false,
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: COLORS.textLight,
    tabBarStyle: {
    backgroundColor: COLORS.white ,
    borderTopColor: COLORS.border ,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    borderRadius: 30,
    height: 80,
    },
    tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: "600",
    },
  }}>
    <Tabs.Screen name="index" options={{ title: "Recipies" , tabBarIcon:({color,size}) => <Ionicons name="home" size={size} color={color} /> }} />
    <Tabs.Screen name="search" options={{ title: "Search" , tabBarIcon:({color,size}) => <Ionicons name="search" size={size} color={color} /> }} />
    <Tabs.Screen name="favorites" options={{ title: "Favorites" , tabBarIcon:({color,size}) => <Ionicons name="heart" size={size} color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: "Settings" , tabBarIcon:({color,size}) => <Ionicons name="settings" size={size} color={color} /> }} />
  </Tabs>
}