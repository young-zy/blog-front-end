import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionListComponent } from './question-list.component';

describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionListComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders questions after the API responds', async () => {
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(request => request.url.endsWith('/question')).flush({
      questions: [{
        id: 1,
        questionContent: '异步加载的问题',
        createTime: new Date(),
        email: '',
        answerContent: '',
        answerTime: new Date(),
        isAnswered: false
      }],
      totalCount: 1
    });

    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.question-text')?.textContent).toContain('异步加载的问题');
  });
});
