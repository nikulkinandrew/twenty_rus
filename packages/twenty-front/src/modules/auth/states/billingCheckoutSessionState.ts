import { BillingCheckoutSession } from '@/auth/types/billingCheckoutSession.type';
import { BILLING_CHECKOUT_SESSION_DEFAULT_VALUE } from '@/billing/constants/BillingCheckoutSessionDefaultValue';
import { syncEffect } from 'recoil-sync';
import { createState } from 'twenty-shared';

export const billingCheckoutSessionState = createState<BillingCheckoutSession>({
  key: 'billingCheckoutSessionState',
  defaultValue: BILLING_CHECKOUT_SESSION_DEFAULT_VALUE,
  effects: [
    syncEffect({
      refine: (value: unknown) => {
        if (
          typeof value === 'object' &&
          value !== null &&
          'plan' in value &&
          'interval' in value &&
          'requirePaymentMethod' in value
        ) {
          return {
            type: 'success',
            value: value as BillingCheckoutSession,
            warnings: [],
          } as const;
        }
        return {
          type: 'failure',
          message: 'Invalid BillingCheckoutSessionState',
          path: [] as any,
        } as const;
      },
    }),
  ],
});
