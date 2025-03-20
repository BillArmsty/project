import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";

// Define the type for a journal entry
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

// Styled Component for Journal Items
const JournalItem = styled.div`
  background: #2a2a3d;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #444;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const PaginationButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #0056b3;
  }
`;

export default function JournalList({
  journals,
}: {
  journals: JournalEntry[];
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(journals.length / itemsPerPage);

  // Get the current page's journals
  const displayedJournals = journals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {displayedJournals.map((journal: JournalEntry) => (
        <Link key={journal.id} href={`/dashboard/edit/${journal.id}`}>
          <JournalItem>
            <h4>{journal.title}</h4>
            <p>{journal.content.substring(0, 50)}...</p>
            <small>📌 {journal.category}</small>
          </JournalItem>
        </Link>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}
