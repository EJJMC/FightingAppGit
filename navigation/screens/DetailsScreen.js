import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  startAfter,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../../firebase";
import { Picker } from "@react-native-picker/picker";

const DetailsScreen = ({ route }) => {
  const [users, setUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [timezoneFilter, setTimezoneFilter] = useState("");
  const [goalFilter, setGoalFilter] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
  const [cfnNameSearch, setCFNNameSearch] = useState("");
  const [selectedRank, setSelectedRank] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch the user's authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUserEmail(user.email);
        fetchUsers();
      }
    });

    return unsubscribe;
  }, [nameFilter, timezoneFilter, goalFilter, rankFilter]); // Update dependencies

  const fetchUsers = async () => {
    const usersRef = collection(db, "users");
    let querySnapshot = null;

    let baseQuery = query(usersRef);

    if (nameFilter) {
      baseQuery = query(baseQuery, where("name", "==", nameFilter));
    }
    if (timezoneFilter) {
      baseQuery = query(baseQuery, where("timezone", "==", timezoneFilter));
    }
    if (goalFilter) {
      baseQuery = query(baseQuery, where("goal", "==", goalFilter));
    }

    if (rankFilter) {
      baseQuery = query(baseQuery, where("rank", "==", rankFilter)); // Apply rank filter
    }

    // Execute the query
    querySnapshot = await getDocs(baseQuery);

    // Map the query snapshot to user data
    const usersData = querySnapshot.docs.map((doc) => doc.data());

    // Filter out the logged-in user from the list
    const filteredUsers = usersData.filter(
      (user) => user.email !== loggedInUserEmail
    );

    // Set the filtered users to the state
    setUsers(filteredUsers);
  };

  // Filter users by CFN Name
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(cfnNameSearch.toLowerCase())
  );

  const handleUserSelection = (user) => {
    navigation.navigate("Results", { user });
  };

  const renderUserItem = ({ item }) => {
    return (
      <View style={styles.userItem}>
        <Text style={styles.username}>{item.username}</Text>
        <Text>Main Character: {item.name}</Text>
        <Text>Timezone: {item.timezone}</Text>
        <Text>Goal: {item.goal}</Text>
        <Text>Rank: {item.rank}</Text>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => handleUserSelection(item)}
        >
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by CFN Name"
        value={cfnNameSearch}
        onChangeText={(text) => {
          setCFNNameSearch(text);
          console.log(text);
        }}
        style={styles.searchInput}
      />

      <Picker
        selectedValue={nameFilter}
        onValueChange={(itemValue) => setNameFilter(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All Characters" value="" />
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

      <Picker
        selectedValue={timezoneFilter}
        onValueChange={(itemValue) => setTimezoneFilter(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All Timezones" value="" />
        <Picker.Item label="PST" value="PST" />
        <Picker.Item label="GMT" value="GMT" />
        <Picker.Item label="EST" value="EST" />
      </Picker>

      <Picker
        selectedValue={goalFilter}
        onValueChange={(itemValue) => setGoalFilter(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All Goals" value="" />
        <Picker.Item label="Casual Set" value="Casual Set" />
        <Picker.Item label="Tournament Practice" value="Tournament Practice" />
        <Picker.Item label="Matchup Experience" value="Matchup Experience" />
      </Picker>

      <Picker
        selectedValue={rankFilter}
        onValueChange={(itemValue) => setRankFilter(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All Ranks" value="" />
        <Picker.Item label="Master" value="Master" />
        <Picker.Item label="Platinum" value="Platinum" />
        <Picker.Item label="Diamond" value="Diamond" />
        <Picker.Item label="Gold" value="Gold" />
        <Picker.Item label="Silver" value="Silver" />
        <Picker.Item label="Iron" value="Iron" />
      </Picker>

      <Button title="Apply Filters" onPress={fetchUsers} />
      <FlatList
        data={filteredUsers} // Use filteredUsers here
        renderItem={renderUserItem}
        keyExtractor={(item) => item.username}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messageButton: {
    marginTop: 8,
    backgroundColor: "#0782F9",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default DetailsScreen;
