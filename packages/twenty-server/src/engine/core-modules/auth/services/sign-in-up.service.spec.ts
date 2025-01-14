import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { DomainManagerService } from 'src/engine/core-modules/domain-manager/service/domain-manager.service';
import { EnvironmentService } from 'src/engine/core-modules/environment/environment.service';
import { SignInUpService } from 'src/engine/core-modules/auth/services/sign-in-up.service';
import { User } from 'src/engine/core-modules/user/user.entity';
import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';
import { WorkspaceInvitationService } from 'src/engine/core-modules/workspace-invitation/services/workspace-invitation.service';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import { OnboardingService } from 'src/engine/core-modules/onboarding/onboarding.service';
import {
  AuthProviderWithPasswordType,
  ExistingUserOrPartialUserWithPicture,
  SignInUpBaseParams,
} from 'src/engine/core-modules/auth/types/signInUp.type';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { AppToken } from 'src/engine/core-modules/app-token/app-token.entity';

describe('SignInUpService', () => {
  let service: SignInUpService;
  let UserRepository: Repository<User>;
  let WorkspaceRepository: Repository<Workspace>;
  let fileUploadService: FileUploadService;
  let workspaceInvitationService: WorkspaceInvitationService;
  let userWorkspaceService: UserWorkspaceService;
  let onboardingService: OnboardingService;
  let httpService: HttpService;
  let environmentService: EnvironmentService;
  let domainManagerService: DomainManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUpService,
        {
          provide: getRepositoryToken(User, 'core'),
          useValue: Repository<User>,
        },
        {
          provide: getRepositoryToken(Workspace, 'core'),
          useValue: Repository<Workspace>,
        },
        { provide: FileUploadService, useValue: {} },
        {
          provide: WorkspaceInvitationService,
          useValue: {},
        },
        {
          provide: UserWorkspaceService,
          useValue: {},
        },
        {
          provide: OnboardingService,
          useValue: {},
        },
        {
          provide: HttpService,
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
      ],
    }).compile();

    service = module.get<SignInUpService>(SignInUpService);
    UserRepository = module.get(getRepositoryToken(User, 'core'));
    WorkspaceRepository = module.get(getRepositoryToken(Workspace, 'core'));
    fileUploadService = module.get<FileUploadService>(FileUploadService);
    workspaceInvitationService = module.get<WorkspaceInvitationService>(
      WorkspaceInvitationService,
    );
    userWorkspaceService =
      module.get<UserWorkspaceService>(UserWorkspaceService);
    onboardingService = module.get<OnboardingService>(OnboardingService);
    httpService = module.get<HttpService>(HttpService);
    environmentService = module.get<EnvironmentService>(EnvironmentService);
    domainManagerService =
      module.get<DomainManagerService>(DomainManagerService);
  });

  it('should handle signInUp with valid personal invitation', async () => {
    const params: SignInUpBaseParams &
      ExistingUserOrPartialUserWithPicture &
      AuthProviderWithPasswordType = {
      invitation: { value: 'invitationToken' } as AppToken,
      workspace: { id: 'workspaceId' } as Workspace,
      authParams: { provider: 'password', password: 'validPassword' },
      userData: {
        type: 'existingUser',
        existingUser: { email: 'test@example.com' } as User,
      },
    };

    jest
      .spyOn(workspaceInvitationService, 'validateInvitation')
      .mockResolvedValue({
        isValid: true,
        workspace: params.workspace as Workspace,
      });

    jest
      .spyOn(workspaceInvitationService, 'invalidateWorkspaceInvitation')
      .mockResolvedValue(undefined);

    jest
      .spyOn(userWorkspaceService, 'addUserToWorkspace')
      .mockResolvedValue({} as User);

    const result = await service.signInUp(params);

    expect(result.workspace).toEqual(params.workspace);
    expect(result.user).toBeDefined();
    expect(workspaceInvitationService.validateInvitation).toHaveBeenCalledWith({
      workspacePersonalInviteToken: 'invitationToken',
      email: 'test@example.com',
    });
    expect(
      workspaceInvitationService.invalidateWorkspaceInvitation,
    ).toHaveBeenCalledWith(
      (params.workspace as Workspace).id,
      'test@example.com',
    );
  });

  it('should handle signInUp on existing workspace without invitation', async () => {
    const params: SignInUpBaseParams &
      ExistingUserOrPartialUserWithPicture &
      AuthProviderWithPasswordType = {
      workspace: { id: 'workspaceId' } as Workspace,
      authParams: { provider: 'password', password: 'validPassword' },
      userData: {
        type: 'existingUser',
        existingUser: { email: 'test@example.com' } as User,
      },
    };

    jest
      .spyOn(userWorkspaceService, 'addUserToWorkspace')
      .mockResolvedValue({} as User);

    const result = await service.signInUp(params);

    expect(result.workspace).toEqual(params.workspace);
    expect(result.user).toBeDefined();
    expect(userWorkspaceService.addUserToWorkspace).toHaveBeenCalled();
  });

  it('should handle signUp on new workspace for a new user', async () => {
    const params: SignInUpBaseParams &
      ExistingUserOrPartialUserWithPicture &
      AuthProviderWithPasswordType = {
      authParams: { provider: 'password', password: 'validPassword' },
      userData: {
        type: 'newUserWithPicture',
        newUserWithPicture: {
          email: 'newuser@example.com',
          picture: 'pictureUrl',
        },
      },
    };

    jest.spyOn(environmentService, 'get').mockReturnValue(false);
    jest.spyOn(WorkspaceRepository, 'count').mockResolvedValue(0);
    jest.spyOn(WorkspaceRepository, 'create').mockReturnValue({} as Workspace);
    jest.spyOn(WorkspaceRepository, 'save').mockResolvedValue({
      id: 'newWorkspaceId',
    } as Workspace);
    jest.spyOn(fileUploadService, 'uploadImage').mockResolvedValue({
      id: '',
      mimeType: '',
      paths: ['path/to/image'],
    });
    jest.spyOn(UserRepository, 'create').mockReturnValue({} as User);
    jest
      .spyOn(UserRepository, 'save')
      .mockResolvedValue({ id: 'newUserId' } as User);
    jest.spyOn(userWorkspaceService, 'create').mockResolvedValue({} as any);

    const result = await service.signInUp(params);

    expect(result.workspace).toBeDefined();
    expect(result.user).toBeDefined();
    expect(WorkspaceRepository.create).toHaveBeenCalled();
    expect(WorkspaceRepository.save).toHaveBeenCalled();
    expect(UserRepository.create).toHaveBeenCalled();
    expect(UserRepository.save).toHaveBeenCalled();
    expect(fileUploadService.uploadImage).toHaveBeenCalled();
  });

  it('should throw an error for invalid params', async () => {
    const params = {} as any;

    await expect(service.signInUp(params)).rejects.toThrow(
      'Invalid sign in up params',
    );
  });
});
