import styled from '@emotion/styled';

import { useGetManyServerlessFunctions } from '@/settings/serverless-functions/hooks/useGetManyServerlessFunctions';
import { Select, SelectOption } from '@/ui/input/components/Select';
import { WorkflowEditGenericFormBase } from '@/workflow/components/WorkflowEditGenericFormBase';
import VariableTagInput from '@/workflow/search-variables/components/VariableTagInput';
import { WorkflowCodeStep } from '@/workflow/types/Workflow';
import { useTheme } from '@emotion/react';
import { ReactNode, useState } from 'react';
import { IconCode, isDefined } from 'twenty-ui';
import { useDebouncedCallback } from 'use-debounce';
import { getDefaultFunctionInputFromInputSchema } from '@/workflow/utils/getDefaultFunctionInputFromInputSchema';
import { FunctionInput } from '@/workflow/types/FunctionInput';
import { mergeDefaultFunctionInputAndFunctionInput } from '@/workflow/utils/mergeDefaultFunctionInputAndFunctionInput';

const StyledContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.font.color.light};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: ${({ theme }) => theme.spacing(4)};
  padding-left: ${({ theme }) => theme.spacing(4)};
`;

type WorkflowEditActionFormServerlessFunctionProps =
  | {
      action: WorkflowCodeStep;
      readonly: true;
    }
  | {
      action: WorkflowCodeStep;
      readonly?: false;
      onActionUpdate: (action: WorkflowCodeStep) => void;
    };

export const WorkflowEditActionFormServerlessFunction = (
  props: WorkflowEditActionFormServerlessFunctionProps,
) => {
  const theme = useTheme();

  const { serverlessFunctions } = useGetManyServerlessFunctions();

  const defaultFunctionInput =
    props.action.settings.input.serverlessFunctionInput;

  const [functionInput, setFunctionInput] =
    useState<FunctionInput>(defaultFunctionInput);
  const [inputSchema, setInputSchema] = useState<InputSchema>({});

  const [serverlessFunctionId, setServerlessFunctionId] = useState<string>(
    props.action.settings.input.serverlessFunctionId,
  );

  const updateFunctionInput = useDebouncedCallback(
    async (newFunctionInput: object) => {
      if (props.readonly === true) {
        return;
      }

      props.onActionUpdate({
        ...props.action,
        settings: {
          ...props.action.settings,
          input: {
            serverlessFunctionId:
              props.action.settings.input.serverlessFunctionId,
            serverlessFunctionVersion:
              props.action.settings.input.serverlessFunctionVersion,
            serverlessFunctionInput: {
              ...props.action.settings.input.serverlessFunctionInput,
              ...newFunctionInput,
            },
          },
        },
      });
    },
    1_000,
  );

  const handleInputChange = (value: any, path: string[]) => {
    const newFunctionInput = { ...functionInput };
    setNestedValue(newFunctionInput, path, value);
    setFunctionInput(newFunctionInput);
    updateFunctionInput(newFunctionInput);
  };

  const getNestedValue = (obj: any, path: string[]) =>
    path.reduce((o, key) => (o ? o[key] : undefined), obj);

  // Utility to set nested value
  const setNestedValue = (obj: any, path: string[], value: any) => {
    path.reduce((o, key, index) => {
      if (index === path.length - 1) {
        o[key] = value;
      }
      return o[key] || {};
    }, obj);
  };

  const availableFunctions: Array<SelectOption<string>> = [
    ...serverlessFunctions
      .filter((serverlessFunction) =>
        isDefined(serverlessFunction.latestVersion),
      )
      .map((serverlessFunction) => ({
        label: serverlessFunction.name,
        value: serverlessFunction.id,
        latestVersionInputSchema: serverlessFunction.latestVersionInputSchema,
      })),
  ];

  const handleFunctionChange = (newServerlessFunctionId: string) => {
    setServerlessFunctionId(newServerlessFunctionId);

    const serverlessFunction = serverlessFunctions.find(
      (f) => f.id === newServerlessFunctionId,
    );

    const serverlessFunctionVersion =
      serverlessFunction?.latestVersion || 'latest';
    const inputSchema = serverlessFunction?.latestVersionInputSchema;
    const defaultFunctionInput =
      getDefaultFunctionInputFromInputSchema(inputSchema);

    if (!props.readonly) {
      props.onActionUpdate({
        ...props.action,
        settings: {
          ...props.action.settings,
          input: {
            serverlessFunctionId: newServerlessFunctionId,
            serverlessFunctionVersion,
            serverlessFunctionInput: defaultFunctionInput,
          },
        },
      });
    }
    setInputSchema(inputSchema);
    setFunctionInput(defaultFunctionInput);
  };

  const renderFields = (
    inputSchema: InputSchema,
    path: string[] = [],
  ): ReactNode | undefined => {
    if (!isDefined(inputSchema)) {
      return;
    }
    return Object.entries(inputSchema).map(([inputKey, inputValue]) => {
      const currentPath = [...path, inputKey];
      const pathKey = currentPath.join('.');

      if (inputValue.type === 'object' && isDefined(inputValue.properties)) {
        return (
          <StyledContainer key={pathKey}>
            <StyledLabel>{inputKey}</StyledLabel>
            <StyledInputContainer>
              {renderFields(inputValue.properties, currentPath)}
            </StyledInputContainer>
          </StyledContainer>
        );
      } else {
        return (
          <VariableTagInput
            key={pathKey}
            inputId={`input-${inputKey}`}
            label={inputKey}
            placeholder="Enter value (use {{variable}} for dynamic content)"
            value={getNestedValue(inputValue, currentPath)}
            onChange={(value) => handleInputChange(value, currentPath)}
          />
        );
      }
    });
  };

  return (
    <WorkflowEditGenericFormBase
      HeaderIcon={<IconCode color={theme.color.orange} />}
      headerTitle="Code - Serverless Function"
      headerType="Code"
    >
      <Select
        dropdownId="select-serverless-function-id"
        label="Function"
        fullWidth
        value={serverlessFunctionId}
        options={availableFunctions}
        emptyOption={{ label: 'None', value: '' }}
        disabled={props.readonly}
        onChange={handleFunctionChange}
      />
      {inputSchema && renderFields(inputSchema)}
    </WorkflowEditGenericFormBase>
  );
};
