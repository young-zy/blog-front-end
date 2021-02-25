import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Question, QuestionListResponse } from '../common/entities/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionApiService {

  newQuestion(token: string, questionContent: string, email: string | undefined): Observable<Response> {
    const headers = new HttpHeaders().set('captchaToken', token);
    return this.http.post<Response>(`${environment.baseURL}/question`, {
      questionContent,
      email
    }, {
      headers
    });
  }

  getQuestions(page: number = 1, size: number = 10, filter: string = ''): Observable<QuestionListResponse> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('filter', filter);
    return this.http.get<QuestionListResponse>(`${environment.baseURL}/question`, {
      params
    });
  }

  getQuestion(questionId: number): Observable<Question>{
    return this.http.get<Question>(`${environment.baseURL}/question/${questionId}`);
  }

  answerQuestion(questionId: number, answerContent: string): Observable<any>{
    return this.http.post(`${environment.baseURL}/question/${questionId}/answer`, {answerContent});
  }

  constructor(private http: HttpClient) { }
}
