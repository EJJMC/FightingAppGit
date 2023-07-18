import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Screens
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MessageScreen from "./screens/MessageScreen";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import ResultsScreen from "./screens/ResultsScreen";

// Screen Names
const homeName = "Home";
const detailsName = "Details";
const settingsName = "Settings";
const profileName = "Profile";
const messageName = "Message";
const loginName = "Login";
const RegName = "Registration";
const resultsName = "Results";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={messageName} component={MessageScreen} />
        <Stack.Screen name={homeName} component={HomeScreen} />
        <Stack.Screen name={profileName} component={ProfileScreen} />
        <Stack.Screen name={loginName} component={LoginScreen} />
        <Stack.Screen name={RegName} component={RegistrationScreen} />
        <Stack.Screen name={resultsName} component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
function CustomTabBarBackground({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarBackground}>
      <Image
        source={require("../assets/NavigationBar.png")}
        style={styles.tabBarBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.tabBarIconsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          let iconName;

          if (route.name === homeName) {
            iconName = isFocused ? "home" : "home-outline";
          } else if (route.name === detailsName) {
            iconName = isFocused ? "list" : "list-outline";
          } else if (route.name === loginName) {
            iconName = isFocused ? "settings" : "settings-outline";
          }

          return (
            <Ionicons
              key={route.key}
              name={iconName}
              size={24}
              color={isFocused ? "#000000" : "#999999"}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      tabBar={(props) => <CustomTabBarBackground {...props} />}
    >
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={detailsName} component={DetailsScreen} />
      <Tab.Screen name={loginName} component={LoginScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    position: "relative",
    zIndex: 0,
    height: 56, // Adjust the height as needed
  },
  tabBarBackgroundImage: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: "100%",
    zIndex: -1,
  },
  tabBarIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
});
