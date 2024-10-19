# Simple-CRUD-API
### A simple Node.js CRUD API that uses an in-memory database
[Task](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

## How to install

1.  Clone this repository
```
git clone https://github.com/Yana-Dyachok/Simple-CRUD-API.git
```
2.  Move to the cloned repository
```
cd Simple-CRUD-API
```
3.  Switch the branch to `develop`
```
git checkout develop
```
4.  Install dependencies
```
npm i
```
## Scripts
 Scripts                  |   instructions                         | Comands
--------------------------|:---------------------------------------|:-----------------------------
ESLint                    | check:                                 | npm run lint 
Prettier                  | fix and formats files:                 | npm run format
Nodemon                   | start the app in the development mode  |  npm run start:dev 
TypeScript Compiler       | start the app in the production mode   | npm run start:prod
Nodemon                   | start the app with load balancer and shared in-memory database              | npm run start:multi
Jest                      | run jest tests                         | npm run test

## Endpoints

 - **GET** ```api/users```  is used to get a array all persons.
 - **GET** ```api/users/${userId}``` is used to get a specific user’s details if it exists.
 - **POST** ```api/users```  is used to create record about new user and store it in database.
 - **PUT** ```api/users/{userId}```  is used to update existing user.
 - **DELETE** ```api/users/${userId}```  is used to delete existing user from database.

## Example to create a new user:

```JSON
  {
    "username": "Yana",
    "age": 21,
    "hobbies": ["drawing", "football","swimming"]
  }
```