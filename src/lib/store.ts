import { promises as fs } from "fs";
import path from "path";
import type { SurveyResponse } from "./types";

function dataFile() {
  // Vercel serverless: faqat /tmp yoziladi (ephemeral, lekin ishlaydi)
  if (process.env.VERCEL) {
    return path.join("/tmp", "hisobot-responses.json");
  }
  return path.join(process.cwd(), "data", "responses.json");
}

async function ensureStore() {
  const file = dataFile();
  const dir = path.dirname(file);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, "[]", "utf8");
  }
}

export async function getResponses(): Promise<SurveyResponse[]> {
  try {
    await ensureStore();
    const raw = await fs.readFile(dataFile(), "utf8");
    const parsed = JSON.parse(raw) as SurveyResponse[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("getResponses:", err);
    return [];
  }
}

export async function addResponse(
  response: SurveyResponse
): Promise<SurveyResponse[]> {
  const all = await getResponses();
  all.unshift(response);
  await fs.writeFile(dataFile(), JSON.stringify(all, null, 2), "utf8");
  return all;
}
