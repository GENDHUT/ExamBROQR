// src/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../(tabs)/index';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Container Row */}
      <View style={styles.rowContainer}>
        
        {/* Elemen 1 — Scan Barcode */}
        <TouchableOpacity 
          style={styles.menuBox}
          onPress={() => navigation.navigate('BarcodeScanner')}
        >
          <Ionicons name="qr-code-outline" size={40} color="#333" />
          <Text style={styles.menuText}>Scan Barcode Ujian</Text>
        </TouchableOpacity>

        {/* Elemen 2 — Dummy */}
        <TouchableOpacity style={styles.menuBox}>
          <Ionicons name="document-text-outline" size={40} color="#333" />
          <Text style={styles.menuText}>Dummy Menu</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: "#f5f5f5"
  },

  rowContainer: {
    flexDirection: "row",
    gap: 20,
  },

  menuBox: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5, 
  },

  menuText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  }
});

export default HomeScreen;
