import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Stripe from 'stripe';
import { Repository } from 'typeorm';

import {
  BillingException,
  BillingExceptionCode,
} from 'src/engine/core-modules/billing/billing.exception';
import { BillingEntitlement } from 'src/engine/core-modules/billing/entities/billing-entitlement.entity';
import { BillingSubscription } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { transformStripeEntitlementEventToEntitlementRepositoryData } from 'src/engine/core-modules/billing/utils/billing-webhook-entitlement-transformer.util';
@Injectable()
export class BillingWebhookEntitlementService {
  protected readonly logger = new Logger(BillingWebhookEntitlementService.name);
  constructor(
    @InjectRepository(BillingSubscription, 'core')
    private readonly billingSubscriptionRepository: Repository<BillingSubscription>,
    @InjectRepository(BillingEntitlement, 'core')
    private readonly billingEntitlementRepository: Repository<BillingEntitlement>,
  ) {}

  async processCustomerActiveEntitlement(
    data: Stripe.EntitlementsActiveEntitlementSummaryUpdatedEvent.Data,
  ) {
    const billingSubscription =
      await this.billingSubscriptionRepository.findOne({
        where: { stripeCustomerId: data.object.customer },
      });

    if (!billingSubscription) {
      throw new BillingException(
        'Billing customer not found',
        BillingExceptionCode.BILLING_CUSTOMER_NOT_FOUND,
      );
    }

    const workspaceId = billingSubscription.workspaceId;

    await this.billingEntitlementRepository.upsert(
      transformStripeEntitlementEventToEntitlementRepositoryData(
        workspaceId,
        data,
      ),
      {
        conflictPaths: ['workspaceId', 'key'],
        skipUpdateIfNoValuesChanged: true,
      },
    );
  }
}
