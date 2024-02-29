import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Stripe from 'stripe';
import { Repository } from 'typeorm';

import { EnvironmentService } from 'src/integrations/environment/environment.service';
import { StripeService } from 'src/core/billing/stripe/stripe.service';
import { BillingSubscription } from 'src/core/billing/entities/billing-subscription.entity';
import { BillingSubscriptionItem } from 'src/core/billing/entities/billing-subscription-item.entity';
import { Workspace } from 'src/core/workspace/workspace.entity';
import { ProductPriceEntity } from 'src/core/billing/dto/product-price.entity';
import { User } from 'src/core/user/user.entity';
import { assert } from 'src/utils/assert';
import {
  FeatureFlagEntity,
  FeatureFlagKeys,
} from 'src/core/feature-flag/feature-flag.entity';

export enum AvailableProduct {
  BasePlan = 'base-plan',
}

export enum WebhookEvent {
  CUSTOMER_SUBSCRIPTION_CREATED = 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
}

@Injectable()
export class BillingService {
  protected readonly logger = new Logger(BillingService.name);
  constructor(
    private readonly stripeService: StripeService,
    private readonly environmentService: EnvironmentService,
    @InjectRepository(BillingSubscription, 'core')
    private readonly billingSubscriptionRepository: Repository<BillingSubscription>,
    @InjectRepository(BillingSubscriptionItem, 'core')
    private readonly billingSubscriptionItemRepository: Repository<BillingSubscriptionItem>,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(FeatureFlagEntity, 'core')
    private readonly featureFlagRepository: Repository<FeatureFlagEntity>,
  ) {}

  getProductStripeId(product: AvailableProduct) {
    if (product === AvailableProduct.BasePlan) {
      return this.environmentService.getBillingStripeBasePlanProductId();
    }
  }

  async getProductPrices(stripeProductId: string) {
    const productPrices = await this.stripeService.stripe.prices.search({
      query: `product: '${stripeProductId}'`,
    });

    return this.formatProductPrices(productPrices.data);
  }

  formatProductPrices(prices: Stripe.Price[]) {
    const result: Record<string, ProductPriceEntity> = {};

    prices.forEach((item) => {
      const interval = item.recurring?.interval;

      if (!interval || !item.unit_amount) {
        return;
      }
      if (
        !result[interval] ||
        item.created > (result[interval]?.created || 0)
      ) {
        result[interval] = {
          unitAmount: item.unit_amount,
          recurringInterval: interval,
          created: item.created,
          stripePriceId: item.id,
        };
      }
    });

    return Object.values(result).sort((a, b) => a.unitAmount - b.unitAmount);
  }

  async getBillingSubscription(workspaceId: string) {
    return await this.billingSubscriptionRepository.findOneOrFail({
      where: { workspaceId },
      relations: ['billingSubscriptionItems'],
    });
  }

  async getBillingSubscriptionItem(
    workspaceId: string,
    stripeProductId = this.environmentService.getBillingStripeBasePlanProductId(),
  ) {
    const billingSubscription = await this.getBillingSubscription(workspaceId);

    const billingSubscriptionItem =
      billingSubscription.billingSubscriptionItems.filter(
        (billingSubscriptionItem) =>
          billingSubscriptionItem.stripeProductId === stripeProductId,
      )?.[0];

    if (!billingSubscriptionItem) {
      throw new Error(
        `Cannot find billingSubscriptionItem for product ${stripeProductId} for workspace ${workspaceId}`,
      );
    }

    return billingSubscriptionItem;
  }

  async checkout(user: User, priceId: string, successUrlPath?: string) {
    const frontBaseUrl = this.environmentService.getFrontBaseUrl();
    const session = await this.stripeService.stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          workspaceId: user.defaultWorkspace.id,
        },
      },
      customer_email: user.email,
      success_url: successUrlPath
        ? frontBaseUrl + successUrlPath
        : frontBaseUrl,
      cancel_url: frontBaseUrl,
    });

    assert(session.url, 'Error: missing checkout.session.url');

    this.logger.log(`Stripe Checkout Session Url Redirection: ${session.url}`);

    return session.url;
  }

  async upsertBillingSubscription(
    workspaceId: string,
    data:
      | Stripe.CustomerSubscriptionUpdatedEvent.Data
      | Stripe.CustomerSubscriptionCreatedEvent.Data,
  ) {
    await this.billingSubscriptionRepository.upsert(
      {
        workspaceId: workspaceId,
        stripeCustomerId: data.object.customer as string,
        stripeSubscriptionId: data.object.id,
        status: data.object.status,
      },
      {
        conflictPaths: ['stripeSubscriptionId'],
        skipUpdateIfNoValuesChanged: true,
      },
    );

    await this.workspaceRepository.update(workspaceId, {
      subscriptionStatus: data.object.status,
    });

    const billingSubscription = await this.getBillingSubscription(workspaceId);

    await this.billingSubscriptionItemRepository.upsert(
      data.object.items.data.map((item) => {
        return {
          billingSubscriptionId: billingSubscription.id,
          stripeProductId: item.price.product as string,
          stripePriceId: item.price.id,
          stripeSubscriptionItemId: item.id,
          quantity: item.quantity,
        };
      }),
      {
        conflictPaths: ['stripeSubscriptionItemId', 'billingSubscriptionId'],
        skipUpdateIfNoValuesChanged: true,
      },
    );
  }

  async updateBillingSubscriptionQuantity(
    workspaceId: string,
    quantity: number,
  ) {
    const isSelfBillingEnabled = await this.featureFlagRepository.findOneBy({
      workspaceId: workspaceId,
      key: FeatureFlagKeys.IsSelfBillingEnabled,
      value: true,
    });

    if (isSelfBillingEnabled) {
      const billingSubscriptionItem =
        await this.getBillingSubscriptionItem(workspaceId);

      await this.stripeService.stripe.subscriptionItems.update(
        billingSubscriptionItem.stripeSubscriptionItemId,
        { quantity },
      );
    }
  }
}
