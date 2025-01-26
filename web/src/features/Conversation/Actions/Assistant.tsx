import { ActionIconGroup } from '@lobehub/ui';
import { ActionIconGroupItems } from '@lobehub/ui/es/ActionIconGroup';
import { memo, useContext, useMemo } from 'react';

import { useChatListActionsBar } from '../hooks/useChatListActionsBar';
import { RenderAction } from '../../types';
import { ErrorActionsBar } from './Error';
import { useCustomActions } from './customAction';

export const AssistantActionsBar: RenderAction = memo(({ onActionClick, error, tools, id }) => {

  const { regenerate, edit, delAndRegenerate, copy, divider, del, branching } =
    useChatListActionsBar();

  const { translate, tts } = useCustomActions();
  const hasTools = !!tools;


  const items = useMemo(() => {
    if (hasTools) return [delAndRegenerate, copy];

    return [edit, copy, branching].filter(Boolean) as ActionIconGroupItems[];
  }, [hasTools]);

  if (error) return <ErrorActionsBar onActionClick={onActionClick} />;

  return (
    <ActionIconGroup
      dropdownMenu={[
        edit,
        copy,
        divider,
        tts,
        translate,
        divider,
        regenerate,
        delAndRegenerate,
        del,
      ]}
      items={items}
      onActionClick={onActionClick}
      type="ghost"
    />
  );
});
