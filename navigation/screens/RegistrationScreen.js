import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import bgImage from "../../assets/blue.png";

const RegistrationScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedName, setSelectedName] = useState("Ryu");
  const [selectedTimezone, setSelectedTimezone] = useState("PST");
  const [selectedGoal, setSelectedGoal] = useState("Casual Set");
  const [selectedRank, setSelectedRank] = useState("Master");
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [cfnName, setCFNName] = useState("");
  const [socialMedia, setSocialMedia] = useState({
    twitch: "",
    youtube: "",
    discord: "",
    twitter: "",
  });
  const [youtubeVideo, setYoutubeVideo] = useState(""); // New state for YouTube video

  const navigation = useNavigation();

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const { uid } = user;

        // Set the same ID for the user document in Firestore
        const userDocRef = doc(db, "users", uid);

        // Store user data in Firestore, including the uid field
        const userData = {
          uid: uid,
          name: selectedName,
          timezone: selectedTimezone,
          goal: selectedGoal,
          rank: selectedRank,
          username: username,
          cfnName: cfnName,
          socialMedia: socialMedia,
          youtubeVideo: youtubeVideo, // Include YouTube video link
          email: user.email,
          photoUrl:
            imageUrl ||
            "https://media.distractify.com/brand-img/eAEeP6ZoU/0x0/street-fighter-6-new-logo-1654282240002.jpg",
        };

        setDoc(userDocRef, userData)
          .then(() => {
            console.log("User registered:", user.email);
            console.log("UID:", uid);
            navigation.navigate(homeName);
          })
          .catch((error) => {
            console.error("Registration failed:", error);
            alert(error.message);
          });
      })
      .catch((error) => {
        console.error("Registration error:", error);
        alert(error.message);
      });
  };
  return (
    <ImageBackground source={bgImage} style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />

            <TextInput
              placeholder="Profile Picture URL"
              value={imageUrl}
              onChangeText={(text) => setImageUrl(text)}
              style={styles.input}
            />

            <Text style={styles.title}>Choose a Main Character</Text>
            <ScrollView style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedName}
                onValueChange={(itemValue) => setSelectedName(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Ryu" value="Ryu" />
                <Picker.Item label="Ken" value="Ken" />
                <Picker.Item label="Juri" value="Juri" />
                <Picker.Item label="Rashid" value="Rashid" />
                <Picker.Item label="Cammy" value="Cammy" />
                <Picker.Item label="Lily" value="Lily" />
                <Picker.Item label="Zangief" value="Zangief" />
                <Picker.Item label="JP" value="JP" />
                <Picker.Item label="Marisa" value="Marisa" />
                <Picker.Item label="Manon" value="Manon" />
                <Picker.Item label="Dee Jay" value="Dee Jay" />
                <Picker.Item label="E.Honda" value="E.Honda" />
                <Picker.Item label="Dhalsim" value="Dhalsim" />
                <Picker.Item label="Blanka" value="Blanka" />
                <Picker.Item label="Kimberly" value="Kimberly" />
                <Picker.Item label="Guile" value="Guile" />
                <Picker.Item label="Chun-Li" value="Chun-Li" />
                <Picker.Item label="Jamie" value="Jamie" />
                <Picker.Item label="Luke" value="Luke" />
              </Picker>
            </ScrollView>

            <Text style={styles.title}>Choose a Timezone</Text>
            <Picker
              selectedValue={selectedTimezone}
              onValueChange={(itemValue) => setSelectedTimezone(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="PST" value="PST" />
              <Picker.Item label="GMT" value="GMT" />
              <Picker.Item label="EST" value="EST" />
            </Picker>
            <Text style={styles.title}>What are your Goals</Text>
            <Picker
              selectedValue={selectedGoal}
              onValueChange={(itemValue) => setSelectedGoal(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Casual Set" value="Casual Set" />
              <Picker.Item
                label="Tournament Practice"
                value="Tournament Practice"
              />
              <Picker.Item
                label="Matchup Experience"
                value="Matchup Experience"
              />
            </Picker>

            <Text style={styles.title}>Select Your Rank</Text>
            <Picker
              selectedValue={selectedRank}
              onValueChange={(itemValue) => setSelectedRank(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Master" value="Master" />
              <Picker.Item label="Platinum" value="Platinum" />
              <Picker.Item label="Diamond" value="Diamond" />
              <Picker.Item label="Gold" value="Gold" />
              <Picker.Item label="Silver" value="Silver" />
              <Picker.Item label="Iron" value="Iron" />
            </Picker>

            <Text style={styles.title}>
              What is your User Name for this app{" "}
            </Text>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
              style={styles.input}
            />
            <Text style={styles.title}>What is your CFN Name </Text>
            <TextInput
              placeholder="CFN Name"
              value={cfnName}
              onChangeText={(text) => setCFNName(text)}
              style={styles.input}
            />

            <Text style={styles.title}>Social Media</Text>
            <TextInput
              placeholder="Twitch Username"
              value={socialMedia.twitch}
              onChangeText={(text) =>
                setSocialMedia({ ...socialMedia, twitch: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="YouTube Channel"
              value={socialMedia.youtube}
              onChangeText={(text) =>
                setSocialMedia({ ...socialMedia, youtube: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Discord Username"
              value={socialMedia.discord}
              onChangeText={(text) =>
                setSocialMedia({ ...socialMedia, discord: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Twitter Handle"
              value={socialMedia.twitter}
              onChangeText={(text) =>
                setSocialMedia({ ...socialMedia, twitter: text })
              }
              style={styles.input}
            />
            <Text style={styles.title}>YouTube Video</Text>
            <TextInput
              placeholder="YouTube Video Link"
              value={youtubeVideo}
              onChangeText={(text) => setYoutubeVideo(text)}
              style={styles.input}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSignup}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}> Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "white",
  },

  scrollContainer: {
    flexGrow: 1, // This property allows the content to grow within the ScrollView
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#FFFFFF", // Input background color
    paddingHorizontal: 15,
    paddingVertical: 12, // Adjust padding for better spacing
    borderRadius: 10,
    marginTop: 10, // Increase spacing between inputs
    borderColor: "#DDDDDD", // Add a border color
    borderWidth: 1, // Add a border
    fontSize: 16, // Adjust font size
  },

  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 20, // Increase spacing between button and inputs
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "#FFFFFF", // Button text color
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center", // Center the button text
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  pickerContainer: {
    maxHeight: 150,
    backgroundColor: "#FFFFFF", // Picker background color
    borderRadius: 10,
    marginTop: 10, // Increase spacing between pickers
    borderColor: "#DDDDDD", // Add a border color
    borderWidth: 1, // Add a border
  },
});

export default RegistrationScreen;
