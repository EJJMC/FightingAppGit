import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { db } from "../../firebase";

const DetailsScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get the collection reference for "users"
        const usersRef = db.collection("users");

        // Fetch all documents from the collection
        const snapshot = await usersRef.get();

        // Extract data from the documents and convert to an array
        const usersData = snapshot.docs.map((doc) => doc.data());

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Timezone</Text>
        <Text style={styles.headerCell}>Goal</Text>
        <Text style={styles.headerCell}>Username</Text>
        {/* Add more headers for other fields as needed */}
      </View>
      <FlatList
        data={users}
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
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

export default DetailsScreen;
