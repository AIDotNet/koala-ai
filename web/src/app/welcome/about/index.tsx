import { memo, useRef } from "react";
import WelcomeLayout from "../_layout";
import { Typography, Row, Col, Card, Avatar, Divider, Space, Button } from 'antd';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from "framer-motion";
import { GithubOutlined } from '@ant-design/icons';
import { GITHUB } from "@/const/url";

const { Title, Paragraph, Text } = Typography;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 24px;
`;

const SectionTitle = styled(Title)`
  position: relative;
  display: inline-block;
  margin-bottom: 48px !important;
  
  &:after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 64px;
    height: 4px;
    background: linear-gradient(90deg, #4285f4, #0f9d58);
    border-radius: 2px;
  }
`;

const ProjectCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const TeamMemberCard = styled(Card)`
  text-align: center;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
`;

const TechTag = styled.div`
  padding: 8px 16px;
  background: linear-gradient(135deg, rgb(0, 102, 255), rgb(0, 153, 255));
  background-size: 200% 200%;
  animation: gradientAnimation 3s ease infinite;
  
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgb(0, 153, 255), rgb(0, 102, 255));
    transform: scale(1.05);
  }
`;

const AnimatedSection = styled(motion.div)`
  margin-bottom: 80px;
`;

const About = memo(() => {
    const containerRef = useRef(null);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);
    const y = useTransform(scrollYProgress, [0, 0.2, 1], [100, 0, 0]);
    
    const teamMembers = [
        {
            name: "Token",
            role: "创始人 & 2024微软MVP",
            avatar: "https://avatars.githubusercontent.com/u/61819790?v=4",
            github: "https://github.com/239573049"
        },
    ];
    
    const techStacks = [
        "React", "Next.js", "TypeScript", "Ant Design", 
        "Framer Motion", "Node.js", "Express", "MongoDB",
        "Docker", "AWS", "GitHub Actions"
    ];
    
    return (
        <WelcomeLayout>
            <AboutContainer ref={containerRef}>
                <AnimatedSection
                    style={{ opacity, y }}
                    transition={{ duration: 0.8 }}
                >
                    <SectionTitle level={2}>关于 Koala</SectionTitle>
                    <Paragraph style={{ fontSize: 18, marginBottom: 32 }}>
                        Koala 是一个开源的知识管理与协作平台，专为研究人员、学生和知识工作者设计。
                        我们的使命是让知识的创建、组织和分享变得简单而高效，帮助用户更好地管理和利用他们的知识资产。
                    </Paragraph>
                    
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <ProjectCard>
                                <Title level={4}>愿景</Title>
                                <Paragraph>
                                    打造一个无缝连接的知识生态系统，让每个人都能轻松获取、创建和分享知识，
                                    推动集体智慧的发展。
                                </Paragraph>
                            </ProjectCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <ProjectCard>
                                <Title level={4}>使命</Title>
                                <Paragraph>
                                    通过直观的工具和智能功能，简化知识管理流程，
                                    让用户能够专注于创造和发现，而不是整理和搜索。
                                </Paragraph>
                            </ProjectCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <ProjectCard>
                                <Title level={4}>价值观</Title>
                                <Paragraph>
                                    开放、协作、创新和用户至上。我们相信开源的力量，
                                    致力于构建一个由社区驱动的平台。
                                </Paragraph>
                            </ProjectCard>
                        </Col>
                    </Row>
                </AnimatedSection>
                
                <AnimatedSection
                    style={{ opacity, y }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <SectionTitle level={2}>团队成员</SectionTitle>
                    <Row gutter={[24, 24]}>
                        {teamMembers.map((member, index) => (
                            <Col xs={24} sm={12} md={8} key={index}>
                                <TeamMemberCard>
                                    <StyledAvatar src={member.avatar} />
                                    <Title level={4} style={{ marginBottom: 4 }}>{member.name}</Title>
                                    <Text type="secondary">{member.role}</Text>
                                    <div style={{ marginTop: 16 }}>
                                        <Button 
                                            icon={<GithubOutlined />} 
                                            href={member.github} 
                                            target="_blank"
                                            shape="round"
                                        >
                                            GitHub
                                        </Button>
                                    </div>
                                </TeamMemberCard>
                            </Col>
                        ))}
                    </Row>
                </AnimatedSection>
                
                <AnimatedSection
                    style={{ opacity, y }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <SectionTitle level={2}>技术栈</SectionTitle>
                    <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
                        Koala 采用现代化的技术栈，确保高性能、可扩展性和出色的用户体验。
                        我们不断探索和整合最新的技术，以提供最佳的产品体验。
                    </Paragraph>
                    
                    <TechStack>
                        {techStacks.map((tech, index) => (
                            <TechTag key={index}>{tech}</TechTag>
                        ))}
                    </TechStack>
                </AnimatedSection>
                
                <AnimatedSection
                    style={{ opacity, y }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <SectionTitle level={2}>开源贡献</SectionTitle>
                    <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
                        Koala 是一个开源项目，我们欢迎所有形式的贡献，无论是代码、设计、文档还是想法。
                        加入我们的社区，一起打造更好的知识管理工具！
                    </Paragraph>
                    
                    <Space size="large">
                        <Button 
                            type="primary" 
                            icon={<GithubOutlined />} 
                            size="large"
                            href={GITHUB}
                            target="_blank"
                        >
                            GitHub 仓库
                        </Button>
                        <Button size="large" href={`${GITHUB}/issues`} target="_blank">
                            提交问题
                        </Button>
                        <Button size="large" href={`${GITHUB}/pulls`} target="_blank">
                            贡献代码
                        </Button>
                    </Space>
                </AnimatedSection>
            </AboutContainer>
        </WelcomeLayout>
    );
});

About.displayName = "About";

export default About;