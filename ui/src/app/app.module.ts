import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule } from '@angular/material';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { MedsComponent } from './components/meds/meds.component';
import { PatientsComponent } from './components/patients/patients.component';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';
import { InterviewComponent } from './components/interview/interview.component';

@NgModule({
  declarations: [
    AppComponent,
    DoctorsComponent,
    MedsComponent,
    PatientsComponent,
    HelloWorldComponent,
    InterviewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule
  ],
  exports: [MatButtonModule, MatToolbarModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
