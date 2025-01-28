import { H2Title, Section } from 'twenty-ui';
import { TextInputV2 } from '@/ui/input/components/TextInputV2';
import { Controller, useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';

import { isDefined } from '~/utils/isDefined';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useRecoilValue } from 'recoil';
import { z } from 'zod';

const StyledDomainFromWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const StyledDomain = styled.h2`
  align-self: flex-start;
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  margin: ${({ theme }) => theme.spacing(2)};
  white-space: nowrap;
`;

export const SettingsSubdomain = () => {
  const domainConfiguration = useRecoilValue(domainConfigurationState);
  const { t } = useLingui();

  const validationSchema = z
    .object({
      subdomain: z
        .string()
        .min(3, { message: t`Subdomain can not be shorter than 3 characters` })
        .max(30, { message: t`Subdomain can not be longer than 30 characters` })
        .regex(/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/, {
          message: t`Use letter, number and dash only. Start and finish with a letter or a number`,
        }),
    })
    .required();

  const { control } = useFormContext<{
    subdomain: string;
  }>();

  return (
    <Section>
      <H2Title
        title={t`Subdomain`}
        description={t`Set the name of your subdomain`}
      />
      <StyledDomainFromWrapper>
        <Controller
          name="subdomain"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextInputV2
                value={value}
                type="text"
                onChange={onChange}
                error={error?.message}
                fullWidth
              />
              {isDefined(domainConfiguration.frontDomain) && (
                <StyledDomain>
                  {`.${domainConfiguration.frontDomain}`}
                </StyledDomain>
              )}
            </>
          )}
        />
      </StyledDomainFromWrapper>
    </Section>
  );
};
