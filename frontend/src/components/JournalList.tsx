"use client";

import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import Link from "next/link";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const JournalCard = styled(Link)`
  background: #2b2d42;
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-decoration: none;
  transition: 0.3s;
  &:hover {
    background: #ef233c;
  }
`;

export default function JournalList() {
  const { loading, error, data } = useQuery<{
    getJournalEntries: JournalEntry[];
  }>(GET_JOURNALS, {
    fetchPolicy: "network-only",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading journals</p>;

  return (
    <ListContainer>
      {data?.getJournalEntries?.length ? (
        data.getJournalEntries.map((journal) => (
          <JournalCard key={journal.id} href={`/dashboard/edit/${journal.id}`}>
            <h3>{journal.title}</h3>
            <p>{journal.content.substring(0, 50)}...</p>
            <small>{journal.category}</small>
          </JournalCard>
        ))
      ) : (
        <p>No journals found.</p>
      )}
    </ListContainer>
  );
}
