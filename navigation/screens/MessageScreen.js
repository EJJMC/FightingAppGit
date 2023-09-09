import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

const MessageScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const [message, setMessage] = useState(""); // State to hold the message text
  const [messages, setMessages] = useState([]); // State to hold the list of messages

  // Function to send a message
  const sendMessage = async () => {
    const senderUid = auth.currentUser.uid;

    try {
      // Add a new message document to the Firestore collection
      await addDoc(collection(db, "Newmessages"), {
        senderUid,
        recipientUid: user.uid,
        content: message,
        timestamp: serverTimestamp(),
      });

      console.log("Message sent successfully!");
      setMessage(""); // Clear the message input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Function to listen for new messages and update the state
  useEffect(() => {
    // Create a query to fetch messages for both sender and recipient
    const messagesQuery = query(
      collection(db, "Newmessages"),
      orderBy("timestamp"),
      where("senderUid", "in", [auth.currentUser.uid, user.uid]),
      where("recipientUid", "in", [auth.currentUser.uid, user.uid])
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const newMessages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newMessages.push({
          id: doc.id,
          senderUid: data.senderUid,
          recipientUid: data.recipientUid,
          content: data.content,
          timestamp: data.timestamp,
        });
      });
      setMessages(newMessages);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []); // Run this effect once on component mount

  return (
    <View style={styles.container}>
      {/* Chat messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              {
                alignSelf:
                  item.senderUid === auth.currentUser.uid
                    ? "flex-end"
                    : "flex-start",
              },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                {
                  backgroundColor:
                    item.senderUid === auth.currentUser.uid
                      ? "#0782F9" // Your sent message background color
                      : "#ccc", // Recipient's message background color
                  color:
                    item.senderUid === auth.currentUser.uid ? "white" : "black",
                },
              ]}
            >
              {item.content}
            </Text>
          </View>
        )}
      />

      {/* Message input */}
      <TextInput
        placeholder="Type your message..."
        value={message}
        onChangeText={(text) => setMessage(text)}
        style={styles.messageInput}
      />

      {/* Send button */}
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ...other styles...

  messageContainer: {
    marginVertical: 4,
  },
  messageText: {
    padding: 8,
    borderRadius: 8,
    maxWidth: "70%",
  },
});

export default MessageScreen;
