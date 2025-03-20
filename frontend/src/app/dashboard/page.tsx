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

// ✅ GraphQL Query to Get Journals
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

// **Styled Components**
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #0f172a;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  background: #1e1e2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryBox = styled.div`
  background: #2a2a3d;
  color: white;
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
  margin-top: 10px;
`;

const ChartContainer = styled.div`
  background: #2a2a3d;
  color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 414px;
`;

// ✅ Styled Component for Add Button (Fixes Missing Definition)
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
  width: fit-content;

  &:hover {
    background: #0056b3;
  }
`;

// ✅ Styled Component for Journal Container
const JournalContainer = styled.div`
  background: #2a2a3d;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  height: 430px;
  overflow-y: auto;
`;

// ✅ Chart Data Processing
export default function Dashboard() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRIES);

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
    labels: Object.keys(wordCountsByDate).reverse(), 
    datasets: [
      {
        label: "Word Count",
        data: Object.values(wordCountsByDate),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const wordCountChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        reverse: true, 
        title: {
          display: true,
          text: "Date",
          color: "#ffffff",
        },
      },
      y: {
        title: {
          display: true,
          text: "Word Count",
          color: "#ffffff",
        },
      },
    },
  };

  return (
    <DashboardContainer>
      <Sidebar />
      <ContentArea>
        {/* ✅ Add Journal Button */}
        <AddButton onClick={() => router.push("/dashboard/create")}>
          <FaPlus /> Add Journal
        </AddButton>

        <GridLayout>
          {/* 📌 Total Entries */}
          <SummaryBox>
            <h2>Total Entries</h2>
            <TotalEntries>{entries.length}</TotalEntries> {}
          </SummaryBox>

          {/* 📌 Word Count Trends */}
          <ChartContainer>
            <h2>Word Count Over Time</h2>
            <div style={{ width: "80%", height: "80%" }}>
              {" "}
              {}
              <Line data={wordCountChartData} options={wordCountChartOptions} />
            </div>
          </ChartContainer>

          {/* 📌 List of Journals */}
          <JournalContainer>
            <h2>My Journals</h2>
            <JournalList journals={entries} />
          </JournalContainer>

          {/* 📌 Category Distribution Pie Chart */}
          <ChartContainer>
            <h2>Category Distribution</h2>
            <Pie data={categoryChartData} />
          </ChartContainer>
        </GridLayout>
      </ContentArea>
    </DashboardContainer>
  );
}









