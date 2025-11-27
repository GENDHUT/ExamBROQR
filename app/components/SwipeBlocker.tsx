// src/components/SwipeBlocker.tsx
import React, { useEffect } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Immersive from "react-native-immersive";

interface Props {
  onSwipe: () => void;
  style?: any;
}

const SwipeBlocker: React.FC<Props> = ({ onSwipe, style }) => {
  const handleGesture = (event: any) => {
    const translationY = event.nativeEvent.translationY;
    if (translationY > 20 || translationY < -20) {
      onSwipe();
    }
  };

  useEffect(() => {
    let immersiveInterval: NodeJS.Timer;
    if (Platform.OS === "android") {
      Immersive.on();
      StatusBar.setHidden(true);
      immersiveInterval = setInterval(() => Immersive.on(), 500);
    }

    return () => {
      if (Platform.OS === "android") {
        Immersive.off();
        StatusBar.setHidden(false);
      }
      clearInterval(immersiveInterval);
    };
  }, []);

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <View style={[styles.blocker, style]} />
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  blocker: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});

export default SwipeBlocker;
