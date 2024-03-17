import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { IconChevronRight, TableCell, TableRow } from 'twenty-ui';

import { WebhookFieldItem } from '@/settings/developers/types/webhook/WebhookFieldItem';

export const StyledApisFieldTableRow = styled(TableRow)`
  grid-template-columns: 444px 68px;
`;

const StyledIconTableCell = styled(TableCell)`
  justify-content: center;
  padding-right: ${({ theme }) => theme.spacing(1)};
`;

const StyledUrlTableCell = styled(TableCell)`
  color: ${({ theme }) => theme.font.color.primary};
  overflow-x: scroll;
  white-space: nowrap;
`;

const StyledIconChevronRight = styled(IconChevronRight)`
  color: ${({ theme }) => theme.font.color.tertiary};
`;

export const SettingsDevelopersWebhookTableRow = ({
  fieldItem,
  onClick,
}: {
  fieldItem: WebhookFieldItem;
  onClick: () => void;
}) => {
  const theme = useTheme();

  return (
    <StyledApisFieldTableRow onClick={onClick}>
      <StyledUrlTableCell>{fieldItem.targetUrl}</StyledUrlTableCell>
      <StyledIconTableCell>
        <StyledIconChevronRight
          size={theme.icon.size.md}
          stroke={theme.icon.stroke.sm}
        />
      </StyledIconTableCell>
    </StyledApisFieldTableRow>
  );
};
