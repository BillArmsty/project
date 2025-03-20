"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import styled from "styled-components";
import SuccessModal from "@/components/SuccessModal"; 
import OpenAI from "openai"; 

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
  dangerouslyAllowBrowser: true,
});

// 📌 GraphQL Queries & Mutations
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

// 📌 Category Options
const categories = [
  "PERSONAL",
  "WORK",
  "TRAVEL",
  "HEALTH",
  "FINANCE",
  "EDUCATION",
  "OTHER",
];

// 📌 Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #1e1e2e;
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background: #2a2a3d;
  color: white;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  height: 100px;
  background: #2a2a3d;
  color: white;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background: #2a2a3d;
  color: white;
`;

const Button = styled.button`
  padding: 10px;
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

const AutoSuggestMessage = styled.p`
  font-size: 0.9rem;
  color: #ff9800;
  margin-top: 5px;
  text-align: right;
`;

export default function EditJournal({ params }: { params: { id: string } }) {
  const [showSuccess, setShowSuccess] = useState(false);
  // const router = useRouter();

  // 📌 Fetch Journal Entry
  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRY, {
    variables: { id: params.id },
  });

  // 📌 Mutation to Update Journal
  const [updateJournalEntry] = useMutation(UPDATE_JOURNAL_ENTRY);

  // 📌 State for Form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("PERSONAL");
  const [suggestedCategory, setSuggestedCategory] = useState("");

  // 📌 Populate State When Data is Available
  useEffect(() => {
    if (data?.getJournalEntry) {
      setTitle(data.getJournalEntry.title);
      setContent(data.getJournalEntry.content);
      setCategory(data.getJournalEntry.category);
    }
  }, [data]);

  // 📌 Auto-Suggest Category using OpenAI GPT
  const autoSuggestCategory = async (text: string) => {
    if (text.length < 10) return; 

    try {
      const response = await openai.completions.create({
        model: "gpt-4",
        prompt: `Analyze this journal entry and suggest a category from these options: ${categories.join(
          ", "
        )}.\n\nEntry: "${text}"\n\nCategory:`,
        max_tokens: 10,
      });

      const suggested = response.choices[0]?.text.trim().toUpperCase();
      if (categories.includes(suggested)) {
        setSuggestedCategory(suggested);
      } else {
        setSuggestedCategory(""); // Reset if invalid
      }
    } catch (error) {
      console.error("Auto-suggest failed:", error);
    }
  };

  // 📌 Handle Content Change & Auto-Suggest
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    autoSuggestCategory(text);
  };

  // 📌 Handle Form Submission
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateJournalEntry({
        variables: {
          data: {
            id: params.id,
            title,
            content,
            category: suggestedCategory || category, 
          },
        },
      });

      setShowSuccess(true); // ✅ Show success modal
    } catch (err) {
      console.error("Update failed", err);
      alert("Error updating journal");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching journal</p>;

  return (
    <>
      {/* ✅ Success Modal */}
      {showSuccess && (
        <SuccessModal
          message="Journal updated successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <Container>
        <Title>📝 Edit Journal</Title>
        <Form onSubmit={handleUpdate}>
          {/* 📌 Title Input */}
          <label>Title:</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />

          {/* 📌 Content Input (Triggers Auto-Suggest) */}
          <label>Content:</label>
          <TextArea value={content} onChange={handleContentChange} />

          {/* 📌 Category Select (Auto-Suggested if Available) */}
          <label>Category:</label>
          <Select
            value={suggestedCategory || category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          {suggestedCategory && (
            <AutoSuggestMessage>
              🔍 Suggested Category: {suggestedCategory}
            </AutoSuggestMessage>
          )}

          {/* 📌 Submit Button */}
          <Button type="submit">Save Changes</Button>
        </Form>
      </Container>
    </>
  );
}
