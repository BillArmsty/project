"use client";

import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import styled from "styled-components";
import { User, Role, JournalEntry } from "@/types";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

// ─── GraphQL ──────────────────────────────────────────────────────────────────
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

const DELETE_JOURNAL_ENTRY = gql`
  mutation DeleteJournalEntry($id: String!) {
    deleteJournalEntry(id: $id) {
      id
    }
  }
`;

const REMOVE_USER = gql`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id) {
      id
    }
  }
`;


// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [includeEmpty, setIncludeEmpty] = useState(true);
  const [deleteTargetUserId, setDeleteTargetUserId] = useState<string | null>(
    null
  );

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: { includeEmpty },
  });

  const [updateUserRole] = useMutation(UPDATE_ROLE);
  const [deleteJournal] = useMutation(DELETE_JOURNAL_ENTRY);
  const [deleteUser] = useMutation(REMOVE_USER);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    await updateUserRole({ variables: { userId, newRole } });
    refetch();
  };

  const handleDeleteJournal = async (journalId: string) => {
    await deleteJournal({ variables: { id: journalId } });
    refetch();
  };

  const confirmDeleteUser = async () => {
    if (!deleteTargetUserId) return;
    await deleteUser({ variables: { id: deleteTargetUserId } });
    setDeleteTargetUserId(null);
    refetch();
  };

  if (loading) return <LoadingMsg>Loading...</LoadingMsg>;
  if (error) return <ErrorMsg>Error loading users.</ErrorMsg>;

  return (
    <Wrapper>
      <Header>
        <h1>🛠️ Admin Dashboard</h1>
        <ToggleButton
          onClick={() => {
            setIncludeEmpty((prev) => !prev);
            setTimeout(() => refetch({ includeEmpty: !includeEmpty }), 250);
          }}
        >
          {includeEmpty ? "Show Only Users With Journals" : "View All Users"}
        </ToggleButton>
      </Header>

      <UserGrid>
        {data?.getUsersWithJournals.map((user: User) => (
          <UserCard key={user.id}>
            <UserHeader>
              <UserEmail>{user.email}</UserEmail>
              <div>
                <RoleSelect
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value as Role)
                  }
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPERADMIN">SUPERADMIN</option>
                </RoleSelect>
                <DeleteBtn onClick={() => setDeleteTargetUserId(user.id)}>
                  Delete User
                </DeleteBtn>
              </div>
            </UserHeader>

            {user.entries.length > 0 && (
              <JournalList>
                {user.entries.map((entry: JournalEntry) => (
                  <JournalItem key={entry.id}>
                    <EntryInfo>
                      <strong>{entry.title}</strong>
                      <small>({entry.category})</small>
                    </EntryInfo>
                    <DeleteBtn onClick={() => handleDeleteJournal(entry.id)}>
                      Delete
                    </DeleteBtn>
                  </JournalItem>
                ))}
              </JournalList>
            )}
          </UserCard>
        ))}
      </UserGrid>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTargetUserId}
        title="Are you sure you want to delete this user?"
        onCancel={() => setDeleteTargetUserId(null)}
        onConfirm={confirmDeleteUser}
      />
    </Wrapper>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────
const Wrapper = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h1 {
    font-size: 2rem;
    color: ${({ theme }) => theme.text};
  }
`;

const ToggleButton = styled.button`
  padding: 10px 16px;
  background: ${({ theme }) => theme.button};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;

const UserGrid = styled.div`
  display: grid;
  gap: 24px;
`;

const UserCard = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.01);
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  & > div {
    display: flex;
    gap: 10px;
  }
`;

const UserEmail = styled.p`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const RoleSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
`;

const JournalList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const JournalItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

const EntryInfo = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 1rem;
    color: ${({ theme }) => theme.text};
  }

  small {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.subText};
  }
`;

const DeleteBtn = styled.button`
  background: #ef4444;
  border: none;
  padding: 6px 10px;
  color: white;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

const LoadingMsg = styled.p`
  text-align: center;
  font-size: 1.2rem;
`;

const ErrorMsg = styled(LoadingMsg)`
  color: red;
`;
