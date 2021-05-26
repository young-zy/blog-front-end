export interface Reply {
  id: number;
  content: string;
  email: string;
  postId: number;
  lastUpdated: Date;
}

export interface ReplyListResponse {
  replies: Reply[];
  totalCount: number;
}
