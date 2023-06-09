import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../services/api.service';
import {CreateVehicleComponent} from './create-vehicle/create-vehicle.component';
import {DeleteDataModal} from '../../../models/DeleteDataModal';
import {DeleteContentModalComponent} from '../shared/delete-content-modal/delete-content-modal.component';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['Marca', 'Modelo', 'Patente', 'Color', 'Año', 'Kilometraje','Acciones'];
  loadingTable = true;
  dataSource: MatTableDataSource<any> | undefined;

  constructor(private dialog: MatDialog, private api: ApiService) {
  }

  ngOnInit(): void {
    this.getAllVehicles();
  }

  updatePaginatorAndSort() {
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator!;
      this.getAndInitTranslations();
      this.dataSource!.sort = this.sort!;
    }, 50);
  }

  getAllVehicles(): void {
    this.loadingTable = true;
    // limpiar dataSource
    if (this.dataSource) {
      this.dataSource.data = [];
    }


    this.api.getAllVehicles().subscribe({
      next: data => {
        console.warn("data");
        console.warn(data);

        var enabledVehicles: any[] = [];

        data.forEach((vehicle: any) => {

          if (vehicle.habilitado) {
            enabledVehicles.push(vehicle);
          }
        });

        this.dataSource = new MatTableDataSource(enabledVehicles);
        if (this.dataSource.data.length > 0) {
          this.updatePaginatorAndSort();
        }

      }, error: error => {
        console.log(error);
      }, complete: () => {

        this.loadingTable = false;

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
        this.getAllVehicles();
      }
    });
  }

  openDetails(vehicle: any): void {
    console.log("vehicle: "+vehicle);

    this.dialog.open(CreateVehicleComponent, {
      width: '1290px',
      data: {
        title: 'Detalles vehiculos',
        vehicle: vehicle,
        edit: false
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllVehicles();
      }
    });
  }

  openEdit(vehicle: any): void {
    this.dialog.open(CreateVehicleComponent, {
      width: '1290px',
      data: {
        title: 'Editar vehiculo',
        client: vehicle,
        edit: true
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllVehicles();
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
        this.getAllVehicles();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  getAndInitTranslations() {


    this.paginator!._intl.itemsPerPageLabel = 'Items por página';
    this.paginator!._intl.nextPageLabel = 'Siguiente ';
    this.paginator!._intl.previousPageLabel = 'Anterior';
    this.paginator!._intl.previousPageLabel = 'Anterior';
    this.paginator!._intl.changes.next();
    this.paginator!._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 / ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} / ${length}`;
    };
  }

}
