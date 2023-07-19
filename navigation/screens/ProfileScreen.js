import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Picker,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { db, auth } from "../../firebase"; // Import the 'auth' object from firebase.js
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import bgImage from "../../assets/purple.png";

const ProfileScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const usersData = snapshot.docs.map((doc) => doc.data());

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUserEmail(user.email);
      }
    });

    return unsubscribe;
  }, []);

  const handleUserSelection = (user) => {
    navigation.navigate("Results", { user });
  };

  const filterUsers = () => {
    return users.filter((user) => {
      const isNotLoggedInUser = user.email !== loggedInUserEmail;
      const nameMatch = !selectedCharacter || user.name === selectedCharacter;
      const timezoneMatch =
        !selectedTimezone || user.timezone === selectedTimezone;
      const goalMatch = !selectedGoal || user.goal === selectedGoal;
      return nameMatch && timezoneMatch && goalMatch && isNotLoggedInUser;
    });
  };

  const filteredUsers = showResults ? filterUsers() : [];

  const handleReset = () => {
    setSelectedCharacter("");
    setSelectedTimezone("");
    setSelectedGoal("");
    setShowResults(false);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleUserSelection(item)}
        style={styles.row}
      >
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.timezone}</Text>
        <Text style={styles.cell}>{item.goal}</Text>
        <Text style={styles.cell}>{item.username}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={bgImage} style={styles.container}>
      <SafeAreaView style={styles.container}>
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
            <Picker.Item
              label="Matchup Experience"
              value="Matchup Experience"
            />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={() => setShowResults(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Show Results</Text>
        </TouchableOpacity>

        {showResults && (
          <View>
            <TouchableOpacity onPress={handleReset} style={styles.button}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Name</Text>
              <Text style={styles.headerCell}>Timezone</Text>
              <Text style={styles.headerCell}>Goal</Text>
              <Text style={styles.headerCell}>Username</Text>
            </View>
            <FlatList
              data={filteredUsers}
              renderItem={renderItem}
              keyExtractor={(item) => item.email}
            />
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
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
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
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
    color: "white",
  },
});

export default ProfileScreen;
