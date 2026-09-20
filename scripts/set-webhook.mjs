#!/usr/bin/env node
/**
 * Webhook o‘rnatish:
 *   TELEGRAM_BOT_TOKEN=... NEXT_PUBLIC_APP_URL=https://xxx npm run telegram:set-webhook
 */
const token = process.env.TELEGRAM_BOT_TOKEN;
const base = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;

if (!token || !base) {
  console.error(
    "TELEGRAM_BOT_TOKEN va NEXT_PUBLIC_APP_URL (yoki APP_URL) kerak"
  );
  process.exit(1);
}

const url = `${base.replace(/\/$/, "")}/api/telegram/webhook`;

const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url }),
});

const data = await res.json();
console.log(data);
if (!data.ok) process.exit(1);
console.log("Webhook o‘rnatildi:", url);
