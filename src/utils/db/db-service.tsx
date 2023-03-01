import SQLite from 'react-native-sqlite-storage';

// NOTE: Every time you replace the db, you have to manually uninstall the app from Android
/**
 * Opens a connection to the database
 *
 * @returns SQLiteDatabase
 */
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
