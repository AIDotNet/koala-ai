import { memo, useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';

// 背景元素容器
const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`;

// 几何元素样式
const GeometricElement = styled.div<{ size: number; color: string; shape: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  opacity: 0.15;
  border-radius: ${props => props.shape === 'circle' ? '50%' : props.shape === 'triangle' ? '0' : '4px'};
  pointer-events: none;
  will-change: transform;
  transition: transform 0.3s ease-out;
`;

interface BackgroundElementsProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
}

const BackgroundElements = memo(({ 
  count = 10, 
  colors = ['#ffffff'], 
  minSize = 10, 
  maxSize = 60 
}: BackgroundElementsProps) => {
  const [elements, setElements] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    shape: string;
    delay: number;
    duration: number;
    offsetX: number;
    offsetY: number;
    rotateOffset: number;
  }>>([]);
  
  // 动画引用
  const animationRef = useRef<number | null>(null);
  // 动画开始时间引用
  const startTimeRef = useRef<number>(Date.now());

  // 生成随机背景元素
  useEffect(() => {
    const shapes = ['circle', 'square', 'triangle'];
    const newElements = [];
    
    for (let i = 0; i < count; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100, // 随机x位置（百分比）
        y: Math.random() * 100, // 随机y位置（百分比）
        size: Math.random() * (maxSize - minSize) + minSize, // 随机大小
        color: colors[Math.floor(Math.random() * colors.length)], // 随机颜色
        shape: shapes[Math.floor(Math.random() * shapes.length)], // 随机形状
        delay: Math.random() * 5, // 随机延迟
        duration: Math.random() * 10 + 15, // 随机动画持续时间
        offsetX: Math.random() * 100 - 50, // 随机X偏移量
        offsetY: Math.random() * 100 - 50, // 随机Y偏移量
        rotateOffset: Math.random() * 45 // 随机旋转偏移量
      });
    }
    
    setElements(newElements);
    
    // 启动动画循环
    startTimeRef.current = Date.now();
    startAnimation();
    
    // 清理函数
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, colors, minSize, maxSize]);

  // 动画函数
  const startAnimation = () => {
    const animate = (timestamp: number) => {
      const currentTime = timestamp || Date.now();
      const elapsedTime = (currentTime - startTimeRef.current) / 1000; // 转换为秒
      
      // 更新每个元素的位置
      const elementsContainer = document.querySelector('.background-elements-container');
      if (elementsContainer) {
        const elementNodes = elementsContainer.querySelectorAll('.geometric-element');
        
        elements.forEach((element, index) => {
          if (index < elementNodes.length) {
            const node = elementNodes[index] as HTMLElement;
            const effectiveTime = (elapsedTime - element.delay) % (element.duration * 2);
            const progress = effectiveTime < 0 ? 0 : 
                            effectiveTime > element.duration ? 
                            2 - (effectiveTime / element.duration) : 
                            effectiveTime / element.duration;
            
            // 计算当前位置
            const xOffset = element.offsetX * Math.sin(progress * Math.PI);
            const yOffset = element.offsetY * Math.sin(progress * Math.PI);
            const rotateValue = element.shape === 'triangle' ? 
                              45 + (element.rotateOffset * Math.sin(progress * Math.PI)) : 
                              (element.rotateOffset * Math.sin(progress * Math.PI));
            
            // 应用变换
            node.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotateValue}deg)`;
          }
        });
      }
      
      // 继续动画循环
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // 启动动画
    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <BackgroundContainer className="background-elements-container">
      {elements.map((element) => (
        <GeometricElement
          key={element.id}
          size={element.size}
          color={element.color}
          shape={element.shape}
          className="geometric-element"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: element.shape === 'triangle' ? 'rotate(45deg)' : 'none'
          }}
        />
      ))}
    </BackgroundContainer>
  );
});

BackgroundElements.displayName = 'BackgroundElements';

export default BackgroundElements;