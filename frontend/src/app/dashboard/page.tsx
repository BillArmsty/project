"use client";

import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import JournalList from "../../components/JournalList";

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

export default function Dashboard() {
  return (
    <DashboardContainer>
      <Sidebar />
      <ContentArea>
        <h1>My Journals</h1>
        <JournalList />
      </ContentArea>
    </DashboardContainer>
  );
}
