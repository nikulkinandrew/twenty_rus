import { Field, ObjectType } from '@nestjs/graphql';

import { IDField } from '@ptc-org/nestjs-query-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { BillingCustomer } from 'src/engine/core-modules/billing/entities/billing-customer.entity';
import { BillingEntitlementKey } from 'src/engine/core-modules/billing/enums/billing-entitlement-key.enum';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
@Entity({ name: 'billingEntitlement', schema: 'core' })
@ObjectType('billingEntitlement')
@Unique('IndexOnFeatureKeyAndWorkspaceIdUnique', ['key', 'workspaceId'])
export class BillingEntitlement {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ nullable: false, type: 'text' })
  key: BillingEntitlementKey;

  @Field()
  @Column({ nullable: false, type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.billingEntitlements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  workspace: Relation<Workspace>;

  @Column({ nullable: false })
  stripeCustomerId: string;

  @Field()
  @Column({ nullable: false })
  value: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  // TODO: Because we haven't populated the billingCustomer table yet, this table is not updated
  // Strategy: if no customer in db, we will get it from Stripe and save it in db before saving the entitlement
  @ManyToOne(
    () => BillingCustomer,
    (billingCustomer) => billingCustomer.billingEntitlements,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    referencedColumnName: 'stripeCustomerId',
    name: 'stripeCustomerId',
  })
  billingCustomer: Relation<BillingCustomer>;
}
