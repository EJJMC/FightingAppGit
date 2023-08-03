import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ResultsScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const handleSendMessage = (user) => {
    navigation.navigate("Messages", { user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username: {user.username}</Text>
      <Text style={styles.text}>Name: {user.name}</Text>
      <Text style={styles.text}>Timezone: {user.timezone}</Text>
      <Text style={styles.text}>Goal: {user.goal}</Text>
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => handleSendMessage(user)} // Use 'user' instead of 'item' here
      >
        <Text style={styles.buttonText}>Message</Text>
      </TouchableOpacity>
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
  messageButton: {
    marginTop: 8,
    backgroundColor: "#0782F9",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ResultsScreen;
