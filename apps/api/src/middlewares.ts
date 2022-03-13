import { verify } from 'jsonwebtoken';
import { accessTokenSecret } from './constants';

/**
 * Middleware checks evm address sent
 */
export const authenticateEVM = (req, res, next) => {
  const evm = req.headers.evm;

  if (evm) {
    next();
  } else {
    res.status(400).send('Sign in with EVM');
  }
};

/**
 * Middleware validates jwt
 */
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.status(401).send('Token expired');
      }

      req.user = user;
      next();
    });
  } else {
    res.status(403).send('You should login');
  }
};
