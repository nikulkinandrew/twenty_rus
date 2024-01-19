import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

import { SignInBackgroundMockPage } from '@/sign-in-background-mock/components/SignInBackgroundMockPage';
import { MainButton } from '@/ui/input/button/components/MainButton';
import AnimatedPlaceholder from '@/ui/layout/animated-placeholder/components/AnimatedPlaceholder';
import {
  StyledEmptyTextContainer,
  StyledErrorSubTitle,
  StyledErrorTitle,
} from '@/ui/layout/animated-placeholder/components/EmptyPlaceholderStyles';

const StyledBackDrop = styled.div`
  align-items: center;
  backdrop-filter: ${({ theme }) => theme.blur.light};
  background: ${({ theme }) => theme.background.transparent.secondary};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10000;
`;

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(15)};
  gap: ${({ theme }) => theme.spacing(6)};
`;

const StyledButtonContainer = styled.div`
  width: 200px;
`;

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <StyledBackDrop>
        <StyledContainer>
          <AnimatedPlaceholder type="error404" />
          <StyledEmptyTextContainer>
            <StyledErrorTitle>Unexpected Pit Stop</StyledErrorTitle>
            <StyledErrorSubTitle>
              We have been notified and working on a fix.
            </StyledErrorSubTitle>
          </StyledEmptyTextContainer>
          <StyledButtonContainer>
            <MainButton
              title="Back to content"
              fullWidth
              onClick={() => navigate('/')}
            />
          </StyledButtonContainer>
        </StyledContainer>
      </StyledBackDrop>
      <SignInBackgroundMockPage />
    </>
  );
};
