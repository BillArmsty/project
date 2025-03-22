"use client";

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

// ** Styled Components **
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
  color: gray;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
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

const TogglePassword = styled.div`
  position: absolute;
  right: 15px;
  top: 68%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
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
  color: ${({ passed }) => (passed ? "green" : "red")};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export default function LoginRegisterModal({ isOpen, onClose }: ModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

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

      if (isLogin) {
        const { data } = await login({ variables: { email, password } });
        token = data?.login?.access_token;
      } else {
        const { data } = await register({ variables: { email, password } });
        token = data?.register?.access_token;
      }

      if (token) {
        localStorage.setItem("token", token);
        onClose();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please check your details.");
    }
  };

  if (!isOpen) return null;

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
