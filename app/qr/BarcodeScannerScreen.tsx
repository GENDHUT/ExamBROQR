import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Linking } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { router } from 'expo-router';
import CryptoJS from 'crypto-js';

const SECRET_KEY = "MYSECRETKEY12345";

// ===== AES DECRYPT ====
function decryptAES(base64Text: string) {
  try {
    const encrypted = CryptoJS.enc.Base64.parse(base64Text);
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);

    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({ ciphertext: encrypted }),
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    const text = decrypted.toString(CryptoJS.enc.Utf8);
    if (!text) return null;

    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

// =====================================

const BarcodeScannerScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    setScanned(true);

    const decrypted = decryptAES(data);

    if (decrypted) {

      if (decrypted.expires) {
        const now = Math.floor(Date.now() / 1000);
        if (now > decrypted.expires) {
          Alert.alert("QR Expired", "QR ini sudah tidak berlaku");
          return;
        }
      }

      if (decrypted.url) {
        router.push({
          pathname: "/webview",
          params: { url: decrypted.url }
        });
        return;
      }

      Alert.alert("QR Invalid", "Format QR terenkripsi tidak valid.");
      return;
    }

    // QR biasa
    if (data.startsWith("http://") || data.startsWith("https://")) {
      router.push({
        pathname: "/webview",
        params: { url: data }
      });
      return;
    }

    Alert.alert("QR Data", data);
  };

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Meminta izin kamera...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>Tidak ada izin kamera</Text>
        <Button title="Buka Pengaturan" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button title="Scan Lagi" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BarcodeScannerScreen;
