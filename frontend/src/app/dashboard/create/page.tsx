"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import TagInput from "@/components/Tag";
// import { Tag } from "react-tag-input";

// ✅ Create Journal Mutation
const CREATE_JOURNAL = gql`
  mutation CreateJournal($data: CreateJournalInput!) {
    createJournalEntry(data: $data) {
      id
    }
  }
`;

// ✅ Analyze Journal Mutation
const ANALYZE_JOURNAL = gql`
  mutation AnalyzeJournal($input: AnalyzeJournalInput!) {
    analyzeJournal(input: $input) {
      summary
    }
  }
`;

// ✅ Categories
const CATEGORIES = ["PERSONAL", "WORK", "EDUCATION", "TRAVEL", "OTHER"];

const FormContainer = styled.div`
  max-width: 720px;
  margin: 120px auto;
  padding: 30px;
  background: ${({ theme }) => theme.background};
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #555;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #555;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 180px;
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
  color: ${({ theme }) => theme.text};
  font-size: 0.85rem;
  &:hover {
    background: #2563eb;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
  font-weight: bold;
  cursor: pointer;
`;

const AiButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  background: #10b981;
  color: white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #059669;
  }
`;

export default function CreateJournal() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [loadingAI, setLoadingAI] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const [createJournalEntry] = useMutation(CREATE_JOURNAL);
  const [analyzeJournal] = useMutation(ANALYZE_JOURNAL);

  useEffect(() => {
    console.log("🧠 Tags (Create):", tags);
  }, [tags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const plainTags = tags.map((t) => t.text);

    console.log("Creating journal with data:", {
      title,
      content,
      category,
      tags,
    });

    try {
      await createJournalEntry({
        variables: {
          data: { title, content, category, tags },
        },
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating journal:", err);
    }
  };

  const handleAISuggestion = async () => {
    if (!content.trim()) return;
    setLoadingAI(true);
    try {
      const res = await analyzeJournal({ variables: { input: { content } } });
      const suggestion = res.data?.analyzeJournal?.summary;
      if (suggestion) {
        setContent(suggestion);
      }
    } catch (err) {
      console.error("AI Suggestion failed:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <FormContainer>
      <h2>Create New Journal</h2>
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
          placeholder="Write your journal entry or use AI to generate one..."
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
        <>
          <label>Tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </>

        <ButtonGroup>
          <SaveButton type="submit">Save Journal</SaveButton>
          <AiButton
            type="button"
            onClick={handleAISuggestion}
            disabled={loadingAI}
          >
            {loadingAI ? "Generating..." : "Get AI Suggestion"}
          </AiButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
}
