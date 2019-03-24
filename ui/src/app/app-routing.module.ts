import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { MedsComponent } from './components/meds/meds.component';
import { PatientsComponent } from './components/patients/patients.component';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';
import { InterviewComponent } from './components/interview/interview.component';
import { LoginComponent } from './components/login/login.component';
import { QuestionsComponent } from './components/questions/questions.component';

const routes: Routes = [
  { path: '', redirectTo: '/helloworld', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'interview/:id', component: InterviewComponent },
  { path: 'helloworld', component: HelloWorldComponent },
  { path: 'doctors', component: DoctorsComponent },
  { path: 'meds', component: MedsComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'questions', component: QuestionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
