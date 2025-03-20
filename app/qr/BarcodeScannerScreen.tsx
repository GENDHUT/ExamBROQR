import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Linking } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../(tabs)/index'; // Pastikan path-nya benar

type BarcodeScannerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BarcodeScanner'
>;

const BarcodeScannerScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');

  const navigation = useNavigation<BarcodeScannerScreenNavigationProp>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    if (data.startsWith('http')) {
      navigation.navigate('WebView', { url: data });
    } else {
      Alert.alert('Barcode Scanned', `Type: ${type}\nData: ${data}`);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Open Settings" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={cameraType}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BarcodeScannerScreen;
