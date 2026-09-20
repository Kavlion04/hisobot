import { NextRequest, NextResponse } from "next/server";
import { getResponses } from "@/lib/store";
import { sendReport, sendWelcome, telegramApi } from "@/lib/telegram";

type TelegramUpdate = {
  message?: {
    chat: { id: number };
    text?: string;
  };
  callback_query?: {
    id: string;
    data?: string;
    message?: { chat: { id: number } };
    from?: { id: number };
  };
};

export async function POST(req: NextRequest) {
  try {
    const update = (await req.json()) as TelegramUpdate;

    if (update.callback_query) {
      const cq = update.callback_query;
      const chatId = cq.message?.chat.id ?? cq.from?.id;
      await telegramApi("answerCallbackQuery", {
        callback_query_id: cq.id,
      });

      if (cq.data === "report" && chatId != null) {
        const responses = await getResponses();
        await sendReport(chatId, responses);
      }
      return NextResponse.json({ ok: true });
    }

    const msg = update.message;
    if (!msg?.text) {
      return NextResponse.json({ ok: true });
    }

    const text = msg.text.trim();
    const chatId = msg.chat.id;
    // /hisobot@BotName → /hisobot
    const command = text.split(/\s+/)[0].split("@")[0].toLowerCase();

    if (command === "/start" || command === "start") {
      await sendWelcome(chatId);
      return NextResponse.json({ ok: true });
    }

    if (
      command === "/hisobot" ||
      command === "/report" ||
      text === "📊 Hisobot" ||
      command === "hisobot"
    ) {
      const responses = await getResponses();
      await sendReport(chatId, responses);
      return NextResponse.json({ ok: true });
    }

    if (text === "ℹ️ Yordam" || command === "/help" || command === "yordam") {
      await sendWelcome(chatId);
      return NextResponse.json({ ok: true });
    }

    await telegramApi("sendMessage", {
      chat_id: chatId,
      text:
        "Buyruqlar:\n/start — menyu\n/hisobot — to‘liq hisobot\n\nYoki pastdagi <b>📊 Hisobot</b> tugmasini bosing.",
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [[{ text: "📊 Hisobot" }, { text: "ℹ️ Yordam" }]],
        resize_keyboard: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook xatosi:", err);
    return NextResponse.json({ ok: true });
  }
}
