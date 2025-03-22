"use client";

import { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import styled, { createGlobalStyle } from "styled-components";

// ✅ GraphQL
const GET_JOURNAL_ENTRY = gql`
  query GetJournalEntry($id: String!) {
    getJournalEntry(id: $id) {
      id
      title
      content
      category
    }
  }
`;

const UPDATE_JOURNAL_ENTRY = gql`
  mutation UpdateJournalEntry($data: UpdateJournalInput!) {
    updateJournalEntry(data: $data) {
      id
      title
      content
      category
    }
  }
`;

// ✅ Categories
const CATEGORIES = ["PERSONAL", "WORK", "EDUCATION", "TRAVEL", "OTHER"];

// ✅ Styled Components
const FormContainer = styled.div`
  max-width: 720px;
  margin: 280px auto;
  padding: 30px;
  background: #2a2a3d;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #1e1e2e;
  color: white;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #1e1e2e;
  color: white;
  min-height: 120px;
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const CategoryBubble = styled.button<{ selected: boolean }>`
  padding: 6px 12px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background: ${({ selected }) => (selected ? "#3b82f6" : "#444")};
  color: white;
  font-size: 0.85rem;
  &:hover {
    background: #2563eb;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #2563eb;
  }
`;

// ✅ Modal Overlay & Popup
const GlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow: hidden;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: #1e1e2e;
  padding: 30px;
  max-width: 90%;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  color: white;
`;

const ModalTitle = styled.h3`
  margin-bottom: 15px;
`;

const CloseButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #2563eb;
  }
`;

export default function EditJournal() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [showModal, setShowModal] = useState(false);

  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRY, {
    variables: { id },
    skip: !id,
  });

  useEffect(() => {
    if (data?.getJournalEntry) {
      const entry = data.getJournalEntry;
      setTitle(entry.title);
      setContent(entry.content);
      setCategory(entry.category);
    }
  }, [data]);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showModal]);

  const [updateJournalEntry] = useMutation(UPDATE_JOURNAL_ENTRY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateJournalEntry({
        variables: {
          data: { id, title, content, category },
        },
      });

      setShowModal(true);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/dashboard");
  };

  if (loading) return <p>Loading journal...</p>;
  if (error) return <p>Error loading journal entry.</p>;

  return (
    <>
      <GlobalStyle />
      <FormContainer>
        <h2>Edit Journal Entry</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Journal Title"
            required
          />
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your journal entry..."
            required
          />
          <h4>Category</h4>
          <CategoryContainer>
            {CATEGORIES.map((cat) => (
              <CategoryBubble
                key={cat}
                selected={cat === category}
                onClick={() => setCategory(cat)}
                type="button"
              >
                {cat}
              </CategoryBubble>
            ))}
          </CategoryContainer>

          <SaveButton type="submit">Save Changes</SaveButton>
        </form>
      </FormContainer>

      {/* ✅ Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>✅ Journal Updated Successfully!</ModalTitle>
            <CloseButton onClick={handleCloseModal}>
              Go to Dashboard
            </CloseButton>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  );
}
