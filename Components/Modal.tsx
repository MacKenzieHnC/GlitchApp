import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

export default function Modal({children, isOpen, onDismiss}) {
  if (!isOpen) {
    return <View />;
  }

  return (
    <View style={styles.modal}>
      <TouchableOpacity onPress={() => onDismiss()} style={styles.background} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  background: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  content: {
    zIndex: 2,
  },
});
