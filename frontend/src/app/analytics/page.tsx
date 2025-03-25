"use client";

import { gql, useQuery } from "@apollo/client";
import { Line, Pie } from "react-chartjs-2";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styled from "styled-components";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
// import { FaHome } from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale
);

// 🔹 GraphQL Query for Fetching Journal Entries
const GET_JOURNAL_ENTRIES = gql`
  query GetJournalEntries($tags: [String!]) {
    getJournalEntries(tags: $tags) {
      id
      title
      content
      category
      createdAt
      tags
    }
  }
`;

// 🔹 Styled Components
const AnalyticsContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 20px;
`;

const AnalyticsTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

// 🔹 Type Definitions
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  tags?: string[];
}

export default function Analytics() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRIES, {
    variables: selectedTag ? { tags: [selectedTag] } : {},
  });

  if (loading) return <p>Loading analytics...</p>;
  if (error || !data) return <p>Error fetching journal analytics.</p>;

  const entries: JournalEntry[] = data.getJournalEntries || [];

  const filteredEntries = entries.filter((entry) =>
    selectedTag ? (entry.tags || []).includes(selectedTag) : true
  );

  const uniqueTags: string[] = [
    ...new Set(entries.flatMap((entry) => (entry.tags || []) as string[])),
  ];

  // 1️⃣ 📅 Calendar Heatmap Data
  const heatmapData = entries.map((entry: JournalEntry) => ({
    date: entry.createdAt.split("T")[0],
    count: 1,
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
  const wordCountsByDate = filteredEntries.reduce(
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

  const wordCountChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    layout: {
      padding: 10,
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM dd",
        },
        reverse: false,
        title: {
          display: true,
          text: "Date",
          color: "#ffffff",
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Word Count",
          color: "#ffffff",
        },
      },
    },
  };
  return (
    <AnalyticsContainer>
      <ContentArea>
        <Container>
          <AnalyticsTitle>📊 Journal Analytics</AnalyticsTitle>
          {/* 🔽 Tag Filter Dropdown */}
          {uniqueTags.length > 0 && (
            <select
              value={selectedTag || ""}
              onChange={(e) => setSelectedTag(e.target.value || null)}
              style={{
                marginBottom: "20px",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "1rem",
                background: "#1e1e2e",
                color: "#fff",
                border: "1px solid #555",
              }}
            >
              <option value="">Filter by Tag</option>
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          )}

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
            <ChartContainer>
              <h3>📌 Category Distribution</h3>
              <Pie data={categoryChartData} />
            </ChartContainer>

            {/* 📈 Word Count Trends */}
            <ChartContainer>
              <h3>📈 Word Count Over Time</h3>
              <div style={{ width: "90%", height: "85%" }}>
                <Line
                  data={wordCountChartData}
                  options={wordCountChartOptions}
                />
              </div>
            </ChartContainer>
          </Grid>
        </Container>
      </ContentArea>
    </AnalyticsContainer>
  );
}
