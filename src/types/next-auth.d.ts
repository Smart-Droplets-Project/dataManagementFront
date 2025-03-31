import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
}