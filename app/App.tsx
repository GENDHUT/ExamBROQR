// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './(tabs)/index';
import { navigationRef } from './RootNavigation';
import AppStateHandler from './AppStateHandler';

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppStateHandler />
      <AppNavigator />
    </NavigationContainer>
  );
}
