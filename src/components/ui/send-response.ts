import http from 'node:http';

export const sendResponse = <T>(result: http.ServerResponse, status: number, data: T) => {
  result.statusCode = status;
  result.write(JSON.stringify(data));
  result.end();
};
