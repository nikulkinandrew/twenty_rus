import styled from '@emotion/styled';
import { useRecoilState } from 'recoil';

import { useOpenActivityRightDrawer } from '@/activities/hooks/useOpenActivityRightDrawer';
import {
  EventRowDynamicComponentProps,
  StyledEventRowItemAction,
  StyledEventRowItemColumn,
} from '@/activities/timelineActivities/rows/components/EventRowDynamicComponent';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';

type EventRowActivityProps = EventRowDynamicComponentProps;

const StyledLinkedActivity = styled.span`
  cursor: pointer;
  text-decoration: underline;
`;

export const EventRowActivity = ({
  event,
  authorFullName,
}: EventRowActivityProps) => {
  const [, eventAction] = event.name.split('.');

  const openActivityRightDrawer = useOpenActivityRightDrawer({
    objectNameSingular: CoreObjectNameSingular.Activity, // TODO
  });

  if (!event.linkedRecordId) {
    throw new Error('Could not find linked record id for event');
  }

  const [activityInStore] = useRecoilState(
    recordStoreFamilyState(event.linkedRecordId),
  );

  return (
    <>
      <StyledEventRowItemColumn>{authorFullName}</StyledEventRowItemColumn>
      <StyledEventRowItemAction>{eventAction}</StyledEventRowItemAction>
      {activityInStore ? (
        <StyledLinkedActivity
          onClick={() => openActivityRightDrawer(event.linkedRecordId)}
        >
          {event.linkedRecordCachedName}
        </StyledLinkedActivity>
      ) : (
        <span>{event.linkedRecordCachedName}</span>
      )}
    </>
  );
};
