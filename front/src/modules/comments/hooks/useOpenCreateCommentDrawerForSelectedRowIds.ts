import { useRecoilState, useRecoilValue } from 'recoil';

import { RightDrawerPages } from '@/ui/layout/right-drawer/types/RightDrawerPages';
import { selectedRowIdsState } from '@/ui/tables/states/selectedRowIdsState';
import { CommentableType } from '~/generated/graphql';

import { useOpenRightDrawer } from '../../ui/layout/right-drawer/hooks/useOpenRightDrawer';
import { commentableEntityArrayState } from '../states/commentableEntityArrayState';
import { CommentableEntity } from '../types/CommentableEntity';

export function useOpenCreateCommentThreadDrawerForSelectedRowIds() {
  const openRightDrawer = useOpenRightDrawer();

  const [, setCommentableEntityArray] = useRecoilState(
    commentableEntityArrayState,
  );

  const selectedEntityIds = useRecoilValue(selectedRowIdsState);

  return function openCreateCommentDrawerForSelectedRowIds(
    entityType: CommentableType,
  ) {
    const commentableEntityArray: CommentableEntity[] = selectedEntityIds.map(
      (id) => ({
        type: entityType,
        id,
      }),
    );

    setCommentableEntityArray(commentableEntityArray);
    openRightDrawer(RightDrawerPages.CreateCommentThread);
  };
}
