export type Difficulty = "Easy" | "Medium";
export type Experience = "Fresher" | "0-1 years";

export type Category =
  | "SQL"
  | "Testing"
  | "Coding Logic"
  | "Introduction"
  | "DSA";

export type Language = "python" | "java" | "javascript" | "cpp";

export type Recommendation = "Reject" | "Maybe" | "Hire";

export type QuestionBankItem = {
  id: string;
  question: string;
  answer: string;
  expectedFresherAnswer: string;
  minimumAcceptableAnswer: string;
  hint: string;
  optimalApproach: string;
  output: string;
  solution: string;
  solutions?: Partial<Record<Language, string>>;
  timeComplexity?: string;
  dsaTopic?: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  followUps: string[];
  evaluationPoints: string[];
  strongIndicators: string[];
  weakIndicators: string[];
  redFlags: string[];
};

export type InterviewQuestion = QuestionBankItem & {
  order: number;
  notes?: string;
  revealed?: boolean;
  asked?: boolean;
};

export type InterviewSet = {
  id: string;
  candidateName: string;
  experience: Experience;
  difficulty: Difficulty;
  createdAt: string;
  source: "ai" | "offline";
  questions: InterviewQuestion[];
};

export type Scores = {
  technicalKnowledge: number;
  communication: number;
  problemSolving: number;
  confidence: number;
  recommendation: Recommendation;
};

export type SavedInterview = InterviewSet & {
  scores: Scores;
  tags: string[];
  summary: string;
  durationSeconds: number;
};
