"use client";

import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";

// GraphQL Query to get journal stats
const GET_STATS = gql`
  query GetStats {
    getJournalStats {
      totalEntries
      categoryCount {
        category
        count
      }
    }
  }
`;

// ✅ Styled Components with Theme Support
const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.navBackground};
  padding: 15px;
  color: ${({ theme }) => theme.text};
`;

const HomeButton = styled(Link)`
  color: ${({ theme }) => theme.text};
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.highlight};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ChartContainer = styled.div`
  width: 80%;
  margin: auto;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  border-radius: 10px;
`;

export default function Dashboard() {
  const { data, loading, error } = useQuery(GET_STATS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading stats</p>;

  return (
    <>
      <Navbar>
        <HomeButton href="/">Journify</HomeButton>
      </Navbar>

      <StatsContainer>
        <StatCard>
          <h3>Total Entries</h3>
          <p>{data.getJournalStats.totalEntries}</p>
        </StatCard>
      </StatsContainer>

      <ChartContainer>
        <h3>Journal Entries by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.getJournalStats.categoryCount}>
            <XAxis dataKey="category" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", color: "#fff" }}
            />
            <Bar dataKey="count" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
}
