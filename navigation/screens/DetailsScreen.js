import React from "react";
import { View, Text } from "react-native";
import { Card } from "react-native-paper";

const DetailsScreen = () => {
  return (
    <Card>
      <Card.Title title="DetailsScreen" />
      <Card.Content>
        <Text>Card content goes here</Text>
      </Card.Content>
    </Card>
  );
};

export default DetailsScreen;
