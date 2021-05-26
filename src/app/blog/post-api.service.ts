import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post, PostListResponse } from '../common/entities/post';
import { ReplyListResponse } from '../common/entities/reply';

@Injectable({
  providedIn: 'root'
})
export class PostApiService {

  constructor(private http: HttpClient) {
  }

  addPost(): Observable<Response> {
    return this.http.post<Response>(`${environment.baseURL}`, {});
  }

  getPostList(page: number = 1, size: number = 10): Observable<PostListResponse> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<PostListResponse>(`${environment.baseURL}/post`, {
      params
    });
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(`${environment.baseURL}/post/${postId}`);
  }

  getReplyList(postId: number, page: number = 1, size: number = 10): Observable<ReplyListResponse> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<ReplyListResponse>(`${environment.baseURL}/post/${postId}`, {
      params
    });
  }

  addReply(postId: number, email: string, replyContent: string): Observable<Response> {
    return this.http.post<Response>(`${environment.baseURL}/post/${postId}`, {
      email,
      replyContent
    });
  }
}
