import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import bcrypt from 'bcrypt';
import { expect, jest } from '@jest/globals';
import { Repository } from 'typeorm';

import {
  AppToken,
  AppTokenType,
} from 'src/engine/core-modules/app-token/app-token.entity';
import { User } from 'src/engine/core-modules/user/user.entity';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import { SignInUpService } from 'src/engine/core-modules/auth/services/sign-in-up.service';
import { EnvironmentService } from 'src/engine/core-modules/environment/environment.service';
import { EmailService } from 'src/engine/core-modules/email/email.service';
import { AccessTokenService } from 'src/engine/core-modules/auth/token/services/access-token.service';
import { RefreshTokenService } from 'src/engine/core-modules/auth/token/services/refresh-token.service';
import { UserService } from 'src/engine/core-modules/user/services/user.service';
import { WorkspaceInvitationService } from 'src/engine/core-modules/workspace-invitation/services/workspace-invitation.service';
import { DomainManagerService } from 'src/engine/core-modules/domain-manager/service/domain-manager.service';

import { AuthService } from './auth.service';

jest.mock('bcrypt');

const UserFindOneMock = jest.fn();
const UserWorkspaceFindOneByMock = jest.fn();

const userWorkspaceServiceCheckUserWorkspaceExistsMock = jest.fn();
const workspaceInvitationGetOneWorkspaceInvitationMock = jest.fn();
const workspaceInvitationValidateInvitationMock = jest.fn();
const userWorkspaceAddUserToWorkspaceMock = jest.fn();

describe('AuthService', () => {
  let service: AuthService;
  let appTokenRepository: Repository<AppToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Workspace, 'core'),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User, 'core'),
          useValue: {
            findOne: UserFindOneMock,
          },
        },
        {
          provide: getRepositoryToken(AppToken, 'core'),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockImplementation(() => null),
            }),
          },
        },
        {
          provide: SignInUpService,
          useValue: {},
        },
        {
          provide: EnvironmentService,
          useValue: {},
        },
        {
          provide: DomainManagerService,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: AccessTokenService,
          useValue: {},
        },
        {
          provide: RefreshTokenService,
          useValue: {},
        },
        {
          provide: UserWorkspaceService,
          useValue: {
            checkUserWorkspaceExists:
              userWorkspaceServiceCheckUserWorkspaceExistsMock,
            addUserToWorkspace: userWorkspaceAddUserToWorkspaceMock,
          },
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: WorkspaceInvitationService,
          useValue: {
            getOneWorkspaceInvitation:
              workspaceInvitationGetOneWorkspaceInvitationMock,
            validateInvitation: workspaceInvitationValidateInvitationMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    appTokenRepository = module.get<Repository<AppToken>>(
      getRepositoryToken(AppToken, 'core'),
    );
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('challenge - user already member of workspace', async () => {
    const workspace = { isPasswordAuthEnabled: true } as Workspace;
    const user = {
      email: 'email',
      password: 'password',
      captchaToken: 'captchaToken',
    };

    (bcrypt.compare as jest.Mock).mockReturnValueOnce(true);

    UserFindOneMock.mockReturnValueOnce({
      email: user.email,
      passwordHash: 'passwordHash',
      captchaToken: user.captchaToken,
    });

    UserWorkspaceFindOneByMock.mockReturnValueOnce({});

    userWorkspaceServiceCheckUserWorkspaceExistsMock.mockReturnValueOnce({});

    const response = await service.challenge(
      {
        email: 'email',
        password: 'password',
        captchaToken: 'captchaToken',
      },
      workspace,
    );

    expect(response).toStrictEqual({
      email: user.email,
      passwordHash: 'passwordHash',
      captchaToken: user.captchaToken,
    });
  });

  it('challenge - user who have an invitation', async () => {
    const user = {
      email: 'email',
      password: 'password',
      captchaToken: 'captchaToken',
    };

    UserFindOneMock.mockReturnValueOnce({
      email: user.email,
      passwordHash: 'passwordHash',
      captchaToken: user.captchaToken,
    });

    (bcrypt.compare as jest.Mock).mockReturnValueOnce(true);
    userWorkspaceServiceCheckUserWorkspaceExistsMock.mockReturnValueOnce(false);

    workspaceInvitationGetOneWorkspaceInvitationMock.mockReturnValueOnce({});
    workspaceInvitationValidateInvitationMock.mockReturnValueOnce({});
    userWorkspaceAddUserToWorkspaceMock.mockReturnValueOnce({});

    const response = await service.challenge(
      {
        email: 'email',
        password: 'password',
        captchaToken: 'captchaToken',
      },
      {
        isPasswordAuthEnabled: true,
      } as Workspace,
    );

    expect(response).toStrictEqual({
      email: user.email,
      passwordHash: 'passwordHash',
      captchaToken: user.captchaToken,
    });

    expect(
      workspaceInvitationGetOneWorkspaceInvitationMock,
    ).toHaveBeenCalledTimes(1);
    expect(workspaceInvitationValidateInvitationMock).toHaveBeenCalledTimes(1);
    expect(userWorkspaceAddUserToWorkspaceMock).toHaveBeenCalledTimes(1);
    expect(UserFindOneMock).toHaveBeenCalledTimes(1);
  });

  describe('findOneInvitationBySignUpParams', () => {
    it('should return an invitation when inviteHash is provided and matches', async () => {
      const params = {
        workspaceId: 'workspace1',
        email: 'test@example.com',
        inviteHash: 'test-invite-hash',
      };

      await service.findOneInvitationBySignUpParams(params);

      expect(appTokenRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(
        appTokenRepository.createQueryBuilder().leftJoin,
      ).toHaveBeenCalledWith('appToken.workspace', 'workspace');
      expect(
        appTokenRepository.createQueryBuilder().andWhere,
      ).toHaveBeenCalledWith('workspace.inviteHash = :inviteHash', {
        inviteHash: params.inviteHash,
      });
      expect(
        appTokenRepository.createQueryBuilder().where,
      ).toHaveBeenCalledWith('"appToken"."workspaceId" = :workspaceId', {
        workspaceId: params.workspaceId,
      });
      expect(
        appTokenRepository.createQueryBuilder().andWhere,
      ).toHaveBeenCalledWith('"appToken".type = :type', {
        type: AppTokenType.InvitationToken,
      });
    });

    it('should return an invitation when personalInviteToken is provided and matches', async () => {
      const params = {
        workspaceId: 'workspace2',
        email: 'test@example.com',
        personalInviteToken: 'test-personal-token',
      };

      await service.findOneInvitationBySignUpParams(params);

      expect(appTokenRepository.createQueryBuilder).toHaveBeenCalledTimes(1);

      expect(
        appTokenRepository.createQueryBuilder().andWhere,
      ).toHaveBeenCalledWith(
        '"appToken".context->>\'value\' = :personalInviteToken',
        {
          personalInviteToken: params.personalInviteToken,
        },
      );
      expect(
        appTokenRepository.createQueryBuilder().where,
      ).toHaveBeenCalledWith('"appToken"."workspaceId" = :workspaceId', {
        workspaceId: params.workspaceId,
      });
      expect(
        appTokenRepository.createQueryBuilder().andWhere,
      ).toHaveBeenCalledWith('"appToken".type = :type', {
        type: AppTokenType.InvitationToken,
      });
    });

    it('should filter by workspaceId and email correctly', async () => {
      const params = {
        workspaceId: 'workspace4',
        email: 'another@example.com',
      };

      await Promise.all([service.findOneInvitationBySignUpParams(params)]);

      expect(appTokenRepository.createQueryBuilder).toHaveBeenCalledTimes(1);

      expect(
        appTokenRepository.createQueryBuilder().where,
      ).toHaveBeenCalledWith('"appToken"."workspaceId" = :workspaceId', {
        workspaceId: 'workspace4',
      });
      expect(
        appTokenRepository.createQueryBuilder().andWhere,
      ).toHaveBeenCalledWith('"appToken".context->>\'email\' = :email', {
        email: 'another@example.com',
      });
    });
  });
});
