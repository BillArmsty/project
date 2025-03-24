"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import {
  FaHome,
  FaBook,
  FaChartBar,
  FaCog,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";
import { getRoleFromToken } from "@/utils/auth";
import { useEffect, useState } from "react";

// interface SidebarProps {
//   userRole: string | null;
// }


const SidebarContainer = styled.aside`
  width: 240px;
  background: ${({ theme }) => theme.card};
  padding: 20px;
  height: 100vh;
  position: fixed;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.h1`
  font-size: 1.4rem;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.text};
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.text)};
  text-decoration: none;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
// const Spacer = styled.div`
//   flex-grow: 1;
// `;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
const TopSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      const userRole = getRoleFromToken();
      console.log("User role from token:", userRole);
      setRole(userRole);
    }, 100); // give the token a moment to be set

    return () => clearTimeout(delay);
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0;";
    window.location.href = "/login";
  };

  return (
    <SidebarContainer>
       <TopSection>
      <Logo>Journify</Logo>
      <NavItem href="/" $active={pathname === "/"}>
        <FaHome /> Home
      </NavItem>
      <NavItem href="/dashboard" $active={pathname === "/dashboard"}>
        <FaBook /> My Journals
      </NavItem>
      <NavItem href="/analytics" $active={pathname === "/analytics"}>
        <FaChartBar /> Analytics
      </NavItem>
      <NavItem href="/settings" $active={pathname === "/settings"}>
        <FaCog /> Settings
      </NavItem>

      {role && (role === "ADMIN" || role === "SUPERADMIN") && (
          <NavItem href="/admin" $active={pathname?.startsWith("/admin")}>
            <FaLock /> Admin
          </NavItem>
            )}

      </TopSection>
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </LogoutButton>
    </SidebarContainer>
  );
}
