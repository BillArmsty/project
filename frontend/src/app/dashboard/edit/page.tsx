"use client";

import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";

// GraphQL Queries & Mutations
const GET_JOURNAL = gql`
  query GetJournal($id: ID!) {
    getJournalEntry(id: $id) {
      id
      title
      content
      category
    }
  }
`;

const UPDATE_JOURNAL = gql`
  mutation UpdateJournal($id: ID!, $data: UpdateJournalInput!) {
    updateJournalEntry(id: $id, data: $data) {
      id
      title
      content
      category
    }
  }
`;

export default function EditJournalPage() {
  const { id } = useParams();
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_JOURNAL, { variables: { id } });
  const [updateJournal] = useMutation(UPDATE_JOURNAL, {
    onCompleted: () => router.push("/dashboard"),
  });

  const [title, setTitle] = useState(data?.getJournalEntry?.title || "");
  const [content, setContent] = useState(data?.getJournalEntry?.content || "");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching journal</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateJournal({ variables: { id, data: { title, content } } });
  };

  return (
    <div>
      <h1>Edit Journal</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
