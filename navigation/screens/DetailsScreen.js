import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebase";
import { Picker } from "@react-native-picker/picker"; // Import the Picker component

const DetailsScreen = () => {
  const [users, setUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [timezoneFilter, setTimezoneFilter] = useState("");
  const [goalFilter, setGoalFilter] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, [nameFilter, timezoneFilter, goalFilter]);

  const fetchUsers = async () => {
    const usersRef = collection(db, "users");
    let querySnapshot = null;

    // Create a base query to fetch all users
    let baseQuery = query(usersRef);

    // Apply filters if they are not empty
    if (nameFilter) {
      baseQuery = query(baseQuery, where("name", "==", nameFilter));
    }
    if (timezoneFilter) {
      baseQuery = query(baseQuery, where("timezone", "==", timezoneFilter));
    }
    if (goalFilter) {
      baseQuery = query(baseQuery, where("goal", "==", goalFilter));
    }

    // Execute the query
    querySnapshot = await getDocs(baseQuery);

    // Map the query snapshot to user data
    const usersData = querySnapshot.docs.map((doc) => doc.data());

    // Set the filtered users to the state
    setUsers(usersData);
  };

  const handleSendMessage = (user) => {
    // Navigate to the MessagesScreen with the selected user's information
    navigation.navigate("Messages", { user });
  };

  const renderUserItem = ({ item }) => {
    return (
      <View style={styles.userItem}>
        <Text style={styles.username}>Username: {item.username}</Text>
        <Text>Name: {item.name}</Text>
        <Text>Timezone: {item.timezone}</Text>
        <Text>Goal: {item.goal}</Text>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => handleSendMessage(item)}
        >
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Use Picker to select from the predefined names */}
      <Picker
        selectedValue={nameFilter}
        onValueChange={(itemValue) => setNameFilter(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All Names" value="" />
        <Picker.Item label="Ryu" value="Ryu" />
        <Picker.Item label="Ken" value="Ken" />
        <Picker.Item label="Juri" value="Juri" />
      </Picker>

      {/* Add the rest of the filters (timezone and goal) */}
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

      <Button title="Apply Filters" onPress={fetchUsers} />
      <FlatList
        data={users}
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
});

export default DetailsScreen;
