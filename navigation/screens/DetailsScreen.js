// DetailsScreen.js

import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebase"; // Update the path accordingly

const DetailsScreen = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    if (image) {
      try {
        const response = await fetch(image);
        const blob = await response.blob();

        // Generate a unique filename for the image
        const imageName = new Date().toISOString();

        // Create a reference to the Firebase Storage location where you want to store the image
        const storageRef = storage.ref().child("images/" + imageName);

        // Upload the image to Firebase Storage
        await storageRef.put(blob);

        // Get the download URL of the uploaded image
        const downloadURL = await storageRef.getDownloadURL();

        console.log("Image uploaded successfully. Download URL:", downloadURL);
        // You can now save the downloadURL to your database or use it as needed.
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.log("No image selected.");
    }
  };

  return (
    <View>
      <Text>DetailsScreen</Text>
      <Button title="Pick an image" onPress={pickImage} />
      <Button title="Upload image" onPress={uploadImage} />
    </View>
  );
};

export default DetailsScreen;
