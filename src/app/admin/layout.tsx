import type { Metadata } from "next";
import { AdminShell } from "./shell";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin · Coral Fanatics" } };

/** Phase 1 prototype: no authentication. Phase 2 adds Better Auth + RBAC guards. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
