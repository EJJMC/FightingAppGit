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
    { name: "Ryu", imageSource: require("../../assets/Fighters/RYU.png") },
    { name: "Ken", imageSource: require("../../assets/Fighters/KEN.png") },
    { name: "Guile", imageSource: require("../../assets/Fighters/GUILE.png") },
    { name: "Chun li", imageSource: require("../../assets/Fighters/CHUN.png") },
    {
      name: "Blanka",
      imageSource: require("../../assets/Fighters/BLANKA.png"),
    },
    {
      name: "Dee Jay",
      imageSource: require("../../assets/Fighters/DEEJAY.png"),
    },
    {
      name: "Dhalsim",
      imageSource: require("../../assets/Fighters/DHALSIM.png"),
    },
    {
      name: "E.Honda",
      imageSource: require("../../assets/Fighters/HONDA.png"),
    },
    {
      name: "Zangief",
      imageSource: require("../../assets/Fighters/ZANGIEF.png"),
    },
    { name: "Cammy", imageSource: require("../../assets/Fighters/CAMMY.png") },
    { name: "Juri", imageSource: require("../../assets/Fighters/JURI.png") },
    {
      name: "Rashid",
      imageSource: require("../../assets/Fighters/RASHID.png"),
    },
    { name: "Luke", imageSource: require("../../assets/Fighters/LUKE.png") },
    { name: "Jamie", imageSource: require("../../assets/Fighters/JAMIE.png") },
    { name: "JP", imageSource: require("../../assets/Fighters/JP.png") },
    {
      name: "Marisa",
      imageSource: require("../../assets/Fighters/MARISA.png"),
    },
    { name: "Manon", imageSource: require("../../assets/Fighters/MANON.png") },
    {
      name: "Kimberly",
      imageSource: require("../../assets/Fighters/KIMBERLY.png"),
    },
    { name: "Lily", imageSource: require("../../assets/Fighters/LILY.png") },
    { name: "A.K.I", imageSource: require("../../assets/Fighters/AKI.png") },
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
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground source={bgImage} style={styles.backgroundImage}>
        <View style={styles.content}>
          <Image source={require("../../assets/timezone.png")} />

          <Image
            source={require("../../assets/Map.png")}
            style={{
              ...styles.image,
              transform: [{ scale: 0.7 }],
            }}
          />

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
          <Image
            source={require("../../assets/SelectRank.png")}
            style={{
              ...styles.image,
              transform: [{ scale: 0.8 }],
            }}
          />
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

          <Image
            source={require("../../assets/SelectGoal.png")}
            style={{
              ...styles.image,
              transform: [{ scale: 0.7 }],
            }}
          />

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
            <Picker.Item
              label="Matchup Experience"
              value="Matchup Experience"
            />
          </Picker>

          <Image
            source={require("../../assets/SelectCharacter.png")}
            style={{
              ...styles.image,
              transform: [{ scale: 0.7 }],
            }}
          />

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
                <Image
                  source={item.imageSource}
                  style={styles.characterImage}
                />
                <Text style={styles.characterName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <Image
            source={require("../../assets/SeachResults.png")}
            style={styles.image}
          />

          <Text style={styles.userText}>
            Selected Character:{" "}
            {selectedCharacter ? selectedCharacter.name : ""}
          </Text>
          <FlatList
            data={filteredUsers}
            keyExtractor={(user) => user.id}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: item.photoUrl }}
                    style={{ ...styles.avatar, width: 80, height: 80 }}
                  />
                </View>
                <View style={styles.characterInfoContainer}>
                  {characters.map((character) => {
                    if (character.name === item.name) {
                      return (
                        <Image
                          key={character.name}
                          source={character.imageSource}
                          style={styles.characterImage}
                        />
                      );
                    }
                  })}
                  <Text style={styles.characterName}>{item.name}</Text>
                </View>
                <View>
                  <Text style={styles.userText}> {item.cfnName}</Text>
                  <Text style={styles.userText}>Rank: {item.rank}</Text>
                  <Text style={styles.userText}>Goal: {item.goal}</Text>
                  <TouchableOpacity
                    style={[
                      styles.viewProfileButton,
                      { width: 100, height: 40 },
                    ]}
                    onPress={() => navigateToUserProfile(item)}
                  >
                    <Text style={styles.viewProfileButtonText}>
                      View Profile
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
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
    scale: 0.7,
  },
  characterName: {
    marginTop: 5,
  },
  userItem: {
    marginTop: 5,
    padding: 5,
    borderWidth: 3,
    borderColor: "purple",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    marginBottom: 5,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: "purple",
  },
  userText: {
    color: "white",
    borderRadius: 82,
    marginBottom: 10,
    padding: 8,
    alignItems: "center",
    backgroundColor: "#9B56BC",
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
    backgroundColor: "#610FB2",
    padding: 4,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  viewProfileButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  image: {},
});

export default YourComponent;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ImageBackground,
// } from "react-native";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../../firebase";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation } from "@react-navigation/native";
// import bgImage from "../../assets/SearchBackground.png";

// const YourComponent = () => {
//   const [selectedCharacter, setSelectedCharacter] = useState(null);
//   const [selectedTimezone, setSelectedTimezone] = useState("");
//   const [selectedRank, setSelectedRank] = useState("");
//   const [selectedGoal, setSelectedGoal] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   const characters = [
//     { name: "Ryu", imageSource: require("../../assets/ryu.png") },
//     { name: "Ken", imageSource: require("../../assets/luke.png") },
//     { name: "Juri", imageSource: require("../../assets/juri.png") },
//     { name: "Guile", imageSource: require("../../assets/guile.png") },
//     { name: "Chun li", imageSource: require("../../assets/chun.png") },
//   ];

//   const navigation = useNavigation();

//   useEffect(() => {
//     if (selectedCharacter) {
//       const usersRef = collection(db, "users");

//       let characterQuery = query(
//         usersRef,
//         where("name", "==", selectedCharacter.name)
//       );

//       if (selectedTimezone) {
//         characterQuery = query(
//           characterQuery,
//           where("timezone", "==", selectedTimezone)
//         );
//       }

//       if (selectedRank) {
//         characterQuery = query(
//           characterQuery,
//           where("rank", "==", selectedRank)
//         );
//       }

//       if (selectedGoal) {
//         characterQuery = query(
//           characterQuery,
//           where("goal", "==", selectedGoal)
//         );
//       }

//       getDocs(characterQuery)
//         .then((querySnapshot) => {
//           const users = [];
//           querySnapshot.forEach((doc) => {
//             const userData = doc.data();
//             users.push({ ...userData, id: doc.id });
//           });
//           setFilteredUsers(users);
//         })
//         .catch((error) => {
//           console.error("Error fetching users:", error);
//         });
//     }
//   }, [selectedCharacter, selectedTimezone, selectedRank, selectedGoal]);

//   const handleCharacterSelect = (character) => {
//     setSelectedCharacter(character);
//   };

//   const navigateToUserProfile = (user) => {
//     navigation.navigate("Results", { user });
//   };

//   return (
//     <ImageBackground source={bgImage} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         <Image source={require("../../assets/timezone.png")} />

//         <Image
//           source={require("../../assets/Map.png")}
//           style={{
//             ...styles.image,
//             transform: [{ scale: 0.7 }],
//           }}
//         />

//         <Picker
//           selectedValue={selectedTimezone}
//           onValueChange={(itemValue) => setSelectedTimezone(itemValue)}
//           style={[styles.picker, styles.bluePicker]}
//         >
//           <Picker.Item label="All Timezones" value="" />
//           <Picker.Item label="PST" value="PST" />
//           <Picker.Item label="GMT" value="GMT" />
//           <Picker.Item label="EST" value="EST" />
//         </Picker>
//         <Image
//           source={require("../../assets/SelectRank.png")}
//           style={{
//             ...styles.image,
//             transform: [{ scale: 0.8 }],
//           }}
//         />
//         <Picker
//           selectedValue={selectedRank}
//           onValueChange={(itemValue) => setSelectedRank(itemValue)}
//           style={[styles.picker, styles.bluePicker]}
//         >
//           <Picker.Item label="All Ranks" value="" />
//           <Picker.Item label="Master" value="Master" />
//           <Picker.Item label="Platinum" value="Platinum" />
//           <Picker.Item label="Diamond" value="Diamond" />
//           <Picker.Item label="Gold" value="Gold" />
//           <Picker.Item label="Silver" value="Silver" />
//           <Picker.Item label="Iron" value="Iron" />
//         </Picker>

//         <Image
//           source={require("../../assets/SelectGoal.png")}
//           style={{
//             ...styles.image,
//             transform: [{ scale: 0.7 }],
//           }}
//         />

//         <Picker
//           selectedValue={selectedGoal}
//           onValueChange={(itemValue) => setSelectedGoal(itemValue)}
//           style={[styles.picker, styles.bluePicker]}
//         >
//           <Picker.Item label="All Goals" value="" />
//           <Picker.Item label="Casual Set" value="Casual Set" />
//           <Picker.Item
//             label="Tournament Practice"
//             value="Tournament Practice"
//           />
//           <Picker.Item
//             label="Matchup Experience"
//             value="Matchup Experience"
//           />
//         </Picker>

//         <Image
//           source={require("../../assets/SelectCharacter.png")}
//           style={{
//             ...styles.image,
//             transform: [{ scale: 0.7 }],
//           }}
//         />

//         <FlatList
//           horizontal
//           data={characters}
//           keyExtractor={(character) => character.name}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[
//                 styles.characterOption,
//                 selectedCharacter === item ? styles.selectedOption : null,
//               ]}
//               onPress={() => handleCharacterSelect(item)}
//             >
//               <Image source={item.imageSource} style={styles.characterImage} />
//               <Text style={styles.characterName}>{item.name}</Text>
//             </TouchableOpacity>
//           )}
//         />

//         <Image
//           source={require("../../assets/SeachResults.png")}
//           style={styles.image}
//         />

//         <Text>
//           Selected Character:{" "}
//           {selectedCharacter ? selectedCharacter.name : ""}
//         </Text>

//         <FlatList
//           data={filteredUsers}
//           keyExtractor={(user) => user.id}
//           renderItem={({ item }) => (
//             <View style={styles.userItem}>
//               <View style={styles.avatarContainer}>
//                 <Image
//                   source={{ uri: item.photoUrl }}
//                   style={{ ...styles.avatar, width: 80, height: 80 }}
//                 />
//               </View>
//               <View style={styles.characterInfoContainer}>
//                 {characters.map((character) => {
//                   if (character.name === item.name) {
//                     return (
//                       <Image
//                         key={character.name}
//                         source={character.imageSource}
//                         style={styles.characterImage}
//                       />
//                     );
//                   }
//                 })}
//                 <Text style={styles.characterName}>{item.name}</Text>
//               </View>
//               <View>
//                 <Text style={styles.userText}> {item.cfnName}</Text>
//                 <Text style={styles.userText}>Rank: {item.rank}</Text>
//                 <Text style={styles.userText}>Goal: {item.goal}</Text>
//                 <TouchableOpacity
//                   style={[
//                     styles.viewProfileButton,
//                     { width: 100, height: 40, borderRadius: 20 },
//                   ]}
//                   onPress={() => navigateToUserProfile(item)}
//                 >
//                   <Text style={styles.viewProfileButtonText}>
//                     View Profile
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         />
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     padding: 20,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//   },
//   image: {
//     width: 150,
//     height: 50,
//     marginBottom: 10,
//   },
//   picker: {
//     width: 200,
//     height: 40,
//     color: "white",
//     marginBottom: 20,
//   },
//   bluePicker: {
//     backgroundColor: "blue",
//     borderRadius: 20,
//   },
//   characterOption: {
//     marginRight: 10,
//     alignItems: "center",
//   },
//   selectedOption: {
//     borderColor: "blue",
//     borderWidth: 2,
//   },
//   characterImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 5,
//   },
//   characterName: {
//     color: "white",
//   },
//   userItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   avatarContainer: {
//     marginRight: 10,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   characterInfoContainer: {
//     marginRight: 10,
//     alignItems: "center",
//   },
//   userText: {
//     color: "white",
//     marginBottom: 5,
//   },
//   viewProfileButton: {
//     backgroundColor: "blue",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 20,
//   },
//   viewProfileButtonText: {
//     color: "white",
//   },
// });

// export default YourComponent;
