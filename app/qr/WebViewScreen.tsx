// src/qr/WebViewScreen.tsx
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../(tabs)/index'; // Pastikan path-nya sudah benar

type WebViewScreenProps = StackScreenProps<RootStackParamList, 'WebView'>;

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" style={styles.loading} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default WebViewScreen;
