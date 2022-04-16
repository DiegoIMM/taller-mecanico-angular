import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../services/api.service';
import {CreateCarPartsComponent} from '../car-parts/create-car-parts/create-car-parts.component';
import {CreateVehicleComponent} from './create-vehicle/create-vehicle.component';

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
      alert('Buscar por cliente: ' + this.selectedClient);
      this.loadingVehicles = false;

      return;
    }

    if (this.patente != '') {
      alert('Buscar por patente: ' + this.patente);
      this.loadingVehicles = false;

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
        title: 'Crear Vehiculo',
        data: null
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        // this.getAllVehicles();
      }
    });
  }

  openEditVehicles(): void {
    this.dialog.open(CreateVehicleComponent, {
      width: '1290px',
      data: {
        title: 'Editar Vehiculo',
        data: {}
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        // this.getAllVehicles();
      }
    });
  }


}
