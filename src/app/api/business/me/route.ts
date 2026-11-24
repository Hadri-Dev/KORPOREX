import { NextResponse } from "next/server";
import { BUSINESS_COOKIE_NAME, verifyBusinessSession } from "@/lib/businessAuth";
import { getBusinessAccountById } from "@/lib/businessAccounts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Read by the NUANS (and eventually other order) forms on mount to decide
// whether to show the "signed in as a business account" ordering experience.
export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const match = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith(`${BUSINESS_COOKIE_NAME}=`));
  const token = match?.slice(BUSINESS_COOKIE_NAME.length + 1);

  const session = await verifyBusinessSession(token);
  if (!session) return NextResponse.json({ signedIn: false });

  const account = await getBusinessAccountById(session.accountId).catch(() => null);
  if (!account) return NextResponse.json({ signedIn: false });

  return NextResponse.json({
    signedIn: true,
    companyName: account.companyName,
    status: account.status,
  });
}
