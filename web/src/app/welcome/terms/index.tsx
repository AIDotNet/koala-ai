import { memo } from "react";
import WelcomeLayout from "../_layout";
import { Tabs, Typography } from 'antd';
const { Title, Paragraph } = Typography;

const Terms = memo(() => {
    return (<WelcomeLayout>
        <Typography style={{
            maxWidth: 800,
            margin: 'auto',
            padding: '0 24px',
        }}>
            <Title level={2}>欢迎使用 Koala</Title>
            <Paragraph>
                Koala 是一个 AI 驱动的知识库，旨在帮助您快速获取所需的信息。
            </Paragraph>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="服务条款" key="1">
                    <Paragraph>
                        在使用 Koala 之前，请仔细阅读以下服务条款。您使用本网站即表示您同意遵守这些条款。我们保留随时更新服务条款的权利，更新后的条款将会发布在本页面上。
                    </Paragraph>
                    <Paragraph>
                        1. 您应确保在使用本网站时遵守所有适用的法律法规，不得利用本网站从事任何非法活动。
                    </Paragraph>
                    <Paragraph>
                        2. 我们致力于确保网站内容的准确性，但不对其完整性和时效性作出保证。您应自行判断并承担使用本站内容的风险。
                    </Paragraph>
                </Tabs.TabPane>
                <Tabs.TabPane tab="隐私政策" key="2">
                    <Paragraph>
                        我们重视您的隐私，并承诺保护您的个人信息。以下是我们的隐私政策概要：
                    </Paragraph>
                    <Paragraph>
                        1. 我们可能会收集您在使用本网站时提供的个人信息，以改进我们的服务。
                    </Paragraph>
                    <Paragraph>
                        2. 未经您的明确同意，我们不会将您的个人信息透露给任何第三方，除非法律要求。
                    </Paragraph>
                    <Paragraph>
                        3. 我们采取合理的安全措施保护您的个人信息不被未经授权的访问、披露或破坏。
                    </Paragraph>
                </Tabs.TabPane>
                <Tabs.TabPane tab="项目声明" key="3">
                    <Paragraph>
                        本项目旨在为用户提供便捷的知识获取渠道，与任何政治立场无关。
                    </Paragraph>
                    <Paragraph>
                        如果您有任何疑问或建议，欢迎联系我们的团队。
                    </Paragraph>
                </Tabs.TabPane>
            </Tabs>
        </Typography>
    </WelcomeLayout>)
});

Terms.displayName = "Terms";

export default Terms;
