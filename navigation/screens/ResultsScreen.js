import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { WebView } from "react-native-webview";

const ResultsScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const handleSendMessage = (user) => {
    navigation.navigate("Messages", { user });
  };

  return (
    <View style={styles.container}>
      <Avatar
        source={{ uri: user.photoUrl }}
        rounded
        size="large"
        containerStyle={styles.avatar}
      />
      <Text style={styles.text}>Username: {user.username}</Text>
      <Text style={styles.text}>Name: {user.name}</Text>
      <Text style={styles.text}>Timezone: {user.timezone}</Text>
      <Text style={styles.text}>Goal: {user.goal}</Text>
      <Text style={styles.text}>CFN Name: {user.cfnName}</Text>
      <View style={styles.socialMediaContainer}>
        <Text style={styles.text}>Social Media:</Text>
        {Object.entries(user.socialMedia).map(([platform, value], index) => (
          <Text key={index} style={styles.text}>
            {platform}: {value}
          </Text>
        ))}
      </View>
      <Text style={styles.text}>Rank: {user.rank}</Text>

      {/* Display YouTube video using <iframe> tag */}
      {user.youtubeVideo && (
        <iframe
          width="300"
          height="200"
          src={user.youtubeVideo}
          frameborder="0"
          allowfullscreen
        ></iframe>
      )}

      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => handleSendMessage(user)}
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
  socialMediaContainer: {
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
  avatar: {
    marginBottom: 20,
  },
  webview: {
    width: 300,
    height: 200,
    marginVertical: 10,
  },
});

export default ResultsScreen;
