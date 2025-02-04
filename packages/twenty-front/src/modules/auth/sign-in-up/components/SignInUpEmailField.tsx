import { TextInput } from '@/ui/input/components/TextInput';
import { Controller, useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Form } from '@/auth/sign-in-up/hooks/useSignInUpForm';
import { isDefined } from 'twenty-shared';

const StyledFullWidthMotionDiv = styled(motion.div)`
  width: 100%;
`;

const StyledInputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

export const SignInUpEmailField = ({
  showErrors,
  onChange,
}: {
  showErrors: boolean;
  onChange?: (value: string) => void;
}) => {
  const form = useFormContext<Form>();

  const onInputChange = (value: string) => {
    if (isDefined(onChange)) onChange(value);
    form.setValue('email', value);
  };

  return (
    <StyledFullWidthMotionDiv
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{
        type: 'spring',
        stiffness: 800,
        damping: 35,
      }}
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field: { onBlur, value }, fieldState: { error } }) => (
          <StyledInputContainer>
            <TextInput
              autoFocus
              value={value}
              placeholder="Email"
              onBlur={onBlur}
              onChange={onInputChange}
              error={showErrors ? error?.message : undefined}
              fullWidth
            />
          </StyledInputContainer>
        )}
      />
    </StyledFullWidthMotionDiv>
  );
};
