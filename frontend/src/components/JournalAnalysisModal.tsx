"use client";

import { useState } from "react";
import { useAnalyzeJournal } from "@/hooks/useAnalyzeJournal";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 30px 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  animation: ${fadeIn} 0.3s ease-in-out;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  text-align: center;
`;

const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.border};
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 20px auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const AnalyzeButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

const CloseButton = styled.button`
  margin-top: 20px;
  color: #f87171;
  font-weight: bold;
  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ResultText = styled.p`
  margin-top: 20px;
  text-align: left;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.text};
`;

export default function JournalAnalysisModal({
  content,
  onClose,
}: {
  content: string;
  onClose: () => void;
}) {
  const { analyze, loading } = useAnalyzeJournal();
  const [result, setResult] = useState<string>("");

  const handleAnalyze = async () => {
    const summary = await analyze(content);
    setResult(summary);
  };

  return (
    <Backdrop>
      <Modal>
        <h2>AI-Generated Suggestions</h2>
        {loading && <Spinner />}
        {!loading && result ? (
          <ResultText>{result}</ResultText>
        ) : (
          <AnalyzeButton onClick={handleAnalyze}>Analyze Journal</AnalyzeButton>
        )}
        <CloseButton onClick={onClose}>Close</CloseButton>
      </Modal>
    </Backdrop>
  );
}
