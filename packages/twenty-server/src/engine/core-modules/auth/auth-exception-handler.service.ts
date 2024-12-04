import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { ExceptionHandlerUser } from 'src/engine/core-modules/exception-handler/interfaces/exception-handler-user.interface';
import { ExceptionHandlerWorkspace } from 'src/engine/core-modules/exception-handler/interfaces/exception-handler-workspace.interface';

import { AuthException } from 'src/engine/core-modules/auth/auth.exception';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';

export const handleException = (
  exception: AuthException,
  exceptionHandlerService: ExceptionHandlerService,
  user?: ExceptionHandlerUser,
  workspace?: ExceptionHandlerWorkspace,
): void => {
  exceptionHandlerService.captureExceptions([exception], { user, workspace });
};

interface RequestAndParams {
  request: Request | null;
  params: any;
}

@Injectable({ scope: Scope.REQUEST })
export class ErrorHandlerService {
  constructor(
    private readonly exceptionHandlerService: ExceptionHandlerService,
    @Inject(REQUEST)
    private readonly request: RequestAndParams | null,
  ) {}

  handleError = (
    exception: AuthException,
    response?: any,
    errorCode?: number,
    user?: ExceptionHandlerUser,
    workspace?: ExceptionHandlerWorkspace,
  ) => {
    const params = this.request?.params;

    if (params?.workspaceId)
      workspace = { ...workspace, id: params.workspaceId };
    if (params?.userId) user = { ...user, id: params.userId };

    handleException(exception, this.exceptionHandlerService, user, workspace);

    return response.status(errorCode).send(exception.message);
  };
}
