import { promises as fs } from "fs";
import path from "path";
import type { SurveyResponse } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "responses.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

export async function getResponses(): Promise<SurveyResponse[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as SurveyResponse[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addResponse(
  response: SurveyResponse
): Promise<SurveyResponse[]> {
  const all = await getResponses();
  all.unshift(response);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf8");
  return all;
}
