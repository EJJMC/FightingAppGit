import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

const UserListScreen = () => {
  const navigation = useNavigation();
  const [usersWithLastMessages, setUsersWithLastMessages] = useState([]);

  useEffect(() => {
    const fetchUsersWithLastMessages = async () => {
      try {
        // Create a query to get the users that the current user has messaged
        const messagesQuery = query(
          collection(db, "Newmessages"),
          where("senderUid", "==", auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(messagesQuery);

        // Extract recipient UIDs from the messages
        const recipientUids = querySnapshot.docs.map(
          (doc) => doc.data().recipientUid
        );

        // Fetch user data for the recipient UIDs
        const usersRef = collection(db, "users");
        const userQuerySnapshot = await getDocs(
          query(usersRef, where("uid", "in", recipientUids))
        );

        // Extract user data
        const userList = userQuerySnapshot.docs.map((doc) => doc.data());

        // Create a map to store the last message sent by each user
        const lastMessagesMap = {};

        querySnapshot.docs.forEach((doc) => {
          const recipientUid = doc.data().recipientUid;
          const messageContent = doc.data().content;

          // Check if this message is more recent than the previously stored message
          if (
            !lastMessagesMap[recipientUid] ||
            doc.data().timestamp > lastMessagesMap[recipientUid].timestamp
          ) {
            lastMessagesMap[recipientUid] = {
              content: messageContent,
              timestamp: doc.data().timestamp,
            };
          }
        });

        // Combine user data with the last message for each user
        const usersWithMessages = userList.map((user) => {
          return {
            ...user,
            lastMessage: lastMessagesMap[user.uid]
              ? lastMessagesMap[user.uid].content
              : "No messages",
          };
        });

        setUsersWithLastMessages(usersWithMessages);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsersWithLastMessages();
  }, []);

  const handleUserPress = (user) => {
    navigation.navigate("Messages", { user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a User to Message</Text>
      <FlatList
        data={usersWithLastMessages}
        keyExtractor={(user) => user.uid}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item)}>
            <View style={styles.userContainer}>
              <Text style={styles.userName}>{item.cfnName}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>
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
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    color: "#0782F9",
  },
  lastMessage: {
    fontSize: 14,
    color: "#555",
  },
});

export default UserListScreen;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { db, auth } from "../../firebase";

// const ChatHistoryScreen = ({ navigation }) => {
//   const [chatHistory, setChatHistory] = useState([]);

//   const navigateToChat = (user) => {
//     navigation.navigate("Messages", { user });
//   };

//   useEffect(() => {
//     // Create a query to fetch the latest message for each user
//     const messagesQuery = query(
//       collection(db, "Newmessages"),
//       orderBy("timestamp", "desc"), // Order messages by timestamp in descending order
//       where("senderUid", "==", auth.currentUser.uid) // Sent messages
//     );

//     const latestMessages = {}; // To store the latest message for each user

//     const unsubscribe = onSnapshot(messagesQuery, async (querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         const recipientUid = doc.data().recipientUid;

//         if (!latestMessages[recipientUid]) {
//           latestMessages[recipientUid] = {
//             id: doc.id,
//             content: doc.data().content,
//           };
//         }
//       });

//       // Convert the latestMessages object to an array
//       const chatHistoryData = await Promise.all(
//         Object.keys(latestMessages).map(async (recipientUid) => {
//           const displayName = await getDisplayName(recipientUid);
//           return {
//             recipientUid,
//             displayName,
//             ...latestMessages[recipientUid],
//           };
//         })
//       );

//       setChatHistory(chatHistoryData);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   // Function to get the display name based on the UID
//   const getDisplayName = async (uid) => {
//     try {
//       const userDoc = doc(db, "users", uid);
//       const userSnap = await getDoc(userDoc);
//       if (userSnap.exists()) {
//         return userSnap.data().cfnName;
//       }
//     } catch (error) {
//       console.error("Error fetching display name:", error);
//     }
//     return "Unknown";
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={chatHistory}
//         keyExtractor={(item) => item.recipientUid}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => navigateToChat(item)}>
//             <View style={styles.messageContainer}>
//               <Text style={styles.messageText}>To: {item.displayName}</Text>
//               <Text style={styles.messageText}>
//                 Latest Message: {item.content}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   messageContainer: {
//     marginVertical: 4,
//   },
//   messageText: {
//     padding: 8,
//     borderRadius: 8,
//     maxWidth: "70%",
//   },
// });

// export default ChatHistoryScreen;
