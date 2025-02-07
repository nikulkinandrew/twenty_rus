import { TextInputV2 } from '@/ui/input/components/TextInputV2';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { Controller, useFormContext } from 'react-hook-form';
import { H2Title, Section } from 'twenty-ui';
import { useGetHostnameDetailsQuery } from '~/generated/graphql';
import { SettingsHostnameRecords } from '~/pages/settings/workspace/SettingsHostnameRecords';

const StyledDomainFromWrapper = styled.div`
  align-items: center;
  display: flex;
`;

export const SettingsHostname = () => {
  const { data: getHostnameDetailsData } = useGetHostnameDetailsQuery();

  const { t } = useLingui();

  const { control, getValues } = useFormContext<{
    hostname: string;
  }>();

  return (
    <Section>
      <H2Title title={t`Domain`} description={t`Set the name of your domain`} />
      <StyledDomainFromWrapper>
        <Controller
          name="hostname"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInputV2
              value={value ?? undefined}
              type="text"
              onChange={onChange}
              error={error?.message}
              fullWidth
            />
          )}
        />
      </StyledDomainFromWrapper>
      {getHostnameDetailsData?.getHostnameDetails &&
        getValues('hostname') ===
          getHostnameDetailsData?.getHostnameDetails?.hostname && (
          <SettingsHostnameRecords
            records={getHostnameDetailsData.getHostnameDetails.records}
            hostname={getHostnameDetailsData.getHostnameDetails.hostname}
            status={{
              ssl:
                getHostnameDetailsData.getHostnameDetails.sslStatus ??
                'unknown',
              ownership:
                getHostnameDetailsData.getHostnameDetails.status ?? 'unknown',
            }}
          />
        )}

      {getHostnameDetailsData?.getHostnameDetails?.verificationErrors &&
        getHostnameDetailsData.getHostnameDetails.verificationErrors.length !==
          0 && (
          <pre>
            Errors:{' '}
            {getHostnameDetailsData?.getHostnameDetails?.verificationErrors}
          </pre>
        )}
    </Section>
  );
};
