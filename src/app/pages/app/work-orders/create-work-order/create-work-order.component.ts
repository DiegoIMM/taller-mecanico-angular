import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../services/api.service';
import {CreateClientComponent} from '../../clients/create-client/create-client.component';
import {CreateVehicleComponent} from '../../vehicles/create-vehicle/create-vehicle.component';

@Component({
  selector: 'app-create-work-order',
  templateUrl: './create-work-order.component.html',
  styleUrls: ['./create-work-order.component.scss']
})
export class CreateWorkOrderComponent implements OnInit {

  createWorkOrderForm: FormGroup;
  loadingButton = false;
  allClients: any[] = [];
  loadingClients = true;
  allVehicles: any[] = [];
  loadingVehicles = true;

  constructor(private dialog: MatDialog,
              private fb: FormBuilder,
              private api: ApiService,
              public dialogRef: MatDialogRef<CreateWorkOrderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.createWorkOrderForm = this.fb.group({
      numeroOrden: new FormControl('', [Validators.required]),
      fechaIngreso: new FormControl('', [Validators.required]),
      rutCliente: new FormControl('', [Validators.required]),
      patenteVehiculo: new FormControl('', [Validators.required]),
      //Detalle es un array de objetos
      detalle: this.fb.array([
        this.fb.group({
          descripcion: new FormControl(''),
          recargo: new FormControl('', [Validators.required])
        })
      ], [Validators.required]),
      codigoRepuestos: new FormControl(''),
      valorOt: new FormControl('')


    });
  }

  get detalleFormArray(): FormArray {
    return this.createWorkOrderForm.get('detalle') as FormArray;
  }

  onNoClick(): void {

    this.dialogRef.close();
  }

  openModalCrearCliente() {
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

  openModalCrearVehiculo() {
    this.dialog.open(CreateVehicleComponent, {
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

  getAllVehicles(): void {
    this.allVehicles = [];
    this.loadingVehicles = true;
    this.api.getAllVehicles().subscribe({
      next: data => {
        this.allVehicles = data.vehiculoDtoList;
      }, error: error => {
        console.log(error);
      }, complete: () => {

        this.loadingVehicles = false;

      }
    });
  }


  ngOnInit(): void {
    this.getAllClients();
    this.getAllVehicles();

  }

  addDetail() {
    const detailForm = <FormArray>this.createWorkOrderForm.controls['detalle'];

    detailForm.push(new FormGroup({
      descripcion: new FormControl(''),
      recargo: new FormControl('', [Validators.required])
    }));
  }

  eliminarDireccion(index: number) {
    const detailForm = <FormArray>this.createWorkOrderForm.controls['detalle'];

    detailForm.removeAt(index);
  }


  async saveWorkOrder(): Promise<void> {
    // this.loadingButton = true;
    console.log(this.createWorkOrderForm.value);

    this.api.addWorkOrder(this.createWorkOrderForm.value).subscribe({
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
