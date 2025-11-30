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

  // Flash modal super cepat (100 ms)
  const showWarning = () => {
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 20);
  };

  // Lock immersive function (lebih kuat & cepat)
  const forceImmersive = () => {
    if (Platform.OS === "android") {
      Immersive.on();
      Immersive.setImmersive(true);
      StatusBar.setHidden(true);
    }
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
      // Awal masuk layar → langsung full immersive
      forceImmersive();

      // Interval super cepat (30ms)
      immersiveInterval = setInterval(() => {
        forceImmersive();
      }, 30);
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        showWarning();
        return true;
      }
    );

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && isFocused) {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })
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

  // Modal muncul/hilang → segera kunci immersive
  useEffect(() => {
    forceImmersive();
  }, [modalVisible]);

  // Fokus screen berubah → kunci immersive
  useEffect(() => {
    if (isFocused) forceImmersive();
  }, [isFocused]);

  // Detect swipe events
  const onSwipeFromEdge = (event: any) => {
    if (
      event.nativeEvent.translationY > 20 ||
      event.nativeEvent.translationY < -20
    ) {
      showWarning();
    }
  };

  const onSwipeStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.state === 4) showWarning();
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
        onLoadStart={forceImmersive}
        onLoadEnd={forceImmersive}
      />

      {/* TOP EDGE */}
      <PanGestureHandler
        onGestureEvent={onSwipeFromEdge}
        onHandlerStateChange={onSwipeStateChange}
      >
        <View style={styles.topEdge} />
      </PanGestureHandler>

      {/* BOTTOM EDGE */}
      <PanGestureHandler
        onGestureEvent={onSwipeFromEdge}
        onHandlerStateChange={onSwipeStateChange}
      >
        <View style={styles.bottomEdge} />
      </PanGestureHandler>

      {/* EMPTY MODAL (100% transparent) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.blankModal} />
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
    height: 120,
    width: "100%",
    backgroundColor: "transparent",
  },
  bottomEdge: {
    position: "absolute",
    bottom: 0,
    height: 120,
    width: "100%",
    backgroundColor: "transparent",
  },

  blankModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)", // transparan penuh
  },
});

export default WebViewScreen;
