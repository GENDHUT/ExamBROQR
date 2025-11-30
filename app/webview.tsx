import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  AppState,
  StatusBar,
  BackHandler,
  Modal,
  PanResponder,
  Pressable,
} from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import Immersive from "react-native-immersive";
import * as ScreenOrientation from "expo-screen-orientation";

const WebViewScreen: React.FC = () => {
  const { url } = useLocalSearchParams<{ url: string }>();

  const [verticalModalVisible, setVerticalModalVisible] = useState(false);
  const [horizontalAlertVisible, setHorizontalAlertVisible] = useState(false);

  // ======================================================
  // 🔥 LOCK ORIENTATION ALWAYS PORTRAIT (ANTI MANTUL)
  // ======================================================
  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  }, []);

  // ======================================================
  // 🔥 VERTICAL MODAL SWIPE WARNING (TOP & BOTTOM)
  // ======================================================
  const showVerticalWarning = () => {
    setVerticalModalVisible(true);
    setTimeout(() => setVerticalModalVisible(false), 10);
  };

  // ======================================================
  // 🔥 HORIZONTAL ALERT (LEFT & RIGHT)
  // ======================================================
  const showHorizontalAlert = () => {
    setHorizontalAlertVisible(true);

    const timer = setTimeout(() => {
      setHorizontalAlertVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  };

  const dismissHorizontalAlert = () => {
    setHorizontalAlertVisible(false);
  };

  // ======================================================
  // 🔥 SHIELDS CONFIG
  // ======================================================
  const verticalShield = (onRelease?: () => void) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: () => {
        Immersive.on();
        Immersive.setImmersive(true);
        showVerticalWarning();
      },
      onPanResponderRelease: () => {
        Immersive.on();
        Immersive.setImmersive(true);
        if (onRelease) onRelease();
      },
    });

  const horizontalShield = () =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: () => {
        Immersive.on();
        Immersive.setImmersive(true);
        showHorizontalAlert();
      },
    });

  const topShield = useRef(
    verticalShield(() => router.replace("/(tabs)"))
  ).current;
  const bottomShield = useRef(verticalShield()).current;
  const leftShield = useRef(horizontalShield()).current;
  const rightShield = useRef(horizontalShield()).current;

  // ======================================================
  // 🔥 IMMERSIVE MODE SUPER LOCK
  // ======================================================
  useEffect(() => {
    let immersiveInterval: NodeJS.Timeout;

    if (Platform.OS === "android") {
      Immersive.on();
      Immersive.setImmersive(true);
      StatusBar.setHidden(true);

      immersiveInterval = setInterval(() => {
        Immersive.on();
        Immersive.setImmersive(true);
      }, 30);
    }

    // Disable Back Button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        showVerticalWarning();
        return true;
      }
    );

    // Reset to home if minimized
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        router.replace("/(tabs)");
      }
    });

    return () => {
      if (Platform.OS === "android") {
        Immersive.off();
        StatusBar.setHidden(false);
      }
      clearInterval(immersiveInterval);
      backHandler.remove();
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url || "https://example.com" }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" style={styles.loading} />
        )}
        style={{ flex: 1 }}
      />

      {/* 🔥 TOP SHIELD */}
      <View style={styles.topShield} {...topShield.panHandlers} />

      {/* 🔥 BOTTOM SHIELD */}
      <View style={styles.bottomShield} {...bottomShield.panHandlers} />

      {/* 🔥 LEFT SHIELD */}
      <View style={styles.leftShield} {...leftShield.panHandlers} />

      {/* 🔥 RIGHT SHIELD */}
      <View style={styles.rightShield} {...rightShield.panHandlers} />

      {/* 🔥 HORIZONTAL ALERT (CENTER MESSAGE) */}
      {horizontalAlertVisible && (
        <Pressable
          style={styles.alertBox}
          onPress={dismissHorizontalAlert}
        >
          <View style={styles.alertContent}>
          </View>
        </Pressable>
      )}

      {/* 🔥 VERTICAL EMPTY MODAL FOR TOP/BOTTOM SWIPE */}
      <Modal visible={verticalModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Anti-swipe thin shields
  topShield: {
    position: "absolute",
    top: 0,
    height: 50,
    width: "100%",
    zIndex: 9999,
  },
  bottomShield: {
    position: "absolute",
    bottom: 0,
    height: 60,
    width: "100%",
    zIndex: 9999,
  },
  leftShield: {
    position: "absolute",
    left: 0,
    width: 35,
    height: "100%",
    zIndex: 9999,
  },
  rightShield: {
    position: "absolute",
    right: 0,
    width: 35,
    height: "100%",
    zIndex: 9999,
  },

  // Horizontal alert box in center
  alertBox: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    width: 300,
    paddingVertical: 20,
    backgroundColor: "transparent",
    borderRadius: 12,
    zIndex: 99999,
    justifyContent: "center",
    alignItems: "center",
  },

  alertContent: {
    paddingHorizontal: 10,
  },

  // Modal overlay for vertical swipe
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default WebViewScreen;
