import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import { MiddlewareService } from 'src/engine/middlewares/middleware.service';

@Injectable()
export class RestCoreMiddleware implements NestMiddleware {
  constructor(private readonly middlewareService: MiddlewareService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.middlewareService.authenticateRestRequest(req);
    } catch (error) {
      // console.error(typeof error);
      this.middlewareService.writeRestResponseOnExceptionCaught(res, error);

      return;
    }

    next();
  }
}
