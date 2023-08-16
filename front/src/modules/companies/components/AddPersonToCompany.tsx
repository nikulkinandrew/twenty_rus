import { useState } from 'react';
import { getOperationName } from '@apollo/client/utilities';
import styled from '@emotion/styled';
import { autoUpdate, flip, offset, useFloating } from '@floating-ui/react';
import { IconPlus } from '@tabler/icons-react';

import {
  PeoplePicker,
  PersonForSelect,
} from '@/people/components/PeoplePicker';
import { GET_PEOPLE } from '@/people/graphql/queries/getPeople';
import {
  Button,
  ButtonSize,
  ButtonVariant,
} from '@/ui/button/components/Button';
import { RecoilScope } from '@/ui/utilities/recoil-scope/components/RecoilScope';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useUpdateOnePersonMutation } from '~/generated/graphql';

const StyledButton = styled(Button)`
  &:focus {
    color: ${({ theme }) => theme.grayScale.gray40};
  }
`;

const StyledDropdownContainer = styled.div<{ isMobile: boolean }>`
  left: unset !important;
  right: ${({ isMobile }) => (isMobile ? '0' : 'unset')};
  top: 35px !important;
`;

const StyledContainer = styled.div`
  position: relative;
`;

export function AddPersonToCompany({
  companyId,
  peopleIds,
}: {
  companyId: string;
  peopleIds?: string[];
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [updatePerson] = useUpdateOnePersonMutation();
  const isMobile = useIsMobile();
  const { refs, floatingStyles } = useFloating({
    strategy: 'absolute',
    middleware: [offset(10), flip()],
    whileElementsMounted: autoUpdate,
    placement: 'right-start',
  });

  function handlePersonSelected(companyId: string) {
    return async (newPerson: PersonForSelect | null) => {
      if (newPerson) {
        await updatePerson({
          variables: {
            where: {
              id: newPerson.id,
            },
            data: {
              company: { connect: { id: companyId } },
            },
          },
          refetchQueries: [getOperationName(GET_PEOPLE) ?? ''],
        });
        setIsDropdownOpen(false);
      }
    };
  }

  function handleCancel() {
    if (isDropdownOpen) setIsDropdownOpen(false);
  }

  return (
    <RecoilScope>
      <StyledContainer>
        <StyledButton
          icon={<IconPlus size={14} />}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          size={ButtonSize.Small}
          variant={ButtonVariant.Tertiary}
        />

        {isDropdownOpen && (
          <StyledDropdownContainer
            isMobile={isMobile}
            ref={refs.setFloating}
            style={floatingStyles}
          >
            <PeoplePicker
              personId={''}
              onSubmit={handlePersonSelected(companyId)}
              onCancel={handleCancel}
              excludePersonIds={peopleIds}
            />
          </StyledDropdownContainer>
        )}
      </StyledContainer>
    </RecoilScope>
  );
}
