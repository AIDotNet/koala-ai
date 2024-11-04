import { memo } from "react";
import WelcomeLayout from "../_layout";
import { Typography } from 'antd';
import { GITEE, GITHUB } from "@/const/url";

const { Title, Paragraph } = Typography;

const Contact = memo(() => {
    return (
        <WelcomeLayout>
            <Typography
                style={{
                    maxWidth: 800,
                    margin: 'auto',
                    padding: '0 24px',
                    fontSize: 16
                }}
            >
                <Title level={2}>关于我们</Title>
                <Paragraph>
                    我们是 AIDotNet 开源组织，致力于给 .NET 赋能 AI 落地。我们组织成员中拥有多名微软 MVP，项目已应用于多个 AI 相关领域，为您解决 AI 项目落地难题。
                </Paragraph>
                <Paragraph>
                    如果您对我们感兴趣，欢迎加入我们的社区，共同推动 AI 技术在 .NET 领域的发展。
                </Paragraph>
                <Paragraph >
                    仓库地址：
                    <a style={{
                        color: '#1890ff',
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                    }} href={GITHUB}>GitHub</a>
                    &nbsp;
                    &nbsp;
                    <a style={{
                        color: '#1890ff',
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                    }} href={GITEE}>Gitee</a>
                </Paragraph>

            </Typography>
        </WelcomeLayout>
    );
});

Contact.displayName = "Contact";

export default Contact;