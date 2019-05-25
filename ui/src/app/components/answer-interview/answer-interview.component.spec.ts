import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerInterviewComponent } from './answer-interview.component';

describe('AnswerInterviewComponent', () => {
  let component: AnswerInterviewComponent;
  let fixture: ComponentFixture<AnswerInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
