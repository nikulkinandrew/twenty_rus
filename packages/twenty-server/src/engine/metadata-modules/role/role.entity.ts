import { Field } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { UserWorkspaceRoleEntity } from 'src/engine/metadata-modules/role/user-workspace-role.entity';

@Entity('role')
export class RoleEntity {
  @Field({ nullable: false })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: false })
  @Column({ nullable: false })
  label: string;

  @Column({ nullable: false, default: false })
  canUpdateAllSettings: boolean;

  @Field({ nullable: false })
  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'uuid' })
  workspaceId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field({ nullable: false })
  @Column({ nullable: false, default: true })
  isEditable: boolean;

  @OneToMany(
    () => UserWorkspaceRoleEntity,
    (userWorkspaceRole: UserWorkspaceRoleEntity) => userWorkspaceRole.role,
  )
  userWorkspaceRoles: Relation<UserWorkspaceRoleEntity[]>;
}
