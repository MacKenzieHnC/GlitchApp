import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import styles from '../utils/styles';
import DocumentPicker from 'react-native-document-picker';
import {gameChanged, mainDirChanged} from '../utils/store/appSlice';
import RNFS from 'react-native-fs';
import {backslash} from '../utils/utils';

export const DirectorySelector = () => {
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const setDirectory = async () => {
    DocumentPicker.pickDirectory().then(response => {
      if (response) {
        const path = response.uri + backslash() + 'glitch-character-manager';
        RNFS.mkdir(path).then(() => dispatch(mainDirChanged(path)));
      }
    });
  };

  return (
    <View style={{...styles.screen, backgroundColor: colors.background}}>
      <Text style={{color: colors.onBackground}}>
        Welcome to Kinzie's Glitch Character Manager!
      </Text>
      <Text style={{color: colors.onBackground}}>
        Let's get started by selecting a folder to store your data.
      </Text>
      <Button
        style={{backgroundColor: colors.primaryContainer}}
        onPress={setDirectory}>
        <Text style={{color: colors.onPrimaryContainer}}>Select directory</Text>
      </Button>
    </View>
  );
};

export const NewGame = ({mainDir}: {mainDir: string}) => {
  const {colors} = useTheme();
  const [name, _setName] = useState('main');
  const dispatch = useDispatch();
  const newGame = () => {
    // TODO: Actual multiple games
    const defaultGameSettings = {
      name: name,
      folderName: name.replace(/[^A-Za-z0-9\-_ ]/g, '').replace(/ /g, '_'),
    };
    const path = mainDir + backslash() + name;
    return RNFS.mkdir(path)
      .then(() => RNFS.mkdir(path + backslash() + 'PCs'))
      .then(() => RNFS.mkdir(path + backslash() + 'NPCs'))
      .then(() =>
        RNFS.writeFile(
          path + backslash() + 'settings.json',
          JSON.stringify(defaultGameSettings),
        ),
      )
      .then(() => {
        dispatch(gameChanged(defaultGameSettings));
      });
  };

  return (
    <View style={{...styles.screen, backgroundColor: colors.background}}>
      <Text style={{color: colors.onBackground}}>
        Next, let's make a new game!
      </Text>
      <Button
        style={{backgroundColor: colors.primaryContainer}}
        onPress={newGame}>
        <Text style={{color: colors.onPrimaryContainer}}>New game!</Text>
      </Button>
    </View>
  );
};
