// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Image } from "react-native";
// import { auth, db } from "../../firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";

// const UserProfileScreen = () => {
//   const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
//   const [userData, setUserData] = useState({});

//   useEffect(() => {
//     // Fetch the user's authentication state
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setLoggedInUserEmail(user.email);

//         // Fetch user data from Firestore based on email
//         const fetchData = async () => {
//           const usersRef = collection(db, "users");
//           const q = query(usersRef, where("email", "==", user.email));
//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             const userData = querySnapshot.docs[0].data();
//             setUserData(userData);
//           }
//         };

//         fetchData();
//       }
//     });

//     return unsubscribe;
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>User Profile</Text>
//       <Image source={{ uri: userData.photoUrl }} style={styles.profileImage} />
//       <Text style={styles.text}>Logged-in User Email: {loggedInUserEmail}</Text>
//       <Text style={styles.text}>Name: {userData.name}</Text>
//       <Text style={styles.text}>Timezone: {userData.timezone}</Text>
//       <Text style={styles.text}>Goal: {userData.goal}</Text>
//       <Text style={styles.text}>Rank: {userData.rank}</Text>
//       <Text style={styles.text}>Username: {userData.username}</Text>
//       <Text style={styles.text}>CFN Name: {userData.cfnName}</Text>
//       <Text style={styles.text}>Social Media:</Text>
//       <Text style={styles.text}>Twitch: {userData.socialMedia?.twitch}</Text>
//       <Text style={styles.text}>YouTube: {userData.socialMedia?.youtube}</Text>
//       <Text style={styles.text}>Discord: {userData.socialMedia?.discord}</Text>
//       <Text style={styles.text}>Twitter: {userData.socialMedia?.twitter}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 18,
//     marginBottom: 5,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
// });

// export default UserProfileScreen;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { auth, db } from "../../firebase";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Picker } from "@react-native-picker/picker"; // Import the Picker component

const UserProfileScreen = () => {
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Define state variables for picker values
  const [selectedName, setSelectedName] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedRank, setSelectedRank] = useState("");

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

            // Set picker values
            setSelectedName(userData.name);
            setSelectedTimezone(userData.timezone);
            setSelectedGoal(userData.goal);
            setSelectedRank(userData.rank);
          }
        };

        fetchData();
      }
    });

    return unsubscribe;
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Create a reference to the logged-in user's document in Firestore
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    // Update user data in Firestore
    try {
      await updateDoc(userDocRef, {
        name: selectedName,
        timezone: selectedTimezone,
        goal: selectedGoal,
        rank: selectedRank,
        // Add other fields as needed
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Image source={{ uri: userData.photoUrl }} style={styles.profileImage} />
      <Text style={styles.text}>Logged-in User Email: {loggedInUserEmail}</Text>

      {isEditing ? (
        // Render the form when editing
        <>
          <Text style={styles.title}>Choose a Name</Text>
          <Picker
            selectedValue={selectedName}
            onValueChange={(itemValue) => setSelectedName(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Ryu" value="Ryu" />
            <Picker.Item label="Ken" value="Ken" />
            <Picker.Item label="Juri" value="Juri" />
            {/* Add more name options */}
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
            <Picker.Item
              label="Matchup Experience"
              value="Matchup Experience"
            />
            {/* Add more goal options */}
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
            {/* Add more rank options */}
          </Picker>

          <Button title="Save" onPress={handleSave} />
        </>
      ) : (
        // Display user profile data when not editing
        <>
          <Text style={styles.text}>Name: {userData.name}</Text>
          <Text style={styles.text}>Timezone: {userData.timezone}</Text>
          <Text style={styles.text}>Goal: {userData.goal}</Text>
          <Text style={styles.text}>Rank: {userData.rank}</Text>
          {/* Display other user profile fields here */}
          <Button title="Edit" onPress={handleEdit} />
        </>
      )}
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    padding: 8,
    width: "100%",
  },
});

export default UserProfileScreen;
