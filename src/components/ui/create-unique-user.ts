import { IUserWithId, IUser } from '../../types/interface';
import { v4 as uuidv4 } from 'uuid';

export const createUniqueUser = (data: IUser): IUserWithId => {
  return {
    id: uuidv4(),
    username: data.username,
    age: data.age,
    hobbies: data.hobbies,
  };
};
