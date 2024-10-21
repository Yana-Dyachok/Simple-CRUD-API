import cluster, { Worker } from 'node:cluster';
import http, { createServer, IncomingMessage, ServerResponse } from 'node:http';
import os from 'node:os';
import { sendResponse } from '../components/ui/send-response';
import { controlDB } from '../libs/db-operations';
import { handleEndpointRequest } from '../components/base/endpoints-request';
import { IRequest } from '../types/interface';
import { StatusCode, StatusMessages, Methods } from '../types/enum';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const availableCPUs = os.cpus().length - 1;

if (cluster.isPrimary) {
  console.log(`Primary process started with PID: ${process.pid}`);

  for (let i = 0; i < availableCPUs; i++) {
    cluster.fork({ WORKER_PORT: port + i + 1 });
  }

  let currentWorker = 0;

  const workers = Object.values(cluster.workers || {}).filter((w): w is Worker => w !== undefined);

  const loadBalancer = createServer((req: IncomingMessage, res: ServerResponse) => {
    const worker = workers[currentWorker];

    if (worker) {
      const workerPort = process.env.WORKER_PORT;
      if (workerPort) {
        const proxyReq = http.request(
          {
            hostname: 'localhost',
            port: parseInt(workerPort, 10),
            path: req.url,
            method: req.method,
            headers: req.headers,
          },
          (proxyRes: IncomingMessage) => {
            proxyRes.pipe(res);
          }
        );

        req.pipe(proxyReq);
        currentWorker = (currentWorker + 1) % workers.length;
      } else {
        sendResponse(res, StatusCode.SERVER_FAILURE, {
          error: 'No worker port found',
        });
      }
    } else {
      sendResponse(res, StatusCode.SERVER_FAILURE, {
        error: 'No available worker',
      });
    }
  });

  loadBalancer.listen(port, () => {
    console.log(`Load balancer listening on port ${port}`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const workerPort = process.env.WORKER_PORT;

  const app = async () => {
    await controlDB.start();

    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      let body: string = '';

      req.on('data', (chunk: Buffer) => {
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
            error: StatusMessages.SERVER_ERROR,
          });
        }
      });

      req.on('error', () => {
        sendResponse(res, StatusCode.SERVER_FAILURE, {
          error: StatusMessages.SERVER_ERROR,
        });
      });
    });

    server.listen(workerPort, () => {
      console.log(`Worker ${process.pid} listening on port http://localhost:${workerPort}`);
    });

    process.on('SIGINT', async () => {
      await controlDB.end();
      process.exit();
    });
  };

  app();
}
