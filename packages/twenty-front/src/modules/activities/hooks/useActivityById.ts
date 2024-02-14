import { useActivityConnectionUtils } from '@/activities/utils/useActivityConnectionUtils';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';

const QUERY_DEPTH_TO_GET_ACTIVITY_TARGET_RELATIONS = 3;

export const useActivityById = ({ activityId }: { activityId: string }) => {
  const { makeActivityWithoutConnection } = useActivityConnectionUtils();

  const { record: activityWithConnections, loading } = useFindOneRecord({
    objectNameSingular: CoreObjectNameSingular.Activity,
    objectRecordId: activityId,
    skip: !activityId,
    depth: QUERY_DEPTH_TO_GET_ACTIVITY_TARGET_RELATIONS,
  });

  const { activity } = makeActivityWithoutConnection(activityWithConnections);

  return {
    activity,
    loading,
  };
};
