import { NextResponse } from "next/server";
import type { Difficulty, Experience } from "@/lib/types";
import { generateOfflineInterviewSet } from "@/lib/question-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      candidateName?: string;
      experience?: Experience;
      difficulty?: Difficulty;
      avoidIds?: string[];
    };

    if (!body.candidateName?.trim()) {
      return NextResponse.json({ error: "Candidate name is required." }, { status: 400 });
    }

    const input = {
      candidateName: body.candidateName.trim(),
      experience: body.experience ?? "Fresher",
      difficulty: body.difficulty ?? "Easy",
      avoidIds: body.avoidIds ?? [],
    };

    return NextResponse.json(generateOfflineInterviewSet(input));
  } catch {
    return NextResponse.json({ error: "Unable to generate interview set." }, { status: 500 });
  }
}
