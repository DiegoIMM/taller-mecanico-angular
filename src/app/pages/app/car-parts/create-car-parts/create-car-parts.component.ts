import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-create-car-parts',
  templateUrl: './create-car-parts.component.html',
  styleUrls: ['./create-car-parts.component.scss']
})
export class CreateCarPartsComponent implements OnInit {


  createCarPartsForm: FormGroup;
  loadingButton = false;


  constructor(private fb: FormBuilder,
              private api: ApiService,
              public dialogRef: MatDialogRef<CreateCarPartsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.createCarPartsForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      codigo: new FormControl('', [Validators.required]),
      anio: new FormControl('', [Validators.required]),
      modelo: new FormControl('', [Validators.required]),
      valor: new FormControl('', [Validators.required]),
      rutProveedor: new FormControl('', [Validators.required])
    });
  }

  onNoClick(): void {

    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  async saveCarParts(): Promise<void> {
    // this.loadingButton = true;
    console.log(this.createCarPartsForm.value);

    this.api.addCarPart(this.createCarPartsForm.value).subscribe({
      next: (res: any) => {
        console.log('res', res);
        if (res) {
          this.dialogRef.close(res.id);
        }
      }, error: (err: any) => {
        console.error('err', err);
      }
    });

    // const question: Question = Question.fromJson(this.createQuestionForm.getRawValue());


  }


}
