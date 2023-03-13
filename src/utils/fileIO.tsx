import {character} from './types';
import RNFS from 'react-native-fs';
import {backslash} from './utils';

export const localStateDir = RNFS.CachesDirectoryPath;

export const getCharacters = async (pc: boolean, dir: string) => {
  var characters: character[] = [];
  var list = await RNFS.readDir(dir + (pc ? '/PCs' : '/NPCs'));
  for (let i = 0; i < list.length; i++) {
    const content = await RNFS.readFile(list[i].path);
    characters[i] = JSON.parse(content);
  }
  return characters;
};

export const saveCharacter = async (char: character, dir: string) => {
  const path = dir + backslash() + char.fileName + '.glitch-character';
  return RNFS.mkdir(dir)
    .then(() => RNFS.unlink(path))
    .then(() => RNFS.writeFile(path, JSON.stringify(char)));
};
