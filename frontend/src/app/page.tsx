"use client";

import { useState } from "react";
import styled from "styled-components";
import LoginRegisterModal from "../components/LoginRegisterModal";
import { motion } from "framer-motion";
import Image from "next/image";


const Container = styled.div`
  min-height: 100vh;
  background: #0f172a;
  overflow: hidden;
  position: relative;
  font-family: 'Inter', sans-serif;
`;

const Nav = styled.nav`
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  align-items: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 100%;
    height: 100%;
    background: url('https://source.unsplash.com/random/1200x800?journal,writing') no-repeat center center;
    background-size: cover;
    opacity: 0.1;
    z-index: 0;
  }

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem 1rem;
  }
`;

const HeroContent = styled.div`
  max-width: 600px;
  position: relative;
  z-index: 1;
  @media (max-width: 968px) {
    margin: 0 auto;
  }
`;

const Heading = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.2;
  background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubText = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.7;
  color: #94a3b8;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const Button = styled(motion.button)<{ $primary?: boolean }>`
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${({ $primary }) => $primary ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.3);
    }
  ` : `
    background: transparent;
    color: #60a5fa;
    border: 2px solid #3b82f6;
    
    &:hover {
      background: rgba(59, 130, 246, 0.1);
    }
  `}
`;

const ImageSection = styled(motion.div)`
  position: relative;
  height: 500px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
    z-index: 1;
  }
  
  @media (max-width: 968px) {
    height: 300px;
    margin-top: 2rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  background: url('https://source.unsplash.com/random/1200x800?paper,texture') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.9);
    z-index: 0;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.7);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-5px);
    background: rgba(30, 41, 59, 0.8);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #60a5fa;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
`;

const FeatureDescription = styled.p`
  color: #94a3b8;
  line-height: 1.6;
`;

export default function LandingPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <>
      <Container>
        <Nav>
          <Logo>Journify</Logo>
          <Button onClick={() => setModalOpen(true)}>Sign In</Button>
        </Nav>

        <MainContent>
          <HeroContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Heading variants={itemVariants}>
                Transform Your Thoughts into Beautiful Stories
              </Heading>
              <SubText variants={itemVariants}>
                Create, organize, and cherish your personal journey with our intuitive journaling platform. 
                Start writing your story today.
              </SubText>
              <ButtonGroup variants={itemVariants}>
                <Button $primary onClick={() => setModalOpen(true)}>
                  Start Your Journey
                </Button>
                <Button onClick={() => console.log("Learn More")}>
                  Learn More
                </Button>
              </ButtonGroup>
            </motion.div>
          </HeroContent>

          <ImageSection
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/sample_journal.png"
              alt="Journaling Illustration"
              fill
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </ImageSection>
        </MainContent>

        <FeatureGrid>
          {[
            {
              icon: "✨",
              title: "Beautiful Templates",
              description: "Choose from dozens of carefully crafted journal templates."
            },
            {
              icon: "🔒",
              title: "Private & Secure",
              description: "Your thoughts are safe with our enterprise-grade encryption."
            },
            {
              icon: "📱",
              title: "Access Anywhere",
              description: "Write from any device, anytime, with cloud sync."
            },
            {
              icon: "🎨",
              title: "Customize Your Space",
              description: "Make your journal truly yours with rich customization options."
            }
          ].map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </Container>

      <LoginRegisterModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
