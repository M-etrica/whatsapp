import type { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import createHttpError from 'http-errors';
import pino from 'pino';

const logger = pino();

export function validate<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.body);
      req.body = data;
      next();
    } catch (err) {
      logger.error(err);
      if (err instanceof ZodError) {
        console.log(err);
        return next(createHttpError(422, err.issues));
      }
      return next(createHttpError(500, 'Internal Server Error'));
    }
  };
}
