import Stripe from 'stripe';
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

import { BillingSubscription } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
@Entity({ name: 'billingSubscriptionItem', schema: 'core' })
@Unique('IndexOnStripeSubscriptionIdAndStripeProductIdUnique', [
  'stripeSubscriptionId',
  'stripeProductId',
])
@Unique('IndexOnStripeSubscriptionIdAndStripeSubscriptionItemIdUnique', [
  'stripeSubscriptionId',
  'stripeSubscriptionItemId',
])
export class BillingSubscriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: false })
  stripeSubscriptionId: string;

  @Column({ nullable: false, type: 'jsonb', default: {} })
  metadata: Stripe.Metadata;

  @Column({ nullable: true, type: 'jsonb' })
  billingThresholds: Stripe.SubscriptionItem.BillingThresholds;

  @ManyToOne(
    () => BillingSubscription,
    (billingSubscription) => billingSubscription.billingSubscriptionItems,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    referencedColumnName: 'stripeSubscriptionId',
    name: 'stripeSubscriptionId',
  })
  billingSubscription: Relation<BillingSubscription>;

  @Column({ nullable: false })
  stripeProductId: string;

  @Column({ nullable: false })
  stripePriceId: string;

  @Column({ nullable: false, unique: true })
  stripeSubscriptionItemId: string;

  @Column({ nullable: true })
  quantity: number;
}
