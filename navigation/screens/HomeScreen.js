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
} from "react-native";
import React from "react";
import bgImage from "../../assets/blue.png";

import NewsList from "./NewsList";

const HomeScreen = () => {
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
});

export default HomeScreen;
