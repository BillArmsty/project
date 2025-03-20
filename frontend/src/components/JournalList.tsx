"use client";

import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import Link from "next/link";

// GraphQL Query
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
  background: #111827;
  padding: 15px;
  border-radius: 5px;
  text-decoration: none;
  color: white;
  transition: 0.3s;

  &:hover {
    background: #1e293b;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #007bff;
  color: white;
  font-size: 1rem;

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #0056b3;
  }
`;

const ITEMS_PER_PAGE = 5;

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function JournalList() {
  const { loading, error, data } = useQuery(GET_JOURNALS, {
    fetchPolicy: "network-only",
  });

  const [currentPage, setCurrentPage] = useState(1);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading journals</p>;

  const journals = data?.getJournalEntries || [];

  // Pagination Logic
  const totalPages = Math.ceil(journals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJournals = journals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <ListContainer>
      {paginatedJournals.length > 0 ? (
        paginatedJournals.map((journal: JournalEntry) => (
          <JournalItem key={journal.id} href={`/dashboard/edit/${journal.id}`}>
            <h3>{journal.title}</h3>
            <p>{journal.content.substring(0, 50)}...</p>
            <small>{journal.category}</small>
          </JournalItem>
        ))
      ) : (
        <p>No journals found.</p>
      )}

      {/* Pagination Controls */}
      <PaginationContainer>
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PaginationButton>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </PaginationButton>
      </PaginationContainer>
    </ListContainer>
  );
}
