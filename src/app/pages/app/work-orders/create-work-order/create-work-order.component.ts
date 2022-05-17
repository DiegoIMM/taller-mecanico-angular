import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../services/api.service';
import {CreateClientComponent} from '../../clients/create-client/create-client.component';
import {CreateVehicleComponent} from '../../vehicles/create-vehicle/create-vehicle.component';
import {MatTableDataSource} from '@angular/material/table';
import {AuthService} from '../../../../services/auth.service';

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
  allCarParts: any[] = [];
  loadingCarParts = true;

  constructor(private dialog: MatDialog,
              private fb: FormBuilder,
              private api: ApiService,
              private auth: AuthService,
              public dialogRef: MatDialogRef<CreateWorkOrderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.createWorkOrderForm = this.fb.group({
      idEmpresa: new FormControl(null, [Validators.required]),
      habilitado: new FormControl(true, [Validators.required]),
      numeroOrden: new FormControl('', [Validators.required]),
      fechaIngreso: new FormControl(null, [Validators.required]),
      rutCliente: new FormControl('', [Validators.required]),
      patenteVehiculo: new FormControl('', [Validators.required]),
      //Detalle es un array de objetos
      detalle: this.fb.array([
        this.fb.group({
          descripcion: new FormControl(''),
          codigoRepuestos: new FormControl(''),
          recargo: new FormControl('', [Validators.required])
        })
      ], [Validators.required]),
      valorOt: new FormControl(0)


    });
    this.createWorkOrderForm.get('idEmpresa')!.setValue(this.auth.getIdEmpresa(), {emitEvent: false});

    //  agregar un listener al formulario
    this.createWorkOrderForm.valueChanges.subscribe(() => {
      this.calcularValorOt();
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
      width: '1000px',
      data: {
        title: 'Crear cliente',
        client: null,
        edit: true
      }
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
        this.allClients = data;
      }, error: error => {
        console.log(error);
      }, complete: () => {
        this.loadingClients = false;
      }
    });
  }


  getAllCarParts(): void {
    this.loadingCarParts = true;
    this.api.getAllCarParts().subscribe({
      next: data => {
        console.warn(data);
        this.allCarParts = data;

      }, error: error => {
        console.log(error);
      }, complete: () => {

        this.loadingCarParts = false;

      }
    });
  }


  ngOnInit(): void {
    this.getAllClients();
    this.getAllCarParts();

  }

  addDetail() {
    const detailForm = <FormArray>this.createWorkOrderForm.controls['detalle'];

    detailForm.push(new FormGroup({
      descripcion: new FormControl(''),
      codigoRepuestos: new FormControl(''),
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

  selectRepuesto(index: number, code: any) {

    // Buscar repuesto por codigo
    const repuesto = this.allCarParts.find(repuesto => repuesto.codigo === code);
    const valor = (repuesto.valor * 1.35);
    // redondear valor en un multiplo de 10
    const valorRounded = Math.round(valor / 10) * 10;

    console.warn(repuesto);
    this.detalleFormArray.at(index).get('recargo')!.setValue(valorRounded, {emitEvent: false});

    this.calcularValorOt();
  }


  getVehiclesByClient(rutCliente: number): void {
    console.log('clientId', rutCliente);
    this.api.getVehiclesByClient(rutCliente.toString()).subscribe({
      next: (res: any) => {
        console.log('res', res);
        if (res) {
          this.allVehicles = res;
        }
      }, error: (err: any) => {
        console.error('err', err);
      }
    });
  }

  calcularValorOt(): void {
    console.log('calcularValorOt');
    let valorOt = 0;
    for (let i = 0; i < this.detalleFormArray.length; i++) {
      valorOt += Number(this.detalleFormArray.at(i).get('recargo')?.value);
    }


    this.createWorkOrderForm.get('valorOt')!.setValue(valorOt, {emitEvent: false});


  }


}
