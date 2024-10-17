import { Methods } from './enum';

export interface IUser {
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUserWithId extends IUser {
  id: string;
}

export interface IRequest {
  method?: keyof typeof Methods;
  endpoint?: string;
  body: IUser;
}
