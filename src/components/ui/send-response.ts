import * as http from 'node:http';

export const sendResponse = <T>(result: http.ServerResponse, status: number, data: T) => {
  result.setHeader('Content-Type', 'application/json');
  result.statusCode = status;

  if (typeof data === 'string') {
    result.write(data);
  } else {
    result.write(JSON.stringify(data, null, 2));
  }

  result.end();
};
