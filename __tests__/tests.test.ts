import { handleEndpointRequest } from '../src/components/base/endpoints-request';
import { IRequest, IResponse, IUserWithId } from '../src/types/interface';
import { Methods, StatusCode, StatusMessages, BaseAPI } from '../src/types/enum';
import { saveUsersToFile, loadUsersFromFile } from '../src/libs/db-operations';
import { isBodyValid } from '../src/utils/body-validation';
import { validateUUID } from '../src/utils/validation-uuid';

jest.mock('../src/libs/db-operations');
jest.mock('../src/components/ui/create-unique-user');
jest.mock('../src/utils/body-validation');
jest.mock('../src/utils/validation-uuid');

const mockUsers: IUserWithId[] = [
  { id: '259505f3-af87-4480-8228-51596e0fd96c', username: 'Yana', age: 21, hobbies: ['drawing'] },
  {
    id: '259505f3-af87-4480-8228-51596e0fd96r',
    username: 'Alex',
    age: 31,
    hobbies: ['football', 'swimming'],
  },
];

describe('Scenario-1 Get all records with a GET and update the created record with a PUT ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadUsersFromFile as jest.Mock).mockResolvedValue(mockUsers);
  });

  it('should return user by ID for GET request', async () => {
    const request: IRequest = {
      endpoint: '/api/users/259505f3-af87-4480-8228-51596e0fd96c',
      method: Methods.GET,
      body: null,
    };

    (validateUUID as jest.Mock).mockReturnValue(true);

    const response: IResponse = await handleEndpointRequest(request);

    expect(response).toEqual({
      method: 'GET',
      statusCode: StatusCode.SUCCESS,
      statusMessage: StatusMessages.OPERATION_SUCCESSFUL,
      data: mockUsers[0],
    });
  });

   it('should return invalid request for invalid UUID in GET request', async () => {
    const request: IRequest = {
      endpoint: '/api/users/invalid-uuid',
      method: Methods.GET,
      body: null,
    };

    (validateUUID as jest.Mock).mockReturnValue(false);

    const response: IResponse = await handleEndpointRequest(request);

    expect(response).toEqual({
      method: 'GET',
      statusCode: StatusCode.INVALID_REQUEST,
      statusMessage: 'The provided ID=invalid-uuid is not valid',
      data: undefined,
    });
  });

  it('should return not found for unsupported endpoint', async () => {
    const request: IRequest = {
      endpoint: '/api/unsupported',
      method: Methods.GET,
      body: null,
    };

    const response: IResponse = await handleEndpointRequest(request);

    expect(response).toEqual({
      method: 'GET',
      statusCode: StatusCode.NOT_FOUND,
      statusMessage: StatusMessages.RESOURCE_NOT_AVAILABLE,
      data: undefined,
    });
  });
  it('should update a user for valid PUT request', async () => {
    const updatedUserData = { username: 'Alex', age: 31, hobbies: ['football', 'swimming'] };
    const request: IRequest = {
      endpoint: '/api/users/259505f3-af87-4480-8228-51596e0fd96r',
      method: Methods.PUT,
      body: updatedUserData,
    };

    (validateUUID as jest.Mock).mockReturnValue(true);
    (isBodyValid as jest.Mock).mockReturnValue(true);

    const response: IResponse = await handleEndpointRequest(request);

    expect(response).toEqual({
      method: 'PUT',
      statusCode: StatusCode.SUCCESS,
      statusMessage: StatusMessages.OPERATION_SUCCESSFUL,
      data: { id: '259505f3-af87-4480-8228-51596e0fd96r', ...updatedUserData },
    });
    expect(saveUsersToFile).toHaveBeenCalledWith([
      {
        id: '259505f3-af87-4480-8228-51596e0fd96c',
        username: 'Yana',
        age: 21,
        hobbies: ['drawing'],
      },
      { id: '259505f3-af87-4480-8228-51596e0fd96r', ...updatedUserData },
    ]);
  });

  it('should return not found for updating a non-existent user in PUT request', async () => {
    const request: IRequest = {
      endpoint: '/api/users/999',
      method: Methods.PUT,
      body: { username: 'Alex', age: 31, hobbies: ['football', 'swimming'] },
    };

    (validateUUID as jest.Mock).mockReturnValue(true);
    (isBodyValid as jest.Mock).mockReturnValue(true);

    const response: IResponse = await handleEndpointRequest(request);

    expect(response).toEqual({
      method: 'PUT',
      statusCode: StatusCode.NOT_FOUND,
      statusMessage: "User with ID <999> doesn't exist",
      data: undefined,
    });
  });
});

describe('Scenario-2 With a DELETE request, we are trying to delete objects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadUsersFromFile as jest.Mock).mockResolvedValue(mockUsers);
  });

  it('should delete a user for valid DELETE request', async () => {
    const request: IRequest = {
      endpoint: '/api/users/259505f3-af87-4480-8228-51596e0fd96c',
      method: Methods.DELETE,
      body: null,
    };

    (validateUUID as jest.Mock).mockReturnValue(true);

    const response: IResponse = await handleEndpointRequest(request);

    expect(response).toEqual({
      method: 'DELETE',
      statusCode: StatusCode.NO_RESPONSE,
      statusMessage: StatusMessages.USER_REMOVED,
      data: undefined,
    });
    expect(saveUsersToFile).toHaveBeenCalledWith([
      {
        id: '259505f3-af87-4480-8228-51596e0fd96r',
        username: 'Alex',
        age: 31,
        hobbies: ['football', 'swimming'],
      },
    ]);
  });

  it('should return not found for deleting a non-existent user in DELETE request', async () => {
    const request: IRequest = {
      endpoint: '/api/users/999',
      method: Methods.DELETE,
      body: null,
    };

    (validateUUID as jest.Mock).mockReturnValue(true);

    const response: IResponse = await handleEndpointRequest(request);

    expect(response).toEqual({
      method: 'DELETE',
      statusCode: StatusCode.NOT_FOUND,
      statusMessage: "User with ID <999> doesn't exist",
      data: undefined,
    });
  });
});

describe('Scenario-3 A new object is created by a POST ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadUsersFromFile as jest.Mock).mockResolvedValue(mockUsers);
  });

  it('should return invalid request for invalid body in POST request', async () => {
    const request: IRequest = {
      endpoint: BaseAPI.USER,
      method: Methods.POST,
      body: null,
    };

    const response: IResponse = await handleEndpointRequest(request);

    expect(response).toEqual({
      method: 'POST',
      statusCode: StatusCode.INVALID_REQUEST,
      statusMessage: StatusMessages.MISSING_BODY,
      data: undefined,
    });
  });
});


describe('Scenario-4 With a GET request, we are trying to get a deleted object by id ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadUsersFromFile as jest.Mock).mockResolvedValue(mockUsers);
  });
  it('should return not found for invalid user ID in GET request', async () => {
    const request: IRequest = {
      endpoint: '/api/users/999',
      method: Methods.GET,
      body: null,
    };

    (validateUUID as jest.Mock).mockReturnValue(true);

    const response: IResponse = await handleEndpointRequest(request);

    expect(response).toEqual({
      method: 'GET',
      statusCode: StatusCode.NOT_FOUND,
      statusMessage: "User with ID=999 doesn't exist",
      data: undefined,
    });
  });
});