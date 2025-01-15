import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  AnimatedEaseIn,
  IconCheck,
  isDefined,
  MainButton,
  RGBA,
  UndecoratedLink,
} from 'twenty-ui';

import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { currentUserState } from '@/auth/states/currentUserState';
import {
  OnboardingStatus,
  useGetCurrentUserLazyQuery,
} from '~/generated/graphql';
import { useSubscriptionStatus } from '@/workspace/hooks/useSubscriptionStatus';
import { AppPath } from '@/types/AppPath';

const StyledCheckContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  border: 2px solid ${(props) => props.color};
  border-radius: ${({ theme }) => theme.border.radius.rounded};
  box-shadow: ${(props) =>
    props.color && `-4px 4px 0 -2px ${RGBA(props.color, 1)}`};
  height: 36px;
  width: 36px;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(8)};
`;

export const PaymentSuccess = () => {
  const theme = useTheme();
  const currentUser = useRecoilValue(currentUserState);
  const subscriptionStatus = useSubscriptionStatus();
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);
  const color =
    theme.name === 'light' ? theme.grayScale.gray90 : theme.grayScale.gray10;

  const checkSubscriptionStatus = async () => {
    if (!isDefined(subscriptionStatus)) {
      const result = await getCurrentUser({ fetchPolicy: 'network-only' });
      const currentUser = result.data?.currentUser;
      if (isDefined(currentUser)) {
        setCurrentUser(currentUser);
      }
    }
  };

  const onClick = async () => {
    await checkSubscriptionStatus();
  };

  if (currentUser?.onboardingStatus === OnboardingStatus.Completed) {
    return <></>;
  }

  return (
    <>
      <AnimatedEaseIn>
        <StyledCheckContainer color={color}>
          <IconCheck color={color} size={24} stroke={3} />
        </StyledCheckContainer>
      </AnimatedEaseIn>
      <Title>All set!</Title>
      <SubTitle>Your account has been activated.</SubTitle>
      <StyledButtonContainer>
        <UndecoratedLink onClick={onClick} to={AppPath.CreateWorkspace}>
          <MainButton title="Start" width={200} />
        </UndecoratedLink>
      </StyledButtonContainer>
    </>
  );
};
