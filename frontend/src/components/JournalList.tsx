"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styled, { createGlobalStyle } from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";

// ✅ GraphQL Mutation
const DELETE_JOURNAL = gql`
  mutation DeleteJournalEntry($id: String!) {
    deleteJournalEntry(id: $id)
  }
`;

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const GlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow: hidden;
    backdrop-filter: blur(10px);
  }
`;

const JournalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 15px;
`;

const JournalCard = styled.div`
  background: #2a2a3d;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid #3a3a4a;
  position: relative;

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
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
`;

const JournalContent = styled.p`
  color: #ddd;
  font-size: 0.9rem;
  margin: 4px 0;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
`;

const CategoryTag = styled.span<{ color?: string }>`
  background: ${(props) => props.color || "#777"};
  color: white;
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: bold;
`;

const DeleteButton = styled.button`
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #d9363e;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #1e1e2e;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  color: white;
  width: 350px;
  max-width: 90%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h3`
  margin-bottom: 15px;
  font-size: 1rem;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const ConfirmButton = styled.button`
  background: #ff4d4f;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #d9363e;
  }
`;

const CancelButton = styled.button`
  background: #3a3a4a;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #555;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 5px;
  font-size: 0.9rem;
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

// ✅ Loader
const LoaderOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid white;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const categoryColors: Record<string, string> = {
  PERSONAL: "#ff6384",
  WORK: "#36a2eb",
  EDUCATION: "#ffce56",
  TRAVEL: "#4caf50",
  OTHER: "#9c27b0",
};

export default function JournalList({
  journals,
  onDelete,
}: {
  journals: JournalEntry[];
  onDelete: () => void;
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    null
  );
  const [deleteJournal] = useMutation(DELETE_JOURNAL);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 2;
  const totalPages = Math.ceil(journals.length / itemsPerPage);

  useEffect(() => {
    document.body.classList.toggle("modal-open", modalIsOpen);
  }, [modalIsOpen]);

  const openDeleteModal = (id: string) => {
    setSelectedJournalId(id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedJournalId(null);
  };

  const confirmDelete = async () => {
    if (!selectedJournalId) return;
    setIsDeleting(true);

    try {
      await deleteJournal({ variables: { id: selectedJournalId } });
      toast.success("Journal deleted successfully!");
      onDelete(); // 🔁 Triggers dashboard refresh
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Delete failed.");
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const displayedJournals = journals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <GlobalStyle />
      <JournalContainer>
        {displayedJournals.map((journal) => (
          <JournalCard key={journal.id}>
            <JournalHeader>
              <Link href={`/dashboard/edit/${journal.id}`}>
                <JournalTitle>{journal.title}</JournalTitle>
              </Link>
              <DeleteButton onClick={() => openDeleteModal(journal.id)}>
                Delete
              </DeleteButton>
            </JournalHeader>
            <JournalContent>
              {journal.content.substring(0, 100)}...
            </JournalContent>
            <BottomSection>
              <CategoryTag color={categoryColors[journal.category]}>
                {journal.category}
              </CategoryTag>
            </BottomSection>
          </JournalCard>
        ))}
      </JournalContainer>

      {/* Pagination */}
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

      {/* Confirmation Modal */}
      {modalIsOpen && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>
              Are you sure you want to delete this journal?
            </ModalTitle>
            <ModalButtonContainer>
              <CancelButton onClick={closeModal}>Cancel</CancelButton>
              <ConfirmButton onClick={confirmDelete}>Delete</ConfirmButton>
            </ModalButtonContainer>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Loader */}
      {isDeleting && (
        <LoaderOverlay>
          <Spinner />
        </LoaderOverlay>
      )}
    </>
  );
}
