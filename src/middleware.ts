// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // redirect to your login page
  },
});

export const config = {
  matcher: ["/api/:path*", "/"]
};