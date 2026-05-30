import { NextResponse } from "next/server";
import type { InterviewQuestion } from "@/lib/types";
import { buildAssistFallback } from "@/lib/question-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: "alternative" | "deeper" | "simplify" | "followup";
      question?: InterviewQuestion;
      candidateAnswer?: string;
      difficulty?: string;
    };

    if (!body.action || !body.question) {
      return NextResponse.json({ error: "Action and question are required." }, { status: 400 });
    }

    if (process.env.OPENAI_API_KEY) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You help an interviewer use a document-based fresher QA prep guide. Keep hints and follow-ups practical, beginner-friendly, and tied to the current question. Return one concise instruction only.",
            },
            {
              role: "user",
              content: JSON.stringify(body),
            },
          ],
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return NextResponse.json({ text, source: "ai" });
      }
    }

    return NextResponse.json({
      text: buildAssistFallback(body.action, body.question, body.candidateAnswer),
      source: "offline",
    });
  } catch {
    return NextResponse.json({ error: "Unable to generate assistance." }, { status: 500 });
  }
}
