import { ReactElement } from 'react';
import styled from '@emotion/styled';
import { ScrollWrapper, useIsMobile } from 'twenty-ui';

const StyledOuterContainer = styled.div`
  display: flex;

  gap: ${({ theme }) => (useIsMobile() ? theme.spacing(3) : '0')};
  height: ${() => (useIsMobile() ? '100%' : '100%')};
  overflow-x: ${() => (useIsMobile() ? 'hidden' : 'auto')};
  width: 100%;
`;

const StyledInnerContainer = styled.div`
  display: flex;
  flex-direction: ${() => (useIsMobile() ? 'column' : 'row')};
  width: 100%;
`;

const StyledScrollWrapper = styled(ScrollWrapper)`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.border.radius.md};
`;

export type ShowPageContainerProps = {
  children: ReactElement[] | ReactElement;
};

export const ShowPageContainer = ({ children }: ShowPageContainerProps) => {
  const isMobile = useIsMobile();
  return isMobile ? (
    <StyledOuterContainer>
      <StyledScrollWrapper>
        <StyledInnerContainer>{children}</StyledInnerContainer>
      </StyledScrollWrapper>
    </StyledOuterContainer>
  ) : (
    <StyledOuterContainer>
      <StyledInnerContainer>{children}</StyledInnerContainer>
    </StyledOuterContainer>
  );
};
