// components/DeleteConfirmationModal.tsx
"use client";

import styled, { createGlobalStyle } from "styled-components";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
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
  background: #1e1e2e;
  padding: 24px;
  border-radius: 10px;
  text-align: center;
  width: 360px;
  max-width: 90%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

const ModalTitle = styled.h3`
  color: white;
  margin-bottom: 20px;
  font-size: 1.1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const CancelButton = styled.button`
  background: #3a3a4a;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background: #555;
  }
`;

const DeleteButton = styled.button`
  background: #ff4d4f;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background: #d9363e;
  }
`;

export default function DeleteConfirmationModal({
  isOpen,
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <GlobalStyle />
      <Overlay>
        <ModalBox>
          <ModalTitle>Are you sure you want to delete this journal?</ModalTitle>
          <ButtonGroup>
            <CancelButton onClick={onCancel}>Cancel</CancelButton>
            <DeleteButton onClick={onConfirm}>Delete</DeleteButton>
          </ButtonGroup>
        </ModalBox>
      </Overlay>
    </>
  );
}
