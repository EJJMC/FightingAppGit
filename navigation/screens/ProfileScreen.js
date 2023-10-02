import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
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
    <Onboarding
      pages={[
        {
          backgroundColor: "#fff",
          image: <Image source={require("../../assets/ps5.jpeg")} />,
          title: "Input Trainer",
          subtitle:
            "Connect your gaming controller via bluetooth to your mobile device ",
        },
        {
          backgroundColor: "#B7410E",
          image: <Image source={require("../../assets/39168-200.png")} />,
          title: "Phone Orientation",
          subtitle: "Rotate your phone 180 sideways ",
        },
      ]}
      onSkip={handleSkip}
      onDone={handleDone}
    />
  );
};

export default WebBrowserScreen;
