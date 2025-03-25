import { memo, useEffect, useRef, useState } from "react";
import WelcomeLayout from "./_layout";
import { Button, Typography, Space, Card, Row, Col } from 'antd';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { RobotOutlined, ApiOutlined, ThunderboltOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { GITHUB } from "@/const/url";

const { Title, Paragraph } = Typography;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: linear-gradient(45deg, rgb(32, 32, 255), rgb(70, 120, 200), rgb(46, 96, 172));
  background-size: 300% 300%;
  animation: gradientShift 15s ease infinite;
  z-index: 0;

  &:before, &:after {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    top: -25%;
    left: -25%;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%);
    animation: rotate 20s linear infinite;
    z-index: 1;
  }

  &:after {
    animation-direction: reverse;
    animation-duration: 30s;
    background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%);
  }

  .particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    pointer-events: none;
    z-index: 1;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0px) translateX(0px);
    }
    50% {
      transform: translateY(-20px) translateX(10px);
    }
    100% {
      transform: translateY(0px) translateX(0px);
    }
  }
`;

const HeroSection = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 24px;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 2;
`;

const LogoSection = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  margin-top: 64px;
  flex-wrap: wrap;
  opacity: 0.7;

  img {
    height: 32px;
    filter: brightness(0) invert(1);
  }
`;

const ActionButtons = styled(Space)`
  margin-top: 32px;
`;

const FeaturesSection = styled.div`
  padding: 100px 24px;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  min-height: 240px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }

  .ant-card-body {
    padding: 32px 24px;
  }

  .feature-icon {
    font-size: 36px;
    color: rgb(0, 0, 255);
    margin-bottom: 24px;
  }
`;

const AISection = styled.div`
  padding: 100px 24px;
`;

const ImageShowcase = styled.div`
  margin-top: 48px;
  img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const ParallaxSection = styled(motion.div)`
  position: relative;
  z-index: 1;
  transform-origin: top;
  transform-style: preserve-3d;
  will-change: transform;
`;

const Welcome = memo(() => {
    const containerRef = useRef(null);
    const backgroundRef = useRef(null);
    const [scrollY, setScrollY] = useState(0);
    const [particles, setParticles] = useState([]);
    const navigate = useNavigate();
    const featuresRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    
    const scale = useSpring(
        useTransform(scrollYProgress, [0, 1], [1, 0.8]),
        springConfig
    );
    
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.5], [1, 0]),
        springConfig
    );
    
    const y = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -100]),
        springConfig
    );
    
    // 特性部分的动画变换
    const featuresOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
    const featuresY = useTransform(scrollYProgress, [0.3, 0.6], [100, 0]);
    
    // 背景元素颜色
    const bgColors = ['#4285f4', '#34a853', '#fbbc05', '#ea4335'];

    const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    // 创建背景粒子效果
    useEffect(() => {
        if (!backgroundRef.current) return;
        
        // 生成随机粒子
        const generateParticles = () => {
            const newParticles = [];
            const count = 20; // 粒子数量
            
            for (let i = 0; i < count; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100, // 随机x位置（百分比）
                    y: Math.random() * 100, // 随机y位置（百分比）
                    size: Math.random() * 5 + 2, // 随机大小 2-7px
                    opacity: Math.random() * 0.5 + 0.1, // 随机透明度 0.1-0.6
                    duration: Math.random() * 20 + 10, // 随机动画持续时间 10-30s
                    delay: Math.random() * 5 // 随机延迟 0-5s
                });
            }
            
            setParticles(newParticles);
        };
        
        generateParticles();
        
        // 每30秒重新生成粒子，保持动态效果
        const interval = setInterval(generateParticles, 30000);
        
        return () => clearInterval(interval);
    }, [backgroundRef]);

    const features = [
        {
            title: "智能代理",
            description: "构建强大的AI代理，自动化复杂任务处理流程",
            icon: <RobotOutlined className="feature-icon" />
        },
        {
            title: "API集成",
            description: "简单易用的API接口，轻松集成到现有应用中",
            icon: <ApiOutlined className="feature-icon" />
        },
        {
            title: "快速部署",
            description: "一键部署AI应用，快速投入生产环境",
            icon: <ThunderboltOutlined className="feature-icon" />
        },
        {
            title: "应用市场",
            description: "丰富的AI应用市场，即插即用的解决方案",
            icon: <AppstoreOutlined className="feature-icon" />
        }
    ];

    return (
        <WelcomeLayout>
            <div ref={containerRef}>
                <motion.div
                    style={{
                        scale,
                        opacity,
                        y
                    }}
                >
                    <HeroSection>
                        <AnimatedBackground ref={backgroundRef}>
                            {particles.map((particle) => (
                                <motion.div
                                    key={particle.id}
                                    className="particle"
                                    style={{
                                        left: `${particle.x}%`,
                                        top: `${particle.y}%`,
                                        width: `${particle.size}px`,
                                        height: `${particle.size}px`,
                                        opacity: particle.opacity
                                    }}
                                    animate={{
                                        x: [0, Math.random() * 100 - 50, 0],
                                        y: [0, Math.random() * 100 - 50, 0],
                                    }}
                                    transition={{
                                        duration: particle.duration,
                                        ease: "easeInOut",
                                        delay: particle.delay,
                                        repeat: Infinity,
                                    }}
                                />
                            ))}
                        </AnimatedBackground>
                        <ContentWrapper
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            whileInView={{ scale: [0.95, 1] }}
                        >
                            <Title level={1} style={{ color: 'white', fontSize: '64px', marginBottom: '24px' }}>
                                Koala - 智能知识库平台
                            </Title>
                            <Paragraph style={{ color: 'white', fontSize: '20px', opacity: 0.8 }}>
                                基于AI技术的新一代知识管理系统，让团队协作更高效
                            </Paragraph>
                            <ActionButtons>
                                <Button 
                                    onClick={() => navigate('/login')}
                                    type="primary" size="large" style={{ height: '48px', padding: '0 32px' }}>
                                    立即开始
                                </Button>
                                <Button
                                    onClick={() => navigate('/docs')}
                                    size="large" style={{ height: '48px', padding: '0 32px', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
                                    了解更多
                                </Button>
                            </ActionButtons>
                        </ContentWrapper>
                    </HeroSection>
                </motion.div>

                <ParallaxSection
                    style={{ y: parallaxY }}
                >
                    <FeaturesSection>
                        <ContentWrapper
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
                                强大的AI开发平台
                            </Title>
                            <Row gutter={[24, 24]}>
                                {features.map((feature, index) => (
                                    <Col xs={24} sm={12} md={6} key={index}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                        >
                                            <FeatureCard bordered={false}>
                                                {feature.icon}
                                                <Title level={4}>{feature.title}</Title>
                                                <Paragraph type="secondary">
                                                    {feature.description}
                                                </Paragraph>
                                            </FeatureCard>
                                        </motion.div>
                                    </Col>
                                ))}
                            </Row>
                        </ContentWrapper>
                    </FeaturesSection>

                    <AISection>
                        <ContentWrapper
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Row gutter={[48, 48]} align="middle">
                                <Col span={24} md={{ span: 12 }}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <Title level={2}>
                                            RAG引擎助力知识库构建
                                        </Title>
                                        <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
                                            通过先进的RAG（检索增强生成）引擎，轻松构建和管理您的知识库。支持多种数据源接入，实现精准的信息检索和智能问答。
                                        </Paragraph>
                                        <Button type="primary" size="large">
                                            了解更多
                                        </Button>
                                    </motion.div>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                    >
                                    <ImageShowcase>
                                    </ImageShowcase>
                                    </motion.div>
                                </Col>
                            </Row>
                        </ContentWrapper>
                    </AISection>

                    <AISection >
                        <ContentWrapper
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Row gutter={[48, 48]} align="middle">
                                <Col span={24} md={{ span: 12 }} style={{ order: 2 }}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <ImageShowcase>
                                        </ImageShowcase>
                                    </motion.div>
                                </Col>
                                <Col span={24} md={{ span: 12 }} style={{ order: 1 }}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <Title level={2}>
                                            可视化AI工作流
                                        </Title>
                                        <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
                                            通过直观的可视化界面，轻松设计和编排复杂的AI工作流。支持多种AI模型集成，实现端到端的智能化解决方案。
                                        </Paragraph>
                                        <Button type="primary" size="large">
                                            开始体验
                                        </Button>
                                    </motion.div>
                                </Col>
                            </Row>
                        </ContentWrapper>
                    </AISection>
                </ParallaxSection>
            </div>
        </WelcomeLayout>
    );
});

Welcome.displayName = "Welcome";

export default Welcome;
