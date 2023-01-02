import SQLite from 'react-native-sqlite-storage';
import {character} from './types';

// TODO: Every time you replace the db, you have to manually uninstall the app from Android
export const getDBConnection = async () => {
  return SQLite.openDatabase(
    {
      name: 'Glitch.db',
      location: 'default',
      createFromLocation: '1',
    },
    () => console.log('Success!'),
    () => console.log('Failure'),
  );
};

SQLite.enablePromise(true);

export const getCharacters = async () => {
  const db = await getDBConnection();

  const items: character[] = [];
  try {
    const query = `SELECT *
    FROM Characters`;

    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        const item = result.rows.item(index);
        items.push!({
          key: item.id,
          name: item.name,
          discipline: item.discipline,
        });
      }
    });
    return items;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get items !!!');
  } finally {
    db.close();
  }
};
