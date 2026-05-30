import rawQuestionBank from "@/data/question-bank.json";
import type { Category, Difficulty, Experience, InterviewQuestion, InterviewSet, QuestionBankItem } from "@/lib/types";
import { uid } from "@/lib/utils";

export const questionBank = rawQuestionBank as QuestionBankItem[];

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return ((state >>> 0) % 100000) / 100000;
  };
}

function shuffle<T>(items: T[], seed: string) {
  const random = seededRandom(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getQuestionBankStats() {
  return questionBank.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.byCategory[item.category] = (acc.byCategory[item.category] ?? 0) + 1;
      return acc;
    },
    { total: 0, byCategory: {} as Record<string, number> },
  );
}

export function generateOfflineInterviewSet(input: {
  candidateName: string;
  experience: Experience;
  difficulty: Difficulty;
  avoidIds?: string[];
}) {
  const avoid = new Set(input.avoidIds ?? []);
  const preferredOrder: Category[] = ["Introduction", "Coding Logic", "Testing", "SQL"];
  const selected = preferredOrder.flatMap((category) => questionBank.filter((item) => item.category === category && !avoid.has(item.id)));
  const fallback = preferredOrder.flatMap((category) => questionBank.filter((item) => item.category === category));
  const fullSet = selected.length >= questionBank.length * 0.5 ? selected : fallback;

  const questions: InterviewQuestion[] = fullSet.map((question, index) => ({
    ...question,
    order: index + 1,
    asked: false,
  }));

  return {
    id: uid("interview"),
    candidateName: input.candidateName,
    experience: input.experience,
    difficulty: input.difficulty,
    createdAt: new Date().toISOString(),
    source: "offline",
    questions,
  } satisfies InterviewSet;
}

export function buildAssistFallback(action: string, question: InterviewQuestion, answer?: string) {
  if (action === "simplify") {
    return `In simple words: ${question.question.replace("How would", "Can you explain how you would").replace("What is", "Can you explain what")} Use one short example.`;
  }
  if (action === "easier") {
    return `Easier version: ${question.question.replace("whether", "if").replace("department wise", "by department")} Explain with one small example.`;
  }
  if (action === "hint") {
    return question.hint;
  }
  if (action === "deeper") {
    return question.followUps[0] ?? "Can you explain this with a simple example?";
  }
  if (action === "alternative") {
    const sameCategory = shuffle(
      questionBank.filter((item) => item.category === question.category && item.id !== question.id),
      `${question.id}-${Date.now()}`,
    )[0];
    return sameCategory?.question ?? question.followUps[0];
  }
  return answer
    ? `Based on the answer "${answer.slice(0, 140)}", ask: What example can you give to prove you have used this concept practically?`
    : question.followUps[0];
}
