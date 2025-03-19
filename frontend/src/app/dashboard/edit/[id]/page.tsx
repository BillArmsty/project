"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import SuccessModal from "@/components/SuccessModal"; // Import success modal

// GraphQL Queries & Mutations
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

// Categories ENUM
const categories = [
  "PERSONAL",
  "WORK",
  "TRAVEL",
  "HEALTH",
  "FINANCE",
  "EDUCATION",
  "OTHER",
];

// Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #1e1e2e;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background: #2b2d42;
  color: white;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background: #2b2d42;
  color: white;
  height: 120px;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background: #2b2d42;
  color: white;
`;

const Button = styled.button`
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background: #0056b3;
  }
`;

export default function EditJournal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRY, {
    variables: { id },
  });

  const [updateJournalEntry] = useMutation(UPDATE_JOURNAL_ENTRY);

  // State for Form Fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("PERSONAL");
  const [showSuccess, setShowSuccess] = useState(false);

  // Populate form fields when data is available
  useEffect(() => {
    if (data?.getJournalEntry) {
      setTitle(data.getJournalEntry.title);
      setContent(data.getJournalEntry.content);
      setCategory(data.getJournalEntry.category);
    }
  }, [data]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateJournalEntry({
        variables: { data: { id, title, content, category } },
      });
      setShowSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      console.error("Update failed", err);
      alert("Error updating journal");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching journal</p>;

  return (
    <>
      {showSuccess && (
        <SuccessModal
          message="Journal updated successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <Container>
        <Title>Edit Journal</Title>
        <Form onSubmit={handleUpdate}>
          <Label>Title:</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Label>Content:</Label>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <Label>Category:</Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          <Button type="submit">Save Changes</Button>
        </Form>
      </Container>
    </>
  );
}
