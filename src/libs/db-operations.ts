import { readFile, writeFile, unlink } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { IUserWithId } from '../types/interface';

export const getDB = () => {
  return join(dirname(__dirname), 'libs', 'db.json');
};

export const loadUsersFromFile = async (): Promise<IUserWithId[]> => {
  try {
    const dbPath = getDB();
    const data = await readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users from file:', error);
    return [];
  }
};

export const saveUsersToFile = async (users: IUserWithId[]): Promise<void> => {
  try {
    const dbPath = getDB();
    const data = JSON.stringify(users, null, 2);
    await writeFile(dbPath, data, 'utf-8');
  } catch (error) {
    console.error('Error saving users to file:', error);
  }
};

export const controlDB = {
  async start() {
    const dbPath = getDB();
    try {
      await writeFile(dbPath, '[]', 'utf-8');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  },

  async end() {
    const dbPath = getDB();
    try {
      await unlink(dbPath);
    } catch (error) {
      console.error('Error deleting database:', error);
    }
  },
};
