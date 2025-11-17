// AppStateHandler.tsx
import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { router } from 'expo-router';

const AppStateHandler = () => {
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      console.log("AppState:", state);

      if (state === "active") {
        // Saat aplikasi kembali dari background → pindah ke Home
        router.replace("/");
      }
    });

    return () => sub.remove();
  }, []);

  return null;
};

export default AppStateHandler;
