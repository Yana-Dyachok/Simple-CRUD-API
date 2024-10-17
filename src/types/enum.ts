export enum BaseAPI {
  DEFAULT = '/',
  USER = '/api/users',
  USER_ID = '/api/users/',
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum HttpStatusCode {
  SUCCESS = 200,
  RESOURCE_CREATED = 201,
  NO_RESPONSE = 204,
  INVALID_REQUEST = 400,
  AUTH_REQUIRED = 401,
  ACCESS_DENIED = 403,
  NOT_FOUND = 404,
  SERVER_FAILURE = 500,
  NOT_SUPPORTED = 501,
  GATEWAY_ERROR = 502,
  SERVICE_DOWN = 503,
}

export enum ErrorMessagesEnum {
  USER_REMOVED = 'User has been successfully removed',
  MISSING_USER_ID = 'User ID is missing',
  METHOD_NOT_ALLOWED = 'The HTTP method is not allowed',
  SERVER_FAILURE_MESSAGE = 'Internal server error occurred',
  OPERATION_SUCCESSFUL = 'Operation completed successfully',
  INVALID_USER_ID = 'The provided ID is not valid',
  INVALID_USER_DATA = 'Provided user data is invalid',
  REQUEST_FAILURE = 'The request is invalid',
  AUTHENTICATION_FAILED = 'Authentication required',
  RESOURCE_NOT_AVAILABLE = 'The requested resource was not found',
  FUNCTIONALITY_NOT_SUPPORTED = 'Functionality not yet implemented',
  SERVICE_TEMPORARILY_UNAVAILABLE = 'The service is temporarily unavailable',
}
