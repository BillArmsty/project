import { colors } from "./palette";

export const lightTheme = {
  background: colors.gray100,
  navBackground: "rgba(255,255,255,0.9)",
  text: colors.gray900,
  subText: colors.gray700,
  logoGradient: `linear-gradient(135deg, ${colors.blue500} 0%, ${colors.blue600} 100%)`,
  card: "rgba(255, 255, 255, 0.6)",
  cardHover: "rgba(255, 255, 255, 0.8)",
  input: colors.white,
  inputText: colors.gray900,
  button: colors.blue500,
  buttonHover: colors.blue600,
  border: "rgba(0,0,0,0.1)",
  overlay: "rgba(255, 255, 255, 0.6)",
  highlight: colors.teal500,
  danger: colors.red500,
  warning: colors.yellow400,
};

export const darkTheme = {
  background: colors.gray900,
  navBackground: "rgba(15, 23, 42, 0.8)",
  text: colors.white,
  subText: colors.gray300,
  logoGradient: `linear-gradient(135deg, ${colors.blue500} 0%, ${colors.blue600} 100%)`,
  card: "rgba(30, 41, 59, 0.7)",
  cardHover: "rgba(30, 41, 59, 0.8)",
  input: colors.gray800,
  inputText: colors.white,
  button: colors.blue500,
  buttonHover: colors.blue600,
  border: "rgba(255,255,255,0.1)",
  overlay: "rgba(0, 0, 0, 0.6)",
  highlight: colors.teal500,
  danger: colors.red500,
  warning: colors.yellow400,
};

export type ThemeType = typeof lightTheme;
