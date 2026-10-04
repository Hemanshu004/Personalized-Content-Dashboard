import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsers, saveUsers, getUserByEmail, getUserByUsername } from '@/lib/users';

export async function POST(request: Request) {
  try {
    const { name, email, password, username } = await request.json();

    if (!name || !email || !password || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (getUserByEmail(email) || getUserByUsername(username)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const users = getUsers();
    const newUser = {
      id: String(Date.now()),
      name,
      username,
      email,
      password: hashedPassword,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff`,
    };

    users.push(newUser);
    saveUsers(users);

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
