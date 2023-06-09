import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../../../services/auth.service';
import * as Regiones from '../../../../../assets/Regiones.json';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {

  createClientForm: FormGroup;
  loadingButton = false;
  regiones = Regiones;
  communes: any[] = [];

  constructor(private fb: FormBuilder,
              private api: ApiService,
              private auth: AuthService,
              public dialogRef: MatDialogRef<CreateClientComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.createClientForm = this.fb.group({
      id: new FormControl({
        value: data.client ? data.client.id : null,
        disabled: !data.edit
      }),
      idEmpresa: new FormControl({
        value: data.client ? data.client.idEmpresa : null,
        disabled: !data.edit
      }, [Validators.required]),
      habilitado: new FormControl({
        value: data.client ? data.client.habilitado : true,
        disabled: !data.edit
      }, [Validators.required]),
      nombre: new FormControl({
        value: data.client ? data.client.nombre : null,
        disabled: !data.edit
      }, [Validators.required]),
      apellido: new FormControl({
        value: data.client ? data.client.apellido : null,
        disabled: !data.edit
      }, [Validators.required]),
      rut: new FormControl({
        value: data.client ? data.client.rut : null,
        disabled: data.provider
      }, [Validators.required]),


      direccion: new FormControl({
        value: data.client ? data.client.direccion : null,
        disabled: !data.edit
      }, [Validators.required]),
      comuna: new FormControl({
        value: data.client ? data.client.comuna : null,
        disabled: !data.edit
      }, [Validators.required]),
      ciudad: new FormControl({
        value: data.client ? data.client.ciudad : null,
        disabled: !data.edit
      }, [Validators.required]),
      telefono: new FormControl({
        value: data.client ? data.client.telefono : null,
        disabled: !data.edit
      }, [Validators.required, Validators.pattern('^([+]?[\\s0-9]+)?(\\d{3}|[(]?[0-9]+[)])?([-]?[\\s]?[0-9])+$')]),
      email: new FormControl({
        value: data.client ? data.client.email : null,
        disabled: !data.edit
      }, [Validators.required, Validators.email])
    });
    this.createClientForm.get('idEmpresa')!.setValue(this.auth.getIdEmpresa(), {emitEvent: false});

  }

  onNoClick(): void {

    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.updateCommunes();
    if (this.data) {
      this.createClientForm.get('ciudad')!.setValue(this.data.client.ciudad);
    }
  }

  async saveClient(): Promise<void> {
    // this.loadingButton = true;
    console.log(this.createClientForm.value);

    this.api.addClient(this.createClientForm.getRawValue()).subscribe({
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

  async editClient(): Promise<void> {
    // this.loadingButton = true;
    console.warn(this.createClientForm.value);

    this.api.editClient(this.createClientForm.getRawValue()).subscribe({
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

  updateCommunes() {
    this.createClientForm.updateValueAndValidity();
    this.createClientForm.controls['ciudad'].reset();
    this.communes = this.regiones.regions.find((region: any) => region.name == this.createClientForm.controls['comuna'].value)!.communes;
    this.createClientForm.updateValueAndValidity();

  }


}
