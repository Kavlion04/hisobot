import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { questions } from "@/lib/questions";
import { addResponse } from "@/lib/store";
import { notifyNewResponse } from "@/lib/telegram";
import type { SurveyAnswers, SurveyResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { answers?: SurveyAnswers };
    const answers = body.answers ?? {};

    for (const q of questions) {
      if (!q.required) continue;
      const value = answers[q.id];
      const empty =
        value == null ||
        (typeof value === "string" && !value.trim()) ||
        (Array.isArray(value) && value.length === 0);
      if (empty) {
        return NextResponse.json(
          { error: `Majburiy savol: ${q.title}` },
          { status: 400 }
        );
      }
    }

    const response: SurveyResponse = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      answers,
      meta: {
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
    };

    await addResponse(response);

    try {
      await notifyNewResponse(response);
    } catch (err) {
      console.error("Telegram notify xatosi:", err);
    }

    return NextResponse.json({ ok: true, id: response.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
