"use client";

import styled from "styled-components";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url('/image.svg') no-repeat center center;
  background-size: cover;
  color: white;
  text-align: center;
  padding: 20px;
`;

const Form = styled.form`
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 5px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
  };

  return (
    <Container>
      <h1>Login to Journify</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
}
