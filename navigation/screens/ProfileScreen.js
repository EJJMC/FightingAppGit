import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      // Get the authenticated user's ID
      const userId = auth.currentUser.uid;

      // Get the user document from Firestore
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // Retrieve the user data from the document
        const userData = userDocSnapshot.data();
        setUsername(userData.username);
        setAge(userData.age);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <Text style={styles.text}>{username}</Text>

      <Text style={styles.label}>Age:</Text>
      <Text style={styles.text}>{age}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ProfileScreen;
