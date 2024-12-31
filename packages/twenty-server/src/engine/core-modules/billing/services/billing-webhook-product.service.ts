import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Stripe from 'stripe';
import { Repository } from 'typeorm';

import { BillingProduct } from 'src/engine/core-modules/billing/entities/billing-product.entity';
import { isStripeValidProductMetadata } from 'src/engine/core-modules/billing/utils/is-stripe-valid-product-metadata.util';
import { transformStripeProductEventToProductRepositoryData } from 'src/engine/core-modules/billing/utils/transform-stripe-product-event-to-product-repository-data.util';
@Injectable()
export class BillingWebhookProductService {
  protected readonly logger = new Logger(BillingWebhookProductService.name);
  constructor(
    @InjectRepository(BillingProduct, 'core')
    private readonly billingProductRepository: Repository<BillingProduct>,
  ) {}

  async processStripeEvent(
    data: Stripe.ProductCreatedEvent.Data | Stripe.ProductUpdatedEvent.Data,
  ) {
    const metadata = data.object.metadata;
    const productRepositoryData = isStripeValidProductMetadata(metadata)
      ? {
          ...transformStripeProductEventToProductRepositoryData(data),
          metadata,
        }
      : transformStripeProductEventToProductRepositoryData(data);

    await this.billingProductRepository.upsert(productRepositoryData, {
      conflictPaths: ['stripeProductId'],
      skipUpdateIfNoValuesChanged: true,
    });
  }

  isStripeValidProductMetadata(
    metadata: Stripe.Metadata,
  ): metadata is BillingProductMetadata {
    if (Object.keys(metadata).length === 0) {
      return true;
    }
    const hasBillingPlanKey = this.isValidBillingPlanKey(metadata?.planKey);
    const hasPriceUsageBased = this.isValidPriceUsageBased(
      metadata?.priceUsageBased,
    );

    return hasBillingPlanKey && hasPriceUsageBased;
  }

  isValidBillingPlanKey(planKey?: string) {
    switch (planKey) {
      case BillingPlanKey.BASE:
        return true;
      case BillingPlanKey.PRO:
        return true;
      default:
        return false;
    }
  }

  isValidPriceUsageBased(priceUsageBased?: string) {
    switch (priceUsageBased) {
      case BillingUsageType.METERED:
        return true;
      case BillingUsageType.LICENSED:
        return true;
      default:
        return false;
    }
  }
}
