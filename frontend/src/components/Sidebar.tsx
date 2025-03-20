import { useState } from "react";
import styled from "styled-components";
import { FaBars, FaTimes, FaHome, FaChartPie, FaBook } from "react-icons/fa";
import Link from "next/link";

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
  width: ${(props) => (props.$collapsed ? "60px" : "250px")};
  height: 100vh;
  background: #0f172a;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 15px;
  left: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: left 0.3s ease-in-out;

  &:hover {
    color: #007bff;
  }
`;

const NavItem = styled(Link)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  font-size: ${(props) => (props.$collapsed ? "0px" : "1rem")};
  white-space: nowrap;
  opacity: ${(props) => (props.$collapsed ? "0" : "1")};
  transition: opacity 0.3s ease-in-out;
  overflow: hidden;

  &:hover {
    background: #1e293b;
  }
`;

const Icon = styled.span`
  font-size: 1.5rem;
  margin-right: 15px;
`;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContainer $collapsed={collapsed}>
      <ToggleButton onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <FaBars /> : <FaTimes />}
      </ToggleButton>

      <NavItem $collapsed={collapsed} href="/">
        <Icon>
          <FaHome />
        </Icon>
        Journify Home
      </NavItem>

      <NavItem $collapsed={collapsed} href="/dashboard">
        <Icon>
          <FaBook />
        </Icon>
        My Journals
      </NavItem>

      <NavItem $collapsed={collapsed} href="/dashboard/analytics">
        <Icon>
          <FaChartPie />
        </Icon>
        Analytics
      </NavItem>
    </SidebarContainer>
  );
}
