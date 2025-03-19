"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { useRouter } from "next/navigation";

// GraphQL Mutation to Create Journal Entry
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 150px;
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

export default function CreateJournalPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  const [createJournal] = useMutation(CREATE_JOURNAL_ENTRY, {
    onCompleted: () => router.push("/dashboard"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJournal({
      variables: {
        data: { title, content, category },
      },
    });
  };

  return (
    <div>
      <h1>Create Journal Entry</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="Write your journal..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Category (e.g., PERSONAL, WORK)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <SubmitButton type="submit">Save Journal</SubmitButton>
      </Form>
    </div>
  );
}
