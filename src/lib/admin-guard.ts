import "server-only";

import { headers } from "next/headers";
import { validAdminAuth } from "@/lib/admin-auth";

/**
 * Every admin server action, route handler and the admin layout check the password themselves. The middleware
 * check alone is not enough: Server Actions can be called on any URL, and on 5 Nov 2026 an outside scanner
 * reached the admin through a URL the middleware skipped and created quotation 1059.
 */
export async function isAdmin() {
  return validAdminAuth((await headers()).get("authorization"));
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

export const unauthorized = () =>
  new Response("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="4U Admin", charset="UTF-8"' } });
