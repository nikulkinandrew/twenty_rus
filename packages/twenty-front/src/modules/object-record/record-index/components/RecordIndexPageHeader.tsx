import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useIcons } from 'twenty-ui';

import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { recordIndexViewTypeState } from '@/object-record/record-index/states/recordIndexViewTypeState';
import { PageAddButton } from '@/ui/layout/page/PageAddButton';
import { PageHeader } from '@/ui/layout/page/PageHeader';
import { PageHotkeysEffect } from '@/ui/layout/page/PageHotkeysEffect';
import { ViewType } from '@/views/types/ViewType';
import { useUserOrMetadataLoading } from '~/hooks/useUserOrMetadataLoading';
import { capitalize } from '~/utils/string/capitalize';

type RecordIndexPageHeaderProps = {
  createRecord: () => void;
};

export const RecordIndexPageHeader = ({
  createRecord,
}: RecordIndexPageHeaderProps) => {
  const objectNamePlural = useParams().objectNamePlural ?? '';

  const { findObjectMetadataItemByNamePlural } =
    useFilteredObjectMetadataItems();

  const objectMetadataItem =
    findObjectMetadataItemByNamePlural(objectNamePlural);

  const { getIcon } = useIcons();
  const Icon = getIcon(
    findObjectMetadataItemByNamePlural(objectNamePlural)?.icon,
  );

  const recordIndexViewType = useRecoilValue(recordIndexViewTypeState);

  const canAddRecord =
    recordIndexViewType === ViewType.Table && !objectMetadataItem?.isRemote;

  const pageHeaderTitle =
    objectMetadataItem?.labelPlural ?? capitalize(objectNamePlural);

  const loading = useUserOrMetadataLoading();

  return (
    <PageHeader title={pageHeaderTitle} Icon={Icon} loading={loading}>
      <PageHotkeysEffect onAddButtonClick={createRecord} />
      {canAddRecord && <PageAddButton onClick={createRecord} />}
    </PageHeader>
  );
};
