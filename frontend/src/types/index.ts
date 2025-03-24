export interface JournalEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
}

export type Role = "USER" | "ADMIN" | "SUPERADMIN";

export interface User {
  id: string;
  email: string;
  role: Role;
  entries: JournalEntry[];
}
