import { createServer } from 'node:http';
import { sendResponse } from '../components/ui/send-response';
import { StatusCode, StatusMessages, Methods } from '../types/enum';
import { handleEndpointRequest } from '../components/base/endpoints-request';
import { IRequest } from '../types/interface';
import 'dotenv/config';

const port = process.env.PORT || 4000;

export const app = () => {
  const server = createServer(async (req, res) => {
    let body: string = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      let parsedBody;
      try {
        parsedBody = body && body.trim() ? JSON.parse(body) : undefined;
      } catch (error) {
        sendResponse(res, StatusCode.INVALID_REQUEST, {
          error: `Invalid JSON format`,
        });
        return;
      }

      const requestObject: IRequest = {
        method: req.method as keyof typeof Methods,
        endpoint: req.url || '',
        body: parsedBody,
      };

      try {
        const response = await handleEndpointRequest(requestObject);

        const responseData = response.data ? response.data : { error: response.statusMessage };

        sendResponse(res, response.statusCode, responseData);
      } catch (error) {
        sendResponse(res, StatusCode.SERVER_FAILURE, {
          error: StatusMessages.REQUEST_FAILURE,
        });
      }
    });

    req.on('error', () => {
      sendResponse(res, StatusCode.SERVER_FAILURE, {
        error: StatusMessages.REQUEST_FAILURE,
      });
    });
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  process.on('SIGINT', async () => {
    process.exit();
  });
};
