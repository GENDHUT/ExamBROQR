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
import * as ScreenCapture from "expo-screen-capture"; // 🛡️ ANTI SCREENSHOT

const WebViewScreen: React.FC = () => {
  const { url } = useLocalSearchParams<{ url: string }>();

  const [verticalModalVisible, setVerticalModalVisible] = useState(false);
  const [horizontalAlertVisible, setHorizontalAlertVisible] = useState(false);
  const [blocked, setBlocked] = useState(false); // 🛡️ DETEKSI SS / RECORD

  // ======================================================
  // 🛡️ ANTI SCREENSHOT & RECORDING (ANDROID + iOS)
  // ======================================================
  useEffect(() => {
    // Android: blok screenshot
    ScreenCapture.preventScreenCaptureAsync();

    // Listener screenshot
    const screenshotSub = ScreenCapture.addScreenshotListener(() => {
      setBlocked(true); // layar hitam
      setTimeout(() => setBlocked(false), 2000);
    });

    // Listener recording
    const recordingSub = ScreenCapture.addScreenRecordingListener((isRecording) => {
      setBlocked(isRecording);
    });

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
      screenshotSub.remove();
      recordingSub.remove();
    };
  }, []);

  // ======================================================
  // 🔥 LOCK PORTRAIT
  // ======================================================
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  // ======================================================
  // 🔥 VERTICAL WARNING
  // ======================================================
  const showVerticalWarning = () => {
    setVerticalModalVisible(true);
    setTimeout(() => setVerticalModalVisible(false), 10);
  };

  // ======================================================
  // 🔥 HORIZONTAL ALERT
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
  // 🔥 SHIELDS CONFIGURATION
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

  const topShield = useRef(verticalShield(() => router.replace("/(tabs)"))).current;
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
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      showVerticalWarning();
      return true;
    });

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

      {/* 🛡️ LAYAR HITAM KETIKA SS/RECORD */}
      {blocked && <View style={styles.blockedOverlay} />}

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

      {/* 🔥 HORIZONTAL ALERT */}
      {horizontalAlertVisible && (
        <Pressable style={styles.alertBox} onPress={dismissHorizontalAlert}>
          <View style={styles.alertContent}></View>
        </Pressable>
      )}

      {/* 🔥 VERTICAL SWIPE MODAL */}
      <Modal visible={verticalModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  // 🛡️ OVERLAY HITAM
  blockedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    zIndex: 999999,
  },

  // Shields
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default WebViewScreen;
