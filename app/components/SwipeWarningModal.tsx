// src/components/SwipeWarningModal.tsx
import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const SwipeWarningModal: React.FC<Props> = ({ visible, message, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    elevation: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    marginTop: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default SwipeWarningModal;
