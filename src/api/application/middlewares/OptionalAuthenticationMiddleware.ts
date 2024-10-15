import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AppError } from '../errors/appError';
import {
  IData,
  IMiddleware,
  IRequest,
  IResponse,
} from '../interfaces/IMiddleware';

export class OptionalAuthenticationMiddleware implements IMiddleware {
  async handle({ headers }: IRequest): Promise<IResponse | IData> {
    const { authorization } = headers;

    if (!authorization) {
      return {
        data: {
          accountId: null,
        },
      };
    }

    try {
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new AppError('Invalid token format');
      }

      const payload = jwt.verify(token, env.jwtSecret);

      return {
        data: {
          accountId: payload.sub,
        },
      };
    } catch {
      if (authorization) {
        return {
          statusCode: 401,
          body: {
            error: 'Invalid access token.',
          },
        };
      }
      return {
        data: {
          accountId: null,
        },
      };
    }
  }
}
