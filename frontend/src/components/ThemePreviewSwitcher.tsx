"use client";

import styled from "styled-components";
import { useThemeContext } from "@/context/ThemeContext";

const ThemeSwitcherContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 30px;
`;

const ThemeCard = styled.button<{ selected: boolean }>`
  border: 2px solid ${({ selected, theme }) => (selected ? theme.button : theme.border)};
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 16px 20px;
  cursor: pointer;
  text-align: center;
  box-shadow: ${({ selected }) =>
    selected ? "0 0 12px rgba(59, 130, 246, 0.6)" : "none"};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
  }
`;

const Swatch = styled.div<{ background: string }>`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: ${({ background }) => background};
  margin: 0 auto 10px;
  border: 1px solid #ccc;
`;

export default function ThemePreviewSwitcher() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <ThemeSwitcherContainer>
      <ThemeCard
        selected={theme === "light"}
        onClick={() => {
          if (theme !== "light") toggleTheme();
        }}
      >
        <Swatch background="#f8fafc" />
        Light Mode
      </ThemeCard>

      <ThemeCard
        selected={theme === "dark"}
        onClick={() => {
          if (theme !== "dark") toggleTheme();
        }}
      >
        <Swatch background="#0f172a" />
        Dark Mode
      </ThemeCard>
    </ThemeSwitcherContainer>
  );
}
