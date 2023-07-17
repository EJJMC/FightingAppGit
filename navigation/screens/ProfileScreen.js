import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Picker,
} from "react-native";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const ProfileScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        // Get the collection reference for "users"
        const usersRef = collection(db, "users");

        // Fetch all documents from the collection
        const snapshot = await getDocs(usersRef);

        // Extract data from the documents and convert to an array
        const usersData = snapshot.docs.map((doc) => doc.data());

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsersData();
  }, []);

  // Function to render each row in the table
  const renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.timezone}</Text>
        <Text style={styles.cell}>{item.goal}</Text>
        <Text style={styles.cell}>{item.username}</Text>
        {/* Add more columns for other fields as needed */}
      </View>
    );
  };

  // Function to filter users based on the selected character, timezone, and goal
  const filterUsers = () => {
    return users.filter((user) => {
      const nameMatch = !selectedCharacter || user.name === selectedCharacter;
      const timezoneMatch =
        !selectedTimezone || user.timezone === selectedTimezone;
      const goalMatch = !selectedGoal || user.goal === selectedGoal;
      return nameMatch && timezoneMatch && goalMatch;
    });
  };

  const filteredUsers = filterUsers();

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter dropdowns */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedCharacter}
          onValueChange={(itemValue) => setSelectedCharacter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All Characters" value="" />
          <Picker.Item label="Ryu" value="Ryu" />
          <Picker.Item label="Ken" value="Ken" />
          <Picker.Item label="Juri" value="Juri" />
        </Picker>

        <Picker
          selectedValue={selectedTimezone}
          onValueChange={(itemValue) => setSelectedTimezone(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All Timezones" value="" />
          <Picker.Item label="PST" value="PST" />
          <Picker.Item label="GMT" value="GMT" />
          <Picker.Item label="EST" value="EST" />
        </Picker>

        <Picker
          selectedValue={selectedGoal}
          onValueChange={(itemValue) => setSelectedGoal(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All Goals" value="" />
          <Picker.Item label="Casual Set" value="Casual Set" />
          <Picker.Item
            label="Tournament Practice"
            value="Tournament Practice"
          />
          <Picker.Item label="Matchup Experience" value="Matchup Experience" />
        </Picker>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Timezone</Text>
        <Text style={styles.headerCell}>Goal</Text>
        <Text style={styles.headerCell}>Username</Text>
        {/* Add more headers for other fields as needed */}
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.email} // You can use a unique identifier as the key
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    marginRight: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});

export default ProfileScreen;
