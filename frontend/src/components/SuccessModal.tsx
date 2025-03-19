import { useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ModalContainer = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2b2d42;
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background: #ef233c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default function SuccessModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ModalContainer
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <h3>✅ {message}</h3>
      <Button onClick={onClose}>Close</Button>
    </ModalContainer>
  );
}
