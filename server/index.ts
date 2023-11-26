import { WebSocketServer } from 'ws';
import imitator, { Response } from './imitator';
import 'dotenv/config';

const wss = new WebSocketServer({
  port: +(process.env.PORT || 3000),
  // host: '127.0.0.1',
});

wss.on('connection', (socket) => {
  console.log(`New connection to wss`);
  const observer = {
    onMessage: (data: Response) => {
      socket.send(JSON.stringify(data));
    },
    onSubscribe: (data: Response) => {
      socket.send(JSON.stringify(data));
    },
  };
  imitator.subscribe(observer);

  socket.on('close', () => {
    imitator.unSubscribe(observer);
  });
});
