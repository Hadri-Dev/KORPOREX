// Stub endpoint backing the CorporationNameSection demo.
// TODO: replace with a real NUANS-backed lookup (or a snapshot of the
// Corporations Canada open-data registry) before launch. The shape of the
// response is fixed: { status: "available" | "similar" | "taken", matches: [...] }.

import { NextResponse } from "next/server";

const MOCK_DB: { name: string; jurisdiction: string; status: string }[] = [
  { name: "ACME TECHNOLOGIES INC.", jurisdiction: "Ontario", status: "Active" },
  { name: "ACME CORP", jurisdiction: "Ontario", status: "Active" },
  { name: "ACME HOLDINGS LTD.", jurisdiction: "Federal", status: "Active" },
  { name: "MAPLE LEAF CONSULTING INC.", jurisdiction: "Ontario", status: "Active" },
  { name: "MAPLE RIDGE HOLDINGS LTD.", jurisdiction: "Federal", status: "Active" },
  { name: "MAPLE RIDGE CONSULTING INC.", jurisdiction: "Federal", status: "Active" },
  { name: "TORONTO STARTUP CO.", jurisdiction: "Ontario", status: "Active" },
  { name: "BLUE WATER VENTURES INC.", jurisdiction: "Ontario", status: "Active" },
  { name: "NORTHERN PINE CAPITAL CORP.", jurisdiction: "Federal", status: "Active" },
  { name: "KORPOREX BUSINESS SOLUTIONS INC.", jurisdiction: "Federal", status: "Active" },
];

export async function POST(req: Request) {
  const { name } = (await req.json()) as { name?: string };
  const q = (name ?? "").trim().toUpperCase();
  const stem = q.split(/\s+/)[0] ?? "";

  if (!stem || stem.length < 3) {
    return NextResponse.json({ status: "available", matches: [] });
  }

  const matches = MOCK_DB.filter((r) => r.name.includes(stem));
  const exact = matches.find((m) => m.name === q || m.name.startsWith(`${q} `));

  await new Promise((r) => setTimeout(r, 500)); // simulate network

  if (exact) return NextResponse.json({ status: "taken", matches });
  if (matches.length > 0) return NextResponse.json({ status: "similar", matches });
  return NextResponse.json({ status: "available", matches: [] });
}
