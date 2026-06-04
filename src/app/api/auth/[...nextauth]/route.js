import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../libs/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@medicare.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        // Cari user berdasarkan email
        const user = await prisma.users.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Email atau password salah");
        }

        // Verifikasi password (plaintext atau bcrypt)
        let isValid = false;
        if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
          isValid = credentials.password === user.password;
        } else {
          isValid = await bcrypt.compare(credentials.password, user.password);
        }

        if (!isValid) {
          throw new Error("Email atau password salah");
        }

        // Jika berhasil, return object user untuk disimpan di JWT session
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // Kita simpan role agar bisa diakses oleh middleware
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
