import React from 'react';
import {Text, View} from 'react-native';
import {StyleSheet} from 'react-native-windows';

const LoadScreen = () => {
  return (
    <View style={styles.loading}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadScreen;
