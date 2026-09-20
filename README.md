# Yoshlar kasb so‘rovnomasi

Next.js so‘rovnoma: card UI, skeleton loading, Framer Motion animatsiyalar va Telegram bot hisoboti.

## Imkoniyatlar

- **Senior UI** — Fraunces + Manrope, teal/ink atmosfera, cardlar
- **Loading + Skeleton** — birinchi yuklanishda shimmer skeleton
- **Animatsiyalar** — card kirish, tanlash spring, submit spinner, success
- **Telegram** — har yangi javobda xabar + **📊 Hisobot** tugmasi / `/hisobot`

## Ishga tushirish

```bash
cd yoshlar-kasb-sorovnomasi
npm install
cp .env.example .env.local
npm run dev
```

Brauzer: [http://localhost:3000](http://localhost:3000)

## Telegram sozlash

1. [@BotFather](https://t.me/BotFather) orqali bot yarating → `TELEGRAM_BOT_TOKEN`
2. Botga `/start` yuboring. Chat ID olish uchun:
   - [@userinfobot](https://t.me/userinfobot) yoki
   - `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. `.env.local` ga yozing:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

4. **Lokal test** — [ngrok](https://ngrok.com) yoki shunga o‘xshash:

```bash
ngrok http 3000
# keyin:
set TELEGRAM_BOT_TOKEN=...
set NEXT_PUBLIC_APP_URL=https://xxxx.ngrok-free.app
npm run telegram:set-webhook
```

5. Botda:
   - `/start` — klaviatura bilan **📊 Hisobot**
   - `/hisobot` yoki tugma — barcha natijalar (foizlar bilan)
   - Yangi forma yuborilganda — avtomatik xabar + Hisobot tugmasi

## API

| Endpoint | Vazifa |
|----------|--------|
| `POST /api/submit` | Javob saqlash + Telegram xabar |
| `GET /api/stats` | Jami javoblar (skeleton uchun) |
| `POST /api/telegram/webhook` | Bot buyruqlari |

Javoblar: `data/responses.json`

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind · Framer Motion
