import { ActionIconGroupItems } from '@lobehub/ui/es/ActionIconGroup';
import { Copy, Edit, ListRestart, RotateCcw, Split, Trash } from 'lucide-react';
import { useMemo } from 'react';

import { isDeprecatedEdition } from '@/const/version';

interface ChatListActionsBar {
  branching: ActionIconGroupItems;
  copy: ActionIconGroupItems;
  del: ActionIconGroupItems;
  delAndRegenerate: ActionIconGroupItems;
  divider: { type: 'divider' };
  edit: ActionIconGroupItems;
  regenerate: ActionIconGroupItems;
}

export const useChatListActionsBar = (): ChatListActionsBar => {

  return useMemo(
    () => ({
      branching: {
        disable: isDeprecatedEdition,
        icon: Split,
        key: 'branching',
        label: !isDeprecatedEdition
          ? 'Create Sub Topic'
          : 'branchingDisable',
      },
      copy: {
        icon: Copy,
        key: 'copy',
        label: 'Copy',
      },
      del: {
        danger: true,
        disable: false,
        icon: Trash,
        key: 'del',
        label: 'delete',
      },
      delAndRegenerate: {
        disable: false,
        icon: ListRestart,
        key: 'delAndRegenerate',
        label: 'Delete and regenerate',
      },
      divider: {
        type: 'divider',
      },
      edit: {
        icon: Edit,
        key: 'edit',
        label: 'Edit',
      },
      regenerate: {
        icon: RotateCcw,
        key: 'regenerate',
        label: 'Regenerate',
      },
    }),
    [],
  );
};
