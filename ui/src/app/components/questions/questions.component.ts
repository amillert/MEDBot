import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { BadInput } from 'src/common/bad-input';
import { AppError } from 'src/common/app-error';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questions: any[];

  constructor(private service: QuestionsService) {
  }

  ngOnInit() {
    this.service.getAll()
      .subscribe(questions => {this.questions = questions; console.log(questions)});
  }

  createQuestion(input: HTMLInputElement) {
    let question = { name: input.value };
    this.questions.splice(0, 0, question);

    input.value = '';

    this.service.create(question)
      .subscribe(
        newQuestion => {
          question['id'] = newQuestion.id;
        },
        (error: AppError) => {
          this.questions.splice(0, 1);

          if (error instanceof BadInput) {
            // this.form.setErrors(error.originalError);
          }
          else throw error;
        });
  }

  updateQuestion(question) {
    this.service.update(question)
      .subscribe(
        updatedQuestion => {
          console.log(updatedQuestion);
        });
  }

  deleteQuestion(question) {
    this.service.delete(question.id).subscribe(
      updatedQuestion => {
        console.log(question.id + 'deleted');
      });;
  }

}
