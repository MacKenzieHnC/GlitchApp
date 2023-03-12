import {character} from './types';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {pickMultiple} from 'react-native-document-picker';
import {backslash} from './utils';

export const localStateDir = RNFS.CachesDirectoryPath;

export const getCharacters = async (pc: boolean) => {
  var characters: character[] = [];
  var list = await RNFS.readDir(localStateDir + (pc ? '/PCs' : '/NPCs'));
  for (let i = 0; i < list.length; i++) {
    const content = await RNFS.readFile(list[i].path);
    characters[i] = JSON.parse(content);
  }
  return characters;
};

export const saveCharacter = async (char: character) => {
  const dir = localStateDir + backslash() + (char.pc ? 'PCs' : 'NPCs');
  const path = dir + backslash() + char.fileName + '.glitch-character';
  console.log('writing to path: ' + path);
  return RNFS.mkdir(dir)
    .then(() => RNFS.unlink(path))
    .then(() => RNFS.writeFile(path, JSON.stringify(char)));
};

export const importCharacters = async () => {
  const results = await pickMultiple();
  if (results.length === 0) {
    console.log('cancelled');
    return;
  } else {
    // Check invalid types
    for (let i = 0; i < results.length; i++) {
      if (!results[i].uri.includes('.glitch-character')) {
        Alert.alert(
          'Invalid filetype detected!\nValid filetypes are ".glitch-character"',
        );
        return;
      }
    }

    // Check duplicate characters
    const duplicates = [];
    for (let i = 0; i < results.length; i++) {
      const uri = localStateDir + '/PCs/' + results[i].name;
      if (await RNFS.exists(uri)) {
        duplicates.push(uri);
        console.log('Duplicate detected: ' + results[i].name);
      }
    }

    // Handle duplicates
    // TODO: Actually handle duplicates
    for (let i = 0; i < duplicates.length; i++) {
      const duplicate = duplicates[i];
      console.log('Deleting ' + duplicate);
      await RNFS.unlink(duplicate).then(() =>
        console.log('Successfully deleted ' + duplicate),
      );
    }

    // Import characters
    for (let i = 0; i < results.length; i++) {
      const dest = localStateDir + '/PCs/' + results[i].name;
      console.log(await RNFS.readFile(results[i].uri)); // Fails
    }
  }
};
