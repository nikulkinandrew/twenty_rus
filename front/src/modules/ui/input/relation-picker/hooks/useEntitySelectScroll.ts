import scrollIntoView from 'scroll-into-view';
import { Key } from 'ts-key-enum';

import { useScopedHotkeys } from '@/ui/utilities/hotkey/hooks/useScopedHotkeys';
import { useRecoilScopedState } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopedState';

import { relationPickerHoverIndexScopedState } from '../states/relationPickerHoverIndexScopedState';
import { EntityForSelect } from '../types/EntityForSelect';
import { RelationPickerHotkeyScope } from '../types/RelationPickerHotkeyScope';

export const useEntitySelectScroll = <
  CustomEntityForSelect extends EntityForSelect,
>({
  containerRef,
  entities,
  createButtonRef,
}: {
  entities: CustomEntityForSelect[];
  containerRef: React.RefObject<HTMLDivElement>;
  createButtonRef?: React.MutableRefObject<HTMLLIElement | null>;
}) => {
  const [relationPickerHoverIndex, setRelationPickerHoverIndex] =
    useRecoilScopedState(relationPickerHoverIndexScopedState);

  const hoveredClass = 'hovered';

  const addClass = () => {
    createButtonRef?.current?.classList.add(hoveredClass);
    createButtonRef?.current?.focus();
  };
  const removeClass = () =>
    createButtonRef?.current?.classList.remove(hoveredClass);

  const resetScroll = () => {
    setRelationPickerHoverIndex(0);

    const currentHoveredRef = containerRef.current?.children[0] as HTMLElement;

    scrollIntoView(currentHoveredRef, {
      align: {
        top: 0,
      },
      isScrollable: (target) => {
        return target === containerRef.current;
      },
      time: 0,
    });
  };

  const addButtonAndIncrementHover = () => {
    if (createButtonRef) {
      addClass();
      setRelationPickerHoverIndex((prevSelectedIndex) =>
        Math.min(prevSelectedIndex + 1, entities.length),
      );
    }
  };

  const incrementHoverAndScrollIntoView = () => {
    setRelationPickerHoverIndex((prevSelectedIndex) =>
      Math.min(prevSelectedIndex + 1, (entities?.length ?? 0) - 1),
    );

    const currentHoveredRef = containerRef.current?.children[
      relationPickerHoverIndex
    ] as HTMLElement;

    if (currentHoveredRef) {
      scrollIntoView(currentHoveredRef, {
        align: {
          top: 0.15,
        },
        isScrollable: (target) => target === containerRef.current,
        time: 0,
      });
    }
  };

  useScopedHotkeys(
    Key.ArrowUp,
    () => {
      if (relationPickerHoverIndex === entities.length) {
        removeClass();
      }
      setRelationPickerHoverIndex((prevSelectedIndex) =>
        Math.max(prevSelectedIndex - 1, 0),
      );

      const currentHoveredRef = containerRef.current?.children[
        relationPickerHoverIndex
      ] as HTMLElement;

      if (currentHoveredRef) {
        scrollIntoView(currentHoveredRef, {
          align: {
            top: 0.5,
          },
          isScrollable: (target) => {
            return target === containerRef.current;
          },
          time: 0,
        });
      }
    },
    RelationPickerHotkeyScope.RelationPicker,
    [setRelationPickerHoverIndex, entities],
  );

  useScopedHotkeys(
    Key.ArrowDown,
    () => {
      if (relationPickerHoverIndex >= entities.length - 1) {
        addButtonAndIncrementHover();
      } else {
        incrementHoverAndScrollIntoView();
      }
    },
    RelationPickerHotkeyScope.RelationPicker,
    [setRelationPickerHoverIndex, entities],
  );

  return {
    hoveredIndex: relationPickerHoverIndex,
    resetScroll,
  };
};
