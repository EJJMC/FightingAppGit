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
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Button,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { auth, db } from "../../firebase";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { Avatar } from "react-native-elements";
import bgImage from "../../assets/blue.png";
import { Ionicons } from "@expo/vector-icons";

const UserProfileScreen = () => {
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Add state to store social media data
  const [socialMedia, setSocialMedia] = useState({});

  const [selectedName, setSelectedName] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedRank, setSelectedRank] = useState("");
  const [selectedcfnName, setSelectedcfnName] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");

  const [selectedTwitch, setSelectedTwitch] = useState("");
  const [selectedYouTube, setSelectedYouTube] = useState("");
  const [selectedDiscord, setSelectedDiscord] = useState("");
  const [selectedTwitter, setSelectedTwitter] = useState("");

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

            setSocialMedia(userData.socialMedia || {});

            // Set social media state variables
            setSelectedTwitch(userData.socialMedia?.twitch || "");
            setSelectedYouTube(userData.socialMedia?.youtube || "");
            setSelectedDiscord(userData.socialMedia?.discord || "");
            setSelectedTwitter(userData.socialMedia?.twitter || "");

            setSelectedName(userData.name || "");
            setSelectedTimezone(userData.timezone || "");
            setSelectedGoal(userData.goal || "");
            setSelectedRank(userData.rank || "");
            setSelectedcfnName(userData.cfnName || "");
            setSelectedUsername(userData.username || "");
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
        cfnName: selectedcfnName,
        username: selectedUsername,

        socialMedia: {
          twitch: selectedTwitch,
          youtube: selectedYouTube,
          discord: selectedDiscord,
          twitter: selectedTwitter,
        },

        // Add other fields as needed
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {isEditing ? (
            <>
              <Text style={styles.text}>{loggedInUserEmail}</Text>
              <Text style={styles.title}>Change Character:</Text>
              <Picker
                selectedValue={selectedName}
                onValueChange={(itemValue) => setSelectedName(itemValue)}
                style={styles.input}
                mode="dropdown"
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
              <Text style={styles.title}>Change Timezone</Text>
              <Picker
                selectedValue={selectedTimezone}
                onValueChange={(itemValue) => setSelectedTimezone(itemValue)}
                style={styles.input}
                mode="dropdown"
              >
                <Picker.Item label="PST" value="PST" />
                <Picker.Item label="GMT" value="GMT" />
                <Picker.Item label="EST" value="EST" />
              </Picker>
              <Text style={styles.title}>Change Goals</Text>
              <Picker
                selectedValue={selectedGoal}
                onValueChange={(itemValue) => setSelectedGoal(itemValue)}
                style={styles.input}
                mode="dropdown"
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
              <Text style={styles.title}>Change Rank</Text>
              <Picker
                selectedValue={selectedRank}
                onValueChange={(itemValue) => setSelectedRank(itemValue)}
                style={styles.input}
                mode="dropdown"
              >
                <Picker.Item label="Master" value="Master" />
                <Picker.Item label="Platinum" value="Platinum" />
                <Picker.Item label="Diamond" value="Diamond" />
                <Picker.Item label="Gold" value="Gold" />
                <Picker.Item label="Silver" value="Silver" />
                <Picker.Item label="Iron" value="Iron" />
                {/* Add more rank options */}
              </Picker>
              <Text style={styles.title}>Social Media:</Text>
              <Text style={styles.title}>Change Twitch UserName</Text>
              <TextInput
                style={styles.input}
                placeholder="Twitch"
                value={selectedTwitch}
                onChangeText={(text) => setSelectedTwitch(text)}
              />
              <Text style={styles.title}>Change Youtube UserName</Text>
              <TextInput
                style={styles.input}
                placeholder="YouTube"
                value={selectedYouTube}
                onChangeText={(text) => setSelectedYouTube(text)}
              />
              <Text style={styles.title}>Change Discord UserName</Text>
              <TextInput
                style={styles.input}
                placeholder="Discord"
                value={selectedDiscord}
                onChangeText={(text) => setSelectedDiscord(text)}
              />
              <Text style={styles.title}>Change Twitter UserName</Text>
              <TextInput
                style={styles.input}
                placeholder="Twitter"
                value={selectedTwitter}
                onChangeText={(text) => setSelectedTwitter(text)}
              />
              <Text style={styles.title}>Change Username</Text>

              <TextInput
                style={styles.input}
                placeholder="Username"
                value={selectedUsername}
                onChangeText={(text) => setSelectedUsername(text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Username"
                value={selectedcfnName}
                onChangeText={(text) => setSelectedcfnName(text)}
              />
              <Button title="Save" onPress={handleSave} />
            </>
          ) : (
            <>
              <View style={styles.headerContainer}>
                <Avatar
                  source={{ uri: userData.photoUrl }}
                  rounded
                  size="xlarge"
                  containerStyle={styles.avatar}
                />
                <TouchableOpacity onPress={handleEdit}>
                  <Ionicons name="settings-outline" size={54} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.cfnContainer}>
                <Ionicons name="earth-outline" size={24} color="#FFFFFF" />
                <Text style={styles.text}> {userData.timezone}</Text>
              </View>

              <Text style={styles.text}>Username: {userData.username}</Text>

              <Image source={require("../../assets/BlueLine.png")} />
              <Text style={styles.text}>Main Character: {userData.name}</Text>
              <Text style={styles.text}>Rank: {userData.rank}</Text>
              <Text style={styles.text}>Goal: {userData.goal}</Text>
              <Image source={require("../../assets/BlueLine.png")} />
              <Text style={styles.text}>cfnName: {userData.cfnName}</Text>
              <Text style={styles.text}>cfnNumber: {userData.username}</Text>
              <Image source={require("../../assets/BlueLine.png")} />

              <Text style={styles.text}>Social Media:</Text>
              <Text style={styles.text}>Twitch: {socialMedia.twitch}</Text>
              <Text style={styles.text}>YouTube: {socialMedia.youtube}</Text>
              <Text style={styles.text}>Discord: {socialMedia.discord}</Text>
              <Text style={styles.text}>Twitter: {socialMedia.twitter}</Text>
              <Image source={require("../../assets/BlueLine.png")} />
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    justifyContent: "space-between",
    width: "50%",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 82,
    marginBottom: 10,
    padding: 8,
    width: "100%",
    color: "white",
    backgroundColor: "blue",
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
  cfnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "20%",
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default UserProfileScreen;
