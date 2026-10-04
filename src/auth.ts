import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserByUsername } from "./lib/users"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        
        const user = getUserByUsername(credentials.username as string)
        if (!user || !user.password) {
          return null
        }
        
        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)
        
        if (!isPasswordValid) {
          return null
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})
