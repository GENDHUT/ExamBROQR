// app/(tabs)/index.tsx 
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../qr/HomeScreen';
import BarcodeScannerScreen from '../qr/BarcodeScannerScreen';
import CameraScreen from '../qr/CameraScreen';
import WebViewScreen from '../qr/WebViewScreen';

export type RootStackParamList = {
  Home: undefined;
  BarcodeScanner: undefined;
  Camera: undefined;
  WebView: { url: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }} 
      />
      <Stack.Screen 
        name="BarcodeScanner" 
        component={BarcodeScannerScreen} 
        options={{ title: 'Barcode Scanner' }} 
      />
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ title: 'Camera View' }} 
      />
      <Stack.Screen 
        name="WebView" 
        component={WebViewScreen} 
        options={{ title: 'Open URL', headerShown:false}} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
