import { DropdownMenuHeader } from '@/ui/layout/dropdown/components/DropdownMenuHeader';
import { DropdownMenuSearchInput } from '@/ui/layout/dropdown/components/DropdownMenuSearchInput';
import {
  BaseOutputSchema,
  LinkOutputSchema,
  OutputSchema,
  StepOutputSchema,
} from '@/workflow/search-variables/types/StepOutputSchema';
import { isBaseOutputSchema } from '@/workflow/search-variables/utils/isBaseOutputSchema';
import { isRecordOutputSchema } from '@/workflow/search-variables/utils/isRecordOutputSchema';
import { useTheme } from '@emotion/react';

import { useState } from 'react';
import {
  HorizontalSeparator,
  IconChevronLeft,
  isDefined,
  MenuItemSelect,
  OverflowingTextWithTooltip,
  useIcons,
} from 'twenty-ui';
import { useRightDrawer } from '@/ui/layout/right-drawer/hooks/useRightDrawer';
import { RightDrawerPages } from '@/ui/layout/right-drawer/types/RightDrawerPages';
import { useSetRecoilState } from 'recoil';
import { workflowSelectedNodeState } from '@/workflow/states/workflowSelectedNodeState';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { WORKFLOW_SERVERLESS_FUNCTION_TAB_LIST_COMPONENT_ID } from '@/workflow/workflow-actions/constants/WorkflowServerlessFunctionTabListComponentId';
import { isLinkOutputSchema } from '@/workflow/search-variables/utils/isLinkOutputSchema';

type SearchVariablesDropdownFieldItemsProps = {
  step: StepOutputSchema;
  onSelect: (value: string) => void;
  onBack: () => void;
};

export const SearchVariablesDropdownFieldItems = ({
  step,
  onSelect,
  onBack,
}: SearchVariablesDropdownFieldItemsProps) => {
  const theme = useTheme();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const { getIcon } = useIcons();
  const { openRightDrawer } = useRightDrawer();
  const setWorkflowSelectedNode = useSetRecoilState(workflowSelectedNodeState);
  const { setActiveTabId } = useTabList(
    WORKFLOW_SERVERLESS_FUNCTION_TAB_LIST_COMPONENT_ID,
  );

  const getCurrentSubStep = (): OutputSchema => {
    let currentSubStep = step.outputSchema;

    for (const key of currentPath) {
      if (isRecordOutputSchema(currentSubStep)) {
        currentSubStep = currentSubStep.fields[key]?.value;
      } else if (isBaseOutputSchema(currentSubStep)) {
        currentSubStep = currentSubStep[key]?.value;
      }
    }

    return currentSubStep;
  };

  const getDisplayedSubStepFields = () => {
    const currentSubStep = getCurrentSubStep();

    if (isLinkOutputSchema(currentSubStep)) {
      return { link: currentSubStep.link };
    } else if (isRecordOutputSchema(currentSubStep)) {
      return currentSubStep.fields;
    } else if (isBaseOutputSchema(currentSubStep)) {
      return currentSubStep;
    }
  };

  const handleSelectField = (key: string) => {
    const currentSubStep = getCurrentSubStep();

    const handleSelectBaseOutputSchema = (
      baseOutputSchema: BaseOutputSchema,
    ) => {
      if (!baseOutputSchema[key]?.isLeaf) {
        setCurrentPath([...currentPath, key]);
        setSearchInputValue('');
      } else {
        onSelect(`{{${step.id}.${[...currentPath, key].join('.')}}}`);
      }
    };

    const handleSelectLinkOutputSchema = (
      linkOutputSchema: LinkOutputSchema,
    ) => {
      if (isDefined(linkOutputSchema.link.tab)) {
        setActiveTabId(linkOutputSchema.link.tab);
      }
      setWorkflowSelectedNode(step.id);
      openRightDrawer(RightDrawerPages.WorkflowStepEdit);
    };

    if (isLinkOutputSchema(currentSubStep)) {
      handleSelectLinkOutputSchema(currentSubStep);
    } else if (isRecordOutputSchema(currentSubStep)) {
      handleSelectBaseOutputSchema(currentSubStep.fields);
    } else if (isBaseOutputSchema(currentSubStep)) {
      handleSelectBaseOutputSchema(currentSubStep);
    }
  };

  const goBack = () => {
    if (currentPath.length === 0) {
      onBack();
    } else {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const headerLabel = currentPath.length === 0 ? step.name : currentPath.at(-1);
  const displayedObject = getDisplayedSubStepFields();
  const options = displayedObject ? Object.entries(displayedObject) : [];

  const filteredOptions = searchInputValue
    ? options.filter(
        ([_, value]) =>
          value.label &&
          value.label.toLowerCase().includes(searchInputValue.toLowerCase()),
      )
    : options;

  return (
    <>
      <DropdownMenuHeader
        StartIcon={IconChevronLeft}
        onClick={goBack}
        style={{
          position: 'fixed',
        }}
      >
        <OverflowingTextWithTooltip text={headerLabel} />
      </DropdownMenuHeader>
      <HorizontalSeparator
        color={theme.background.transparent.primary}
        noMargin
      />
      <DropdownMenuSearchInput
        autoFocus
        value={searchInputValue}
        onChange={(event) => setSearchInputValue(event.target.value)}
      />
      <HorizontalSeparator
        color={theme.background.transparent.primary}
        noMargin
      />
      {filteredOptions.map(([key, value]) => (
        <MenuItemSelect
          key={key}
          selected={false}
          hovered={false}
          onClick={() => handleSelectField(key)}
          text={value.label || key}
          hasSubMenu={!value.isLeaf}
          LeftIcon={value.icon ? getIcon(value.icon) : undefined}
        />
      ))}
    </>
  );
};
