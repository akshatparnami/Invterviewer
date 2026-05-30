import Database from "better-sqlite3";
import path from "node:path";
import type { SavedInterview } from "@/lib/types";

let db: Database.Database | undefined;

function getDb() {
  if (!db) {
    const file = path.join(process.cwd(), "interviewer.sqlite");
    db = new Database(file);
    db.pragma("journal_mode = WAL");
    db.exec(`
      create table if not exists interviews (
        id text primary key,
        candidate_name text not null,
        created_at text not null,
        recommendation text not null,
        payload text not null
      );
    `);
  }
  return db;
}

export function saveInterview(interview: SavedInterview) {
  const database = getDb();
  database
    .prepare(
      `insert or replace into interviews (id, candidate_name, created_at, recommendation, payload)
       values (@id, @candidateName, @createdAt, @recommendation, @payload)`,
    )
    .run({
      id: interview.id,
      candidateName: interview.candidateName,
      createdAt: interview.createdAt,
      recommendation: interview.scores.recommendation,
      payload: JSON.stringify(interview),
    });
}

export function listInterviews() {
  const database = getDb();
  return database
    .prepare("select payload from interviews order by created_at desc limit 100")
    .all()
    .map((row) => JSON.parse((row as { payload: string }).payload) as SavedInterview);
}
