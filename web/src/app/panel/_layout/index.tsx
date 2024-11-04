import { memo } from "react";
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet } from "react-router-dom";
import { Flexbox } from 'react-layout-kit';
import { SideNav } from "@lobehub/ui";
import Nav from "../@nav";


const PanelLayout = memo(({ }) => {
    return (<Flexbox horizontal>
        <Flexbox>
            <Nav />
        </Flexbox>
        <Flexbox>

        </Flexbox>
    </Flexbox>)
})

export default PanelLayout;