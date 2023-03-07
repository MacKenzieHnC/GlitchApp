import {character} from './types';
import RNFS from 'react-native-fs';

const mainDir = RNFS.CachesDirectoryPath;

export const getCharacters = async (pc: boolean) => {
  var characters: character[] = [];
  var list = await RNFS.readDir(mainDir + (pc ? '/PCs' : '/NPCs'));
  for (let i = 0; i < list.length; i++) {
    const content = await RNFS.readFile(list[i].path);
    characters[i] = JSON.parse(content);
  }
  return characters;
};

export const saveCharacter = async (char: character, pc: boolean) => {
  const dir = mainDir + (pc ? '/PCs' : '/NPCs');
  const path = dir + '/' + char.fileName + '.glitch-character';
  console.log('writing to path: ' + path);
  RNFS.mkdir(dir).then(() => {
    RNFS.unlink(path).then(() => {
      RNFS.writeFile(path, JSON.stringify(char));
    });
  });
};
