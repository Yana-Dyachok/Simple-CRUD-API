import { createServer } from 'node:http';
import 'dotenv/config';

const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
