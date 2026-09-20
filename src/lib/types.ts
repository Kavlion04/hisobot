export type QuestionType = "single" | "multiple" | "text" | "number";

export type Question = {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  options?: { id: string; label: string }[];
  allowOther?: boolean;
  placeholder?: string;
  hint?: string;
  /** Profile fields shown in Telegram header, not as option charts */
  profile?: boolean;
};

export type SurveyAnswers = Record<string, string | string[]>;

export type SurveyResponse = {
  id: string;
  createdAt: string;
  answers: SurveyAnswers;
  meta?: {
    userAgent?: string;
  };
};
