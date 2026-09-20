#!/usr/bin/env node
/**
 * Lokal Telegram long-polling → Next.js webhook ga uzatadi.
 * npm run telegram:poll
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

function saveChatId(chatId) {
  let raw = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
  if (/^TELEGRAM_CHAT_ID=/m.test(raw)) {
    raw = raw.replace(/^TELEGRAM_CHAT_ID=.*$/m, `TELEGRAM_CHAT_ID=${chatId}`);
  } else {
    raw += `\nTELEGRAM_CHAT_ID=${chatId}\n`;
  }
  writeFileSync(envPath, raw, "utf8");
}

const env = loadEnv();
const TOKEN = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const APP =
  env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

if (!TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN .env.local da yo‘q");
  process.exit(1);
}

const API = `https://api.telegram.org/bot${TOKEN}`;

async function api(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return res.json();
}

async function forward(update) {
  const chatId =
    update.message?.chat?.id ??
    update.callback_query?.message?.chat?.id ??
    update.callback_query?.from?.id;
  if (chatId != null) saveChatId(chatId);

  const res = await fetch(`${APP.replace(/\/$/, "")}/api/telegram/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Webhook ${res.status}: ${t}`);
  }
}

let offset = 0;

async function loop() {
  await api("deleteWebhook", { drop_pending_updates: false });
  console.log("Telegram polling →", APP);
  console.log("Botga /hisobot yuboring…");

  for (;;) {
    try {
      const data = await api("getUpdates", {
        offset,
        timeout: 30,
        allowed_updates: ["message", "callback_query"],
      });
      if (!data.ok) {
        console.error(data);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      for (const update of data.result || []) {
        offset = update.update_id + 1;
        const preview =
          update.message?.text ||
          update.callback_query?.data ||
          "update";
        try {
          await forward(update);
          console.log("✓", preview);
        } catch (e) {
          console.error("✗", preview, e.message || e);
        }
      }
    } catch (e) {
      console.error("Polling xatosi:", e.message || e);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

loop();
