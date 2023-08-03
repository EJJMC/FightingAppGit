import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const [uniqueSenderIDs, setUniqueSenderIDs] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Ensure the user is logged in before fetching messages
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("User is not logged in.");
      return;
    }

    // Initialize the messages collection reference
    const messagesRef = collection(db, "Messages");

    // Create a query to filter messages where the current user's UID is the recipientID
    const receivedMessagesQuery = query(
      messagesRef,
      where("recipientID", "==", currentUser.uid),
      orderBy("timestamp", "asc")
    );

    // Subscribe to changes in the messages collection based on the query
    const unsubscribe = onSnapshot(receivedMessagesQuery, (snapshot) => {
      const receivedMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(receivedMessages);
      setUniqueSenderIDs([
        ...new Set(receivedMessages.map((msg) => msg.senderID)),
      ]);
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  const handleOpenConversation = (senderID, senderUsername) => {
    const sender = { uid: senderID, username: senderUsername };
    navigation.navigate("Messages", { user: sender });
  };

  const getLatestMessageFromSender = (senderID) => {
    return messages.find((msg) => msg.senderID === senderID);
  };

  const renderMessageItem = ({ item: senderID }) => {
    const latestMessage = getLatestMessageFromSender(senderID);
    return (
      <TouchableOpacity
        onPress={() =>
          handleOpenConversation(senderID, latestMessage.senderUsername)
        }
      >
        <View style={styles.messageContainer}>
          <Text style={styles.sender}>
            From: {latestMessage.senderUsername}
          </Text>
          <Text style={styles.text}>{latestMessage.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={uniqueSenderIDs}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => item + index}
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  sender: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    marginTop: 8,
  },
});

export default SettingsScreen;
