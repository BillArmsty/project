"use client";

import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import styled from "styled-components";
import {User, Role, JournalEntry } from "@/types"; 

const GET_USERS = gql`
  query GetUsers($includeEmpty: Boolean) {
    getUsersWithJournals(includeEmpty: $includeEmpty) {
      id
      email
      role
      entries {
        id
        title
        category
        content
        createdAt
      }
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation UpdateUserRole($userId: String!, $newRole: Role!) {
    updateUserRole(id: $userId, newRole: $newRole) {
      id
      role
    }
  }
`;

const DELETE_JOURNAL = gql`
  mutation DeleteJournal($journalId: String!) {
    deleteJournal(id: $journalId)
  }
`;

export default function AdminDashboard() {
  const [includeEmpty, setIncludeEmpty] = useState(true);
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: { includeEmpty },
  });

  const [updateUserRole] = useMutation(UPDATE_ROLE);
  const [deleteJournal] = useMutation(DELETE_JOURNAL);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    await updateUserRole({ variables: { userId, newRole } });
    refetch();
  };

  const handleDeleteJournal = async (journalId: string) => {
    await deleteJournal({ variables: { journalId } });
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <Wrapper>
      <Content>
        <Header>
          <h1>Admin Dashboard</h1>
          <ToggleButton onClick={() => {
            setIncludeEmpty((prev) => !prev);
            setTimeout(() => refetch({ includeEmpty: !includeEmpty }), 250);
          }}>
            {includeEmpty ? "Show Only Users With Journals" : "View All Users"}
          </ToggleButton>
        </Header>

        <UserGrid>
          {data?.getUsersWithJournals.map((user: User) => (
            <UserCard key={user.id}>
              <strong>{user.email}</strong>
              <p>
                Role:
                <RoleSelect
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPERADMIN">SUPERADMIN</option>
                </RoleSelect>
              </p>

              {user.entries.length > 0 && (
                <div>
                  <strong>Journals</strong>
                  <JournalList>
                    {user.entries.map((entry:JournalEntry) => (
                      <JournalItem key={entry.id}>
                        <span>
                          {entry.title} ({entry.category})
                        </span>
                        <DeleteBtn onClick={() => handleDeleteJournal(entry.id)}>
                          Delete
                        </DeleteBtn>
                      </JournalItem>
                    ))}
                  </JournalList>
                </div>
              )}
            </UserCard>
          ))}
        </UserGrid>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleButton = styled.button`
  padding: 8px 12px;
  font-size: 0.9rem;
  background-color: #3b82f6;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

const UserGrid = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: all 0.3s ease-in-out;
`;

const UserCard = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 20px;
  border-radius: 8px;
  transition: transform 0.2s;
  color: ${({ theme }) => theme.text};

  &:hover {
    transform: translateY(-2px);
  }
`;

const RoleSelect = styled.select`
  margin-left: 8px;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
`;

const JournalList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const JournalItem = styled.li`
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteBtn = styled.button`
  background: #ef4444;
  border: none;
  padding: 4px 8px;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;
