import { ActionIconGroupItems } from '@lobehub/ui/es/ActionIconGroup';
import { css, cx } from 'antd-style';
import { LanguagesIcon,} from 'lucide-react';
import { useMemo } from 'react';


const translateStyle = css`
  .ant-dropdown-menu-sub {
    overflow-y: scroll;
    max-height: 400px;
  }
`;

export const useCustomActions = () => {

  const translate = {
    children: [
      {
        key: 'zh',
        label: '中文',
      },
      {
        key: 'en',
        label: 'English',
      },
    ],
    icon: LanguagesIcon,
    key: 'translate',
    label: 'Translate',
    popupClassName: cx(translateStyle),
  } as ActionIconGroupItems;

  return useMemo(() => ({ translate }), []);
};
