import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import bgImage from "../../assets/SearchBackground.png";

const UserListScreen = () => {
  const navigation = useNavigation();
  const [usersWithLastMessages, setUsersWithLastMessages] = useState([]);

  useEffect(() => {
    const fetchUsersWithLastMessages = async () => {
      try {
        // Create a query to get the users that the current user has messaged
        const messagesQuery = query(
          collection(db, "Newmessages"),
          orderBy("timestamp", "desc"),
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
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Choose a User to Message</Text>
        {usersWithLastMessages.map((user, index) => (
          <TouchableOpacity key={index} onPress={() => handleUserPress(user)}>
            <View style={styles.userText}>
              <Avatar
                source={{ uri: user.photoUrl }}
                style={styles.userProfileImage}
                rounded
                onError={(error) => console.error("Image load error:", error)}
              />

              <Text style={styles.userName}>{user.cfnName}</Text>

              <Text style={styles.lastMessage}>{user.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  userName: {
    fontSize: 18,
    color: "white",
  },
  lastMessage: {
    fontSize: 14,
    color: "#555",
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Assuming the profile picture is circular
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  userText: {
    color: "white",
    borderRadius: 8,
    marginBottom: 10,
    padding: 8,
    borderWidth: 3,
    borderColor: "purple",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#000000",
  },
});

export default UserListScreen;

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   getDoc,
//   orderBy,
// } from "firebase/firestore";
// import { db, auth } from "../../firebase";
// import { useNavigation } from "@react-navigation/native";
// import { Avatar } from "react-native-elements";

// const ChatHistoryScreen = ({ navigation }) => {
//   const [chatHistory, setChatHistory] = useState([]);

//   const navigateToChat = (user) => {
//     navigation.navigate("Messages", { user });
//   };

//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       try {
//         // Create a query to fetch the chat history from the "Newmessages" collection
//         const messagesQuery = query(
//           collection(db, "Newmessages"),
//           orderBy("timestamp", "desc"),
//           where("senderUid", "==", auth.currentUser.uid)
//         );

//         const querySnapshot = await getDocs(messagesQuery);

//         const chatHistoryData = querySnapshot.docs.map((doc) => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             recipientUid: data.recipientUid,
//             content: data.content,
//             timestamp: data.timestamp,
//           };
//         });

//         // Fetch sender's and recipient's profile picture URLs from the "users" collection
//         const promises = chatHistoryData.map(async (message) => {
//           const senderDoc = await getDoc(
//             doc(db, "users", auth.currentUser.uid)
//           );
//           const recipientDoc = await getDoc(
//             doc(db, "users", message.recipientUid)
//           );

//           return {
//             ...message,
//             senderPhotoUrl: senderDoc.data().photoUrl,
//             recipientPhotoUrl: recipientDoc.data().photoUrl,
//           };
//         });

//         const chatHistoryWithProfileUrls = await Promise.all(promises);

//         setChatHistory(chatHistoryWithProfileUrls);
//       } catch (error) {
//         console.error("Error fetching chat history:", error);
//       }
//     };

//     fetchChatHistory();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={chatHistory}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => navigateToChat(item)}>
//             <View style={styles.messageContainer}>
//               <Avatar
//                 source={{ uri: item.recipientPhotoUrl }}
//                 style={styles.userProfileImage}
//                 onError={(error) => console.error("Image load error:", error)}
//               />
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
//     padding: 20,
//   },
//   messageContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   userProfileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25, // Assuming the profile picture is circular
//   },
//   messageText: {
//     flex: 1,
//     marginLeft: 10,
//   },
// });

// export default ChatHistoryScreen;
