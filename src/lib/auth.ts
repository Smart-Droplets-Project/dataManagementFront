import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AUTH } from "@/lib/constants";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Keycloak",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(AUTH.KEYCLOAK_TOKEN_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: AUTH.KEYCLOAK_CLIENT_ID,
              grant_type: "password",
              username: credentials?.username!,
              password: credentials?.password!,
            }),
          });

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const keycloakResponse = await response.json();

          return {
            id: keycloakResponse.access_token,
            name: credentials?.username,
            accessToken: keycloakResponse.access_token,
            refreshToken: keycloakResponse.refresh_token,
            expiresIn: keycloakResponse.expires_in,
          };
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresIn = Date.now() + user.expiresIn * 1000;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: AUTH.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);