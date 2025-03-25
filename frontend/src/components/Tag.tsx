"use client";

import { WithContext as ReactTags, Tag } from "react-tag-input";
import styled from "styled-components";

const KeyCodes = { comma: 188, enter: 13 };
const delimiters = [KeyCodes.comma, KeyCodes.enter];

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagWrapper = styled.div`
  margin-top: 10px;

  .ReactTags__tags {
    width: 100%;
    font-size: 1rem;
  }

  .ReactTags__tagInputField {
    padding: 10px 12px;
    font-size: 1rem;
    border: 1px solid ${({ theme }) => theme.border || "#ccc"};
    border-radius: 6px;
    width: 100%;
    background: ${({ theme }) => theme.input || "#1e1e2e"};
    color: ${({ theme }) => theme.text || "#fff"};
  }

  .ReactTags__tag {
    background: #10b981;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .ReactTags__remove {
    margin-left: 6px;
    cursor: pointer;
    font-weight: bold;
  }
`;

export default function TagInput({ tags, setTags }: TagInputProps) {
  // Convert string[] to Tag[] for display
  const tagObjects: Tag[] = tags.map((text, i) => ({
    id: `${i}`,
    text,
    className: "", // Add a default className property
  }));

  const handleAddition = (tag: Tag) => {
    setTags([...tags, tag.text]);
  };

  const handleDelete = (i: number) => {
    setTags(tags.filter((_, index) => index !== i));
  };

  return (
    <TagWrapper>
      <ReactTags
        tags={tagObjects}
        handleAddition={handleAddition}
        handleDelete={handleDelete}
        delimiters={delimiters}
        inputFieldPosition="bottom"
        placeholder="Add new tag"
      />
    </TagWrapper>
  );
}
