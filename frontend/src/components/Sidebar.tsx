"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled, { keyframes } from "styled-components";
import {
  FaHome,
  FaBook,
  FaChartBar,
  FaCog,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const WHO_AM_I = gql`
  query WhoAmI {
    whoAmI {
      id
      email
      role
    }
  }
`;

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

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.background};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const Spinner = styled.div`
  width: 45px;
  height: 45px;
  border: 4px solid ${({ theme }) => theme.primary};
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export default function Sidebar() {
  const pathname = usePathname();
  const { data, loading, error } = useQuery(WHO_AM_I);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const role = data?.whoAmI?.role;

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0;";
    document.cookie = "refresh_token=; path=/; max-age=0;";
    window.location.href = "/";
  };

  if (loading) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  if (error || !role) {
    return null;
  }

  return (
    <IconContext.Provider value={{ style: { verticalAlign: "middle" } }}>
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

          {isMounted && (role === "ADMIN" || role === "SUPERADMIN") && (
            <NavItem href="/admin" $active={pathname === "/admin"}>
              <FaLock /> Admin
            </NavItem>
          )}
        </TopSection>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </LogoutButton>
      </SidebarContainer>
    </IconContext.Provider>
  );
}
