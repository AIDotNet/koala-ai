import { ActionIcon } from '@lobehub/ui';
import { Popconfirm } from 'antd';
import { Eraser } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

import { useChatStore } from '@/store/chat';
// import { useFileStore } from '@/store/file';
import { isMobileDevice } from '@/utils/responsive';

const Clear = memo(() => {
  const [clearMessage] = useChatStore((s) => [s.clearMessage]);
  // const [clearImageList] = useFileStore((s) => [s.clearChatUploadFileList]);
  const [confirmOpened, updateConfirmOpened] = useState(false);
  const mobile = isMobileDevice()

  const resetConversation = useCallback(async () => {
    await clearMessage();
    // clearImageList();
  }, []);

  const actionTitle: any = confirmOpened ? void 0 : 'clearCurrentMessages';

  const popconfirmPlacement = mobile ? 'top' : 'topRight';

  return (
    <Popconfirm
      arrow={false}
      okButtonProps={{ danger: true, type: 'primary' }}
      onConfirm={resetConversation}
      onOpenChange={updateConfirmOpened}
      open={confirmOpened}
      placement={popconfirmPlacement}
      title={
        <div style={{ marginBottom: '8px', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
          即将清空当前会话消息，清空后将无法找回，请确认你的操作
        </div>
      }
    >
      <ActionIcon
        icon={Eraser}
        placement={'bottom'}
        styles={{
          root: { maxWidth: 'none' },
        }}
        title={actionTitle}
      />
    </Popconfirm>
  );
});

export default Clear;
