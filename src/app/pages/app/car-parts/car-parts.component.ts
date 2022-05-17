import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CreateCarPartsComponent} from './create-car-parts/create-car-parts.component';
import {CreateVehicleComponent} from '../vehicles/create-vehicle/create-vehicle.component';
import {DeleteDataModal} from '../../../models/DeleteDataModal';
import {DeleteContentModalComponent} from '../shared/delete-content-modal/delete-content-modal.component';

@Component({
  selector: 'app-car-parts',
  templateUrl: './car-parts.component.html',
  styleUrls: ['./car-parts.component.scss']
})
export class CarPartsComponent implements OnInit {

  loadingCarParts = false;
  loadingProviders = false;
  allProviders: any[] = [];
  selectedProvider: any = null;
  codigo: string = '';

  carParts: any[] = [];


  constructor(private dialog: MatDialog, private api: ApiService) {

  }

  ngOnInit(): void {
    this.getAllProviders();
  }

  selectProvider() {
    this.codigo = '';
    console.log(this.selectedProvider);


  }

  changeCodigo() {
    this.selectedProvider = null;
    console.log(this.codigo);

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

  searchCarParts() {
    if (this.codigo == '' && this.selectedProvider == null) {
      alert('Debe ingresar una patente o un cliente');
      return;

    }

    this.loadingCarParts = true;
    if (this.selectedProvider != null) {
      this.api.getCarPartsByProvider(this.selectedProvider).subscribe({
        next: (data: any) => {
          console.log('Repuestos por proveedor -> ', data);
          let activeCarParts = data.filter((provider: any) => provider.habilitado);

          this.carParts = activeCarParts;
          this.loadingCarParts = false;
          console.log(data);
        }, error: (error: any) => {
          this.loadingCarParts = false;
          console.error(error);
        }, complete: () => {
          this.loadingCarParts = false;

        }
      });
      return;
    }

    if (this.codigo != '') {
      this.loadingCarParts = false;
      this.api.getCarPartByCode(this.codigo).subscribe({
        next: (data: any) => {
          this.carParts = [data];
          this.loadingCarParts = false;
          console.log(data);
        }, error: (error: any) => {
          this.loadingCarParts = false;
          console.error(error);
        }
      });
      return;
    }
    this.loadingCarParts = false;

    alert('Debe ingresar una código o un proveedor NO DEBERIA LLEGAR ACA');


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
        console.log('Error', error);
      }, complete: () => {

        this.loadingProviders = false;

      }
    });
  }


  openCreateCarParts(): void {
    this.dialog.open(CreateCarPartsComponent, {
      width: '1290px',
      data: {
        title: 'Crear Repuesto',
        carPart: null,
        edit: true
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        // this.getAllCarParts();
      }
    });
  }


  openEditCarParts(carPart: any): void {
    this.dialog.open(CreateCarPartsComponent, {
      width: '1290px',
      data: {
        title: 'Editar Repuesto',
        carPart: carPart,
        edit: true
      }

    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.searchCarParts();
      }
    });
  }

  openDelete(carPart: any): void {
    const data: DeleteDataModal = {
      title: (carPart.marca + ' ' + carPart.modelo),
      categoryToDelete: 'Repuesto',
      idToDelete: carPart.id,
      endpoint: 'repuesto'
    };

    this.dialog.open(DeleteContentModalComponent, {
      width: '500px',
      data: data
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.searchCarParts();
      }
    });
  }


}
