"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as StyledProvider } from "styled-components";
import { lightTheme, darkTheme } from "@/styles/theme";

type Theme = "light" | "dark";

const ThemeContext = createContext({
  theme: "dark" as Theme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        {children}
      </StyledProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);


