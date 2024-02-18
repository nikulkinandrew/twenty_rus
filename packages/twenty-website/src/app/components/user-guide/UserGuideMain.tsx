'use client';
import styled from '@emotion/styled';

import UserGuideCard from '@/app/components/user-guide/UserGuideCard';
import { Theme } from '@/app/ui/theme/theme';
import { DeviceType, useDeviceType } from '@/app/ui/utilities/useDeviceType';
import { UserGuideHomeCards } from '@/app/user-guide/constants/UserGuideHomeCards';

const StyledContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const StyledWrapper = styled.div`
  width: 79.3%;
  padding: ${Theme.spacing(10)} 0px ${Theme.spacing(20)} 0px;
  display: flex;
  flex-direction: column;
  gap: ${Theme.spacing(8)};
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const StyledHeading = styled.h1`
  line-height: 38px;
  font-weight: 700;
  font-size: 38px;
  color: ${Theme.text.color.primary};
  margin: 0px;
`;

const StyledSubHeading = styled.h1`
  line-height: 12px;
  font-family: ${Theme.font.family};
  font-size: ${Theme.font.size.sm};
  font-weight: ${Theme.font.weight.regular};
  color: ${Theme.text.color.tertiary};
`;

const StyledContentGrid = styled.div`
  width: 100%;
  padding-top: ${Theme.spacing(6)};
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto auto;
  gap: ${Theme.spacing(6)};
`;

const StyledContentFlex = styled.div`
  width: 100%;
  padding-top: ${Theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${Theme.spacing(6)};
`;

export default function UserGuideMain() {
  const deviceType = useDeviceType();
  return (
    <StyledContainer>
      <StyledWrapper>
        <StyledHeader>
          <StyledHeading>User Guide</StyledHeading>
          <StyledSubHeading>
            A brief guide to grasp the basics of Twenty
          </StyledSubHeading>
        </StyledHeader>
        {deviceType === DeviceType.DESKTOP ? (
          <StyledContentGrid>
            {UserGuideHomeCards.map((card) => {
              return <UserGuideCard key={card.title} card={card} />;
            })}
          </StyledContentGrid>
        ) : (
          <StyledContentFlex>
            {UserGuideHomeCards.map((card) => {
              return <UserGuideCard key={card.title} card={card} />;
            })}
          </StyledContentFlex>
        )}
      </StyledWrapper>
    </StyledContainer>
  );
}
