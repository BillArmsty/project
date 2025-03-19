"use client";

import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import Link from "next/link";

// ✅ Define TypeScript Interface for Journal Entry
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

// ✅ GraphQL Query to Fetch Journals
const GET_JOURNALS = gql`
  query GetJournals {
    getJournalEntries {
      id
      title
      content
      category
      createdAt
    }
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const JournalItem = styled(Link)`
  background: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
  text-decoration: none;
  color: black;
  transition: 0.3s;

  &:hover {
    background: #ddd;
  }
`;

export default function JournalList() {
  const { loading, error, data } = useQuery<{
    getJournalEntries: JournalEntry[];
  }>(GET_JOURNALS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading journals</p>;

  return (
    <ListContainer>
      {data?.getJournalEntries.map((journal) => (
        <JournalItem key={journal.id} href={`/dashboard/edit/${journal.id}`}>
          <h3>{journal.title}</h3>
          <p>{journal.content.substring(0, 50)}...</p>
          <small>{journal.category}</small>
        </JournalItem>
      ))}
    </ListContainer>
  );
}
