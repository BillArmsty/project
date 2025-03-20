"use client";

import { gql, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import SuccessModal from "@/components/SuccessModal";

const CREATE_JOURNAL_ENTRY = gql`
  mutation CreateJournalEntry($data: CreateJournalInput!) {
    createJournalEntry(data: $data) {
      id
      title
      content
      category
    }
  }
`;

// AI-powered auto-category suggestions
const suggestCategory = (content: string): string => {
  if (/finance|money|investment/i.test(content)) return "FINANCE";
  if (/health|fitness|exercise/i.test(content)) return "HEALTH";
  if (/work|job|career/i.test(content)) return "WORK";
  if (/travel|vacation|trip/i.test(content)) return "TRAVEL";
  if (/education|study|learning/i.test(content)) return "EDUCATION";
  return "PERSONAL"; // Default fallback category
};

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 100px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #0056b3;
  }
`;

export default function CreateJournal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (content) {
      setCategory(suggestCategory(content));
    }
  }, [content]);

  const [createJournalEntry] = useMutation(CREATE_JOURNAL_ENTRY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJournalEntry({
        variables: {
          data: { title, content, category: category || "PERSONAL" },
        },
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to create journal", error);
    }
  };

  return (
    <Container>
      <h2>Create Journal Entry</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Journal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          placeholder="Write your journal entry..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Input
          type="text"
          value={category}
          readOnly
          placeholder="Suggested Category (Auto-filled)"
        />
        <Button type="submit">Save Journal</Button>
      </form>
      {showSuccess && (
        <SuccessModal
          message="Journal Created Successfully!"
          onClose={() => router.push("/dashboard")}
        />
      )}
    </Container>
  );
}
