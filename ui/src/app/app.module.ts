import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule } from '@angular/material';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { MedsComponent } from './components/meds/meds.component';
import { PatientsComponent } from './components/patients/patients.component';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';

@NgModule({
  declarations: [
    AppComponent,
    DoctorsComponent,
    MedsComponent,
    PatientsComponent,
    HelloWorldComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  exports: [MatButtonModule, MatToolbarModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
