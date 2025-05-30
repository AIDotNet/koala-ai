import { ActionIconGroup } from '@lobehub/ui';
import { ActionIconGroupItems } from '@lobehub/ui/es/ActionIconGroup';
import { memo, useMemo } from 'react';


import { useChatListActionsBar } from '../hooks/useChatListActionsBar';
import { RenderAction } from '../../types';
import { useCustomActions } from './customAction';

export const UserActionsBar: RenderAction = memo(({ onActionClick, id }) => {

  const { regenerate, edit, copy, divider, del, branching } = useChatListActionsBar();
  const { translate } = useCustomActions();

  const inPortalThread = false;
  const inThread = false || inPortalThread;

  const items = useMemo(
    () => [regenerate, edit, inThread ? null : branching].filter(Boolean) as ActionIconGroupItems[],
    [inThread],
  );

  return (
    <ActionIconGroup
      dropdownMenu={[edit, copy, divider, translate, divider, regenerate, del]}
      items={items}
      onActionClick={onActionClick}
      type="ghost"
    />
  );
});
