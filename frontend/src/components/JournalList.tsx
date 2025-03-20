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

// Styled Components
const JournalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 15px; 
`;

const JournalCard = styled.div`
  background: #2a2a3d;
  padding: 15px;
  border-radius: 10px;
  transition: background 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #3a3a4a;

  &:hover {
    background: #444;
  }
`;

const JournalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const JournalTitle = styled.h4`
  color: #007bff;
  font-size: 1.1rem;
  margin: 0;
`;

const JournalContent = styled.p`
  color: #ddd;
  font-size: 0.9rem;
  margin: 5px 0;
`;

const CategoryTag = styled.span`
  background: ${(props) => (props.color ? props.color : "#777")};
  color: white;
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: bold;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px; /* 
  padding-bottom: 10px; 
`;

const PaginationButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1rem;
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

// Category Color Mapping
const categoryColors: Record<string, string> = {
  PERSONAL: "#ff6384",
  WORK: "#36a2eb",
  EDUCATION: "#ffce56",
  TRAVEL: "#4caf50",
  OTHER: "#9c27b0",
};

export default function JournalList({
  journals,
}: {
  journals: JournalEntry[];
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(journals.length / itemsPerPage);

  // Get the current page's journals
  const displayedJournals = journals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <JournalContainer>
      {displayedJournals.map((journal: JournalEntry) => (
        <Link key={journal.id} href={`/dashboard/edit/${journal.id}`}>
          <JournalCard>
            <JournalHeader>
              <JournalTitle>{journal.title}</JournalTitle>
              <CategoryTag color={categoryColors[journal.category] || "#777"}>
                {journal.category}
              </CategoryTag>
            </JournalHeader>
            <JournalContent>{journal.content.substring(0, 100)}...</JournalContent>
          </JournalCard>
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
    </JournalContainer>
  );
}
