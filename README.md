# Interview Assistant

Document-based fresher Interview Assistant for Automation Testing hiring drives.

## Features

- Next.js, TypeScript, TailwindCSS, shadcn-style reusable UI components
- Prep-guide checklist using `src/data/question-bank.json`
- 31 document-based questions from the Automation Testing interviewer prep PDF
- Introduction, coding logic, testing definitions, and SQL query tasks
- Each question includes answer, optimal approach, solution, expected output, and optional time complexity
- Simple accordion preview with asked checkboxes and copyable solutions
- Candidate history stored in browser localStorage and mirrored to local SQLite through API routes

## Getting Started

```bash
npm run dev
```

Open the local URL shown by Next.js, usually [http://localhost:3000](http://localhost:3000).

The main website is a single question and answer preview page. Old app routes redirect back to the preview page.
