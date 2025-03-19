"use client";

import { useState } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { gql, useMutation } from "@apollo/client";

// ** GraphQL Mutations **
const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(registerInput: { email: $email, password: $password }) {
      access_token
      user {
        id
        email
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      access_token
      user {
        id
        email
      }
    }
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: gray;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  text-align: left;
`;

const SubmitButton = styled.button`
  padding: 12px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #0056b3;
  }
`;

const ToggleText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const ToggleButton = styled.span`
  color: #007bff;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

export default function LoginRegisterModal({ isOpen, onClose }: ModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [register] = useMutation(REGISTER_MUTATION);
  const [login] = useMutation(LOGIN_MUTATION);

  // Email & Password Validation Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle Login/Register Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Email Validation
    if (!emailRegex.test(email)) {
      setError("Invalid email format. Use a valid email.");
      return;
    }

    // Password Validation
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include an uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      if (isLogin) {
        // **LOGIN REQUEST**
        const { data } = await login({
          variables: { email, password },
        });

        if (data?.login?.access_token) {
          localStorage.setItem("token", data.login.access_token);
          window.location.reload(); // Refresh to apply session
        }
      } else {
        // **REGISTER REQUEST**
        const { data } = await register({
          variables: { email, password },
        });

        if (data?.register?.access_token) {
          localStorage.setItem("token", data.register.access_token);
          window.location.reload(); // Refresh to apply session
        }
      }

      onClose(); // Close modal after successful login/register
    } catch (err: unknown) {
      console.error("Auth Error:", err);
      setError("Authentication failed. Please check your details.");
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        {/* Modal Header */}
        <ModalHeader>
          <Title>{isLogin ? "Login" : "Register"}</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        {/* Form Fields */}
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorText>{error}</ErrorText>}
          <SubmitButton type="submit">
            {isLogin ? "Login" : "Register"}
          </SubmitButton>
        </Form>

        {/* Toggle between Login/Register */}
        <ToggleText>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <ToggleButton onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </ToggleButton>
        </ToggleText>
      </ModalContainer>
    </Overlay>
  );
}
