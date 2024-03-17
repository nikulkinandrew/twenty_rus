import { useRecoilState, useRecoilValue } from 'recoil';
import { AppHotkeyScope, usePreviousHotkeyScope } from 'twenty-ui';

import { isKeyboardShortcutMenuOpenedState } from '../states/isKeyboardShortcutMenuOpenedState';

export const useKeyboardShortcutMenu = () => {
  const [, setIsKeyboardShortcutMenuOpened] = useRecoilState(
    isKeyboardShortcutMenuOpenedState,
  );
  const isKeyboardShortcutMenuOpened = useRecoilValue(
    isKeyboardShortcutMenuOpenedState,
  );
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  const toggleKeyboardShortcutMenu = () => {
    if (isKeyboardShortcutMenuOpened === false) {
      setIsKeyboardShortcutMenuOpened(true);
      setHotkeyScopeAndMemorizePreviousScope(
        AppHotkeyScope.KeyboardShortcutMenu,
      );
    } else {
      setIsKeyboardShortcutMenuOpened(false);
      goBackToPreviousHotkeyScope();
    }
  };

  const openKeyboardShortcutMenu = () => {
    setIsKeyboardShortcutMenuOpened(true);
    setHotkeyScopeAndMemorizePreviousScope(AppHotkeyScope.KeyboardShortcutMenu);
  };

  const closeKeyboardShortcutMenu = () => {
    setIsKeyboardShortcutMenuOpened(false);
    goBackToPreviousHotkeyScope();
  };

  return {
    toggleKeyboardShortcutMenu,
    openKeyboardShortcutMenu,
    closeKeyboardShortcutMenu,
  };
};
