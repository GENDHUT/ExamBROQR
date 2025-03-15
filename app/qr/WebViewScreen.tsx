// src/qr/WebViewScreen.tsx
import React, { useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  AppState,
  Alert,
  StatusBar,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  StackScreenProps,
  CommonActions,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import { RootStackParamList } from "../(tabs)/index";
import Immersive from "react-native-immersive"; // Import modul immersive

type WebViewScreenProps = StackScreenProps<RootStackParamList, "WebView">;

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
  const { url } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Hapus tab bar dari navigator induk (misalnya, tab navigator) ketika layar WebView aktif
  useLayoutEffect(() => {
    const parent = navigation.getParent(); // Ambil navigator induk (biasanya tab navigator)
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: "none" },
      });
    }
    // Kembalikan opsi tab bar saat layar tidak lagi aktif
    return () => {
      if (parent) {
        parent.setOptions({
          // Atur kembali ke style default atau sesuai kebutuhan
          tabBarStyle: { display: "flex" },
        });
      }
    };
  }, [navigation]);

  useEffect(() => {
    if (Platform.OS === "android") {
      Immersive.on();
      StatusBar.setHidden(true);
    }

    // BackHandler untuk mencegah tombol back
    const backAction = () => {
      Alert.alert("Peringatan", "Tombol kembali dinonaktifkan selama ujian!");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Listener AppState: reset navigasi ke layar Home ketika aplikasi kembali aktif
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && isFocused) {
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default WebViewScreen;
