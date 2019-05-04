import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { InterviewService } from 'src/app/services/interview.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { AppError } from 'src/common/app-error';
import { BadInput } from 'src/common/bad-input';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {
  loading = true;
  questions: any[];
  interview: any[];
  interviewForm: FormGroup;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private form: FormBuilder, private QService: QuestionsService, private IService: InterviewService) { }

  ngOnInit() {
    this.getInterview(this.activatedRoute.snapshot.url[1].path);
  }

  onSubmit() {
    let id = this.activatedRoute.snapshot.url[1].path
    console.log(id)
    this.IService.updateStatus(id)
      .subscribe(updatedInterview => {
        console.log('answered');
        this.router.navigate(['/browseInterviews'])
      });
  }

  private getInterview(id) {
    this.loading = true;
    this.IService.get(id)
      .subscribe(interview => {
        this.interview = interview;
        this.questions = interview.questions;
        this.loading = false;
        console.log(this.interview, this.questions);
      });
  }

  private generateReport(interview) {
    const pdf = new jsPDF();
    pdf.setFontSize(24);
    pdf.text(40, 20, 'MEDBot medical interview report');
    pdf.autoTable({
      styles: { fontSize: 18 },
      margin: { top: 40 },
      body: [
        ['interview nr', interview.id],
        ['doctor', `${interview.sender.firstName} ${interview.sender.lastName}`],
        ['patient', `${interview.receiver.firstName} ${interview.receiver.lastName}`],
        ['status', interview.status],
        ['created at', interview.creationTimestamp],
        ['updated at', interview.lastActionTimestamp],
      ]
    });
    pdf.addPage();

    pdf.setFontSize(24);
    pdf.text(90, 20, 'Questions');
    pdf.autoTable({
      styles: { fontSize: 18 },
      margin: { top: 40 },
      body: interview.questions.map(e => [e.question.question, e.answer]),
    });
    pdf.save(`report_${interview.id}_${interview.receiver.firstName}_${interview.receiver.lastName}.pdf`);
  }
}
