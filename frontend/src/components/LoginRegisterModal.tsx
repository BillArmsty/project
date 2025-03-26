"use client";
import React from 'react';


import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import {
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { gql, useMutation } from "@apollo/client";

// ** GraphQL Mutations **
const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(registerInput: { email: $email, password: $password }) {
      access_token
      user {
        id
        email
        role
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
        role
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
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  padding: 30px;
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
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.subText};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  font-size: 1rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.9rem;
  text-align: left;
`;

const SubmitButton = styled.button`
  padding: 12px;
  background: #3b82f6;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #2563eb;
  }
`;

const ToggleText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 10px;
  color: ${({ theme }) => theme.subText};
`;

const ToggleButton = styled.span`
  color: #3b82f6;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const TogglePassword = styled.div`
  position: absolute;
  right: 15px;
  top: 68%;
  transform: translateY(-50%);
  cursor: pointer;
  color: ${({ theme }) => theme.subText};
  font-size: 1.2rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordChecklist = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  margin-top: 6px;
`;

const PasswordRule = styled.li<{ passed: boolean }>`
  font-size: 0.85rem;
  color: ${({ passed }) => (passed ? "#10b981" : "#ef4444")};
  display: flex;
  align-items: center;
  gap: 6px;
`;

// ✅ Spinner overlay
const Spinner = styled.div`
  width: 40px;
  height: 40px;
  background-color: #3b82f6;
  border-radius: 50%;
  animation: pulse 10s ease-in-out infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export default function LoginRegisterModal({ isOpen, onClose }: ModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [register] = useMutation(REGISTER_MUTATION);
  const [login] = useMutation(LOGIN_MUTATION);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const passwordRules = [
    { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
    { label: "1 uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "1 lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "1 digit", test: (pw: string) => /\d/.test(pw) },
    {
      label: "1 special character (@$!%*?&)",
      test: (pw: string) => /[@$!%*?&]/.test(pw),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!emailRegex.test(email)) {
      setError("Invalid email format. Use a valid email.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include an uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      let token = "";
      let userRole = "";

      if (isLogin) {
        const { data } = await login({ variables: { email, password } });
        token = data?.login?.access_token;
        userRole = data?.login?.user?.role;
      } else {
        const { data } = await register({ variables: { email, password } });
        token = data?.register?.access_token;
        userRole = data?.register?.user?.role;
      }

      if (token && userRole) {
     
          onClose();

          // ✅ Role-based routing
          if (userRole === "ADMIN" || userRole === "SUPERADMIN") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
       
      }
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Overlay>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <Spinner />
          <p style={{ marginTop: "12px" }}>Logging you in...</p>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <Title>{isLogin ? "Login" : "Register"}</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TogglePassword onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
          </InputWrapper>

          {/* Live checklist only for registration */}
          {!isLogin && (
            <PasswordChecklist>
              {passwordRules.map((rule) => {
                const passed = rule.test(password);
                return (
                  <PasswordRule key={rule.label} passed={passed}>
                    {passed ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
                    {rule.label}
                  </PasswordRule>
                );
              })}
            </PasswordChecklist>
          )}

          {error && <ErrorText>{error}</ErrorText>}
          <SubmitButton type="submit">
            {isLogin ? "Login" : "Register"}
          </SubmitButton>
        </Form>

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
