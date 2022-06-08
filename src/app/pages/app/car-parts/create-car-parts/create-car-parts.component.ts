import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {AuthService} from '../../../../services/auth.service';
import {CreateClientComponent} from '../../clients/create-client/create-client.component';
import {CreateProviderComponent} from '../../providers/create-provider/create-provider.component';

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
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<CreateCarPartsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.warn('dataaaaa', data);
    this.createCarPartsForm = this.fb.group({
      id: new FormControl({
        value: data.carPart ? data.carPart.id : null,
        disabled: !data.edit
      }),
      idEmpresa: new FormControl({
        value: data.idEmpresa ? data.carPart.idEmpresa : null,
        disabled: !data.edit
      }, [Validators.required]),
      habilitado: new FormControl({
        value: data.carPart ? data.carPart.habilitado : true,
        disabled: !data.edit
      }, [Validators.required]),
      nombre: new FormControl({
        value: data.carPart ? data.carPart.nombre : null,
        disabled: !data.edit
      }, [Validators.required]),
      codigo: new FormControl({
        value: data.carPart ? data.carPart.codigo : null,
        disabled: !data.edit
      }, [Validators.required]),
      anio: new FormControl({
        value: data.carPart ? data.carPart.anio : null,
        disabled: !data.edit
      }, [Validators.required]),
      marca: new FormControl({
        value: data.carPart ? data.carPart.marca : null,
        disabled: !data.edit
      }, [Validators.required]),
      modelo: new FormControl({
        value: data.carPart ? data.carPart.modelo : null,
        disabled: !data.edit
      }, [Validators.required]),
      valor: new FormControl({
        value: data.carPart ? data.carPart.valor : null,
        disabled: !data.edit
      }, [Validators.required]),
      rutProveedor: new FormControl({
        value: data.carPart ? data.carPart?.proveedor[0]?.rut : null,
        disabled: !data.edit
      }, [Validators.required])
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

    this.api.editCarPart(this.createCarPartsForm.value).subscribe({
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


  openModal() {
    this.dialog.open(CreateProviderComponent, {
      width: '1000px',
      data: {
        title: 'Crear proveedor',
        client: null,
        edit: true
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        //TODO: Agregar cliente a la lista sin cargar todos los clientes de nuevo
        this.getAllProviders();
      }
    });
  }


}
