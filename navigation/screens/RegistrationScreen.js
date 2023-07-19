import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Picker,
} from "react-native";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const RegistrationScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedName, setSelectedName] = useState("Ryu");
  const [selectedTimezone, setSelectedTimezone] = useState("PST");
  const [selectedGoal, setSelectedGoal] = useState("Casual Set");
  const [username, setUsername] = useState(""); // State for the username
  const navigation = useNavigation();

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const { uid } = user;

        // Set the same ID for the user document in Firestore
        const userDocRef = doc(db, "users", uid);

        // Store user data in Firestore
        const userData = {
          name: selectedName,
          timezone: selectedTimezone,
          goal: selectedGoal,
          username: username, // Include the inputted username
          email: user.email,
        };

        // Set the user data in Firestore with the specified document ID
        setDoc(userDocRef, userData)
          .then(() => {
            console.log("User registered:", user.email);
            navigation.navigate("Home");
          })
          .catch((error) => {
            console.error("Registration failed:", error);
            alert(error.message);
          });
      })
      .catch((error) => alert(error.message));
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

        <Text style={styles.title}>Choose a Main Character</Text>

        <Picker
          selectedValue={selectedName}
          onValueChange={(itemValue) => setSelectedName(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Ryu" value="Ryu" />
          <Picker.Item label="Ken" value="Ken" />
          <Picker.Item label="Juri" value="Juri" />
        </Picker>

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

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
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
});

export default RegistrationScreen;
