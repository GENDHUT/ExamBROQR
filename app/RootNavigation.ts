// RootNavigation.ts
import * as React from 'react';
import { CommonActions } from '@react-navigation/native';

// Membuat reference global untuk navigator
export const navigationRef = React.createRef<any>();

// Fungsi untuk mereset navigasi ke layar "Home"
export function resetToHome() {
  console.log('Resetting navigation to Home');
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    })
  );
}

// Default export sehingga file ini bisa diimpor sebagai default
export default {
  navigationRef,
  resetToHome,
};
