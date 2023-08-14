// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebase";
// import { useNavigation } from "@react-navigation/native";

// const UserListScreen = () => {
//   const navigation = useNavigation();
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const usersRef = collection(db, "users");
//       const querySnapshot = await getDocs(usersRef);
//       const userList = querySnapshot.docs.map((doc) => doc.data());
//       setUsers(userList);
//     };

//     fetchUsers();
//   }, []);

//   const handleUserPress = (user) => {
//     navigation.navigate("Messages", { user });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Choose a User to Message</Text>
//       <FlatList
//         data={users}
//         keyExtractor={(user) => user.email}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleUserPress(item)}>
//             <Text style={styles.userItem}>{item.cfnName}</Text>
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
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   userItem: {
//     fontSize: 18,
//     marginBottom: 10,
//     color: "#0782F9", // Choose your desired text color
//   },
// });

// export default UserListScreen;

import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

const GamepadInputScreen = () => {
  const [buttonPresses, setButtonPresses] = useState([]);
  const [joystickX, setJoystickX] = useState(0);
  const [joystickY, setJoystickY] = useState(0);
  const [specialMove, setSpecialMove] = useState("");
  const [sequenceStep, setSequenceStep] = useState(0);
  const [sequenceError, setSequenceError] = useState(false);
  const [correctInputsCount, setCorrectInputsCount] = useState(0);
  const [wrongInputsCount, setWrongInputsCount] = useState(0);
  const [totalTries, setTotalTries] = useState(0);

  useEffect(() => {
    const handleGamepadInput = () => {
      const gamepads = navigator.getGamepads();
      for (const gamepad of gamepads) {
        if (gamepad) {
          // Handle button presses
          const pressedButtons = [];
          for (let i = 0; i < gamepad.buttons.length; i++) {
            if (gamepad.buttons[i].pressed) {
              pressedButtons.push(i);
            }
          }
          setButtonPresses(pressedButtons);

          // Handle special move sequence
          if (sequenceError) {
            setSequenceError(false);
            setWrongInputsCount(wrongInputsCount + 1);
          }

          if (sequenceStep === 0 && gamepad.buttons[13].pressed) {
            setSequenceStep(1);
          } else if (sequenceStep === 1 && gamepad.buttons[15].pressed) {
            setSequenceStep(2);
          } else if (sequenceStep === 2 && gamepad.buttons[2].pressed) {
            setSpecialMove("Hadouken");
            setSequenceStep(0);
            setCorrectInputsCount(correctInputsCount + 1);
          } else {
            if (
              gamepad.buttons[13].pressed ||
              gamepad.buttons[15].pressed ||
              gamepad.buttons[2].pressed
            ) {
              setSequenceError(true);
            }
            setSequenceStep(0);
            setSpecialMove("");
          }

          // Handle joystick input
          const adjustedJoystickX = gamepad.axes[0];
          const adjustedJoystickY = gamepad.axes[1];

          setJoystickX(adjustedJoystickX);
          setJoystickY(adjustedJoystickY);
        }
      }
    };

    // Check gamepad input periodically
    const interval = setInterval(handleGamepadInput, 100);

    // Clean up the interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, [sequenceStep, sequenceError, correctInputsCount, wrongInputsCount]);

  const handleRetry = () => {
    setCorrectInputsCount(0);
    setWrongInputsCount(0);
    setTotalTries(totalTries + 1);
  };

  return (
    <View>
      <Text>Gamepad Input Handling</Text>
      <Text>Pressed Buttons: {buttonPresses.join(", ")}</Text>
      <Text>Joystick X: {joystickX.toFixed(2)}</Text>
      <Text>Joystick Y: {joystickY}</Text>
      {sequenceError && (
        <Text style={{ color: "red" }}>Incorrect Sequence</Text>
      )}
      {specialMove && <Text>Special Move: {specialMove}</Text>}
      <Text>Correct Inputs Count: {correctInputsCount}</Text>
      <Text>Wrong Inputs Count: {wrongInputsCount}</Text>
      <Text>Total Tries: {totalTries}</Text>
      <Button title="Retry" onPress={handleRetry} />
    </View>
  );
};

export default GamepadInputScreen;
