import { createServer } from 'node:http';
import 'dotenv/config';
import { sendResponse } from '../components/ui/send-response';
import { HttpStatusCode, ErrorMessagesEnum, BaseAPI } from '../types/enum';

const port = process.env.PORT || 4000;

export const app = () => {
  const server = createServer((req, res) => {
    if (req.method === 'GET' && req.url === BaseAPI.USER) {
      const responseData = { message: 'Hello, World!' };
      sendResponse(res, HttpStatusCode.SUCCESS, responseData);
    } else {
      sendResponse(res, HttpStatusCode.NO_RESPONSE, {
        error: ErrorMessagesEnum.RESOURCE_NOT_AVAILABLE,
      });
    }
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  process.on('SIGINT', async () => {
    process.exit();
  });
};
