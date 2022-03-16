import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss']
})
export class CreateProviderComponent implements OnInit {

  createProviderForm: FormGroup;
  loadingButton = false;


  constructor(private fb: FormBuilder,
              private api: ApiService,
              public dialogRef: MatDialogRef<CreateProviderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.createProviderForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      rut: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      comuna: new FormControl('', [Validators.required]),
      ciudad: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])
    });
  }

  onNoClick(): void {

    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  async saveProvider(): Promise<void> {
    // this.loadingButton = true;
    console.log(this.createProviderForm.value);

    this.api.addCarPart(this.createProviderForm.value).subscribe({
      next: (res: any) => {
        console.log('res', res);
        if (res) {
          this.dialogRef.close(res.id);
        }
      }, error: (err: any) => {
        console.error('err', err);
      }
    });

  }


}
