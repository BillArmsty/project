"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function PasswordSuccessModal({ show, onClose }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalBox
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h2>✅ Password Updated</h2>
            <p>Your password has been successfully changed.</p>
            <CloseBtn onClick={onClose}>Close</CloseBtn>
          </ModalBox>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

// Styled
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled(motion.div)`
  background: #1e1e2e;
  padding: 2rem;
  border-radius: 10px;
  color: white;
  text-align: center;
  max-width: 400px;
  width: 90%;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: #cbd5e1;
    margin-bottom: 1.5rem;
  }
`;

const CloseBtn = styled.button`
  background: #3b82f6;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;
