export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: number;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonRequest {
  title: string;
  description: string;
  order: number;
  category: string;
  isWelcome: boolean;
  videoUrl: string;
  audioUrl: string;
  htmlContent: string;
  durationMinutes: number;
  prerequisites: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: number;
}

export const QuestionType = {
  FreeText: 0,
  Number: 1,
  MultipleChoice: 2,
  SingleChoice: 3
} as const;

export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

export const DeliveryMethod = {
  Immediate: 0,
  Email: 1
} as const;

export type DeliveryMethod = typeof DeliveryMethod[keyof typeof DeliveryMethod];

export interface QuestionOption {
  text: string;
  comment: string;
  order: number;
}

export interface Question {
  questionText: string;
  questionType: QuestionType;
  maxCharacters: number;
  isRequired: boolean;
  order: number;
  options: QuestionOption[];
}

export interface NotificationConfig {
  generateNotification: boolean;
  triggerCourseId: string;
  triggerLessonId: string;
  deliveryMethod: DeliveryMethod;
  notificationTitle: string;
  notificationMessage: string;
}

export interface CreateFormRequest {
  title: string;
  description: string;
  questions: Question[];
  notificationConfig: NotificationConfig;
}