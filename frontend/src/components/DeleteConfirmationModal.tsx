"use client";

import styled, { createGlobalStyle } from "styled-components";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title?: string; // Optional, customizable title
  onCancel: () => void;
  onConfirm: () => void;
}

const GlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow: hidden;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 24px;
  border-radius: 10px;
  text-align: center;
  width: 360px;
  max-width: 90%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
`;

const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
  font-size: 1.1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const CancelButton = styled.button`
  background: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.cardHover};
  }
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

export default function DeleteConfirmationModal({
  isOpen,
  title = "Are you sure you want to delete this item?", 
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <GlobalStyle />
      <Overlay>
        <ModalBox>
          <ModalTitle>{title}</ModalTitle>
          <ButtonGroup>
            <CancelButton onClick={onCancel}>Cancel</CancelButton>
            <DeleteButton onClick={onConfirm}>Delete</DeleteButton>
          </ButtonGroup>
        </ModalBox>
      </Overlay>
    </>
  );
}
