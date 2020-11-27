export type Country = {
  name: string;
  flag: string;
  capital: string;
  region: string;
};

export type Question = {
  question: string;
  answerOptions: Option[];
};

export type Option = {
  answer: string;
  isCorrect: boolean;
};

export type User = {
  userId: number;
  username: string;
  totalAnsweredQuestions: number;
  totalCorrectQuestions: number;
  streakDays: number;
  avatarUrl: string;
  passwordHash: string;
};

export type Category = {
  category_id: number;
};
export type Region = {
  region_id: number;
};
export type RegionScores = {};
export type CategoryScores = {};
export type Session = {
  id: number;
  token: string;
  expiryTimestamp: Date;
  userId: number;
};

export type MemoryCard = Country & {
  visible: boolean;
  solved: boolean;
  id: number;
  pairId: number;
  display: string;
};
