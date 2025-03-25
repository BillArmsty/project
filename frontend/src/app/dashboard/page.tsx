"use client";

import styled from "styled-components";
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
import { FaPlus } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import JournalList from "../../components/JournalList";

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

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  tags?: string[];
}

const CATEGORIES = ["ALL", "PERSONAL", "WORK", "EDUCATION", "TRAVEL", "OTHER"];

export default function Dashboard() {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isRefreshing] = useState(false);

  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRIES, {
    variables: selectedTag ? { tags: [selectedTag] } : {},
  });

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading journals</p>;

  const allEntries = data?.getJournalEntries || [];

  const filteredEntries = allEntries.filter((entry: JournalEntry) => {
    const matchesCategory =
      selectedCategory === "ALL" || entry.category === selectedCategory;
    const matchesTag = !selectedTag || (entry.tags || []).includes(selectedTag);
    return matchesCategory && matchesTag;
  });

  const uniqueTags: string[] = Array.from(
    new Set<string>(
      allEntries.flatMap((entry: JournalEntry) => entry.tags ?? [])
    )
  );

  const categoryCounts = filteredEntries.reduce(
    (acc: Record<string, number>, entry: JournalEntry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const wordCountsByDate = filteredEntries.reduce(
    (acc: Record<string, number>, entry: JournalEntry) => {
      const date = entry.createdAt.split("T")[0];
      acc[date] = (acc[date] || 0) + entry.content.split(" ").length;
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
        {/* Category Filter */}
        <FilterContainer>
          {CATEGORIES.map((cat) => (
            <FilterButton
              key={cat}
              selected={selectedCategory === cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedTag(null);
              }}
            >
              {cat}
            </FilterButton>
          ))}
        </FilterContainer>

        {/* Tag Filter Dropdown */}
        {uniqueTags.length > 0 && (
          <select
            value={selectedTag || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedTag(e.target.value || null)
            }
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
            {uniqueTags.map((tag: string) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}

        <GridLayout>
          <SummaryBox>
            <TotalEntries>Total Entries</TotalEntries>
            {filteredEntries.length === 0 ? (
              <BigPlusButton onClick={() => router.push("/dashboard/create")}>
                <FaPlus />
              </BigPlusButton>
            ) : (
              <>
                <h1 style={{ fontSize: "8rem", margin: 0 }}>
                  {filteredEntries.length}
                </h1>
                <AddMoreButton onClick={() => router.push("/dashboard/create")}>
                  Add More
                </AddMoreButton>
              </>
            )}
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
              journals={filteredEntries}
              onDelete={() => router.refresh()}
            />
          </JournalContainer>

          <ChartContainer>
            <h2>Category Distribution</h2>
            <Pie data={categoryChartData} />
          </ChartContainer>
        </GridLayout>

        {isRefreshing && (
          <LoaderOverlay>
            <Spinner />
          </LoaderOverlay>
        )}
      </ContentArea>
    </DashboardContainer>
  );
}

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${({ theme }) => theme.background};
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button<{ selected: boolean }>`
  background: ${({ selected, theme }) =>
    selected ? theme.button : theme.card};
  color: ${({ selected, theme }) => (selected ? "white" : theme.text)};
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
    color: white;
  }
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
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 50px;
  border-radius: 10px;
  text-align: center;
  height: 410px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const TotalEntries = styled.h2`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const BigPlusButton = styled.button`
  font-size: 5rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.button};
  }
`;

const AddMoreButton = styled.button`
  margin-top: 20px;
  background: ${({ theme }) => theme.button};
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  border-radius: 10px;
  height: 414px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const JournalContainer = styled.div`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  height: 420px;
`;

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
  border: 5px solid ${({ theme }) => theme.button};
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
