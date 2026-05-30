"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { CheckSquare, ChevronDown, Clipboard, Eye, EyeOff, Search, SkipForward } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { questionBank } from "@/lib/question-engine";
import type { Category, InterviewQuestion, Language, QuestionBankItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryOrder: Category[] = ["Introduction", "Coding Logic", "Testing", "SQL", "DSA"];
const languageLabels: Record<Language, string> = {
  python: "Python",
  java: "Java",
  javascript: "JavaScript",
  cpp: "C++",
};
const languages: Language[] = ["python", "java", "javascript", "cpp"];
type SectionTab = "all" | "prep" | "dsa";
type ViewMode = "bank" | "interview";

function asInterviewQuestion(question: QuestionBankItem, index: number): InterviewQuestion {
  return {
    ...question,
    order: index + 1,
    asked: false,
    revealed: false,
  };
}

export function InterviewAssistant() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(() => questionBank.map(asInterviewQuestion));
  const [openId, setOpenId] = useState<string>(questions[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<SectionTab>("prep");
  const [viewMode, setViewMode] = useState<ViewMode>("bank");
  const [interviewIndex, setInterviewIndex] = useState(0);
  const [showInterviewAnswer, setShowInterviewAnswer] = useState(false);
  const [languageByQuestion, setLanguageByQuestion] = useState<Record<string, Language>>({});
  const [toast, setToast] = useState("");

  const prepCount = questions.filter((question) => question.category !== "DSA").length;
  const dsaCount = questions.filter((question) => question.category === "DSA").length;

  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const sectionQuestions = questions.filter((question) => {
      if (section === "prep") return question.category !== "DSA";
      if (section === "dsa") return question.category === "DSA";
      return true;
    });
    const matches = normalized
      ? sectionQuestions.filter(
          (question) =>
            question.question.toLowerCase().includes(normalized) ||
            question.answer.toLowerCase().includes(normalized) ||
            question.category.toLowerCase().includes(normalized) ||
            question.tags.join(" ").toLowerCase().includes(normalized),
        )
      : sectionQuestions;

    return categoryOrder.flatMap((category) => matches.filter((question) => question.category === category));
  }, [query, questions, section]);

  const askedCount = questions.filter((question) => question.asked).length;

  const switchSection = (nextSection: SectionTab) => {
    setSection(nextSection);
    setQuery("");
    const firstQuestion = questions.find((question) => {
      if (nextSection === "prep") return question.category !== "DSA";
      if (nextSection === "dsa") return question.category === "DSA";
      return true;
    });
    setOpenId(firstQuestion?.id ?? "");
    setInterviewIndex(0);
    setShowInterviewAnswer(false);
  };

  const toggleAsked = (id: string) => {
    setQuestions((current) =>
      current.map((question) => (question.id === id ? { ...question, asked: !question.asked } : question)),
    );
  };

  const setQuestionAsked = (id: string, asked: boolean) => {
    setQuestions((current) => current.map((question) => (question.id === id ? { ...question, asked } : question)));
  };

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const copySolution = async (question: InterviewQuestion) => {
    await navigator.clipboard.writeText(
      [
        `Question: ${question.question}`,
        `Answer: ${question.answer}`,
        `Optimal approach: ${question.optimalApproach}`,
        question.solutions
          ? Object.entries(question.solutions)
              .map(([language, code]) => `${languageLabels[language as Language]}:\n${code}`)
              .join("\n\n")
          : `Solution:\n${question.solution}`,
        `Output:\n${question.output}`,
      ].join("\n\n"),
    );
    notify("Copied.");
  };

  const copyText = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    notify(`${label} copied.`);
  };

  const activeInterviewQuestion = filteredQuestions[Math.min(interviewIndex, Math.max(filteredQuestions.length - 1, 0))];
  const activeInterviewLanguage = activeInterviewQuestion ? languageByQuestion[activeInterviewQuestion.id] ?? "python" : "python";
  const activeInterviewSolution = activeInterviewQuestion
    ? activeInterviewQuestion.solutions?.[activeInterviewLanguage] ?? activeInterviewQuestion.solution
    : "";

  const goToInterviewQuestion = (nextIndex: number) => {
    setInterviewIndex(Math.min(Math.max(nextIndex, 0), Math.max(filteredQuestions.length - 1, 0)));
    setShowInterviewAnswer(false);
  };

  return (
    <section className="min-h-screen bg-zinc-50 px-4 py-6 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Automation Testing Interview Prep</h1>
            <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
              Simple question, answer, and DSA solution preview for fresher interviews.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950">
            <CheckSquare size={16} />
            <span>{askedCount}/{questions.length} asked</span>
          </div>
        </header>

        <div className="grid gap-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-2">
          <TabButton active={viewMode === "bank"} onClick={() => setViewMode("bank")}>
            Question Bank
          </TabButton>
          <TabButton
            active={viewMode === "interview"}
            onClick={() => {
              setViewMode("interview");
              setInterviewIndex(0);
              setShowInterviewAnswer(false);
            }}
          >
            Interview Mode
          </TabButton>
        </div>

        <div className="grid gap-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-3">
          <TabButton active={section === "prep"} onClick={() => switchSection("prep")}>
            Prep Guide ({prepCount})
          </TabButton>
          <TabButton active={section === "dsa"} onClick={() => switchSection("dsa")}>
            DSA / LeetCode 75 ({dsaCount})
          </TabButton>
          <TabButton active={section === "all"} onClick={() => switchSection("all")}>
            All Questions ({questions.length})
          </TabButton>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
          <Input
            className="pl-10"
            placeholder="Search questions, answers, or category..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {viewMode === "interview" ? (
          <InterviewMode
            activeLanguage={activeInterviewLanguage}
            activeSolution={activeInterviewSolution}
            index={interviewIndex}
            languageByQuestion={languageByQuestion}
            onCopy={copyText}
            onLanguageChange={(questionId, language) =>
              setLanguageByQuestion((current) => ({
                ...current,
                [questionId]: language,
              }))
            }
            onMarkAsked={(question) => setQuestionAsked(question.id, true)}
            onNext={() => goToInterviewQuestion(interviewIndex + 1)}
            onPrevious={() => goToInterviewQuestion(interviewIndex - 1)}
            onSkip={() => goToInterviewQuestion(interviewIndex + 1)}
            question={activeInterviewQuestion}
            showAnswer={showInterviewAnswer}
            total={filteredQuestions.length}
            toggleAnswer={() => setShowInterviewAnswer((value) => !value)}
          />
        ) : (
          <div className="space-y-3">
          {filteredQuestions.length === 0 && (
            <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              No questions found. This section has {section === "dsa" ? dsaCount : section === "prep" ? prepCount : questions.length} questions before search filtering.
            </div>
          )}
          {filteredQuestions.map((question, index) => {
            const isOpen = openId === question.id;
            const activeLanguage = languageByQuestion[question.id] ?? "python";
            const activeSolution = question.solutions?.[activeLanguage] ?? question.solution;
            const previous = filteredQuestions[index - 1];
            const showDsaHeader =
              question.category === "DSA" &&
              (!previous || previous.category !== "DSA" || previous.dsaTopic !== question.dsaTopic);
            return (
              <div key={question.id} className="space-y-3">
                {showDsaHeader && (
                  <div className="pt-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {question.dsaTopic}
                    </h2>
                  </div>
                )}
                <Card className={cn(question.asked && "border-emerald-300 dark:border-emerald-900")}>
                  <button
                    className="flex w-full items-start gap-3 p-4 text-left"
                    onClick={() => setOpenId(isOpen ? "" : question.id)}
                  >
                    <input
                      className="mt-1 h-5 w-5 shrink-0 accent-zinc-950 dark:accent-white"
                      type="checkbox"
                      checked={Boolean(question.asked)}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleAsked(question.id)}
                      aria-label={`Mark question ${question.order} as asked`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{question.category === "DSA" ? question.dsaTopic : question.category}</Badge>
                        <Badge>{question.difficulty}</Badge>
                        {question.timeComplexity && <Badge>{question.timeComplexity}</Badge>}
                      </div>
                      <h2 className="mt-2 text-base font-semibold leading-6">
                        {question.order}. {question.question}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{question.answer}</p>
                    </div>
                    <ChevronDown className={cn("mt-1 shrink-0 transition", isOpen && "rotate-180")} size={19} />
                  </button>

                  {isOpen && (
                    <CardContent className="space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                      <Detail title="Answer" content={question.answer} />
                      <Detail title="Optimal Approach" content={question.optimalApproach} />
                      <Detail title="Detailed Explanation" content={question.expectedFresherAnswer} />
                      {question.solutions && (
                        <div className="flex flex-wrap gap-2">
                          {languages.map((language) => (
                            <Button
                              key={language}
                              variant={activeLanguage === language ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                setLanguageByQuestion((current) => ({
                                  ...current,
                                  [question.id]: language,
                                }))
                              }
                            >
                              {languageLabels[language]}
                            </Button>
                          ))}
                        </div>
                      )}
                      <CodeBlock title={question.solutions ? `${languageLabels[activeLanguage]} Solution` : "Solution"} code={activeSolution} />
                      <CodeBlock title="Expected Output" code={question.output} muted />
                      {question.timeComplexity && <Detail title="Time Complexity" content={question.timeComplexity} />}
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => copySolution(question)}>
                          <Clipboard size={15} />
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            );
          })}
          </div>
        )}
      </div>
      {toast && <div className="fixed bottom-4 right-4 rounded-md bg-zinc-950 px-4 py-3 text-sm text-white shadow-lg dark:bg-white dark:text-zinc-950">{toast}</div>}
    </section>
  );
}

function InterviewMode({
  activeLanguage,
  activeSolution,
  index,
  onCopy,
  onLanguageChange,
  onMarkAsked,
  onNext,
  onPrevious,
  onSkip,
  question,
  showAnswer,
  toggleAnswer,
  total,
}: {
  activeLanguage: Language;
  activeSolution: string;
  index: number;
  languageByQuestion: Record<string, Language>;
  onCopy: (label: string, value: string) => void;
  onLanguageChange: (questionId: string, language: Language) => void;
  onMarkAsked: (question: InterviewQuestion) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  question?: InterviewQuestion;
  showAnswer: boolean;
  toggleAnswer: () => void;
  total: number;
}) {
  if (!question) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        No questions available for this section or search.
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-5 pt-5">
        <div className="flex flex-col gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{question.category === "DSA" ? question.dsaTopic : question.category}</Badge>
            <Badge>{question.difficulty}</Badge>
            {question.timeComplexity && <Badge>{question.timeComplexity}</Badge>}
            <Badge>{index + 1}/{total}</Badge>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 md:w-56 dark:bg-zinc-800">
            <div
              className="h-2 rounded-full bg-zinc-950 dark:bg-zinc-100"
              style={{ width: `${total ? ((index + 1) / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Question</p>
          <h2 className="mt-2 text-2xl font-semibold leading-9">{question.question}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onMarkAsked(question)}>
            <CheckSquare size={16} />
            Mark Asked
          </Button>
          <Button variant="outline" onClick={onSkip}>
            <SkipForward size={16} />
            Skip
          </Button>
          <Button variant="secondary" onClick={toggleAnswer}>
            {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onCopy("Question", question.question)}>
            <Clipboard size={15} />
            Copy Question
          </Button>
          <Button variant="outline" size="sm" onClick={() => onCopy("Approach", question.optimalApproach)}>
            <Clipboard size={15} />
            Copy Approach
          </Button>
          <Button variant="outline" size="sm" onClick={() => onCopy("Solution", activeSolution)}>
            <Clipboard size={15} />
            Copy Solution
          </Button>
        </div>

        {showAnswer && (
          <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <Detail title="Answer" content={question.answer} />
            <Detail title="Optimal Approach" content={question.optimalApproach} />
            <Detail title="Detailed Explanation" content={question.expectedFresherAnswer} />
            {question.solutions && (
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <Button
                    key={language}
                    variant={activeLanguage === language ? "default" : "outline"}
                    size="sm"
                    onClick={() => onLanguageChange(question.id, language)}
                  >
                    {languageLabels[language]}
                  </Button>
                ))}
              </div>
            )}
            <CodeBlock title={question.solutions ? `${languageLabels[activeLanguage]} Solution` : "Solution"} code={activeSolution} />
            <CodeBlock title="Expected Output" code={question.output} muted />
          </div>
        )}

        <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button variant="outline" onClick={onPrevious} disabled={index === 0}>
            Previous
          </Button>
          <Button onClick={onNext} disabled={index >= total - 1}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "h-10 rounded-md px-3 text-sm font-medium transition",
        active
          ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Detail({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{content}</p>
    </div>
  );
}

function CodeBlock({ title, code, muted = false }: { title: string; code: string; muted?: boolean }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <pre
        className={cn(
          "mt-2 overflow-auto rounded-md p-3 text-xs leading-5",
          muted
            ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            : "bg-zinc-950 text-zinc-50",
        )}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
