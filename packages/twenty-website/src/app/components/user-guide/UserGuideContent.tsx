'use client';
import React from 'react';
import styled from '@emotion/styled';

import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { FileContent } from '@/app/get-posts';
import { Theme } from '@/app/ui/theme/theme';
import { DeviceType, useDeviceType } from '@/app/ui/utilities/useDeviceType';

const StyledContainer = styled.div<{ devicetype: string }>`
  width: ${({ devicetype }) =>
    devicetype === DeviceType.TABLET
      ? '70%'
      : devicetype === DeviceType.DESKTOP
        ? '60%'
        : '100%'};
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-family: ${Theme.font.family};
`;

const StyledWrapper = styled.div`
  width: 79.3%;
  padding: ${Theme.spacing(10)} 0px ${Theme.spacing(20)} 0px;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.spacing(8)};
`;

const StyledHeading = styled.div`
  font-size: 40px;
  font-weight: 700;
`;

const StyledHeaderInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.spacing(4)};
`;

const StyledHeaderInfoSectionTitle = styled.div`
  font-size: ${Theme.font.size.sm};
  padding: ${Theme.spacing(2)} 0px;
  color: ${Theme.text.color.secondary};
  font-weight: ${Theme.font.weight.medium};
`;

const StyledHeaderInfoSectionSub = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.spacing(4)};
  color: ${Theme.text.color.tertiary};
  font-family: ${Theme.font.family};
`;

const StyledRectangle = styled.div`
  width: 100%;
  height: 1px;
  background: ${Theme.background.transparent.medium};
`;

export default function UserGuideContent({ item }: { item: FileContent }) {
  const BREADCRUMB_ITEMS = [
    {
      uri: '/user-guide',
      label: 'User Guide',
    },
  ];
  const deviceType = useDeviceType();
  return (
    <StyledContainer devicetype={deviceType}>
      <StyledWrapper>
        <StyledHeader>
          <Breadcrumbs
            items={BREADCRUMB_ITEMS}
            activePage={item.itemInfo.title}
            separator="/"
          />
          <StyledHeading>{item.itemInfo.title}</StyledHeading>
          {item.itemInfo.image && (
            <img
              id={`img-${item.itemInfo.title}`}
              src={item.itemInfo.image}
              alt={item.itemInfo.title}
            />
          )}
          <StyledHeaderInfoSection>
            <StyledHeaderInfoSectionTitle>
              In this article
            </StyledHeaderInfoSectionTitle>
            <StyledHeaderInfoSectionSub>
              {item.itemInfo.info}
            </StyledHeaderInfoSectionSub>
          </StyledHeaderInfoSection>
          <StyledRectangle />
        </StyledHeader>
        <div>{item.content}</div>
      </StyledWrapper>
    </StyledContainer>
  );
}
