import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    const formControls = this.questionsList.map(control => new FormControl(false));

    this.interviewForm = this.fb.group({
      questionsList: new FormArray(formControls)
    });
  }

  ngOnInit() { }

  onSubmit() { 
    
  }

}
