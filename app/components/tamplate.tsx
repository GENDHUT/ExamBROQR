// src/qr/WebViewScreen.tsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  AppState,
  StatusBar,
  BackHandler,
  Modal,
  Text,
  TouchableOpacity,
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
import { PanGestureHandler } from "react-native-gesture-handler";

type WebViewScreenProps = StackScreenProps<RootStackParamList, "WebView">;

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
  const { url } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Show fullscreen modal
  const showWarning = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  // Hide tab bar
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) parent.setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      if (parent) parent.setOptions({ tabBarStyle: { display: "flex" } });
    };
  }, [navigation]);

  useEffect(() => {
    let immersiveInterval: NodeJS.Timer;

    if (Platform.OS === "android") {
      Immersive.on();
      StatusBar.setHidden(true);

      // PAKSA immersive ON setiap 500ms
      immersiveInterval = setInterval(() => {
        Immersive.on();
      }, 500);
    }

    // Disable back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        showWarning("Tombol kembali dinonaktifkan selama ujian!");
        return true;
      }
    );

    // AppState listener
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

  // Detect swipe from top/bottom only
  const onSwipeFromEdge = (event: any) => {
    if (event.nativeEvent.translationY > 20 || event.nativeEvent.translationY < -20) {
      showWarning("Swipe tidak diizinkan saat ujian!");
    }
  };

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

      {/* TOP EDGE */}
      <PanGestureHandler onGestureEvent={onSwipeFromEdge}>
        <View style={styles.topEdge} />
      </PanGestureHandler>

      {/* BOTTOM EDGE */}
      <PanGestureHandler onGestureEvent={onSwipeFromEdge}>
        <View style={styles.bottomEdge} />
      </PanGestureHandler>

      {/* FULLSCREEN WARNING MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalText}>{modalMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  topEdge: {
    position: "absolute",
    top: 0,
    height: 40,
    width: "100%",
    backgroundColor: "transparent",
  },
  bottomEdge: {
    position: "absolute",
    bottom: 0,
    height: 80,
    width: "100%",
    backgroundColor: "transparent",
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    elevation: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default WebViewScreen;