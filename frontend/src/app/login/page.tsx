"use client";

import styled from "styled-components";
import { useState } from "react";
import { motion } from "framer-motion";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// GraphQL Mutation for Registration
const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      email
      id
      createdAt
    }
  }
`;

// GraphQL Mutation for Login
const LOGIN_USER = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id
        email
      }
    }
  }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e2e8f0;
  text-align: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("https://source.unsplash.com/random/1200x800?journal,writing")
      no-repeat center center;
    background-size: cover;
    opacity: 0.1;
    z-index: 0;
  }
`;

const Content = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Form = styled(motion.form)`
  background: rgba(30, 41, 59, 0.7);
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
  position: relative;
`;

const Label = styled.label`
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const TogglePassword = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #94a3b8;
`;

const Button = styled(motion.button)`
  padding: 0.875rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.3);
  }
`;

const TabContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled(motion.button)<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
      : "rgba(30, 41, 59, 0.7)"};
  color: ${({ $active }) => ($active ? "white" : "#94a3b8")};
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [createUser] = useMutation(CREATE_USER);
  const [loginUser] = useMutation(LOGIN_USER);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      if (isLogin) {
        // Handle login
        const { data } = await loginUser({
          variables: { loginInput: formData },
        });

        if (data?.login?.access_token) {
          localStorage.setItem("token", data.login.access_token);
          toast.success("Login successful!");
          router.push("/dashboard");
        }
      } else {
        // Handle registration
        const { data } = await createUser({
          variables: { createUserInput: formData },
        });

        if (data?.createUser) {
          setIsLogin(true);
          setFormData({ email: "", password: "" });
          toast.success("Account created! Please log in.");
        }
      }
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }

      if (errorMessage.includes("already exists")) {
        toast.error("Email already exists. Please log in.");
      } else if (errorMessage.includes("Invalid credentials")) {
        toast.error("Incorrect password. Try again.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Container>
      <Content>
        <Title>Welcome Back</Title>
        <TabContainer>
          <Tab $active={isLogin} onClick={() => setIsLogin(true)}>
            Login
          </Tab>
          <Tab $active={!isLogin} onClick={() => setIsLogin(false)}>
            Register
          </Tab>
        </TabContainer>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </InputGroup>
          <InputGroup>
            <Label>Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <TogglePassword onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
          </InputGroup>
          <Button type="submit">
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </Form>
      </Content>
    </Container>
  );
}
