"use client";

import { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import styled, { createGlobalStyle } from "styled-components";
import TagInput from "@/components/Tag";
// import { Tag } from "react-tag-input";

// ✅ GraphQL
const GET_JOURNAL_ENTRY = gql`
  query GetJournalEntry($id: String!) {
    getJournalEntry(id: $id) {
      id
      title
      content
      category
      tags
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
      tags
    }
  }
`;

const ANALYZE_JOURNAL = gql`
  mutation AnalyzeJournal($input: AnalyzeJournalInput!) {
    analyzeJournal(input: $input) {
      summary
    }
  }
`;

const CATEGORIES = ["PERSONAL", "WORK", "EDUCATION", "TRAVEL", "OTHER"];

// ✅ Styled Components
const FormContainer = styled.div`
  max-width: 720px;
  margin: 280px auto;
  padding: 30px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
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

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const SaveButton = styled.button`
  flex: 1;
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

const SuggestionButton = styled.button`
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

const GlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow: hidden;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

export default function EditJournal() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [tags, setTags] = useState<string[]>([]);

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
      setTags(entry.tags ?? []);
    }
  }, [data]);

  useEffect(() => {
    console.log("📝 Tags (Edit):", tags);
  }, [tags]);

  const [updateJournalEntry] = useMutation(UPDATE_JOURNAL_ENTRY);
  const [analyzeJournal, { loading: analyzing }] = useMutation(ANALYZE_JOURNAL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateJournalEntry({
        variables: {
          data: {
            id,
            title,
            content,
            category,
            tags,
          },
        },
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleGenerateSuggestion = async () => {
    try {
      const { data } = await analyzeJournal({
        variables: { input: { content } },
      });

      if (data?.analyzeJournal?.summary) {
        setContent(data.analyzeJournal.summary);
      }
    } catch (error) {
      console.error("AI generation failed:", error);
    }
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
          <div style={{ marginBottom: "15px" }}>
            <h4>Tags</h4>
            <TagInput tags={tags} setTags={setTags} />
          </div>

          <ButtonRow>
            <SaveButton type="submit">Save Changes</SaveButton>
            <SuggestionButton
              type="button"
              onClick={handleGenerateSuggestion}
              disabled={analyzing}
            >
              {analyzing ? "Thinking..." : "Generate Suggestion"}
            </SuggestionButton>
          </ButtonRow>
        </form>
      </FormContainer>
    </>
  );
}
