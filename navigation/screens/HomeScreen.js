// import * as React from "react";
// import { View, Text } from "react-native";

// export default function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text
//         onPress={() => alert('This is the "Home" screen.')}
//         style={{ fontSize: 26, fontWeight: "bold" }}
//       >
//         Home Screen
//       </Text>
//     </View>
//   );
// }

import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import bgImage from "../../assets/blue.png";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import NewsList from "./NewsList";

const HomeScreen = () => {
  const handleLogout = () => {
    // Call the signOut function to log the user out
    signOut(auth)
      .then(() => {
        // Logout successful
        console.log("User logged out successfully.");
      })
      .catch((error) => {
        // Handle logout error
        console.error("Logout failed:", error);
      });
  };

  return (
    <ImageBackground source={bgImage} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          <Image
            source={require("../../assets/news.png")}
            style={styles.image}
          />
        </View>

        {/* Display the NewsList component */}
        <NewsList />

        {/* Add the logout button */}
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
