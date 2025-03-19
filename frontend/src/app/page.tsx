"use client";

import { useState } from "react";
import styled from "styled-components";
import LoginRegisterModal from "../components/LoginRegisterModal";

const Container = styled.div`
  background: url('/image.svg') no-repeat center center;
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 20px;
`;

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
`;

const SubText = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-top: 10px;
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 12px 24px;
  background: ${({ $primary }) => ($primary ? "#007bff" : "transparent")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#007bff")};
  border: 2px solid #007bff;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: ${({ $primary }) => ($primary ? "#0056b3" : "#007bff")};
    color: #fff;
  }
`;

export default function LandingPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Container>
        <Heading>Discover Your Personalized Journey</Heading>
        <SubText>
          At Journify, we craft unique journals that reflect your life experiences and aspirations.
        </SubText>
        <ButtonGroup>
          <Button $primary onClick={() => setModalOpen(true)}>Get Started</Button>
          <Button onClick={() => console.log("Journals")}>Journals</Button>
        </ButtonGroup>
      </Container>

      {/* Render the Modal */}
      <LoginRegisterModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
