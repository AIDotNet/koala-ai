import { memo } from "react";
import WelcomeLayout from "../_layout";
import { Card, Typography, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const faqData = [
    {
        question: "什么是Koala AI?",
        answer: "Koala是一个基于人工智能的知识库，利用检索增强生成（RAG）来提供准确和相关的信息。"
    },
    {
        question: "Koala是如何工作的？",
        answer: "Koala使用先进的人工智能算法从庞大的数据库中检索信息，并为用户查询生成精确的答案。"
    },
    {
        question: "什么是检索增强生成（RAG）？",
        answer: "RAG是一种技术，它将相关文档的检索与答案的生成结合起来，从而提高了答案的准确性和相关性。"
    },
    {
        question: "如何使用Koala？",
        answer: "你可以通过访问Koala的web界面来使用它，在那里你可以搜索信息并获得人工智能生成的答案。"
    },
    {
        question: "Koala是免费使用的吗?",
        answer: "Koala提供免费和付费计划。免费计划提供基本访问，而付费计划提供高级功能和更全面的支持。"
    }
];

const FaqItem = ({ question, answer }: { question: string, answer: string }) => (
    <Card style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Title level={4}>{question}</Title>
        <Paragraph>{answer}</Paragraph>
    </Card>
);

const FaqList = () => (
    <Row gutter={[16, 16]}>
        {faqData.map((faq, index) => (
            <Col xs={24} sm={24} md={12} lg={8} key={index}>
                <FaqItem question={faq.question} answer={faq.answer} />
            </Col>
        ))}
    </Row>
);

const Faq = memo(() => {
    return (
        <WelcomeLayout>
            <div style={{ padding: '0 24px' }}>
                <h1 style={{
                    textAlign: 'center',
                    fontSize: 32,
                    marginBottom: 24
                }}>
                    Koala AI 常见问题
                </h1>
                <FaqList />
            </div>
        </WelcomeLayout>
    );
});

Faq.displayName = "Faq";

export default Faq;