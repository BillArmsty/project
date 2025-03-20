"use client";

import { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import SuccessModal from "@/components/SuccessModal";

// ✅ GraphQL Query to Fetch a Single Journal
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

// ✅ GraphQL Mutation to Update Journal Entry
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

// **Category Options**
const CATEGORIES = ["PERSONAL", "WORK", "EDUCATION", "TRAVEL", "OTHER"];

// ✅ Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #1e1e2e;
  color: white;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
`;

const CategoryBubble = styled.button<{ selected: boolean }>`
  padding: 8px 15px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background: ${({ selected }) => (selected ? "#007bff" : "#444")};
  color: white;
  transition: 0.3s;
  &:hover {
    background: #0056b3;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background: #0056b3;
  }
`;

export default function EditJournal() {
  const params = useParams();
  const router = useRouter();
  const [journalId, setJournalId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("OTHER");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (params?.id) {
      setJournalId(params.id as string);
    }
  }, [params]);

  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRY, {
    variables: { id: journalId },
    skip: !journalId,
  });

  useEffect(() => {
    if (data?.getJournalEntry) {
      setTitle(data.getJournalEntry.title);
      setContent(data.getJournalEntry.content);
      setCategory(data.getJournalEntry.category);

      const lowerCaseContent = data.getJournalEntry.content.toLowerCase();
      if (lowerCaseContent.includes("work")) setCategory("WORK");
      else if (
        lowerCaseContent.includes("school") ||
        lowerCaseContent.includes("study")
      )
        setCategory("EDUCATION");
      else if (
        lowerCaseContent.includes("travel") ||
        lowerCaseContent.includes("trip")
      )
        setCategory("TRAVEL");
      else if (
        lowerCaseContent.includes("personal") ||
        lowerCaseContent.includes("diary")
      )
        setCategory("PERSONAL");
      else setCategory("OTHER");
    }
  }, [data]);

  // ✅ Mutation to update journal
  const [updateJournalEntry] = useMutation(UPDATE_JOURNAL_ENTRY);

  // ✅ Handle Update
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!journalId) return;

    try {
      await updateJournalEntry({
        variables: {
          data: {
            id: journalId,
            title,
            content,
            category,
          },
        },
      });

      // ✅ Show success modal & auto-close after 3s
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // ✅ Error Handling
  if (!journalId) return <p>Invalid journal ID.</p>;
  if (loading) return <p>Loading journal...</p>;
  if (error) {
    console.error("GraphQL Error:", error);
    return <p>Error loading journal.</p>;
  }

  return (
    <Container>
      {/* ✅ Success Modal */}
      {showSuccess && (
        <SuccessModal
          message="Journal Updated Successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <h2>Edit Journal Entry</h2>
      <form onSubmit={handleUpdate}>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your journal..."
          required
        />

        {/* 📌 Category Selection */}
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
    </Container>
  );
}
