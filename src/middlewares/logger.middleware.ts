import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { originalUrl: path, method } = request;
    const ip = (req =>
      // TODO: proxy hogi toh isko fix krna pdega
    req.headers['x-forwarded-for']
    || req.socket?.remoteAddress)(request);

    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const message = `${method} ${path} ${statusCode} - ${userAgent} ${ip}`;

      if(statusCode >= 400) {
        this.logger.error(message);
        return;
      }

      this.logger.log(message);
    });

    next();
  }
}
