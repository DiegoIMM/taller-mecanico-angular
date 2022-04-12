import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../../../services/auth.service';

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
              private auth: AuthService,
              public dialogRef: MatDialogRef<CreateProviderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.createProviderForm = this.fb.group({
      idEmpresa: new FormControl(null, [Validators.required]),
      habilitado: new FormControl(1, [Validators.required]),
      nombre: new FormControl({
        value: data.provider ? data.provider.nombre : null,
        disabled: !data.edit
      }, [Validators.required]),
      apellido: new FormControl({
        value: data.provider ? data.provider.apellido : null,
        disabled: !data.edit
      }, [Validators.required]),
      rut: new FormControl({
        value: data.provider ? data.provider.rut : null,
        disabled: !data.edit
      }, [Validators.required]),
      direccion: new FormControl({
        value: data.provider ? data.provider.direccion : null,
        disabled: !data.edit
      }, [Validators.required]),
      comuna: new FormControl({
        value: data.provider ? data.provider.comuna : null,
        disabled: !data.edit
      }, [Validators.required]),
      ciudad: new FormControl({
        value: data.provider ? data.provider.ciudad : null,
        disabled: !data.edit
      }, [Validators.required]),
      telefono: new FormControl({
        value: data.provider ? data.provider.telefono : null,
        disabled: !data.edit
      }, [Validators.required]),
      email: new FormControl({
        value: data.provider ? data.provider.email : null,
        disabled: !data.edit
      }, [Validators.required])
    });
    this.createProviderForm.get('idEmpresa')!.setValue(this.auth.getIdEmpresa(), {emitEvent: false});

  }

  onNoClick(): void {

    this.dialogRef.close();
  }

  ngOnInit(): void {

  }

  async saveProvider(): Promise<void> {
    // this.loadingButton = true;
    console.log(this.createProviderForm.value);

    this.api.addProviders(this.createProviderForm.value).subscribe({
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
