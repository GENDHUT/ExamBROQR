import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, AppState } from "react-native";
import { WebView } from "react-native-webview";

export default function LiveKitWebView() {
  const webviewRef = useRef<WebView>(null);
  const [key, setKey] = useState(0); // untuk force reload

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        // Ketika user kembali ke aplikasi → reset WebView
        setKey((prev) => prev + 1);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        key={key} // reload total WebView
        ref={webviewRef}
        source={{ uri: "https://be-exam-livekit.vercel.app/" }}
        style={{ flex: 1 }}

        // 🔥 MODE INCOGNITO
        incognito={true}

        javaScriptEnabled={true}
        domStorageEnabled={false} // ❌ tidak pakai localStorage
        cacheEnabled={false} // ❌ tidak menyimpan cache
        cacheMode="LOAD_NO_CACHE" // ❌ jangan load cache
        allowsFullscreenVideo={true}
        startInLoadingState={true}
        originWhitelist={["*"]}
        setSupportMultipleWindows={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}

        // Pastikan storage lain juga tidak digunakan:
        sharedCookiesEnabled={false}
        thirdPartyCookiesEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
