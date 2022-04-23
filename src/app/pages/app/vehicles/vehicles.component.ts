import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../services/api.service';
import {CreateCarPartsComponent} from '../car-parts/create-car-parts/create-car-parts.component';
import {CreateVehicleComponent} from './create-vehicle/create-vehicle.component';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {DeleteDataModal} from '../../../models/DeleteDataModal';
import {DeleteContentModalComponent} from '../shared/delete-content-modal/delete-content-modal.component';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {


  loadingVehicles = false;
  loadingClients = false;
  allClients: any[] = [];
  selectedClient: any = null;
  patente: string = '';

  vehicles: any[] = [];

  constructor(private dialog: MatDialog, private api: ApiService) {


  }


  ngOnInit(): void {
    this.getAllClients();
  }

  selectClient() {
    this.patente = '';
    console.log(this.selectedClient);


  }


  changePatente() {
    this.selectedClient = null;
    console.log(this.patente);

    // this.loadingVehicles = true;
    // this.api.getVehiclesByPatente(this.patente).subscribe(
    //   (data: any) => {
    //     this.loadingVehicles = false;
    //     console.log(data);
    //   },
    //   (error: any) => {
    //     this.loadingVehicles = false;
    //     console.log(error);
    //   }
    // );
  }

  searchVehicles() {
    if (this.patente == '' && this.selectedClient == null) {
      alert('Debe ingresar una patente o un cliente');
      return;

    }

    this.loadingVehicles = true;
    if (this.selectedClient != null) {
      this.api.getVehiclesByClient(this.selectedClient).subscribe({
        next: (data: any) => {

          let activeVehicles = data.vehiculoDtoList.filter((vehicle: any) => vehicle.habilitado);

          this.vehicles = activeVehicles;
          this.loadingVehicles = false;
          console.log(data);
        }, error: (error: any) => {
          this.loadingVehicles = false;
          console.error(error);
        }, complete: () => {
          this.loadingVehicles = false;

        }
      });
      return;
    }

    if (this.patente != '') {
      this.loadingVehicles = false;
      this.api.getVehiclesByPatente(this.patente).subscribe({
        next: (data: any) => {
          this.vehicles = [data];
          this.loadingVehicles = false;
          console.log(data);
        }, error: (error: any) => {
          this.loadingVehicles = false;
          console.error(error);
        }
      });
      return;
    }
    this.loadingVehicles = false;

    alert('Debe ingresar una patente o un cliente NO DEBERIA LLEGAR ACA');

  }

  getAllClients(): void {
    this.loadingClients = true;
    this.api.getAllClients().subscribe({
      next: data => {
        console.warn(data);
        var enabledClients: any[] = [];

        data.forEach((client: any) => {

          if (client.habilitado) {
            enabledClients.push(client);
          }
        });
        this.allClients = enabledClients;


      }, error: error => {
        console.log(error);
      }, complete: () => {

        this.loadingClients = false;

      }
    });
  }


  openCreateVehicles(): void {
    this.dialog.open(CreateVehicleComponent, {
      width: '1290px',
      data: {
        title: 'Crear Vehículo',
        vehicle: null,
        edit: true
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        // this.getAllVehicles();
      }
    });
  }

  openEditVehicles(vehicle: any): void {
    this.dialog.open(CreateVehicleComponent, {
      width: '1290px',
      data: {
        title: 'Editar Vehículo',
        vehicle: vehicle,
        edit: true
      }

    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        // this.getAllVehicles();
      }
    });
  }

  openDelete(vehicle: any): void {
    const data: DeleteDataModal = {
      title: (vehicle.marca + ' ' + vehicle.modelo),
      categoryToDelete: 'Vehiculo',
      idToDelete: vehicle.id,
      endpoint: 'vehiculo'
    };

    this.dialog.open(DeleteContentModalComponent, {
      width: '500px',
      data: data
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.searchVehicles();
      }
    });
  }


}
