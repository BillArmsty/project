"use client";

import styled from "styled-components";

const FooterContainer = styled.footer`
  background: #222;
  color: white;
  text-align: center;
  padding: 20px;
  position: relative;
  bottom: 0;
  width: 100%;
`;

export default function Footer() {
  return <FooterContainer>© 2025 Journify. All rights reserved.</FooterContainer>;
}
