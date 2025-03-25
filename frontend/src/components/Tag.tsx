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

  .ReactTags__tagInput {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .ReactTags__tagInputField {
    padding: 10px 12px;
    font-size: 1rem;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 6px;
    width: 100%;
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) => theme.inputText};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary || "#3b82f6"};
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
  }

  .ReactTags__selected {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .ReactTags__tag {
    background: ${({ theme }) => theme.highlight};
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
  const handleDelete = (i: number) => {
    setTags(tags.filter((_, index) => index !== i));
  };

  const handleAddition = (tag: Tag) => {
    setTags([...tags, tag.text]);
  };

  return (
    <TagWrapper>
      <ReactTags
        tags={tags.map((text, i) => ({
          id: i.toString(),
          text,
          className: "",
        }))}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        inputFieldPosition="bottom"
        placeholder="Add new tag"
      />
    </TagWrapper>
  );
}

