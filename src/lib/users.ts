import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');

export interface User {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  image?: string;
}

export function getUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export function saveUsers(users: User[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function getUserByUsername(username: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.username === username);
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email === email);
}
