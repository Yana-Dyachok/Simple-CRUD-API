import { IRequest, IResponse, IUserWithId } from '../../types/interface';
import { Methods, StatusCode, StatusMessages, BaseAPI } from '../../types/enum';
import { dataUsers } from '../ui/data-users';
import { isBodyValid } from '../../utils/body-validation';
import { validateUUID } from '../../utils/validation-uuid';
import { createUniqueUser } from '../ui/create-unique-user';

export const handleEndpointRequest = async (requestObject: IRequest): Promise<IResponse> => {
  const { endpoint, method, body } = requestObject;
  const isDynamicPath =
    endpoint && /\/api\/users\/*/.test(endpoint) && endpoint.split('/').length === 4;

  const createResponse = (
    statusCode: StatusCode,
    statusMessage: StatusMessages | string,
    data?: IUserWithId[] | IUserWithId
  ): IResponse => ({
    method: method as keyof typeof Methods,
    statusCode: statusCode,
    statusMessage: statusMessage,
    data: data,
  });

  if (isDynamicPath && method === Methods.GET) {
    const id = endpoint.split('/')[3]!;
    const isValidUUID = validateUUID(id);
    const user = dataUsers.find((user) => user.id === id);

    if (!isValidUUID) {
      return createResponse(StatusCode.INVALID_REQUEST, `The provided ID=${id} is not valid`);
    }

    if (isValidUUID && user) {
      return createResponse(StatusCode.SUCCESS, StatusMessages.OPERATION_SUCCESSFUL, user);
    } else {
      return createResponse(StatusCode.NOT_FOUND, `User with ID=${id} doesn't exist`);
    }
  }

  if (isDynamicPath && method === Methods.PUT && body) {
    const id = endpoint.split('/')[3]!;
    const isValidUUID = validateUUID(id);
    const isValidBodySchema = isBodyValid(body);

    if (!isValidUUID) {
      return createResponse(StatusCode.INVALID_REQUEST, `The provided ID=${id} is not valid`);
    }

    if (isValidUUID && isValidBodySchema) {
      const user = dataUsers.find((user) => user.id === id);

      if (user) {
        const updatedUser = { id, ...body };
        dataUsers.splice(dataUsers.indexOf(user), 1, updatedUser);
        return createResponse(StatusCode.SUCCESS, StatusMessages.OPERATION_SUCCESSFUL, updatedUser);
      } else {
        return createResponse(StatusCode.NOT_FOUND, `User with ID <${id}> doesn't exist`);
      }
    }

    return createResponse(StatusCode.INVALID_REQUEST, StatusMessages.REQUEST_FAILURE);
  }

  if (isDynamicPath && method === Methods.PUT && !body) {
    return createResponse(StatusCode.INVALID_REQUEST, StatusMessages.MISSING_BODY);
  }

  if (isDynamicPath && method === Methods.DELETE) {
    const id = endpoint.split('/')[3]!;
    const isValidUUID = validateUUID(id);
    const user = dataUsers.find((user) => user.id === id);

    if (!isValidUUID) {
      return createResponse(StatusCode.INVALID_REQUEST, `The provided ID=${id} is not valid`);
    }

    if (user) {
      dataUsers.splice(dataUsers.indexOf(user), 1);
      return createResponse(StatusCode.NO_RESPONSE, StatusMessages.USER_REMOVED);
    } else {
      return createResponse(StatusCode.NOT_FOUND, `User with ID <${id}> doesn't exist`);
    }
  }

  switch (endpoint) {
    case BaseAPI.USER: {
      if (method === Methods.GET) {
        return createResponse(StatusCode.SUCCESS, StatusMessages.OPERATION_SUCCESSFUL, dataUsers);
      }

      if (method === Methods.POST && body) {
        const isValidBodySchema = isBodyValid(body);
        if (isValidBodySchema) {
          const newUser = createUniqueUser(body);
          dataUsers.push(newUser);
          return createResponse(StatusCode.RESOURCE_CREATED, StatusMessages.USER_CREATED, newUser);
        } else {
          return createResponse(StatusCode.INVALID_REQUEST, StatusMessages.REQUEST_FAILURE);
        }
      } else if (method === Methods.POST && !body) {
        return createResponse(StatusCode.INVALID_REQUEST, StatusMessages.MISSING_BODY);
      }

      break;
    }

    default: {
      return createResponse(StatusCode.NOT_FOUND, StatusMessages.RESOURCE_NOT_AVAILABLE);
    }
  }

  return createResponse(StatusCode.NOT_FOUND, StatusMessages.RESOURCE_NOT_AVAILABLE);
};
