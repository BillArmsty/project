import styled from "styled-components";
import Link from "next/link";

const SidebarContainer = styled.div`
  width: 250px;
  height: 100%;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const NavItem = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #34495e;
  }
`;

export default function Sidebar() {
  return (
    <SidebarContainer>
      <h2>Journify</h2>
      <NavItem href="/dashboard">Dashboard</NavItem>
      <NavItem href="/dashboard/create">New Entry</NavItem>
    </SidebarContainer>
  );
}
