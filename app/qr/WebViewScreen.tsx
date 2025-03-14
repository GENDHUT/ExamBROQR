// src/qr/WebViewScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../(tabs)/index'; 
// import { StatusBar } from 'expo-status-bar'; // Jika ingin menyembunyikan status bar

type WebViewScreenProps = StackScreenProps<RootStackParamList, 'WebView'>;

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
  const { url } = route.params;

  useEffect(() => {
    // Fungsi untuk menangani event back button
    const backAction = () => {
      Alert.alert("Peringatan", "Tombol kembali dinonaktifkan selama ujian!");
      return true; // Mencegah aksi back default
    };

    // Daftarkan listener untuk event hardwareBackPress
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    
    // Cleanup listener saat komponen di-unmount
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* Jika ingin menyembunyikan status bar, aktifkan baris di bawah */}
      {/* <StatusBar hidden={true} /> */}
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
