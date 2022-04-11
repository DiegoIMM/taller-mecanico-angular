import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CreateClientComponent} from '../../clients/create-client/create-client.component';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.scss']
})
export class CreateVehicleComponent implements OnInit {


  createVehicleForm: FormGroup;
  loadingButton = false;
  allClients: any[] = [];
  loadingClients = true;

  constructor(private dialog: MatDialog,
              private fb: FormBuilder,
              private api: ApiService,
              public dialogRef: MatDialogRef<CreateVehicleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    console.log('Datos recibidos', data);
    this.createVehicleForm = this.fb.group({
      marca: new FormControl('', [Validators.required]),
      modelo: new FormControl({value: 'Impreza', disabled: false}, [Validators.required]),
      patente: new FormControl('', [Validators.required]),
      anio: new FormControl('', [Validators.required]),
      numeroMotor: new FormControl('', [Validators.required]),
      numeroChasis: new FormControl('', [Validators.required]),
      rutDueno: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      kilometraje: new FormControl('', [Validators.required])
    });
  }

  onNoClick(): void {

    this.dialogRef.close();
  }


  openModal() {
    this.dialog.open(CreateClientComponent, {
      width: '1000px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        //TODO: Agregar cliente a la lista sin cargar todos los clientes de nuevo
        this.getAllClients();
      }
    });
  }

  getAllClients(): void {
    this.allClients = [];
    this.loadingClients = true;
    this.api.getAllClients().subscribe({
      next: data => {
        this.allClients = data.clienteDtoList;
      }, error: error => {
        console.log(error);
      }, complete: () => {

        this.loadingClients = false;

      }
    });
  }


  ngOnInit(): void {
    this.getAllClients();
  }

  async saveVehicle(): Promise<void> {
    // this.loadingButton = true;
    console.log(this.createVehicleForm.value);

    this.api.addVehicle(this.createVehicleForm.value).subscribe({
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
