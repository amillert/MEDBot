import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { InterviewService } from 'src/app/services/interview.service';

@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.css']
})
export class CreateInterviewComponent implements OnInit {
  interviewForm: FormGroup;
  questionsList = [
    { id: 1, quest: 'How do You feel today?' },
    { id: 2, quest: 'How did You sleep tonight?' },
    { id: 3, quest: 'Did You take Your pills?' },
  ];
  

  constructor(private fb: FormBuilder,  private service: InterviewService) {

  }

  get formControls() { return this.interviewForm.controls; }

  ngOnInit() { 
    const formControls = this.questionsList.map(control => new FormControl(false));
    this.interviewForm = this.fb.group({
      patientID: ['', Validators.required],
      questionsList: new FormArray(formControls)
    });
  }

  onSubmit() { 
    let arr = this.formControls.questionsList.value;
    let que = this.questionsList.filter(q => arr[q.id-1] == true);
    let id = +this.formControls.patientID.value;
    let que2  = que.map(function(item) {
      return item['id'];
    });
    this.service.addInterview({
      PatientID: id,
      questions: que2
    });

  }

}
