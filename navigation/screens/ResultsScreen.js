// Import the required modules
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// ResultsScreen component
const ResultsScreen = ({ route }) => {
  // Extract the user object from the route params
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username: {user.username}</Text>
      <Text style={styles.text}>Name: {user.name}</Text>
      <Text style={styles.text}>Timezone: {user.timezone}</Text>
      <Text style={styles.text}>Goal: {user.goal}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ResultsScreen;
