import { User } from './user';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  lastUpdated: Date;
}

export interface PostListResponse {
  posts: Post[];
  totalCount: number;
}
