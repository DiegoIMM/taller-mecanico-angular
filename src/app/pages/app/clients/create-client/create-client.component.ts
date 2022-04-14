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

    this.createClientForm = this.fb.group({
      idEmpresa: new FormControl(null, [Validators.required]),

      habilitado: new FormControl(true, [Validators.required]),

      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      rut: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      comuna: new FormControl('', [Validators.required]),
      ciudad: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required])
    });
    this.createClientForm.get('idEmpresa')!.setValue(this.auth.getIdEmpresa(), {emitEvent: false});

  }

  onNoClick(): void {

    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log(this.regiones.regions);

  }

  updateCommunes() {
    this.createClientForm.controls['ciudad'].reset();
    this.communes = this.regiones.regions.find(region => region.name == this.createClientForm.controls['comuna'].value)!.communes;
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


}
