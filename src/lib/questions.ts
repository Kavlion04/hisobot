import type { Question } from "./types";

export const SURVEY_TITLE =
  "Yoshlarning kasb va kelajakdagi faoliyatiga munosabati";

export const SURVEY_SUBTITLE =
  "Avval o‘zingiz haqingizda qisqa ma’lumot, so‘ng kasb tanlash bo‘yicha fikringiz.";

export const questions: Question[] = [
  {
    id: "name",
    title: "Ism va familiyangiz",
    type: "text",
    required: true,
    profile: true,
    placeholder: "Masalan: Ali Valiyev",
    hint: "To‘liq ismingizni yozing",
  },
  {
    id: "age",
    title: "Yoshingiz",
    type: "number",
    required: true,
    profile: true,
    placeholder: "Masalan: 20",
    hint: "Faqat raqam",
  },
  {
    id: "gender",
    title: "Jinsingiz",
    type: "single",
    required: true,
    profile: true,
    options: [
      { id: "erkak", label: "Erkak" },
      { id: "ayol", label: "Ayol" },
      { id: "aytmaslik", label: "Aytishni xohlamayman" },
    ],
  },
  {
    id: "region",
    title: "Qaysi viloyat / shaharda yashaysiz?",
    type: "single",
    required: true,
    profile: true,
    options: [
      { id: "toshkent_sh", label: "Toshkent shahri" },
      { id: "toshkent_v", label: "Toshkent viloyati" },
      { id: "samarqand", label: "Samarqand" },
      { id: "buxoro", label: "Buxoro" },
      { id: "andijon", label: "Andijon" },
      { id: "fargona", label: "Farg‘ona" },
      { id: "namangan", label: "Namangan" },
      { id: "xorazm", label: "Xorazm" },
      { id: "qashqadaryo", label: "Qashqadaryo" },
      { id: "surxondaryo", label: "Surxondaryo" },
      { id: "navoiy", label: "Navoiy" },
      { id: "jizzax", label: "Jizzax" },
      { id: "sirdaryo", label: "Sirdaryo" },
      { id: "qoraqalpogiston", label: "Qoraqalpog‘iston" },
      { id: "boshqa", label: "Boshqa" },
    ],
  },
  {
    id: "phone",
    title: "Telefon raqamingiz",
    type: "text",
    required: false,
    profile: true,
    placeholder: "90 123 45 67",
    hint: "Raqam +998 bilan boshlanadi",
  },
  {
    id: "education",
    title: "Ta’lim darajangiz",
    type: "single",
    required: true,
    profile: true,
    options: [
      { id: "maktab", label: "Maktab" },
      { id: "kollej", label: "Kollej / litsey" },
      { id: "bakalavr", label: "Bakalavr (o‘qiyapman)" },
      { id: "bakalavr_tugagan", label: "Bakalavr (tugatgan)" },
      { id: "magistr", label: "Magistratura" },
      { id: "boshqa", label: "Boshqa" },
    ],
  },
  {
    id: "occupation",
    title: "Hozirgi bandingiz",
    type: "single",
    required: true,
    profile: true,
    options: [
      { id: "talaba", label: "Talaba" },
      { id: "ishlayman", label: "Ishlayman" },
      { id: "ikkalasi", label: "O‘qiyman va ishlayman" },
      { id: "ishsiz", label: "Hozircha ishsizman" },
      { id: "boshqa", label: "Boshqa" },
    ],
  },
  {
    id: "q1",
    title: "Kelajakdagi kasbingizni tanlab bo‘lganmisiz?",
    type: "single",
    required: true,
    options: [
      { id: "ha", label: "Ha" },
      { id: "qisman", label: "Qisman" },
      { id: "yoq", label: "Yo‘q" },
    ],
  },
  {
    id: "q2",
    title: "Kasb tanlashda siz uchun eng muhim omil nima?",
    type: "multiple",
    required: true,
    allowOther: true,
    options: [
      { id: "daromad", label: "Yuqori daromad" },
      { id: "qiziqish", label: "Qiziqish" },
      { id: "obro", label: "Jamiyatdagi obro‘" },
      { id: "ish", label: "Ish topish imkoniyati" },
      { id: "otaona", label: "Ota-ona tavsiyasi" },
      { id: "boshqa", label: "Boshqa" },
    ],
  },
  {
    id: "q3",
    title: "Tanlagan kasbingiz bo‘yicha ishlashni xohlaysizmi?",
    type: "single",
    required: true,
    options: [
      { id: "ha", label: "Ha" },
      { id: "yoq", label: "Yo‘q" },
      { id: "aniq_emas", label: "Aniq emas" },
    ],
  },
  {
    id: "q4",
    title: "Ota-onangizning kasb tanlashingizga ta’siri qanchalik katta?",
    type: "single",
    required: true,
    options: [
      { id: "juda_katta", label: "Juda katta" },
      { id: "malum", label: "Ma’lum darajada" },
      { id: "kam", label: "Kam" },
      { id: "yoq", label: "Umuman ta’sir qilmaydi" },
    ],
  },
  {
    id: "q5",
    title:
      "Sizningcha, universitetda olinayotgan bilimlar kelajakdagi ish uchun yetarlimi?",
    type: "single",
    required: true,
    options: [
      { id: "ha", label: "Ha" },
      { id: "qisman", label: "Qisman" },
      { id: "yoq", label: "Yo‘q" },
      { id: "bilmayman", label: "Bilmayman" },
    ],
  },
  {
    id: "q6",
    title: "Siz uchun ish tanlashda qaysi biri muhimroq?",
    type: "multiple",
    required: true,
    options: [
      { id: "maosh", label: "Yuqori maosh" },
      { id: "qiziqarli", label: "Qiziqarli ish" },
      { id: "karyera", label: "Karyera o‘sishi" },
      { id: "muvozanat", label: "Ish va shaxsiy hayot muvozanati" },
      { id: "barqaror", label: "Barqaror ish" },
    ],
  },
  {
    id: "q7",
    title:
      "Hozirgi mehnat bozorida yoshlar uchun ish topish qiyin deb o‘ylaysizmi?",
    type: "single",
    required: true,
    options: [
      { id: "ha", label: "Ha" },
      { id: "yoq", label: "Yo‘q" },
      { id: "qisman", label: "Qisman" },
      { id: "bilmayman", label: "Bilmayman" },
    ],
  },
  {
    id: "q8",
    title: "Ishga kirishda diplom muhimroqmi yoki amaliy ko‘nikmalar?",
    type: "single",
    required: true,
    options: [
      { id: "diplom", label: "Diplom" },
      { id: "amaliy", label: "Amaliy ko‘nikmalar" },
      { id: "ikkala", label: "Ikkalasi ham" },
      { id: "joyga", label: "Ish joyiga qarab" },
    ],
  },
];

export function labelForOption(
  questionId: string,
  optionId: string
): string {
  const q = questions.find((item) => item.id === questionId);
  if (!q) return optionId;
  if (q.type === "text" || q.type === "number") return optionId;
  if (optionId.startsWith("other:")) {
    return `Boshqa: ${optionId.slice(6)}`;
  }
  return q.options?.find((o) => o.id === optionId)?.label ?? optionId;
}

export function formatAnswerValue(
  questionId: string,
  value: string | string[]
): string {
  if (Array.isArray(value)) {
    return value.map((v) => labelForOption(questionId, v)).join(", ");
  }
  return labelForOption(questionId, value);
}
