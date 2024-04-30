import { ReactElement, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { offset, useFloating } from '@floating-ui/react';
import { motion } from 'framer-motion';
import { Chip, ChipVariant } from 'twenty-ui';

import { AnimationDivProps } from '@/object-record/record-table/record-table-cell/components/RecordTableCellButton.tsx';
import { ChildrenContainer } from '@/ui/display/expandable-list/ChildrenContainer.tsx';
import { getChipContentWidth } from '@/ui/display/expandable-list/getChipContentWidth.ts';
import { DropdownMenu } from '@/ui/layout/dropdown/components/DropdownMenu.tsx';

const GAP_WIDTH = 4;

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: space-between;
  width: 100%;
`;

const StyledRelationsListContainer = styled.div<{ withOutline?: boolean }>`
  backdrop-filter: ${({ theme }) => theme.blur.strong};
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  box-shadow: '0px 2px 4px ${({ theme }) =>
    theme.boxShadow.light}, 2px 4px 16px ${({ theme }) =>
    theme.boxShadow.strong}';
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)};
  outline: ${(props) =>
    props.withOutline
      ? `1px solid ${props.theme.font.color.extraLight}`
      : 'none'};
`;

const StyledAnimatedChipContainer = styled(motion.div)``;

export type ExpandableListProps = {
  isHovered?: boolean;
  reference?: HTMLDivElement;
  forceDisplayHiddenCount?: boolean;
  withOutline?: boolean;
};

export type ChildrenProperty = {
  width: number;
  shrink: number;
  isVisible: boolean;
};

export const ExpandableList = ({
  children,
  isHovered,
  forceDisplayHiddenCount = false,
  reference,
  withOutline = false,
}: {
  children: ReactElement[];
} & ExpandableListProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [childrenProperties, setChildrenProperties] = useState<
    Record<number, ChildrenProperty>
  >({});

  // Because Chip width depends on the number of hidden children which depends on the Chip width, we have a circular dependency
  // To avoid it, we set the Chip width and make sure it can display its content (a number greater than 1)
  const chipContentWidth = getChipContentWidth(children.length);
  const chipContainerWidth = chipContentWidth + 2 * GAP_WIDTH; // Because Chip component has 4px padding-left and right
  const availableWidth = containerWidth - (chipContainerWidth + GAP_WIDTH); // Because there is a 4px gap between ChildrenContainer and ChipContainer

  const hiddenChildrenCount = Object.values(childrenProperties).filter(
    (childProperties) => !childProperties.isVisible,
  ).length;

  const isFocusedMode =
    (isHovered || forceDisplayHiddenCount) &&
    Object.values(childrenProperties).length > 0;

  const displayHiddenCountChip = isFocusedMode && hiddenChildrenCount > 0;

  const { refs, floatingStyles } = useFloating({
    // @ts-expect-error placement accepts 'start' as value even if the typing does not permit it
    placement: 'start',
    middleware: [offset({ mainAxis: -1, crossAxis: -1 })],
    elements: { reference },
  });

  const openDropdownMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDropdownMenuOpen(true);
  };

  useEffect(() => {
    if (!isHovered) {
      setIsDropdownMenuOpen(false);
    }
  }, [isHovered]);

  useEffect(() => {
    if (isFocusedMode) {
      let cumulatedChildrenWidth = 0;
      Object.values(childrenProperties).forEach((childProperties, index) => {
        // Because there is a 4px gap between children
        const childWidth = childProperties.width + GAP_WIDTH;
        let shrink = 1;
        let isVisible = true;

        if (cumulatedChildrenWidth > availableWidth) {
          isVisible = false;
        } else if (cumulatedChildrenWidth + childWidth <= availableWidth) {
          shrink = 0;
        }
        setChildrenProperties((prevState) => {
          return {
            ...prevState,
            [index]: { width: prevState[index].width, shrink, isVisible },
          };
        });
        cumulatedChildrenWidth += childWidth;
      });
    }
  }, [isFocusedMode, childrenProperties, availableWidth]);

  return (
    <StyledContainer
      ref={(el) => {
        if (!el) return;
        setContainerWidth(el.getBoundingClientRect().width);
      }}
    >
      <ChildrenContainer
        childrenProperties={childrenProperties}
        setChildrenProperties={setChildrenProperties}
        isFocusedMode={isFocusedMode}
      >
        {children}
      </ChildrenContainer>
      {displayHiddenCountChip && (
        <StyledAnimatedChipContainer
          initial={AnimationDivProps.initial}
          animate={AnimationDivProps.animate}
          transition={AnimationDivProps.transition}
          whileHover={AnimationDivProps.whileHover}
        >
          <Chip
            label={`+${hiddenChildrenCount}`}
            variant={ChipVariant.Highlighted}
            onClick={openDropdownMenu}
            width={chipContentWidth}
          />
        </StyledAnimatedChipContainer>
      )}
      {isDropdownMenuOpen && (
        <DropdownMenu
          ref={refs.setFloating}
          style={floatingStyles}
          width={
            reference
              ? Math.max(220, reference.getBoundingClientRect().width)
              : undefined
          }
        >
          <StyledRelationsListContainer withOutline={withOutline}>
            {children}
          </StyledRelationsListContainer>
        </DropdownMenu>
      )}
    </StyledContainer>
  );
};
