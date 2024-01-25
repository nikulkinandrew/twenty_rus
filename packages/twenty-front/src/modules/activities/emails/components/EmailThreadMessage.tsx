import { useState } from 'react';
import styled from '@emotion/styled';

import { EmailThreadMessageBody } from '@/activities/emails/components/EmailThreadMessageBody';
import { EmailThreadMessageBodyPreview } from '@/activities/emails/components/EmailThreadMessageBodyPreview';
import { EmailThreadMessageReceivers } from '@/activities/emails/components/EmailThreadMessageReceivers';
import { EmailThreadMessageSender } from '@/activities/emails/components/EmailThreadMessageSender';
import { EmailThreadMessageParticipant } from '@/activities/emails/types/EmailThreadMessageParticipant';

const PARTICIPANT_FROM_ROLE = 'from';

const StyledThreadMessage = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(4, 6)};
`;

const StyledThreadMessageHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

type EmailThreadMessageProps = {
  body: string;
  sentAt: string;
  participants: EmailThreadMessageParticipant[];
};

export const EmailThreadMessage = ({
  body,
  sentAt,
  participants,
}: EmailThreadMessageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const from = participants.find(
    (participant) => participant.role === PARTICIPANT_FROM_ROLE,
  );
  const to = participants.filter(
    (participant) => participant.role !== PARTICIPANT_FROM_ROLE,
  );

  if (!from || to.length === 0) {
    return null;
  }

  return (
    <StyledThreadMessage onClick={() => setIsOpen(!isOpen)}>
      <StyledThreadMessageHeader>
        <EmailThreadMessageSender sender={from} sentAt={sentAt} />
        {isOpen && <EmailThreadMessageReceivers receivers={to} />}
      </StyledThreadMessageHeader>
      {isOpen ? (
        <EmailThreadMessageBody body={body} />
      ) : (
        <EmailThreadMessageBodyPreview body={body} />
      )}
    </StyledThreadMessage>
  );
};
