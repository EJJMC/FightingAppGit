// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Button,
//   TextInput,
//   StyleSheet,
//   ImageBackground,
// } from "react-native";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   startAfter,
// } from "firebase/firestore";
// import { useNavigation } from "@react-navigation/native";
// import { db, auth } from "../../firebase";
// import { Picker } from "@react-native-picker/picker";
// import bgImage from "../../assets/SearchBackground.png";

// const DetailsScreen = ({ route }) => {
//   const [users, setUsers] = useState([]);
//   const [nameFilter, setNameFilter] = useState("");
//   const [timezoneFilter, setTimezoneFilter] = useState("");
//   const [goalFilter, setGoalFilter] = useState("");
//   const [rankFilter, setRankFilter] = useState("");
//   const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
//   const [cfnNameSearch, setCFNNameSearch] = useState("");
//   const [selectedRank, setSelectedRank] = useState("");
//   const navigation = useNavigation();

//   useEffect(() => {
//     // Fetch the user's authentication state
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setLoggedInUserEmail(user.email);
//         fetchUsers();
//       }
//     });

//     return unsubscribe;
//   }, [nameFilter, timezoneFilter, goalFilter, rankFilter]); // Update dependencies

//   const fetchUsers = async () => {
//     const usersRef = collection(db, "users");
//     let querySnapshot = null;

//     let baseQuery = query(usersRef);

//     if (nameFilter) {
//       baseQuery = query(baseQuery, where("name", "==", nameFilter));
//     }
//     if (timezoneFilter) {
//       baseQuery = query(baseQuery, where("timezone", "==", timezoneFilter));
//     }
//     if (goalFilter) {
//       baseQuery = query(baseQuery, where("goal", "==", goalFilter));
//     }

//     if (rankFilter) {
//       baseQuery = query(baseQuery, where("rank", "==", rankFilter)); // Apply rank filter
//     }

//     // Execute the query
//     querySnapshot = await getDocs(baseQuery);

//     // Map the query snapshot to user data
//     const usersData = querySnapshot.docs.map((doc) => doc.data());

//     // Filter out the logged-in user from the list
//     const filteredUsers = usersData.filter(
//       (user) => user.email !== loggedInUserEmail
//     );

//     // Set the filtered users to the state
//     setUsers(filteredUsers);
//   };

//   // Filter users by CFN Name
//   const filteredUsers = users.filter((user) =>
//     user.username.toLowerCase().includes(cfnNameSearch.toLowerCase())
//   );

//   const handleUserSelection = (user) => {
//     navigation.navigate("Results", { user });
//   };

//   const renderUserItem = ({ item }) => {
//     return (
//       <View style={styles.userItem}>
//         <Text style={[styles.username, { color: "white" }]}>
//           {item.username}
//         </Text>
//         <Text style={{ color: "white" }}>Main Character: {item.name}</Text>
//         <Text style={{ color: "white" }}>Timezone: {item.timezone}</Text>
//         <Text style={{ color: "white" }}>Goal: {item.goal}</Text>
//         <Text style={{ color: "white" }}>Rank: {item.rank}</Text>
//         <TouchableOpacity
//           style={styles.messageButton}
//           onPress={() => handleUserSelection(item)}
//         >
//           <Text style={styles.buttonText}>View Profile</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <ImageBackground source={bgImage} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         <TextInput
//           placeholder="Search by CFN Name"
//           value={cfnNameSearch}
//           onChangeText={(text) => {
//             setCFNNameSearch(text);
//             console.log(text);
//           }}
//           style={styles.searchInput}
//         />

//         <Picker
//           selectedValue={nameFilter}
//           onValueChange={(itemValue) => setNameFilter(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="All Characters" value="" />
//           <Picker.Item label="Ryu" value="Ryu" />
//           <Picker.Item label="Ken" value="Ken" />
//           <Picker.Item label="Juri" value="Juri" />
//           <Picker.Item label="Rashid" value="Rashid" />
//           <Picker.Item label="Cammy" value="Cammy" />
//           <Picker.Item label="Lily" value="Lily" />
//           <Picker.Item label="Zangief" value="Zangief" />
//           <Picker.Item label="JP" value="JP" />
//           <Picker.Item label="Marisa" value="Marisa" />
//           <Picker.Item label="Manon" value="Manon" />
//           <Picker.Item label="Dee Jay" value="Dee Jay" />
//           <Picker.Item label="E.Honda" value="E.Honda" />
//           <Picker.Item label="Dhalsim" value="Dhalsim" />
//           <Picker.Item label="Blanka" value="Blanka" />
//           <Picker.Item label="Kimberly" value="Kimberly" />
//           <Picker.Item label="Guile" value="Guile" />
//           <Picker.Item label="Chun-Li" value="Chun-Li" />
//           <Picker.Item label="Jamie" value="Jamie" />
//           <Picker.Item label="Luke" value="Luke" />
//         </Picker>

//         <Picker
//           selectedValue={timezoneFilter}
//           onValueChange={(itemValue) => setTimezoneFilter(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="All Timezones" value="" />
//           <Picker.Item label="PST" value="PST" />
//           <Picker.Item label="GMT" value="GMT" />
//           <Picker.Item label="EST" value="EST" />
//         </Picker>

//         <Picker
//           selectedValue={goalFilter}
//           onValueChange={(itemValue) => setGoalFilter(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="All Goals" value="" />
//           <Picker.Item label="Casual Set" value="Casual Set" />
//           <Picker.Item
//             label="Tournament Practice"
//             value="Tournament Practice"
//           />
//           <Picker.Item label="Matchup Experience" value="Matchup Experience" />
//         </Picker>

//         <Picker
//           selectedValue={rankFilter}
//           onValueChange={(itemValue) => setRankFilter(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="All Ranks" value="" />
//           <Picker.Item label="Master" value="Master" />
//           <Picker.Item label="Platinum" value="Platinum" />
//           <Picker.Item label="Diamond" value="Diamond" />
//           <Picker.Item label="Gold" value="Gold" />
//           <Picker.Item label="Silver" value="Silver" />
//           <Picker.Item label="Iron" value="Iron" />
//         </Picker>

//         <Button title="Apply Filters" onPress={fetchUsers} />
//         <FlatList
//           data={filteredUsers} // Use filteredUsers here
//           renderItem={renderUserItem}
//           keyExtractor={(item) => item.username}
//         />
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   userItem: {
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 16,
//     borderRadius: 8,
//   },
//   username: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
//   messageButton: {
//     marginTop: 8,
//     backgroundColor: "#0782F9",
//     padding: 8,
//     borderRadius: 8,
//     alignSelf: "flex-start",
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   picker: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     marginBottom: 8,
//     color: "white",
//   },
//   pickerItem: {
//     color: "white", // Set text color for Picker.Item
//   },

//   searchInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     marginBottom: 8,
//     paddingHorizontal: 8,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//   },
// });

// export default DetailsScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import bgImage from "../../assets/SearchBackground.png";

const YourComponent = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedRank, setSelectedRank] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const characters = [
    { name: "Ryu", imageSource: require("../../assets/ryu.png") },
    { name: "Ken", imageSource: require("../../assets/luke.png") },
    { name: "Juri", imageSource: require("../../assets/juri.png") },
    { name: "Guile", imageSource: require("../../assets/guile.png") },
    { name: "Chun li", imageSource: require("../../assets/chun.png") },
  ];

  const navigation = useNavigation();

  useEffect(() => {
    if (selectedCharacter) {
      const usersRef = collection(db, "users");

      let characterQuery = query(
        usersRef,
        where("name", "==", selectedCharacter.name)
      );

      if (selectedTimezone) {
        characterQuery = query(
          characterQuery,
          where("timezone", "==", selectedTimezone)
        );
      }

      if (selectedRank) {
        characterQuery = query(
          characterQuery,
          where("rank", "==", selectedRank)
        );
      }

      if (selectedGoal) {
        characterQuery = query(
          characterQuery,
          where("goal", "==", selectedGoal)
        );
      }

      getDocs(characterQuery)
        .then((querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            users.push({ ...userData, id: doc.id });
          });
          setFilteredUsers(users);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [selectedCharacter, selectedTimezone, selectedRank, selectedGoal]);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const navigateToUserProfile = (user) => {
    navigation.navigate("Results", { user });
  };

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require("../../assets/news.png")} style={styles.image} />

        <Picker
          selectedValue={selectedTimezone}
          onValueChange={(itemValue) => setSelectedTimezone(itemValue)}
          style={[styles.picker, styles.bluePicker]}
        >
          <Picker.Item label="All Timezones" value="" />
          <Picker.Item label="PST" value="PST" />
          <Picker.Item label="GMT" value="GMT" />
          <Picker.Item label="EST" value="EST" />
        </Picker>
        <Picker
          selectedValue={selectedRank}
          onValueChange={(itemValue) => setSelectedRank(itemValue)}
          style={[styles.picker, styles.bluePicker]}
        >
          <Picker.Item label="All Ranks" value="" />
          <Picker.Item label="Master" value="Master" />
          <Picker.Item label="Platinum" value="Platinum" />
          <Picker.Item label="Diamond" value="Diamond" />
          <Picker.Item label="Gold" value="Gold" />
          <Picker.Item label="Silver" value="Silver" />
          <Picker.Item label="Iron" value="Iron" />
        </Picker>
        <Picker
          selectedValue={selectedGoal}
          onValueChange={(itemValue) => setSelectedGoal(itemValue)}
          style={[styles.picker, styles.bluePicker]}
        >
          <Picker.Item label="All Goals" value="" />
          <Picker.Item label="Casual Set" value="Casual Set" />
          <Picker.Item
            label="Tournament Practice"
            value="Tournament Practice"
          />
          <Picker.Item label="Matchup Experience" value="Matchup Experience" />
        </Picker>

        <FlatList
          horizontal
          data={characters}
          keyExtractor={(character) => character.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.characterOption,
                selectedCharacter === item ? styles.selectedOption : null,
              ]}
              onPress={() => handleCharacterSelect(item)}
            >
              <Image source={item.imageSource} style={styles.characterImage} />
              <Text style={styles.characterName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <Text>
          Selected Character: {selectedCharacter ? selectedCharacter.name : ""}
        </Text>
        <FlatList
          data={filteredUsers}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.userText}>Name: {item.name}</Text>
              <Text style={styles.userText}>CFN Name: {item.cfnName}</Text>
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => navigateToUserProfile(item)}
              >
                <Text style={styles.viewProfileButtonText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  characterOption: {
    alignItems: "center",
    marginRight: 10,
  },
  selectedOption: {
    borderColor: "blue",
    borderWidth: 2,
  },
  characterImage: {
    width: 100,
    height: 100,
  },
  characterName: {
    marginTop: 5,
  },
  userItem: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "white",
  },
  userText: {
    color: "white",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    width: 200,
    color: "white",
  },
  bluePicker: {
    backgroundColor: "purple",
    color: "white",
    borderRadius: 12,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 10,
  },

  viewProfileButton: {
    backgroundColor: "purple",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  viewProfileButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1, // Take up the full screen height
    resizeMode: "cover", // Cover the entire view
  },
});

export default YourComponent;
