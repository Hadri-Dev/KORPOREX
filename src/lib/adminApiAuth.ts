import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "./adminAuth";

// Middleware (src/middleware.ts) gates /admin and /dashboard/* but explicitly
// excludes /api/*. So any /api/seo/* (or other admin-only) route handler must
// verify the session JWT itself before doing privileged work.
//
// Usage in a route handler:
//
//   const unauthorized = await requireAdminOrUnauthorized();
//   if (unauthorized) return unauthorized;
//   // ... privileged work
export async function requireAdminOrUnauthorized(): Promise<Response | null> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const ok = await verifyAdminSession(token);
  if (!ok) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
