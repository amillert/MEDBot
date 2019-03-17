import { Component, OnInit } from '@angular/core';
import { AppError } from 'src/common/app-error';
import { BadInput } from 'src/common/bad-input';
import { MedsService } from 'src/app/services/accounts/meds.service';

@Component({
  selector: 'app-meds',
  templateUrl: './meds.component.html',
  styleUrls: ['./meds.component.css']
})
export class MedsComponent implements OnInit {

  meds: any[];

  constructor(private service: MedsService) {
  }

  ngOnInit() {
    this.service.getAll()
      .subscribe(meds => this.meds = meds);
  }

  createMed(input: HTMLInputElement) {
    let med = { name: input.value };
    this.meds.splice(0, 0, med);

    input.value = '';

    this.service.create(med)
      .subscribe(
        newMed => {
          med['id'] = newMed.id;
        },
        (error: AppError) => {
          this.meds.splice(0, 1);

          if (error instanceof BadInput) {
            // this.form.setErrors(error.originalError);
          }
          else throw error;
        });
  }

  updateMed(med) {
    this.service.update(med)
      .subscribe(
        updatedMed => {
          console.log(updatedMed);
        });
  }

  deleteMed(med) {
    this.service.delete(med.id);
  }

}
