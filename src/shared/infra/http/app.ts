import 'reflect-metadata';
import 'dotenv/config';

import { errors } from 'celebrate';
import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import swaggerUI from 'swagger-ui-express';
import 'express-async-errors';

import AppError from '@shared/errors/AppError';
import { rateLimiter } from './middlewares/rateLimiter';
import { router } from './routes';
import swaggerFile from './swagger.json';

import '@shared/infra/typeorm';
import '@shared/container';

class App {
  public server: Application;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  private middlewares() {
    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(rateLimiter);
  }

  private routes() {
    this.server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
    this.server.use(router);
  }

  private exceptionHandler() {
    this.server.use(errors());

    this.server.use(
      (err: Error, request: Request, response: Response, _: NextFunction) => {
        if (err instanceof AppError) {
          return response
            .status(err.statusCode)
            .json({ status: 'error', message: err.message });
        }

        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ status: 'error', message: 'Internal Server Error' });
      },
    );
  }
}

const app = new App().server;

export { app };
