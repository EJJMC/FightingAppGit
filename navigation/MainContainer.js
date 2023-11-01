// // MainContainer.js
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createStackNavigator } from "@react-navigation/stack";
// import { Ionicons } from "@expo/vector-icons";

// // Screens
// import HomeScreen from "./screens/HomeScreen";
// import DetailsScreen from "./screens/DetailsScreen";
// import MessagesScreen from "./screens/MessageScreen"; // Import the MessagesScreen component
// // ... import other screens ...

// const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();

// function TabNavigator() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Ionicons
//               name={focused ? "ios-home" : "ios-home-outline"}
//               size={24}
//               color={focused ? "#007AFF" : "#8E8E93"}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Details"
//         component={DetailsStackScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Ionicons
//               name={focused ? "ios-list-box" : "ios-list-outline"}
//               size={24}
//               color={focused ? "#007AFF" : "#8E8E93"}
//             />
//           ),
//         }}
//       />
//       {/* Add more screens to the bottom tab navigator */}
//     </Tab.Navigator>
//   );
// }

// function DetailsStackScreen() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Details"
//         component={DetailsScreen}
//         options={{ headerTitle: "Users Details" }}
//       />
//       <Stack.Screen
//         name="Messages"
//         component={MessagesScreen} // Use the MessagesScreen component
//         options={({ route }) => ({
//           title: `Messages with ${route.params.user.username}`,
//         })}
//       />
//     </Stack.Navigator>
//   );
// }

// export default function MainContainer() {
//   return (
//     <NavigationContainer>
//       <TabNavigator />
//     </NavigationContainer>
//   );
// }

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
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
import UserProfileScreen from "./screens/UserProfileScreen";

// Screen Names
const homeName = "Home";
const detailsName = "Details";
const settingsName = "Settings";
const profileName = "Profile";
const messageName = "Messages";
const loginName = "Login";
const RegName = "Registration";
const resultsName = "Results";
const UserProfileName = "UserProfile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomHeader = ({ navigation, routeName }) => {
  return (
    <View style={{ flexDirection: "row", marginRight: 10 }}>
      {routeName === resultsName && (
        <TouchableOpacity
          onPress={() => {
            console.log("Results icon pressed!");
          }}
          style={styles.iconButton}
        >
          <Ionicons name="star-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Settings");
        }}
        style={styles.iconButton}
      >
        <Ionicons name="chatbox-ellipses-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("UserProfile");
        }}
        style={styles.iconButton}
      >
        <Ionicons name="person-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "black", // Set the header background color to black
          },
          headerTitleStyle: {
            color: "white", // Set the header text color to white
          },
          headerTintColor: "white", // Set the back arrow color to white
        }}
      >
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
        <Stack.Screen
          name={resultsName}
          component={ResultsScreen}
          options={{
            headerTitle: "Search Results",
          }}
        />

        <Stack.Screen
          name={UserProfileName}
          component={UserProfileScreen}
          options={{
            headerTitle: "View/Edit Your Profile",
            headerTitleStyle: { fontSize: 13 },
            headerBackground: () => (
              <Image
                style={{ flex: 1, width: "100%", height: "100%" }}
                source={require("../assets/TopNavBar.png")}
              />
            ),
          }}
        />
        <Stack.Screen
          name={settingsName}
          component={SettingsScreen}
          options={{
            headerTitle: "Previous Messages",
            headerTitleStyle: { fontSize: 13 },
            headerBackground: () => (
              <Image
                style={{ flex: 1, width: "100%", height: "100%" }}
                source={require("../assets/TopNavBar.png")}
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function CustomTabBarBackground({ state, descriptors, navigation }) {
  const screensWithHiddenTabBar = [loginName, RegName];

  const shouldHideTabBar = screensWithHiddenTabBar.includes(
    state.routes[state.index].name
  );

  if (shouldHideTabBar) {
    return null;
  }

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
            iconName = isFocused ? "search" : "search-outline";
          } else if (route.name === profileName) {
            iconName = isFocused
              ? "game-controller"
              : "game-controller-outline";
          }

          return (
            <Ionicons
              key={route.key}
              name={iconName}
              size={24}
              color={isFocused ? "#FFFFFF" : "#999999"}
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
function TabNavigator({ navigation, route }) {
  const currentRouteName = route.state
    ? route.state.routes[route.state.index].name
    : "";

  return (
    <Tab.Navigator
      initialRouteName={loginName}
      tabBar={(props) => <CustomTabBarBackground {...props} />}
    >
      <Tab.Screen
        name={homeName}
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTintColor: "white",
          headerTitle: "Latest FGC News",

          headerBackground: () => (
            <Image
              style={{ flex: 1, width: "100%", height: "100%" }}
              source={require("../assets/TopNavBar.png")}
            />
          ),
          headerRight: () => (
            <CustomHeader
              navigation={navigation}
              routeName={currentRouteName}
            />
          ),
        }}
      />

      <Tab.Screen
        name={detailsName}
        component={DetailsScreen}
        options={{
          headerShown: true,
          headerTitle: "Search For Player",
          headerTintColor: "white",

          headerBackground: () => (
            <Image
              style={{ flex: 1, width: "100%", height: "100%", color: "white" }}
              source={require("../assets/TopNavBar.png")}
            />
          ),
          headerRight: () => (
            <CustomHeader
              navigation={navigation}
              routeName={currentRouteName}
            />
          ),
        }}
      />
      <Tab.Screen
        name={loginName}
        component={LoginScreen}
        options={{ headerShown: false, tabBarVisible: false }}
      />
      <Tab.Screen
        name={profileName}
        component={ProfileScreen}
        options={{
          headerShown: false,
          headerTitle: "",

          headerBackground: () => (
            <Image
              style={{ flex: 1, width: "100%", height: "100%" }}
              source={require("../assets/TopNavBar.png")}
            />
          ),
          headerRight: () => (
            <CustomHeader
              navigation={navigation}
              routeName={currentRouteName}
            />
          ),
        }}
      />

      <Tab.Screen
        name={resultsName}
        component={ResultsScreen}
        options={{
          headerShown: true,
          headerTitle: "Search Results",
          headerTintColor: "white",

          headerBackground: () => (
            <Image
              style={{ flex: 1, width: "100%", height: "100%", color: "white" }}
              source={require("../assets/TopNavBar.png")}
            />
          ),
          headerRight: () => (
            <CustomHeader
              navigation={navigation}
              routeName={currentRouteName}
            />
          ),
        }}
      />

      <Tab.Screen
        name={UserProfileName}
        component={UserProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    position: "relative",
    zIndex: 0,
    height: 50,
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
  iconButton: {
    marginRight: 50,
  },
  headerTitle: {
    fontSize: 16,
  },
});
