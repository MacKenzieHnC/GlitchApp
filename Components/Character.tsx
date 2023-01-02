import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {StyleSheet} from 'react-native-windows';
import {character} from '../utils/types';
import LoadScreen from './LoadScreen';

const Character = ({initial}: {initial: character}) => {
  // Load
  const [chara, setChara] = useState(initial);
  if (!chara) {
    return <LoadScreen />;
  }

  // Component
  return (
    <View style={styles.container}>
      {/* Name */}
      <Text style={styles.h1}>{initial.name}</Text>
      <Text style={styles.h2}>Disciplined in {initial.discipline}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  h1: {
    flex: 1,
    textAlign: 'center',
    fontSize: 30,
  },
  h2: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
  },
});

export default Character;
