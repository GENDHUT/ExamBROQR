// AppStateHandler.tsx
import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { resetToHome } from './RootNavigation';

const AppStateHandler: React.FC = () => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('AppState changed to:', nextAppState);
      if (nextAppState === 'active') {
        resetToHome();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return null;
};

export default AppStateHandler;
