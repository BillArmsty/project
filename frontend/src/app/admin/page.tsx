"use client";

import dynamic from "next/dynamic";
import styled from "styled-components";

const AdminDashboard = dynamic(() => import("@/components/AdminDashboard"), {
  ssr: false,
});

const ContentWrapper = styled.div`
  padding: 40px 60px;
  margin-left: 240px; 
  height: 400vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center; 
`;

export default function AdminPage() {
  return (
    <ContentWrapper>
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <AdminDashboard />
    </div>
  </ContentWrapper>
  );
}
