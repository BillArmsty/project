"use client";

import { gql, useQuery } from "@apollo/client";
import { Line, Pie } from "react-chartjs-2";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
} from "chart.js";
import { FaHome } from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement
);

// 🔹 GraphQL Query for Fetching Journal Entries
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

// 🔹 Styled Components for Layout
const AnalyticsContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #1e1e2e;
  color: white;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #0f172a;
  border-radius: 8px;
`;

const HomeButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    color: #007bff;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 20px;
`;

const AnalyticsTitle = styled.h2`
  // 🔹 Renamed to avoid conflict
  text-align: center;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

// 🔹 Type Definitions for Data Structure
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function Analytics() {
  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRIES);
  const router = useRouter();

  if (loading) return <p>Loading analytics...</p>;
  if (error || !data) return <p>Error fetching journal analytics.</p>;

  const entries: JournalEntry[] = data.getJournalEntries || [];

  // 1️⃣ 📅 Calendar Heatmap Data
  const heatmapData = entries.map((entry: JournalEntry) => ({
    date: entry.createdAt.split("T")[0], // Extract YYYY-MM-DD
    count: 1, // One entry per day
  }));

  // 2️⃣ 📊 Category Distribution (Pie Chart)
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
          "#9C27B0",
        ],
      },
    ],
  };

  // 3️⃣ 📈 Word Count Trends
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

  return (
    <AnalyticsContainer>
      <Sidebar />
      <ContentArea>
        {/* 🔝 Top Navigation Bar */}
        <TopBar>
          <HomeButton onClick={() => router.push("/")}>
            <FaHome /> Journify Home
          </HomeButton>
        </TopBar>

        <Container>
          <AnalyticsTitle>📊 Journal Analytics</AnalyticsTitle>

          {/* 📅 Calendar Heatmap */}
          <h3>📆 Entry Frequency Calendar</h3>
          <ReactCalendarHeatmap
            startDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) =>
              value ? `color-scale-${Math.min(value.count, 4)}` : "color-empty"
            }
          />

          <Grid>
            {/* 📊 Category Distribution */}
            <div>
              <h3>📌 Category Distribution</h3>
              <Pie data={categoryChartData} />
            </div>

            {/* 📈 Word Count Trends */}
            <div>
              <h3>📈 Word Count Over Time</h3>
              <Line data={wordCountChartData} />
            </div>
          </Grid>
        </Container>
      </ContentArea>
    </AnalyticsContainer>
  );
}
