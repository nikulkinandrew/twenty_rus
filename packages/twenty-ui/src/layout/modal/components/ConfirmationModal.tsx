import { ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import debounce from 'lodash.debounce';

import { H1Title, H1TitleFontColor } from '../../../display';
import { Button } from '../../../input';
import { TextInput } from '../../../input/components/TextInput';
import {
  Section,
  SectionAlignment,
  SectionFontColor,
} from '../../section/components/Section';

import { Modal } from './Modal';

export type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  subtitle: ReactNode;
  setIsOpen: (val: boolean) => void;
  onConfirmClick: () => void;
  deleteButtonText?: string;
  confirmationPlaceholder?: string;
  confirmationValue?: string;
};

const StyledConfirmationModal = styled(Modal)`
  border-radius: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(6)};
  width: calc(400px - ${({ theme }) => theme.spacing(32)});
`;

const StyledCenteredButton = styled(Button)`
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledCenteredTitle = styled.div`
  text-align: center;
`;

const StyledSection = styled(Section)`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

export const StyledConfirmationButton = styled(StyledCenteredButton)`
  border-color: ${({ theme }) => theme.border.color.danger};
  box-shadow: none;
  color: ${({ theme }) => theme.color.red};
  font-size: ${({ theme }) => theme.font.size.md};
  line-height: ${({ theme }) => theme.text.lineHeight.lg};
  :hover {
    background-color: ${({ theme }) => theme.color.red10};
  }
`;

export const ConfirmationModal = ({
  isOpen = false,
  title,
  subtitle,
  setIsOpen,
  onConfirmClick,
  deleteButtonText = 'Delete',
  confirmationValue,
  confirmationPlaceholder,
}: ConfirmationModalProps) => {
  const [inputConfirmationValue, setInputConfirmationValue] =
    useState<string>('');
  const [isValidValue, setIsValidValue] = useState(!confirmationValue);

  const handleInputConfimrationValueChange = (value: string) => {
    setInputConfirmationValue(value);
    isValueMatchingInput(confirmationValue, value);
  };

  const isValueMatchingInput = debounce(
    (value?: string, inputValue?: string) => {
      setIsValidValue(Boolean(value && inputValue && value === inputValue));
    },
    250,
  );

  return (
    <AnimatePresence mode="wait">
      <LayoutGroup>
        <StyledConfirmationModal
          isOpen={isOpen}
          onClose={() => {
            if (isOpen) {
              setIsOpen(false);
            }
          }}
          onEnter={onConfirmClick}
        >
          <StyledCenteredTitle>
            <H1Title title={title} fontColor={H1TitleFontColor.Primary} />
          </StyledCenteredTitle>
          <StyledSection
            alignment={SectionAlignment.Center}
            fontColor={SectionFontColor.Primary}
          >
            {subtitle}
          </StyledSection>
          {confirmationValue && (
            <Section>
              <TextInput
                value={inputConfirmationValue}
                onChange={handleInputConfimrationValueChange}
                placeholder={confirmationPlaceholder}
                fullWidth
                key={'input-' + confirmationValue}
              />
            </Section>
          )}
          <StyledCenteredButton
            onClick={() => setIsOpen(false)}
            variant="secondary"
            title="Cancel"
            fullWidth
          />
          <StyledCenteredButton
            onClick={async () => {
              await onConfirmClick();
              setIsOpen(false);
            }}
            variant="secondary"
            accent="danger"
            title={deleteButtonText}
            disabled={!isValidValue}
            fullWidth
          />
        </StyledConfirmationModal>
      </LayoutGroup>
    </AnimatePresence>
  );
};
