import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../services/api.service';
import {CreateClientComponent} from '../../clients/create-client/create-client.component';
import {CreateVehicleComponent} from '../../vehicles/create-vehicle/create-vehicle.component';
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

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    public dialogRef: MatDialogRef<CreateWorkOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('data', data);
    this.createWorkOrderForm = this.fb.group({
      id: new FormControl({
        value: data.work_order ? data.work_order.id : null,
        disabled: !data.edit
      }),
      idEmpresa: new FormControl({
        value: data.work_order ? data.work_order.idEmpresa : null,
        disabled: !data.edit
      }, [Validators.required]),
      habilitado: new FormControl({
        value: data.work_order ? data.work_order.habilitado : true,
        disabled: !data.edit
      }, [Validators.required]),
      numeroOrden: new FormControl({
        value: data.work_order ? data.work_order.numeroOrden : null,
        disabled: data.work_order
      }, [Validators.required]),
      estado: new FormControl({
        value: data.work_order ? data.work_order.estado : 'ABIERTAS',
        disabled: !data.work_order
      }, [Validators.required]),
      //fechaIngreso: new FormControl(null, [Validators.required]),
      rutCliente: new FormControl({
        value: data.work_order ? data.work_order.rutCliente : null,
        disabled: !data.edit
      }, [Validators.required]),
      patenteVehiculo: new FormControl({
        value: data.work_order ? data.work_order.patenteVehiculo : null,
        disabled: !data.edit
      }, [Validators.required]),
      //Detalle es un array de objetos
      detalle: data.work_order ? this.fb.array([]) : this.fb.array(
        [
          this.fb.group({
            descripcion: new FormControl(''),
            codigoRepuestos: new FormControl(''),
            repuesto_id: new FormControl(''),
            recargo: new FormControl('', [Validators.required])
          })
        ],
        [Validators.required]
      ),
      valorOt: new FormControl({
        value: data.work_order ? data.work_order.valorOt : 0,
        disabled: !data.edit
      })
    });
    this.createWorkOrderForm
      .get('idEmpresa')!
      .setValue(this.auth.getIdEmpresa(), {emitEvent: false});

    if (data.work_order) {
      this.getVehiclesByClient(data.work_order.rutCliente);
    }

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
    this.dialog
      .open(CreateClientComponent, {
        width: '1000px',
        data: {
          title: 'Crear cliente',
          client: null,
          edit: true
        }
      })
      .afterClosed()
      .subscribe((result) => {
        console.log('The dialog was closed with result: ' + result);
        if (result != null) {
          //TODO: Agregar cliente a la lista sin cargar todos los clientes de nuevo
          this.getAllClients();
        }
      });
  }

  openModalCrearVehiculo() {
    this.dialog
      .open(CreateVehicleComponent, {
        width: '1000px'
      })
      .afterClosed()
      .subscribe((result) => {
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
      next: (data) => {
        var enabledClients: any[] = [];

        data.forEach((client: any) => {
          if (client.habilitado) {
            enabledClients.push(client);
          }
        });
        this.allClients = enabledClients;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loadingClients = false;
      }
    });
  }

  getAllCarParts(): void {
    this.loadingCarParts = true;
    this.api.getAllCarParts().subscribe({
      next: (data) => {
        let activeCarParts = data.filter(
          (provider: any) => provider.habilitado
        );

        this.allCarParts = activeCarParts;
        this.loadingCarParts = false;
        console.warn(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loadingCarParts = false;
        if (this.data.work_order) {
          this.buildDetail();
        }
      }
    });
  }

  ngOnInit(): void {
    this.getAllClients();
    this.getAllCarParts();
  }

  addDetail() {
    const detailForm = <FormArray>this.createWorkOrderForm.controls['detalle'];

    detailForm.push(
      new FormGroup({
        descripcion: new FormControl(''),
        codigoRepuestos: new FormControl(''),
        repuesto_id: new FormControl(''),
        recargo: new FormControl('', [Validators.required])
      })
    );
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
      },
      error: (err: any) => {
        console.error('err', err);
      }
    });
  }

  async editWorkOrder(): Promise<void> {
    // this.loadingButton = true;
    console.log(this.createWorkOrderForm.value);
    this.api.editWorkOrder(this.createWorkOrderForm.getRawValue()).subscribe({
      next: (res: any) => {
        console.log('res', res);
        if (res) {
          this.dialogRef.close(res.id);
        }
      },
      error: (err: any) => {
        console.error('err', err);
      }
    });
  }

  selectRepuesto(index: number, code: any) {
    console.log('selectRepuesto');


    //index = code.id;
    // Buscar repuesto por codigo
    console.log('code', code);
    const repuesto = this.allCarParts.find(
      (repuesto) => repuesto.codigo === code
    );
    console.log('repuesto', repuesto);
    const repuesto_id = this.allCarParts.find(
      (repuesto) => repuesto.id === repuesto.id
    );
    const valor = repuesto.valor * 1.35;
    // redondear valor en un multiplo de 10
    const valorRounded = Math.round(valor / 10) * 10;

    console.warn(repuesto);
    this.detalleFormArray
      .at(index)
      .get('recargo')!
      .setValue(valorRounded, {emitEvent: false});

    this.detalleFormArray
      .at(index)
      .get('repuesto_id')!
      .setValue(repuesto.id, {emitEvent: false});

    this.calcularValorOt();
  }

  getVehiclesByClient(rutCliente: number): void {
    console.log('clientId', rutCliente);
    this.api.getVehiclesByClient(rutCliente.toString()).subscribe({
      next: (res: any) => {
        console.log('res', res);
        if (res) {
          let activeVehicles = res.filter((vehicle: any) => vehicle.habilitado);

          this.allVehicles = activeVehicles;
          this.loadingVehicles = false;
        }
      },
      error: (err: any) => {
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

    this.createWorkOrderForm
      .get('valorOt')!
      .setValue(valorOt, {emitEvent: false});
  }


  buildDetail(): void {
    // var a = this.fb.array([]);
    this.data.work_order.detalle.forEach((detail: any, index: any) => {
      this.addDetail();
      console.log('aaaa', detail);
      this.detalleFormArray
        .at(index)
        .get('descripcion')!
        .setValue(detail.descripcion, {emitEvent: false});
      this.detalleFormArray
        .at(index)
        .get('recargo')!
        .setValue(detail.recargo, {emitEvent: false});


      if (detail.repuesto) {
        this.detalleFormArray
          .at(index)
          .get('codigoRepuestos')!
          .setValue(detail.repuesto.codigo, {emitEvent: false});

        this.detalleFormArray
          .at(index)
          .get('repuesto_id')!
          .setValue(detail.repuesto.id, {emitEvent: false});


        this.selectRepuesto(index, detail.repuesto.codigo);

      }

      //
      // a.push(
      //   this.fb.group({
      //     descripcion: new FormControl(detail.descripcion),
      //     codigoRepuestos: new FormControl(detail?.repuesto),
      //     repuesto_id: new FormControl(detail?.repuesto?.id),
      //     recargo: new FormControl(detail.recargo, [Validators.required])
      //   }));
    });
    // return a;

  }
}
