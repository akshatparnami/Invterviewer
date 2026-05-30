import { NextResponse } from "next/server";
import type { SavedInterview } from "@/lib/types";
import { listInterviews, saveInterview } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json({ interviews: listInterviews() });
  } catch {
    return NextResponse.json({ interviews: [] });
  }
}

export async function POST(request: Request) {
  try {
    const interview = (await request.json()) as SavedInterview;
    saveInterview(interview);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to save interview." }, { status: 500 });
  }
}
