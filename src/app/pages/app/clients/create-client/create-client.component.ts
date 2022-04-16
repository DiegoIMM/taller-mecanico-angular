import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {AuthService} from '../../../../services/auth.service';
import Regiones from '../../../../helpers/regiones.json';

@Component({
  selector: 'app-create-client',
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
    console.warn(data);
    this.createClientForm = this.fb.group({
      id: new FormControl({
        value: data.client ? data.client.id : null,
        disabled: false
      }),
      idEmpresa: new FormControl({
        value: data.idEmpresa ? data.client.idEmpresa : null,
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
        disabled: !data.edit
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
      }, [Validators.required])
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

  updateCommunes() {

    this.createClientForm.updateValueAndValidity();
    this.createClientForm.controls['ciudad'].reset();
    this.communes = this.regiones.regions.find(region => region.name == this.createClientForm.controls['comuna'].value)!.communes;
    this.createClientForm.updateValueAndValidity();

  }

  async saveClient(): Promise<void> {
    // this.loadingButton = true;
    console.log(this.createClientForm.value);

    this.api.addClient(this.createClientForm.value).subscribe({
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

  async editClient(): Promise<void> {
    // this.loadingButton = true;
    console.log(this.createClientForm.value);

    this.api.editClient(this.createClientForm.value).subscribe({
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
