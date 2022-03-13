import * as express from 'express';
import { v4 } from 'uuid';
import { json } from 'body-parser';
import { sign } from 'jsonwebtoken';
import { verifySignature } from './verify-signature';
import { accessTokenSecret } from './constants';
import { authenticateEVM } from '@blockchain-chat/middlewares';
import cors = require('cors');

const app = express();
app.use(json());
app.use(cors());

const STORE = {};

app.get('/login-evm/message', authenticateEVM, (req, res) => {
  const messageToSign = v4();
  const address = req.headers.evm as string;

  STORE[address] = messageToSign;

  res.json({ message: messageToSign });
});

app.post('/login-evm', authenticateEVM, async (req, res) => {
  const { signature } = req.body;
  const address = req.headers.evm as string;

  const message = STORE[address];

  if (!message) {
    return res.status(403).send('You must request login id first');
  }

  delete STORE[address];

  const isValid = await verifySignature({ address, message, signature });

  if (!isValid) {
    return res.status(403).send('EVM signature invalid');
  }

  const expiresIn = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const jwt = sign({ evm: address }, accessTokenSecret, { expiresIn });
  res.json({ jwt, expiresIn });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
