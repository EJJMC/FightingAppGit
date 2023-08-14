import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

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
            "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/08/07/mortal-kombat-1-trailer-reptile-ashrah-havik-sareena-evo.jpg",
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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
          <Picker.Item label="Matchup Experience" value="Matchup Experience" />
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

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
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
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  pickerContainer: {
    maxHeight: 150,
  },
});

export default RegistrationScreen;
