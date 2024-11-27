import { Decorator } from '@storybook/react';

import { RecordPickerComponentInstanceContext } from '@/object-record/relation-picker/states/contexts/RecordPickerComponentInstanceContext';

export const RecordPickerDecorator: Decorator = (Story) => (
  <RecordPickerComponentInstanceContext.Provider
    value={{ instanceId: 'relation-picker' }}
  >
    <Story />
  </RecordPickerComponentInstanceContext.Provider>
);
