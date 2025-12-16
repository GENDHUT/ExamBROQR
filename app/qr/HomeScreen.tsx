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

      {/* ===== HEADER ===== */}
      <Text style={styles.title}>WELCOME</Text>

      {/* ===== MENU ROW ===== */}
      <View style={styles.rowContainer}>
        
        {/* Scan Barcode */}
        <TouchableOpacity 
          style={styles.menuBox}
          onPress={() => navigation.navigate('BarcodeScanner')}
          activeOpacity={0.7}
        >
          <Ionicons name="qr-code-outline" size={32} color="#222" />
          <Text style={styles.menuText}>Scan Barcode</Text>
        </TouchableOpacity>

        {/* Dummy */}
        <TouchableOpacity style={styles.menuBox} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={32} color="#222" />
          <Text style={styles.menuText}>Dummy Menu</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 80,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 40,
    color: "#222",
  },

  rowContainer: {
    flexDirection: "row",
    gap: 30,
  },

  menuBox: {
    width: 110,
    height: 110,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",

    // TRANSPARAN
    backgroundColor: "transparent",

    // GARIS TIPIS BIAR TETAP KELIHATAN
    borderWidth: 1.5,
    borderColor: "#ccc",
  },

  menuText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  }
});

export default HomeScreen;
