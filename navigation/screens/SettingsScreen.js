import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

const UserListScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const userList = querySnapshot.docs.map((doc) => doc.data());
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleUserPress = (user) => {
    navigation.navigate("Messages", { user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a User to Message</Text>
      <FlatList
        data={users}
        keyExtractor={(user) => user.email}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item)}>
            <Text style={styles.userItem}>{item.cfnName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userItem: {
    fontSize: 18,
    marginBottom: 10,
    color: "#0782F9", // Choose your desired text color
  },
});

export default UserListScreen;
