// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebase";
// import { useNavigation } from "@react-navigation/native";

// const UserListScreen = () => {
//   const navigation = useNavigation();
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const usersRef = collection(db, "users");
//       const querySnapshot = await getDocs(usersRef);
//       const userList = querySnapshot.docs.map((doc) => doc.data());
//       setUsers(userList);
//     };

//     fetchUsers();
//   }, []);

//   const handleUserPress = (user) => {
//     navigation.navigate("Messages", { user });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Choose a User to Message</Text>
//       <FlatList
//         data={users}
//         keyExtractor={(user) => user.email}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleUserPress(item)}>
//             <Text style={styles.userItem}>{item.cfnName}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   userItem: {
//     fontSize: 18,
//     marginBottom: 10,
//     color: "#0782F9", // Choose your desired text color
//   },
// });

// export default UserListScreen;

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { TouchableOpacity } from "react-native";

const ChatHistoryScreen = ({ navigation }) => {
  const [chatHistory, setChatHistory] = useState([]);

  const navigateToChat = (user) => {
    navigation.navigate("ResultsScreen", { user });
  };

  useEffect(() => {
    // Create a query to fetch the latest message for each user
    const messagesQuery = query(
      collection(db, "Newmessages"),
      orderBy("timestamp", "desc"), // Order messages by timestamp in descending order
      where("senderUid", "==", auth.currentUser.uid) // Sent messages
    );

    const latestMessages = {}; // To store the latest message for each user

    const unsubscribe = onSnapshot(messagesQuery, async (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const recipientUid = doc.data().recipientUid;

        if (!latestMessages[recipientUid]) {
          latestMessages[recipientUid] = {
            id: doc.id,
            content: doc.data().content,
          };
        }
      });

      // Convert the latestMessages object to an array
      const chatHistoryData = await Promise.all(
        Object.keys(latestMessages).map(async (recipientUid) => {
          const displayName = await getDisplayName(recipientUid);
          return {
            recipientUid,
            displayName,
            ...latestMessages[recipientUid],
          };
        })
      );

      setChatHistory(chatHistoryData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Function to get the display name based on the UID
  // Function to get the display name based on the UID
  const getDisplayName = async (uid) => {
    try {
      const userDoc = doc(db, "users", uid); // Replace "users" with your user collection name
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        return userSnap.data().cfnName; // Replace "cfnName" with your display name field
      }
    } catch (error) {
      console.error("Error fetching display name:", error);
    }
    return "Unknown"; // Return a default value if display name is not found
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatHistory}
        keyExtractor={(item) => item.recipientUid} // Use recipientUid as the key
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              To: {item.displayName} {/* Display recipient's display name */}
            </Text>
            <Text style={styles.messageText}>
              Latest Message: {item.content} {/* Display the latest message */}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  messageText: {
    padding: 8,
    borderRadius: 8,
    maxWidth: "70%",
  },
});

export default ChatHistoryScreen;
