
export interface Question{
  id: number;
  questionContent: string;
  createTime: Date;
  email: string;
  answerContent: string;
  answerTime: Date;
  isAnswered: boolean;
}

export interface QuestionListResponse {
  questions: Question[];
  totalCount: number;
}
