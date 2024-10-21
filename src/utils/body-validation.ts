import { IUser } from '../types/interface';

export const isBodyValid = (body: IUser) => {
  const isCorrectBody = isIncludeAllFields(body) && isCorrectAllFieldsType(body);
  return isCorrectBody;
};

const isIncludeAllFields = (body: Partial<IUser>): boolean => {
  const requiredFields: (keyof IUser)[] = ['username', 'age', 'hobbies'];

  return requiredFields.every((field) => field in body) && Object.keys(body).length === 3;
};

const isCorrectAllFieldsType = ({ username, hobbies, age }: IUser): boolean => {
  const isUsernameValid = typeof username === 'string' && username.trim() !== '';
  const isAgeValid = typeof age === 'number' && age > 0;
  const areHobbiesValid = Array.isArray(hobbies);
  const areHobbiesStrings =
    areHobbiesValid &&
    (hobbies.length === 0 || hobbies.every((hobby) => typeof hobby === 'string'));
  return isUsernameValid && isAgeValid && areHobbiesStrings;
};
