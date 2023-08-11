import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const UserProfileScreen = () => {
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Fetch the user's authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUserEmail(user.email);

        // Fetch user data from Firestore based on email
        const fetchData = async () => {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserData(userData);
          }
        };

        fetchData();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Image source={{ uri: userData.photoUrl }} style={styles.profileImage} />
      <Text style={styles.text}>Logged-in User Email: {loggedInUserEmail}</Text>
      <Text style={styles.text}>Name: {userData.name}</Text>
      <Text style={styles.text}>Timezone: {userData.timezone}</Text>
      <Text style={styles.text}>Goal: {userData.goal}</Text>
      <Text style={styles.text}>Rank: {userData.rank}</Text>
      <Text style={styles.text}>Username: {userData.username}</Text>
      <Text style={styles.text}>CFN Name: {userData.cfnName}</Text>
      <Text style={styles.text}>Social Media:</Text>
      <Text style={styles.text}>Twitch: {userData.socialMedia?.twitch}</Text>
      <Text style={styles.text}>YouTube: {userData.socialMedia?.youtube}</Text>
      <Text style={styles.text}>Discord: {userData.socialMedia?.discord}</Text>
      <Text style={styles.text}>Twitter: {userData.socialMedia?.twitter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default UserProfileScreen;
