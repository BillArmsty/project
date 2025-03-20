"use client";

import { useState } from "react";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
// import JournalList from "../../components/JournalList";
import { gql, useQuery } from "@apollo/client";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  PointElement,
} from "chart.js";
import { useRouter } from "next/navigation";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  PointElement
);

// GraphQL Query to Get Journals
const GET_JOURNAL_ENTRIES = gql`
  query GetJournalEntries {
    getJournalEntries {
      id
      title
      content
      category
      createdAt
    }
  }
`;

// **Styled Components**
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryBox = styled.div`
  background: #1e1e2e;
  color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SectionTitle = styled.h2`
  color: white;
  margin-bottom: 15px;
  text-align: center;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 1rem;
  cursor: pointer;
  gap: 10px;
  margin-bottom: 15px;
  width: fit-content;

  &:hover {
    background: #0056b3;
  }
`;

const JournalContainer = styled.div`
  background: #1e1e2e;
  color: white;
  padding: 20px;
  border-radius: 10px;
`;

const ChartContainer = styled.div`
  background: #1e1e2e;
  color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRIES);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading journals</p>;

  const entries = data?.getJournalEntries || [];

  // 📊 Category Distribution (Pie Chart)
  const categoryCounts = entries.reduce(
    (acc: Record<string, number>, entry: JournalEntry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const categoryChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Entries per Category",
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF9800",
        ],
      },
    ],
  };

  // 📈 Word Count Trends
  const wordCountsByDate = entries.reduce(
    (acc: Record<string, number>, entry: JournalEntry) => {
      const date = entry.createdAt.split("T")[0];
      acc[date] = (acc[date] || 0) + entry.content.split(" ").length;
      return acc;
    },
    {}
  );

  const wordCountChartData = {
    labels: Object.keys(wordCountsByDate),
    datasets: [
      {
        label: "Word Count",
        data: Object.values(wordCountsByDate),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  // ** Pagination Logic **
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = entries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <DashboardContainer>
      <Sidebar />
      <ContentArea>
        {/* Add Journal Button */}
        <AddButton onClick={() => router.push("/dashboard/create")}>
          <FaPlus /> Add Journal
        </AddButton>

        <GridLayout>
          {/* 📌 Total Entries (Top-Left) */}
          <SummaryBox>
            <SectionTitle>Total Entries</SectionTitle>
            <h2>{entries.length}</h2>
          </SummaryBox>

          {/* 📌 Word Count Trends (Top-Right) */}
          <SummaryBox>
            <SectionTitle>Word Count Over Time</SectionTitle>
            <Line data={wordCountChartData} />
          </SummaryBox>

          {/* 📌 Paginated List of Journals (Bottom-Left) */}
          <JournalContainer>
            <SectionTitle>My Journals</SectionTitle>
            {paginatedEntries.length > 0 ? (
              paginatedEntries.map((entry: JournalEntry) => (
                <div
                  key={entry.id}
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    background: "#2a2a3d",
                    borderRadius: "5px",
                  }}
                >
                  <h3>{entry.title}</h3>
                  <p>{entry.content.substring(0, 50)}...</p>
                  <small>{entry.category}</small>
                </div>
              ))
            ) : (
              <p>No journals found.</p>
            )}

            {/* Pagination Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  background: "#007bff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  background: "#007bff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          </JournalContainer>

          {/* 📌 Category Distribution Pie Chart (Bottom-Right) */}
          <ChartContainer>
            <SectionTitle>Category Distribution</SectionTitle>
            <Pie data={categoryChartData} />
          </ChartContainer>
        </GridLayout>
      </ContentArea>
    </DashboardContainer>
  );
}
