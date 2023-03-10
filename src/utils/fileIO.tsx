import {character} from './types';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

const mainDir =
  RNFS.MainBundlePath + (Platform.OS === 'windows' ? '\\LocalState' : '');

export const getCharacters = async (pc: boolean) => {
  var characters: character[] = [];
  var list = await RNFS.readDir(mainDir + (pc ? '/PCs' : '/NPCs'));
  for (let i = 0; i < list.length; i++) {
    const content = await RNFS.readFile(list[i].path);
    characters[i] = JSON.parse(content);
  }
  return characters;
};

export const saveCharacter = async (char: character) => {
  const dir = mainDir + (char.pc ? '/PCs' : '/NPCs');
  const path = dir + '/' + char.fileName + '.glitch-character';
  console.log('writing to path: ' + path);
  RNFS.mkdir(dir).then(() => {
    RNFS.unlink(path).then(() => {
      RNFS.writeFile(path, JSON.stringify(char));
    });
  });
};

export const getFolderLocation = () => {
  return mainDir;
};
