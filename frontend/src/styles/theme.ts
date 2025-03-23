export const lightTheme = {
  // Base Colors
  background: "#f8fafc",
  text: "#0f172a",
  subText: "#334155",

  // UI Components
  navBackground: "rgba(255,255,255,0.9)",
  card: "rgba(255, 255, 255, 0.6)",
  cardHover: "rgba(255, 255, 255, 0.8)",
  border: "rgba(0,0,0,0.1)",
  overlay: "rgba(255, 255, 255, 0.6)",

  // Forms
  input: "#ffffff",
  inputText: "#0f172a",

  // Buttons
  button: "#3b82f6",
  buttonHover: "#2563eb",

  // Alerts / Status
  highlight: "#10b981", // success / checklist passed
  danger: "#ef4444", // errors / delete / checklist failed
  warning: "#facc15", // password strength warning
  success: "#28a745", // success modal / toast

  // Brand
  logoGradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
};

export const darkTheme = {
  // Base Colors
  background: "#0f172a",
  text: "#ffffff",
  subText: "#94a3b8",

  // UI Components
  navBackground: "rgba(15, 23, 42, 0.8)",
  card: "rgba(30, 41, 59, 0.7)",
  cardHover: "rgba(30, 41, 59, 0.8)",
  border: "rgba(255,255,255,0.1)",
  overlay: "rgba(0, 0, 0, 0.6)",

  // Forms
  input: "#2a2a3d",
  inputText: "#ffffff",

  // Buttons
  button: "#3b82f6",
  buttonHover: "#2563eb",

  // Alerts / Status
  highlight: "#10b981",
  danger: "#ef4444",
  warning: "#facc15",
  success: "#16a34a",

  // Brand
  logoGradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
};

// For styled-components theme typing
export type ThemeType = typeof lightTheme;
