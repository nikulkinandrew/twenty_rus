import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { Repository } from 'typeorm';

import { assert } from 'src/utils/assert';
import { User } from 'src/coreV2/user/user.entity';

export class UserService extends TypeOrmQueryService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async deleteUser({
    workspaceId: _workspaceId,
    userId,
  }: {
    workspaceId: string;
    userId: string;
  }) {
    // const { workspaceMember, refreshToken } = this.prismaService.client;

    // const queryRunner =
    //   this.userRepository.manager.connection.createQueryRunner();
    // await queryRunner.connect();

    const user = await this.findById(userId);
    assert(user, 'User not found');

    // FIXME: Workspace entity is not defined
    // const workspace = await queryRunner.manager.findOneBy(Workspace, {
    //   id: userId,
    // });
    // assert(workspace, 'Workspace not found');

    // const workSpaceMembers = await queryRunner.manager.findBy(WorkspaceMember, {
    //   workspaceId,
    // });

    // const isLastMember =
    //   workSpaceMembers.length === 1 && workSpaceMembers[0].userId === userId;

    // if (isLastMember) {
    //   // FIXME: workspaceService is not defined
    //   await this.workspaceService.deleteWorkspace({
    //     workspaceId,
    //   });
    // } else {
    //   await queryRunner.startTransaction();

    //   // FIXME: these other entities are not defined
    //   await queryRunner.manager.delete(WorkspaceMember, {
    //     userId,
    //   });
    //   await queryRunner.manager.delete(RefreshToken, {
    //     userId,
    //   });
    //   await queryRunner.manager.delete(User, {
    //     id: userId,
    //   });
    //   await queryRunner.commitTransaction();

    //   await queryRunner.release();
    // }

    return user;
  }
}
