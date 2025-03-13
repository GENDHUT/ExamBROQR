import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraPermissions, CameraType } from 'expo-camera';

const CameraScreen: React.FC = () => {
  // Gunakan literal string 'back' atau 'front' sebagai nilai
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current: 'back' | 'front') =>
      current === 'back' ? 'front' : 'back'
    );
  }

  function handleScanQR() {
    console.log("Scan QR Code pressed");
    // Tambahkan implementasi pemindaian QR Code di sini
  }

  // Workaround: cast Camera ke any agar bisa digunakan sebagai JSX element
  const ExpoCamera = Camera as unknown as React.ComponentType<{ 
    style: any; 
    type: 'back' | 'front'; 
    children?: React.ReactNode;
  }>;

  return (
    <View style={styles.container}>
      <ExpoCamera style={styles.camera} type={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleScanQR}>
            <Text style={styles.text}>Scan</Text>
          </TouchableOpacity>
        </View>
      </ExpoCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  message: { textAlign: 'center', paddingBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: { fontSize: 24, fontWeight: 'bold', color: 'white' },
});

export default CameraScreen;
