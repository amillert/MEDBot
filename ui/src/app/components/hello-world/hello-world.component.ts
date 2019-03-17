import { Component, OnInit } from '@angular/core';
import { HelloworldService } from 'src/app/services/helloworld.service';
import { Helloworld } from 'src/app/models/helloworld';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent implements OnInit {
  hw: Helloworld;

  constructor(private service: HelloworldService) { }

  ngOnInit() {
    this.service.getHelloWorld()
      .subscribe(hw => {
         this.hw = hw 
        });
  }

}
