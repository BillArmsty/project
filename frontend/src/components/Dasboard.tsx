import styled from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  background: #2b2d42;
  padding: 15px;
  color: white;
`;

const HomeButton = styled(Link)`
  color: white;
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
  background: #ef233c;
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ChartContainer = styled.div`
  width: 80%;
  margin: auto;
  background: white;
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
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ef233c" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
}
