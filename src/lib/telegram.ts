import {
  questions,
  labelForOption,
  formatAnswerValue,
  SURVEY_TITLE,
} from "./questions";
import type { SurveyResponse } from "./types";

const TELEGRAM_API = "https://api.telegram.org";
const DIVIDER = "────────────────────";

function token() {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN o‘rnatilmagan");
  return t;
}

function adminChatId() {
  return process.env.TELEGRAM_CHAT_ID ?? "";
}

export async function telegramApi(
  method: string,
  body: Record<string, unknown>
) {
  const res = await fetch(`${TELEGRAM_API}/bot${token()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) {
    console.error("Telegram API xatosi:", data);
  }
  return data;
}

function esc(text: string) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function progressBar(pct: number, width = 10) {
  const filled = Math.round((Math.min(100, Math.max(0, pct)) / 100) * width);
  return "▓".repeat(filled) + "░".repeat(width - filled);
}

function ageBucket(ageStr: string) {
  const n = parseInt(ageStr, 10);
  if (Number.isNaN(n)) return "Noma’lum";
  if (n < 18) return "17 va undan kichik";
  if (n <= 20) return "18–20";
  if (n <= 24) return "21–24";
  if (n <= 29) return "25–29";
  return "30+";
}

function profileLines(response: SurveyResponse) {
  const a = response.answers;
  const rows: [string, string][] = [];
  const name = a.name;
  const age = a.age;
  const gender = a.gender;
  const region = a.region;
  const phone = a.phone;
  const education = a.education;
  const occupation = a.occupation;

  if (typeof name === "string" && name.trim())
    rows.push(["👤 Ism", name.trim()]);
  if (typeof age === "string" && age.trim())
    rows.push(["🎂 Yosh", age.trim()]);
  if (typeof gender === "string")
    rows.push(["👫 Jins", labelForOption("gender", gender)]);
  if (typeof region === "string")
    rows.push(["📍 Joy", labelForOption("region", region)]);
  if (typeof phone === "string" && phone.trim())
    rows.push(["📱 Tel", phone.trim()]);
  if (typeof education === "string")
    rows.push(["🎓 Ta’lim", labelForOption("education", education)]);
  if (typeof occupation === "string")
    rows.push(["💼 Bandlik", labelForOption("occupation", occupation)]);

  return rows
    .map(([k, v]) => `${k}: <b>${esc(v)}</b>`)
    .join("\n");
}

export function formatNewResponseMessage(response: SurveyResponse) {
  const when = new Date(response.createdAt).toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines = [
    "🆕 <b>YANGI JAVOB</b>",
    `<code>#${esc(response.id.slice(0, 8))}</code>  ·  ${esc(when)}`,
    DIVIDER,
    profileLines(response) || "<i>Profil ma’lumoti yo‘q</i>",
    DIVIDER,
    "<b>📋 So‘rovnoma javoblari</b>",
    "",
  ];

  let n = 0;
  for (const q of questions) {
    if (q.profile) continue;
    const value = response.answers[q.id];
    if (value == null || (Array.isArray(value) && value.length === 0)) continue;
    n += 1;
    const answerText = formatAnswerValue(q.id, value);
    lines.push(`<b>${n}.</b> ${esc(q.title)}`);
    lines.push(`   ✅ ${esc(answerText)}`);
    lines.push("");
  }

  return lines.join("\n").trim();
}

export function buildReportText(responses: SurveyResponse[]) {
  const total = responses.length;
  const when = new Date().toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const header = [
    "📊 <b>HISOBOT</b>",
    esc(SURVEY_TITLE),
    "",
    `📈 Jami javoblar: <b>${total}</b>`,
    `🕐 Yangilandi: ${esc(when)}`,
    DIVIDER,
  ];

  if (total === 0) {
    return (
      header.join("\n") +
      "\n📭 Hali javoblar yo‘q.\nSaytda so‘rovnomani to‘ldiring."
    );
  }

  const sections: string[] = [...header, "", "<b>👥 DEMOGRAFIYA</b>", ""];

  // Age buckets
  const ageCounts = new Map<string, number>();
  for (const r of responses) {
    const age = r.answers.age;
    if (typeof age === "string" && age.trim()) {
      const b = ageBucket(age);
      ageCounts.set(b, (ageCounts.get(b) ?? 0) + 1);
    }
  }
  if (ageCounts.size) {
    sections.push("<b>🎂 Yosh</b>");
    for (const [label, count] of [...ageCounts.entries()].sort(
      (a, b) => b[1] - a[1]
    )) {
      const pct = Math.round((count / total) * 100);
      sections.push(
        `<code>${progressBar(pct)}</code> ${esc(label)} — <b>${count}</b> (${pct}%)`
      );
    }
    sections.push("");
  }

  const profileChoiceIds = ["gender", "region", "education", "occupation"];
  for (const id of profileChoiceIds) {
    const q = questions.find((x) => x.id === id);
    if (!q?.options) continue;
    const counts = countOptions(responses, id);
    if (!counts.size) continue;
    sections.push(`<b>${esc(q.title)}</b>`);
    appendChart(sections, counts, total, id);
    sections.push("");
  }

  sections.push(DIVIDER, "", "<b>📝 SO‘ROVNOMA</b>", "");

  for (const q of questions) {
    if (q.profile || q.type === "text" || q.type === "number") continue;
    const counts = countOptions(responses, q.id);
    sections.push(`<b>${esc(q.title)}</b>`);
    if (!counts.size) {
      sections.push("<i>— ma’lumot yo‘q</i>", "");
      continue;
    }
    appendChart(sections, counts, total, q.id);
    sections.push("");
  }

  sections.push(DIVIDER, "", "<b>🕒 So‘nggi ishtirokchilar</b>", "");
  for (const r of responses.slice(0, 8)) {
    const name =
      typeof r.answers.name === "string" ? r.answers.name.trim() : "Nomsiz";
    const age =
      typeof r.answers.age === "string" ? `, ${r.answers.age} yosh` : "";
    const t = new Date(r.createdAt).toLocaleString("uz-UZ", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    sections.push(
      `• <b>${esc(name)}</b>${esc(age)}  ·  <code>${esc(r.id.slice(0, 6))}</code>  ·  ${esc(t)}`
    );
  }

  return sections.join("\n");
}

function countOptions(responses: SurveyResponse[], questionId: string) {
  const counts = new Map<string, number>();
  for (const r of responses) {
    const value = r.answers[questionId];
    if (value == null) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      const key = v.startsWith("other:") ? "other" : v;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function appendChart(
  sections: string[],
  counts: Map<string, number>,
  total: number,
  questionId: string
) {
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [optId, count] of sorted) {
    const label =
      optId === "other" ? "Boshqa" : labelForOption(questionId, optId);
    const pct = Math.round((count / total) * 100);
    sections.push(
      `<code>${progressBar(pct)}</code> ${esc(label)} — <b>${count}</b> (${pct}%)`
    );
  }
}

export async function notifyNewResponse(response: SurveyResponse) {
  const chatId = adminChatId();
  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) {
    console.warn("Telegram sozlanmagan — xabar yuborilmadi");
    return;
  }

  await telegramApi("sendMessage", {
    chat_id: chatId,
    text: formatNewResponseMessage(response),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📊 Hisobot", callback_data: "report" },
          { text: "🔄 Yangilash", callback_data: "report" },
        ],
      ],
    },
  });
}

export async function sendWelcome(chatId: number | string) {
  await telegramApi("sendMessage", {
    chat_id: chatId,
    text: [
      "✨ <b>So‘rovnoma boti</b>",
      esc(SURVEY_TITLE),
      "",
      DIVIDER,
      "",
      "Bu bot orqali:",
      "• har yangi javobdan xabar olasiz",
      "• <b>/hisobot</b> bilan to‘liq statistikani ko‘rasiz",
      "",
      "<b>Buyruqlar</b>",
      "/start — menyu",
      "/hisobot — natijalar",
      "",
      "Pastdagi tugmadan ham foydalanishingiz mumkin 👇",
    ].join("\n"),
    parse_mode: "HTML",
    reply_markup: {
      keyboard: [[{ text: "📊 Hisobot" }, { text: "ℹ️ Yordam" }]],
      resize_keyboard: true,
    },
  });
}

export async function sendReport(
  chatId: number | string,
  responses: SurveyResponse[]
) {
  const text = buildReportText(responses);
  const chunks = chunkText(text, 3500);
  for (let i = 0; i < chunks.length; i++) {
    await telegramApi("sendMessage", {
      chat_id: chatId,
      text: chunks[i],
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup:
        i === chunks.length - 1
          ? {
              inline_keyboard: [
                [{ text: "🔄 Hisobotni yangilash", callback_data: "report" }],
              ],
            }
          : undefined,
    });
  }
}

function chunkText(text: string, size: number) {
  if (text.length <= size) return [text];
  const parts: string[] = [];
  let rest = text;
  while (rest.length > size) {
    let cut = rest.lastIndexOf("\n", size);
    if (cut < size * 0.5) cut = size;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut).trimStart();
  }
  if (rest) parts.push(rest);
  return parts;
}
