export interface QuizQuestion {
  id: string;
  belt_id: string;
  question: string;
  options: string[]; // JSONB array of strings
  correct_answer: string;
  type: 'technique' | 'history' | 'vocab';
}

export interface QuizAttemptAnswer {
  question_id: string;
  selected: string;
  correct: string;
}

export interface QuizAttempt {
  id?: string;
  user_id?: string;
  belt_id: string;
  score: number;
  total_questions: number;
  answers: QuizAttemptAnswer[];
  created_at?: string;
}
