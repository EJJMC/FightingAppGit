import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook
import bgImage from "../../assets/SearchBackground.png";

const MessageScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation(); // Initialize the navigation hook

  const [message, setMessage] = useState(""); // State to hold the message text
  const [messages, setMessages] = useState([]); // State to hold the list of messages
  const [messagedUser, setMessagedUser] = useState(null); // State to hold messaged user data

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

  // Function to navigate to the user's profile
  const navigateToUserProfile = () => {
    // Check if messagedUser exists before navigating
    if (messagedUser) {
      navigation.navigate("Results", { user: messagedUser });
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

    // Fetch messaged user data
    const fetchMessagedUserData = async () => {
      try {
        // Fetch user data for the messaged user
        const messagedUserDoc = await getDoc(doc(db, "users", user.uid));
        if (messagedUserDoc.exists()) {
          setMessagedUser(messagedUserDoc.data());
        } else {
          console.error("Messaged user not found.");
        }
      } catch (error) {
        console.error("Error fetching messaged user data:", error);
      }
    };

    fetchMessagedUserData();

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {/* Wrap the profile image with a TouchableOpacity */}
          <TouchableOpacity onPress={navigateToUserProfile}>
            {/* Display the profile image of the messaged user if it exists */}
            {messagedUser && messagedUser.photoUrl && (
              <Image
                source={{ uri: messagedUser.photoUrl }}
                style={styles.profileImage}
              />
            )}
          </TouchableOpacity>
        </View>

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
              {item.senderUid !== auth.currentUser.uid &&
                // Check if messagedUser exists and has a photoUrl before rendering
                messagedUser &&
                messagedUser.photoUrl && (
                  <Image
                    source={{ uri: messagedUser.photoUrl }}
                    style={styles.senderImage}
                  />
                )}
              <Text
                style={[
                  styles.messageText,
                  {
                    backgroundColor:
                      item.senderUid === auth.currentUser.uid
                        ? "#610FB2" // Your sent message background color
                        : "#ccc", // Recipient's message background color
                    color:
                      item.senderUid === auth.currentUser.uid
                        ? "white"
                        : "black",
                  },
                ]}
              >
                {item.content}
              </Text>
            </View>
          )}
        />

        <TextInput
          placeholder="Type your message..."
          placeholderTextColor="white" // Set the placeholder text color to white
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={styles.messageInput}
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  senderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageText: {
    padding: 8,
    borderRadius: 80,
    maxWidth: "80%",
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 80,
    padding: 8,
    marginBottom: 8,
    color: "white",
  },
  sendButton: {
    backgroundColor: "#610FB2",
    padding: 12,
    borderRadius: 80,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
});

export default MessageScreen;
