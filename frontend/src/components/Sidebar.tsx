"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useState } from "react";
import {
  FaHome,
  FaBook,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
  width: ${(props) => (props.$collapsed ? "60px" : "200px")};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: width 0.3s ease;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.4rem;
  cursor: pointer;
  padding: 16px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  padding: 14px 20px;
  cursor: pointer;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.cardHover};
  }
`;

export default function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleNav = (path: string) => {
    router.push(path);
  };

  return (
    <SidebarContainer $collapsed={collapsed}>
      <ToggleButton onClick={() => setCollapsed((prev) => !prev)}>
        {collapsed ? <FaBars /> : <FaTimes />}
      </ToggleButton>

      <div style={{ marginTop: "60px" }}>
        <NavItem onClick={() => handleNav("/")}>
          <FaHome />
          {!collapsed && "Home"}
        </NavItem>

        <NavItem onClick={() => handleNav("/dashboard")}>
          <FaBook />
          {!collapsed && "My Journals"}
        </NavItem>

        <NavItem onClick={() => handleNav("/dashboard/analytics")}>
          <FaChartBar />
          {!collapsed && "Analytics"}
        </NavItem>

        <NavItem onClick={() => handleNav("/settings")}>
          <FaCog />
          {!collapsed && "Settings"}
        </NavItem>
      </div>
    </SidebarContainer>
  );
}
