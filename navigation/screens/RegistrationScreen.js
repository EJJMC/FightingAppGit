import React, { useEffect, useState } from "react";
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
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const RegistrationScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(""); // Set default age value
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("profileName");
      }
    });

    return unsubscribe;
  }, []);

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const { uid } = user;
  
        // Set the same ID for the user document in Firestore
        const userDocRef = doc(db, "users", uid);
  
        // Store user data in Firestore
        const userData = {
          username: username,
          age: age.toString(), // Store age as a string
          email: user.email,
        };
  
        // Set the user data in Firestore with the specified document ID
        setDoc(userDocRef, userData)
          .then(() => {
            console.log("User registered:", user.email);
            navigation.navigate("Profile");
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

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />

<Picker
  selectedValue={age}
  onValueChange={(itemValue) => setAge(itemValue)}
  style={styles.input}
>
  <Picker.Item label="GMT" value="GMT" />
  <Picker.Item label="PST" value="PST" />
  <Picker.Item label="EST" value="EST" />
</Picker>
      </View>

      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}> Login</Text>
        </TouchableOpacity> */}

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

export default RegistrationScreen


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
  