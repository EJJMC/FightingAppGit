import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

const MessagesScreen = ({ route }) => {
  const { user } = route.params;

  if (!user || !user.uid) {
    // Handle the case when the user object or user ID is not available
    return <Text>Loading...</Text>;
  }

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Initialize the messages collection reference
    const messagesRef = collection(db, "Messages");

    // Create a query to filter messages by the current user's UID as either sender or recipient
    const userMessagesQuery = query(
      messagesRef,
      orderBy("timestamp", "asc"),
      where("recipientID", "==", user.uid),
      where("senderID", "==", auth.currentUser.uid)
    );

    // Subscribe to changes in the messages collection based on the query
    const unsubscribe = onSnapshot(userMessagesQuery, (snapshot) => {
      const userMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(userMessages);
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, [user.uid]);

  const handleSendMessage = async () => {
    if (message.trim() === "") {
      return;
    }

    // Clear the input text box
    setMessage("");

    // Get the UID of the currently authenticated user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("User is not logged in.");
      return;
    }
    const senderId = currentUser.uid;

    // Send the message to the recipient using Firebase Firestore
    try {
      await addDoc(collection(db, "Messages"), {
        recipientID: user.uid, // 'user' here represents the receiver user object from route.params
        senderID: senderId, // Set the senderID to the current user's UID
        text: message,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.senderID === auth.currentUser.uid
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Text
              style={
                msg.senderID === auth.currentUser.uid
                  ? styles.myMessageText
                  : styles.otherMessageText
              }
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type your message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ...rest of the component remains the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  message: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  myMessage: {
    backgroundColor: "#0782F9",
    alignSelf: "flex-end",
    marginLeft: 50,
    marginRight: 10,
  },
  otherMessage: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
    marginRight: 50,
    marginLeft: 10,
  },
  myMessageText: {
    color: "white", // Set the text color for the user's messages
  },
  otherMessageText: {
    color: "black", // Set the text color for the sender's messages
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  sendButton: {
    backgroundColor: "#0782F9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "700",
  },
});

export default MessagesScreen;
