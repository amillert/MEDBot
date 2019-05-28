import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  addQuestionsForm: FormGroup;
  loading = false;
  questions: any[];

  constructor(private formBuilder: FormBuilder, private service: QuestionsService, private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.addQuestionsForm = this.formBuilder.group({
      question: ['', Validators.required]
    });
    this.getAllQuestions();
  }

  get formControls() { return this.addQuestionsForm.controls; }

  onSubmit() {
    if (this.addQuestionsForm.invalid) {
      return;
    }
    let question = {
      question: this.formControls.question.value
    }
    this.service.addQuestion(question)
      .subscribe(
        newQuestion => {
          this.getAllQuestions()
          this.toastrService.success("Question has been added !")
        });
    this.addQuestionsForm.reset();
  }

  deleteQuestion(question) {
    this.service.delete(question.id).subscribe(
      updatedQuestion => {
        this.getAllQuestions();
      });
  }

  private getAllQuestions() {
    this.loading = true;
    this.service.getAll()
      .subscribe(questions => {
        this.questions = questions['questions'];
        this.loading = false;
      });
  }
}
