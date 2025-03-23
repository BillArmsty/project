"use client";

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

// ✅ GraphQL Mutation
const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

// ✅ Styled Components with theme
const Container = styled.div`
  max-width: 400px;
  margin: 80px auto;
  background: ${({ theme }) => theme.card};
  padding: 30px;
  border-radius: 12px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border || "#555"};
  border-radius: 6px;
  margin-bottom: 12px;
`;

const ToggleBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  color: ${({ theme }) => theme.textSecondary || "#ccc"};
  border: none;
  cursor: pointer;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const SaveButton = styled.button`
  background: #3b82f6;
  color: white;
  width: 100%;
  padding: 12px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #2563eb;
  }
`;

const StrengthBar = styled.div<{ strength: number }>`
  height: 6px;
  margin-bottom: 16px;
  background: ${({ strength }) =>
    strength >= 80
      ? "#10b981"
      : strength >= 50
      ? "#facc15"
      : strength >= 30
      ? "#f97316"
      : "#ef4444"};
  width: ${({ strength }) => strength}%;
  transition: width 0.3s ease;
  border-radius: 4px;
`;

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 30;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 15;
  if (/[@$!%*?&]/.test(password)) score += 15;
  return score;
}

export default function ChangePasswordForm() {
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword({
        variables: {
          input: {
            currentPassword,
            newPassword,
          },
        },
      });
      toast.success("✅ Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("❌ Error updating password.");
      }
    }
  };

  return (
    <Container>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        Change Password
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Current Password */}
        <label>Current Password</label>
        <InputWrapper>
          <Input
            type={showCurrent ? "text" : "password"}
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <ToggleBtn type="button" onClick={() => setShowCurrent((s) => !s)}>
            {showCurrent ? "🙈" : "👁️"}
          </ToggleBtn>
        </InputWrapper>

        {/* New Password */}
        <label>New Password</label>
        <InputWrapper>
          <Input
            type={showNew ? "text" : "password"}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <ToggleBtn type="button" onClick={() => setShowNew((s) => !s)}>
            {showNew ? "🙈" : "👁️"}
          </ToggleBtn>
        </InputWrapper>

        <StrengthBar strength={passwordStrength} />
        <SaveButton type="submit">Change Password</SaveButton>
      </form>
    </Container>
  );
}
