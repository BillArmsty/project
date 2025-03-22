"use client"; 

import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import styled, { createGlobalStyle } from "styled-components";
import { useRouter } from "next/navigation";

// ✅ GraphQL Mutation for Creating a Journal
const CREATE_JOURNAL = gql`
  mutation CreateJournalEntry($data: CreateJournalInput!) {
    createJournalEntry(data: $data) {
      id
      title
      content
      category
      createdAt
    }
  }
`;

// ✅ Global Style to Handle Background Blur Effect
const GlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow: hidden;
    backdrop-filter: blur(8px);
  }
`;

// ✅ Styled Components for UI
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #121212;
  color: white;
`;

const FormContainer = styled.div`
  width: 750px;
  background: #2a2a3d;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #1e1e2e;
  color: white;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #1e1e2e;
  color: white;
  min-height: 120px;
`;

const CategoryLabel = styled.div`
  background: #1e1e2e;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #555;
  color: white;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2563eb;
  }
`;

// ✅ Success Modal with Blur Effect
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1e1e2e;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: white;
  width: 320px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h3`
  margin-bottom: 10px;
`;

const CloseButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #2563eb;
  }
`;

export default function CreateJournal() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "OTHER",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [createJournalEntry, { loading }] = useMutation(CREATE_JOURNAL, {
    onCompleted: () => {
      setModalIsOpen(true);
      document.body.classList.add("modal-open"); 
    },
    onError: (error) => {
      console.error("Journal creation failed:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJournalEntry({ variables: { data: formData } });
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    document.body.classList.remove("modal-open"); 
    setTimeout(() => {
      router.replace("/dashboard");
      // window.location.reload();
    }, 500);
  };

  // ✅ Automatically detect category based on content
  useEffect(() => {
    const value = formData.content.toLowerCase();
    let detectedCategory = "OTHER";

    const categoryKeywords: Record<string, string[]> = {
      PERSONAL: ["family", "diary", "memories"],
      WORK: ["meeting", "project", "deadline", "task"],
      EDUCATION: ["school", "exam", "study", "university"],
      TRAVEL: ["trip", "vacation", "adventure", "flight"],
      HEALTH: ["fitness", "diet", "mental", "doctor"],
      FINANCE: ["money", "investment", "budget", "savings"],
      FITNESS: ["workout", "gym", "running", "training"],
      RELATIONSHIP: ["love", "partner", "dating", "marriage"],
      SPIRITUAL: ["faith", "prayer", "meditation", "soul"],
      GOALS: ["dream", "achievement", "plan", "success"],
      MOTIVATION: ["inspiration", "hustle", "ambition"],
      FOOD: ["recipe", "cooking", "restaurant", "meal"],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => value.includes(keyword))) {
        detectedCategory = category;
        break;
      }
    }

    setFormData((prev) => ({ ...prev, category: detectedCategory }));
  }, [formData.content]);

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <FormContainer>
          <h2>Create Journal</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Journal Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <TextArea
              placeholder="Write your journal entry..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
            <CategoryLabel>Category: {formData.category}</CategoryLabel>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Journal"}
            </Button>
          </form>
        </FormContainer>
      </PageContainer>

      {/* ✅ Success Modal with Blur Effect */}
      {modalIsOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>🎉 Journal Created Successfully! 🎉</ModalTitle>
            <CloseButton onClick={handleModalClose}>Go to Dashboard</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
