import { useCallback } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { useBlockNote } from '@blocknote/react';
import styled from '@emotion/styled';
import { isNonEmptyString } from '@sniptt/guards';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { useDebouncedCallback } from 'use-debounce';

import { useUpsertActivity } from '@/activities/hooks/useUpsertActivity';
import { activityTitleHasBeenSetFamilyState } from '@/activities/states/activityTitleHasBeenSetFamilyState';
import { canCreateActivityState } from '@/activities/states/canCreateActivityState';
import { Activity } from '@/activities/types/Activity';
import { useObjectMetadataItemOnly } from '@/object-metadata/hooks/useObjectMetadataItemOnly';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useModifyRecordFromCache } from '@/object-record/cache/hooks/useModifyRecordFromCache';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { BlockEditor } from '@/ui/input/editor/components/BlockEditor';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { FileFolder, useUploadFileMutation } from '~/generated/graphql';

import { blockSpecs } from '../blocks/blockSpecs';
import { getSlashMenu } from '../blocks/slashMenu';
import { getFileType } from '../files/utils/getFileType';

import '@blocknote/react/style.css';

const StyledBlockNoteStyledContainer = styled.div`
  width: 100%;
`;

type ActivityBodyEditorProps = {
  activity: Activity;
  fillTitleFromBody: boolean;
};

export const ActivityBodyEditor = ({
  activity,
  fillTitleFromBody,
}: ActivityBodyEditorProps) => {
  const [activityTitleHasBeenSet, setActivityTitleHasBeenSet] = useRecoilState(
    activityTitleHasBeenSetFamilyState({
      activityId: activity.id,
    }),
  );

  const { objectMetadataItem: objectMetadataItemActivity } =
    useObjectMetadataItemOnly({
      objectNameSingular: CoreObjectNameSingular.Activity,
    });

  const modifyActivityFromCache = useModifyRecordFromCache({
    objectMetadataItem: objectMetadataItemActivity,
  });

  const { upsertActivity } = useUpsertActivity();

  const persistBodyDebounced = useDebouncedCallback((newBody: string) => {
    upsertActivity({
      activity,
      input: {
        body: newBody,
      },
    });
  }, 500);

  const persistTitleAndBodyDebounced = useDebouncedCallback(
    (newTitle: string, newBody: string) => {
      upsertActivity({
        activity,
        input: {
          title: newTitle,
          body: newBody,
        },
      });

      setActivityTitleHasBeenSet(true);
    },
    500,
  );

  const updateTitleAndBody = useCallback(
    (newStringifiedBody: string) => {
      const blockBody = JSON.parse(newStringifiedBody);
      const newTitleFromBody = blockBody[0]?.content?.[0]?.text;

      persistTitleAndBodyDebounced(newTitleFromBody, newStringifiedBody);
    },
    [persistTitleAndBodyDebounced],
  );

  const [canCreateActivity, setCanCreateActivity] = useRecoilState(
    canCreateActivityState,
  );

  const handleBodyChange = useCallback(
    (activityBody: string) => {
      if (!canCreateActivity) {
        setCanCreateActivity(true);
      }

      if (!activityTitleHasBeenSet && fillTitleFromBody) {
        updateTitleAndBody(activityBody);
      } else {
        persistBodyDebounced(activityBody);
      }
    },
    [
      fillTitleFromBody,
      persistBodyDebounced,
      activityTitleHasBeenSet,
      updateTitleAndBody,
      setCanCreateActivity,
      canCreateActivity,
    ],
  );

  const slashMenuItems = getSlashMenu();

  const [uploadFile] = useUploadFileMutation();

  const handleUploadAttachment = async (file: File): Promise<string> => {
    if (!file) {
      return '';
    }
    const result = await uploadFile({
      variables: {
        file,
        fileFolder: FileFolder.Attachment,
      },
    });
    if (!result?.data?.uploadFile) {
      throw new Error("Couldn't upload Image");
    }
    const imageUrl =
      REACT_APP_SERVER_BASE_URL + '/files/' + result?.data?.uploadFile;
    return imageUrl;
  };

  const editor: BlockNoteEditor<typeof blockSpecs> | null = useBlockNote({
    initialContent:
      isNonEmptyString(activity.body) && activity.body !== '{}'
        ? JSON.parse(activity.body)
        : undefined,
    domAttributes: { editor: { class: 'editor' } },
    onEditorContentChange: useRecoilCallback(
      ({ snapshot, set }) =>
        (editor: BlockNoteEditor) => {
          const newStringifiedBody =
            JSON.stringify(editor.topLevelBlocks) ?? '';

          set(recordStoreFamilyState(activity.id), (oldActivity) => {
            return {
              ...oldActivity,
              id: activity.id,
              body: newStringifiedBody,
            };
          });

          modifyActivityFromCache(activity.id, {
            body: () => {
              return newStringifiedBody;
            },
          });

          const activityTitleHasBeenSet = snapshot
            .getLoadable(
              activityTitleHasBeenSetFamilyState({
                activityId: activity.id,
              }),
            )
            .getValue();

          const blockBody = JSON.parse(newStringifiedBody);
          const newTitleFromBody = blockBody[0]?.content?.[0]?.text as string;

          if (!activityTitleHasBeenSet && fillTitleFromBody) {
            set(recordStoreFamilyState(activity.id), (oldActivity) => {
              return {
                ...oldActivity,
                id: activity.id,
                title: newTitleFromBody,
              };
            });

            modifyActivityFromCache(activity.id, {
              title: () => {
                return newTitleFromBody;
              },
            });
          }

          handleBodyChange(newStringifiedBody);
        },
      [activity, fillTitleFromBody, modifyActivityFromCache, handleBodyChange],
    ),
    slashMenuItems,
    blockSpecs: blockSpecs,
    uploadFile: handleUploadAttachment,
    onEditorReady: (editor: BlockNoteEditor) => {
      editor.domElement.addEventListener('paste', handleImagePaste);
    },
  });

  const handleImagePaste = async (event: ClipboardEvent) => {
    const clipboardItems = event.clipboardData?.items;

    if (clipboardItems) {
      for (let i = 0; i < clipboardItems.length; i++) {
        if (clipboardItems[i].kind === 'file') {
          const isImage = clipboardItems[i].type.match('^image/');
          const pastedFile = clipboardItems[i].getAsFile();
          if (!pastedFile) {
            return;
          }

          const attachmentUrl = await handleUploadAttachment(pastedFile);

          if (!attachmentUrl) {
            return;
          }

          if (isImage) {
            editor?.insertBlocks(
              [
                {
                  type: 'image',
                  props: {
                    url: attachmentUrl,
                  },
                },
              ],
              editor?.getTextCursorPosition().block,
              'after',
            );
          } else {
            editor?.insertBlocks(
              [
                {
                  type: 'file',
                  props: {
                    url: attachmentUrl,
                    fileType: getFileType(pastedFile.name),
                    name: pastedFile.name,
                  },
                },
              ],
              editor?.getTextCursorPosition().block,
              'after',
            );
          }
        }
      }
    }
  };

  return (
    <StyledBlockNoteStyledContainer>
      <BlockEditor editor={editor} />
    </StyledBlockNoteStyledContainer>
  );
};
