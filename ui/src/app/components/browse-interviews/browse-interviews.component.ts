import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-browse-interviews',
  templateUrl: './browse-interviews.component.html',
  styleUrls: ['./browse-interviews.component.css']
})

export class BrowseInterviewsComponent implements OnInit {
  loading = false;
  interviews: any[];

  constructor(private service: InterviewService, private router: Router) { }

  ngOnInit() {
    this.getAllInterviews();
  }

  private openInterview(url, id){
    console.log("opened interview ->", id)
    this.router.navigate([url, id]).then( (e) => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });
  }

  private getAllInterviews() {
    this.loading = true;
    this.service.getAll()
      .subscribe(interviews => {
        this.interviews = interviews['interviews'];
        this.loading = false;
        console.log(this.interviews);
      });
  }

}
