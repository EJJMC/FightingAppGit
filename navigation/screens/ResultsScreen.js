import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import { Avatar } from "react-native-elements";
import bgImage from "../../assets/SearchBackground.png";
import { Ionicons } from "@expo/vector-icons";

const ResultsScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const handleSendMessage = (user) => {
    navigation.navigate("Messages", { user });
  };

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Avatar
              source={{ uri: user.photoUrl }}
              rounded
              size="xlarge"
              containerStyle={styles.avatar}
            />
            <TouchableOpacity onPress={() => handleSendMessage(user)}>
              <Ionicons name="mail-outline" size={54} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.cfnContainer}>
            <Ionicons name="earth-outline" size={24} color="#FFFFFF" />
            <Text style={styles.text}>{user.timezone}</Text>
          </View>
          <View style={styles.Container}>
            <Text style={styles.text}> {user.username}</Text>
          </View>
          <Image source={require("../../assets/Line.png")} />
          <View style={styles.Container}>
            <Text style={styles.text}>CFN Name: {user.cfnName}</Text>
            <Text style={styles.text}>CFN Number: {user.cfnName}</Text>
          </View>
          <Image source={require("../../assets/Line.png")} />
          <View style={styles.Container}>
            <Text style={styles.text}>Main Character: {user.name}</Text>
            <Text style={styles.text}>Rank: {user.rank}</Text>
            <Text style={styles.text}>Goal: {user.goal}</Text>
          </View>
          <Image source={require("../../assets/Line.png")} />

          <View style={styles.socialMediaContainer}>
            <Text style={styles.text}>Social Media:</Text>
            {Object.entries(user.socialMedia).map(
              ([platform, value], index) => (
                <Text key={index} style={styles.text}>
                  {platform}: {value}
                </Text>
              )
            )}
          </View>

          <Image source={require("../../assets/Line.png")} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    justifyContent: "space-between",
    width: "50%",
  },
  cfnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "20%",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
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

  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default ResultsScreen;
