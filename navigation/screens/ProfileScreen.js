import { useState } from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { WebView } from "react-native-webview";
import Onboarding from "react-native-onboarding-swiper";

const WebBrowserScreen = () => {
  const [showWebView, setShowWebView] = useState(false);

  const handleSkip = () => {
    setShowWebView(true);
  };

  const handleDone = () => {
    setShowWebView(true);
  };

  if (showWebView) {
    const webUrl = "https://ejjmc.github.io/GamePad/";
    return (
      <WebView
        source={{ uri: webUrl }}
        useWebKit={true}
        allowsZoom={false}
        allowFileAccess={false}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/InputBackground.png")} // Replace with your image file
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <Onboarding
          pages={[
            {
              backgroundColor: "transparent", // Set the background color to transparent
              image: (
                <Image
                  source={require("../../assets/sf6logo.png")}
                  style={styles.imageStyle}
                />
              ),

              title: "Motion Input Trainer",
              subtitle:
                "Welcome to the Motion Input Trainer. Here you can learn how to perform/master inputs for multiple characters.",
            },
            {
              backgroundColor: "transparent", // Set the background color to transparent
              image: <Image source={require("../../assets/ps5.png")} />,
              title: "Bluetooth Connection",
              subtitle:
                "Connect your gaming controller via Bluetooth to your mobile device to get started.",
            },
            {
              backgroundColor: "transparent", // Set the background color to transparent
              image: (
                <Image
                  source={require("../../assets/controllerinstructions.png")}
                  style={styles.imageStyle}
                />
              ),
              title: "How To Perform Inputs",
              subtitle:
                "Use the D-pad to perform motions and the face buttons to perform punches and kicks. You can view these controls again on the screen",
            },
          ]}
          onSkip={handleSkip}
          onDone={handleDone}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    width: 400,
    height: 300,
    resizeMode: "contain",
  },
});

export default WebBrowserScreen;
