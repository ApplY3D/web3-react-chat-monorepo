/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { authenticateJWT } from '@blockchain-chat/middlewares';
import { Server } from 'socket.io';
import { accessTokenSecret } from './constants';

const io = new Server({ cors: { origin: '*' } });

io.use((socket, next) => {
  let status = 0;
  let message = '';
  authenticateJWT(accessTokenSecret)(
    socket.request,
    // res.status(400).send('error)
    {
      status: (s: number) => {
        status = s;
        return {
          send: (m: string) => (message = m),
        };
      },
    },
    next
  );
  next(new Error(status + ': ' + message));
});

io.on('connection', (socket) => {
  socket.emit('connected', socket.id);

  socket.on('CHAT:NEW_MESSAGE', (message: string) => {
    socket.broadcast.emit('CHAT:NEW_MESSAGE', message);
  });

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnect');
  });
});

io.listen(3334);
