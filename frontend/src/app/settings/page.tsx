"use client";

import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
// import { useThemeContext } from "@/context/ThemeContext";
import ThemePreviewSwitcher from "@/components/ThemePreviewSwitcher";

// ✅ GraphQL Mutation
const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

// ✅ Password Rules
const rules = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "1 uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "1 lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "1 number", test: (pw: string) => /\d/.test(pw) },
  {
    label: "1 special character (@$!%*?&)",
    test: (pw: string) => /[@$!%*?&]/.test(pw),
  },
];

// ✅ Styled Components
const PageLayout = styled.div`
  display: flex;
  height: 100vh;
  background: ${({ theme }) => theme.background};
`;

const Content = styled.div`
  flex: 1;
  padding: 60px 60px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const Container = styled.div`
  max-width: 800px;
  background: ${({ theme }) => theme.card};
  padding: 170px;
  border-radius: 10px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.textSecondary};
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.inputBackground};
  border: 1px solid #555;
  border-radius: 6px;
  padding: 10px 40px 10px 12px;
  color: ${({ theme }) => theme.text};
`;

const ToggleBtn = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Checklist = styled.ul`
  list-style: none;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ChecklistItem = styled.li<{ $valid: boolean }>`
  color: ${({ $valid }) => ($valid ? "#10b981" : "#ef4444")};
  &::before {
    content: ${({ $valid }) => ($valid ? "'✅ '" : "'❌ '")};
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? "#4b5563" : "#3b82f6")};
  border: none;
  border-radius: 6px;
  padding: 12px;
  color: white;
  font-weight: bold;
  width: 100%;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: ${({ disabled }) => (disabled ? "#4b5563" : "#2563eb")};
  }
`;

// ✅ Modal styles
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 0px 40px;
  border-radius: 12px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease forwards;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

const ModalButton = styled.button`
  margin-top: 20px;
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

// const ThemeToggle = styled.div`
//   margin-top: 40px;
//   text-align: center;
//   color: ${({ theme }) => theme.textSecondary};

//   button {
//     background: #3b82f6;
//     color: white;
//     border: none;
//     padding: 8px 14px;
//     border-radius: 6px;
//     font-weight: bold;
//     cursor: pointer;
//     margin-top: 10px;

//     &:hover {
//       background: #2563eb;
//     }
//   }
// `;

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [changePassword] = useMutation(CHANGE_PASSWORD);

  // const { theme, toggleTheme } = useThemeContext();
  const allRulesPassed = rules.every((rule) => rule.test(newPassword));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword({
        variables: { input: { currentPassword, newPassword } },
      });

      setCurrentPassword("");
      setNewPassword("");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } catch (error) {
      console.error("Password change error:", error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

  return (
    <PageLayout>
      <Sidebar />
      <Content>
        <Container>
          <Title>Change Password</Title>
          <form onSubmit={handleSubmit}>
            <Label>Current Password</Label>
            <InputWrapper>
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <ToggleBtn
                onClick={() => setShowCurrent((prev) => !prev)}
                type="button"
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </ToggleBtn>
            </InputWrapper>

            <Label>New Password</Label>
            <InputWrapper>
              <Input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <ToggleBtn
                onClick={() => setShowNew((prev) => !prev)}
                type="button"
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </ToggleBtn>
            </InputWrapper>

            <Checklist>
              {rules.map((rule) => (
                <ChecklistItem key={rule.label} $valid={rule.test(newPassword)}>
                  {rule.label}
                </ChecklistItem>
              ))}
            </Checklist>

            <Button type="submit" disabled={!allRulesPassed}>
              Change Password
            </Button>
          </form>

          {/* <ThemeToggle>
            <p>
              Current Theme: <strong>{theme}</strong>
            </p>
            <button onClick={toggleTheme}>
              {theme === "light"
                ? "Switch to Dark Mode"
                : "Switch to Light Mode"}
            </button>
          </ThemeToggle> */}
          <ThemePreviewSwitcher />
        </Container>

        {showModal && (
          <ModalOverlay>
            <ModalBox ref={modalRef}>
              ✅ Password changed successfully!
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <ModalButton onClick={() => setShowModal(false)}>
                  OK
                </ModalButton>
                <ModalButton
                  onClick={() => {
                    setShowModal(false);
                    localStorage.removeItem("token");
                    router.push("/login");
                  }}
                >
                  Log Out
                </ModalButton>
              </div>
            </ModalBox>
          </ModalOverlay>
        )}
      </Content>
    </PageLayout>
  );
}
