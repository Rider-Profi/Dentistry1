import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "superadmin" | "manager";
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "superadmin" | "manager";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "superadmin" | "manager";
  }
}
