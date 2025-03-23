"use client";

import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import JournalList from "../../components/JournalList";
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
import { useState } from "react";

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

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

// Styling
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background:${({ theme }) => theme.background};;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  background:${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryBox = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 50px;
  border-radius: 10px;
  text-align: center;
  height: 340px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TotalEntries = styled.h2`
  font-size: 10rem;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  border-radius: 10px;
  height: 414px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.background};
  color:${({ theme }) => theme.text};
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 1rem;
  gap: 10px;
  cursor: pointer;

  &:hover {
    background:${({ theme }) => theme.background};
  }
`;

const JournalContainer = styled.div`
  background:${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  height: 430px;
  overflow-y: auto;
`;

// Loader Overlay
const LoaderOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.background};
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #007bff;
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function Dashboard() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRIES);
  const [isRefreshing] = useState(false);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading journals</p>;

  const entries = data?.getJournalEntries || [];

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

  const wordCountsByDate = entries.reduce(
    (acc: Record<string, number>, entry: JournalEntry) => {
      const date = entry.createdAt.split("T")[0];
      acc[date] = (acc[date] || 0) + entry.content.split(" ").length;
      return acc;
    },
    {}
  );

  const wordCountChartData = {
    labels: Object.keys(wordCountsByDate).reverse(),
    datasets: [
      {
        label: "Word Count",
        data: Object.values(wordCountsByDate),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        pointRadius: 4,
      },
    ],
  };

  const wordCountChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      x: { title: { display: true, text: "Date", color: "#fff" } },
      y: { title: { display: true, text: "Word Count", color: "#fff" } },
    },
  };

  
  

  return (
    <DashboardContainer>
      <Sidebar />
      <ContentArea>
        <AddButton onClick={() => router.push("/dashboard/create")}>
          <FaPlus /> Add Journal
        </AddButton>

        <GridLayout>
          <SummaryBox>
            <h2>Total Entries</h2>
            <TotalEntries>{entries.length}</TotalEntries>
          </SummaryBox>

          <ChartContainer>
            <h2>Word Count Over Time</h2>
            <div style={{ width: "80%", height: "80%" }}>
              <Line data={wordCountChartData} options={wordCountChartOptions} />
            </div>
          </ChartContainer>

          <JournalContainer>
            <h2>My Journals</h2>
            <JournalList
              journals={entries}
              onDelete={()=> {
                router.refresh()
              }}
            />{" "}
          </JournalContainer>

          <ChartContainer>
            <h2>Category Distribution</h2>
            <Pie data={categoryChartData} />
          </ChartContainer>
        </GridLayout>
      </ContentArea>

      {isRefreshing && (
        <LoaderOverlay>
          <Spinner />
        </LoaderOverlay>
      )}
    </DashboardContainer>
  );
}
