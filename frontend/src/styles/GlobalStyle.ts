import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: "Inter", sans-serif;
    min-height: 100vh;
  }

  * {
    box-sizing: border-box;
  }
`;