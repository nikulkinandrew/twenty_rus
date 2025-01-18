import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { SettingsPath } from '@/types/SettingsPath';
import { isDefined } from 'twenty-ui';
import { useBillingPortalSessionQuery } from '~/generated/graphql';
import { settingsLink } from '~/utils/navigation/settingsLink';

export const InformationBannerFailPaymentInfo = () => {
  const { data, loading } = useBillingPortalSessionQuery({
    variables: {
      returnUrlPath: settingsLink(SettingsPath.Billing),
    },
  });

  const openBillingPortal = () => {
    if (isDefined(data) && isDefined(data.billingPortalSession.url)) {
      window.location.replace(data.billingPortalSession.url);
    }
  };

  return (
    <InformationBanner
      variant="danger"
      message={'Last payment failed. Please update your billing details.'}
      buttonTitle="Update"
      buttonOnClick={() => openBillingPortal()}
      isButtonDisabled={loading || !isDefined(data)}
    />
  );
};
