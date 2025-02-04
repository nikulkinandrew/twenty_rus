import { isGoogleMessagingEnabledState } from '@/client-config/states/isGoogleMessagingEnabledState';
import { isMicrosoftMessagingEnabledState } from '@/client-config/states/isMicrosoftMessagingEnabledState';
import { useTriggerApisOAuth } from '@/settings/accounts/hooks/useTriggerApiOAuth';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { useRecoilValue } from 'recoil';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconGoogle,
  IconMicrosoft,
} from 'twenty-ui';

const StyledHeader = styled(CardHeader)`
  align-items: center;
  display: flex;
  height: ${({ theme }) => theme.spacing(6)};
`;

const StyledBody = styled(CardContent)`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

type SettingsAccountsListEmptyStateCardProps = {
  label?: string;
};

export const SettingsAccountsListEmptyStateCard = ({
  label,
}: SettingsAccountsListEmptyStateCardProps) => {
  const { triggerApisOAuth } = useTriggerApisOAuth();

  const { t } = useLingui();

  const isGoogleMessagingEnabled = useRecoilValue(
    isGoogleMessagingEnabledState,
  );
  const isMicrosoftMessagingEnabled = useRecoilValue(
    isMicrosoftMessagingEnabledState,
  );

  return (
    <Card>
      <StyledHeader>{label || t`No connected account`}</StyledHeader>
      <StyledBody>
        {isGoogleMessagingEnabled && (
          <Button
            Icon={IconGoogle}
            title={t`Connect with Google`}
            variant="secondary"
            onClick={() => triggerApisOAuth('google')}
          />
        )}

        {isMicrosoftMessagingEnabled && (
          <Button
            Icon={IconMicrosoft}
            title={t`Connect with Microsoft`}
            variant="secondary"
            onClick={() => triggerApisOAuth('microsoft')}
          />
        )}
      </StyledBody>
    </Card>
  );
};
