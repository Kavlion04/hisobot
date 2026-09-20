import { SurveyForm } from "@/components/SurveyForm";

export default function HomePage() {
  return (
    <main className="relative mx-auto min-h-screen w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <SurveyForm />
      <footer className="relative z-10 mt-12 pb-6 text-center text-xs text-ink-400">
        Javoblar maxfiy saqlanadi · Telegram orqali hisobot
      </footer>
    </main>
  );
}
