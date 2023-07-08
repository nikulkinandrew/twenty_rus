import styled from '@emotion/styled';
import { useRecoilState } from 'recoil';

import { Panel } from '../Panel';
import { RightDrawer } from '../right-drawer/components/RightDrawer';
import { isRightDrawerOpenState } from '../right-drawer/states/isRightDrawerOpenState';

type OwnProps = {
  children: JSX.Element;
  topMargin?: number;
  withPanel?: boolean;
};

const MainContainer = styled.div<{ topMargin: number }>`
  background: ${({ theme }) => theme.background.noisy};
  display: flex;

  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)};
  height: calc(100% - ${(props) => props.topMargin}px);

  padding-bottom: ${({ theme }) => theme.spacing(3)};
  padding-right: ${({ theme }) => theme.spacing(3)};
  width: calc(100% - ${({ theme }) => theme.spacing(3)});
`;

type LeftContainerProps = {
  isRightDrawerOpen?: boolean;
};

const LeftContainer = styled.div<LeftContainerProps>`
  display: flex;
  position: relative;
  width: 100%;
`;

export function ContentContainer({
  children,
  topMargin,
  withPanel = true,
}: OwnProps) {
  const [isRightDrawerOpen] = useRecoilState(isRightDrawerOpenState);

  return (
    <MainContainer topMargin={topMargin ?? 0}>
      <LeftContainer isRightDrawerOpen={isRightDrawerOpen}>
        {withPanel ? <Panel>{children}</Panel> : children}
      </LeftContainer>
      <RightDrawer />
    </MainContainer>
  );
}
