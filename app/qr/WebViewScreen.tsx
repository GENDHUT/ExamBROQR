// src/qr/WebViewScreen.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
} from "react-native";
import { WebView } from "react-native-webview";
import {
  StackScreenProps,
  CommonActions,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import { RootStackParamList } from "../(tabs)/index";
import Immersive from "react-native-immersive";

type WebViewScreenProps = StackScreenProps<RootStackParamList, "WebView">;

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
  const { url } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);

  // ======================================
  // 🔥 ULTRA FAST WARNING (EMPTY MODAL)
  // ======================================
  const showWarning = () => {
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 10); // super cepat
  };

  // ======================================================
  // 🔥 TOP & BOTTOM SHIELD (ANTI SWIPE SEBELUM OS BACA)
  // ======================================================
  const topShield = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: () => {
        Immersive.on();
        Immersive.setImmersive(true);
        showWarning();
      },
      onPanResponderRelease: () => {
        Immersive.on();
        Immersive.setImmersive(true);
      },
    })
  ).current;

  const bottomShield = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: () => {
        Immersive.on();
        Immersive.setImmersive(true);
        showWarning();
      },
      onPanResponderRelease: () => {
        Immersive.on();
        Immersive.setImmersive(true);
      },
    })
  ).current;

  // ==========================================
  // HIDE TAB BAR
  // ==========================================
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) parent.setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      if (parent) parent.setOptions({ tabBarStyle: { display: "flex" } });
    };
  }, [navigation]);

  // ================================================
  // IMMERSIVE SUPER LOCK 30ms
  // ================================================
  useEffect(() => {
    let immersiveInterval: NodeJS.Timer;

    if (Platform.OS === "android") {
      Immersive.on();
      Immersive.setImmersive(true);
      StatusBar.setHidden(true);

      immersiveInterval = setInterval(() => {
        Immersive.on();
        Immersive.setImmersive(true);
      }, 30); // 👈 30ms Super Lock
    }

    // Disable back
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        showWarning();
        return true;
      }
    );

    // App State
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && isFocused) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        );
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
  }, [isFocused, navigation]);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" style={styles.loading} />
        )}
        style={{ flex: 1 }}
      />

      {/* 🔥 TOP SHIELD */}
      <View
        style={styles.topShield}
        {...topShield.panHandlers}
      />

      {/* 🔥 BOTTOM SHIELD */}
      <View
        style={styles.bottomShield}
        {...bottomShield.panHandlers}
      />

      {/* 🔥 EMPTY MODAL WARNING */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Very thin shield (anti swipe)
  topShield: {
    position: "absolute",
    top: 0,
    height: 50,  // cukup untuk mencegah gesture OS
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

  // Empty fullscreen modal (canvas kosong)
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default WebViewScreen;
