import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-create-car-parts',
  templateUrl: './create-car-parts.component.html',
  styleUrls: ['./create-car-parts.component.scss']
})
export class CreateCarPartsComponent implements OnInit {


  createCarPartsForm: FormGroup;
  loadingButton = false;
  allProviders: any[] = [];
  loadingProviders = false;

  constructor(private fb: FormBuilder,
              private api: ApiService,
              private auth: AuthService,
              public dialogRef: MatDialogRef<CreateCarPartsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.createCarPartsForm = this.fb.group({
      idEmpresa: new FormControl(null, [Validators.required]),
      habilitado: new FormControl(true, [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      codigo: new FormControl('', [Validators.required]),
      anio: new FormControl('', [Validators.required]),
      marca: new FormControl('', [Validators.required]),
      modelo: new FormControl('', [Validators.required]),
      valor: new FormControl('', [Validators.required]),
      rutProveedor: new FormControl('', [Validators.required])
    });
    this.createCarPartsForm.get('idEmpresa')!.setValue(this.auth.getIdEmpresa(), {emitEvent: false});

  }

  onNoClick(): void {

    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getAllProviders();
  }

  getAllProviders(): void {
    this.loadingProviders = true;
    this.api.getAllProviders().subscribe({
      next: data => {

        console.warn(data);
        var enabledProviders: any[] = [];

        data.forEach((provider: any) => {

          if (provider.habilitado) {
            enabledProviders.push(provider);
          }
        });

        this.allProviders = enabledProviders;

      }, error: error => {
        console.log(error);
      }, complete: () => {

        this.loadingProviders = false;

      }
    });
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

  }


}
