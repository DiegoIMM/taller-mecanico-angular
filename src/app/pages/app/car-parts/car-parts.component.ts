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
import {CreateProviderComponent} from "../providers/create-provider/create-provider.component";

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
  selectedCarParts: any = null;

  codigo: string = '';
  nombre: string = '';
  carParts: any[] | null = null;


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['Codigo','Nombre', 'Modelo', 'Marca', 'anio', 'Valor', 'Acciones'];
  loadingTable = true;
  dataSource: MatTableDataSource<any> | undefined;

  constructor(private dialog: MatDialog, private api: ApiService) {

  }

  ngOnInit(): void {
    this.getAllCarParts();
  }

  updatePaginatorAndSort() {
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator!;
      this.getAndInitTranslations();
      this.dataSource!.sort = this.sort!;
    }, 50);

  }

  getAllCarParts(): void {
    this.loadingTable = true;
    // limpiar dataSource
    if (this.dataSource) {
      this.dataSource.data = [];
    }

    this.api.getAllCarParts().subscribe({
      next: data => {
        console.warn(data);
        var enabledCarParts: any[] = [];

        data.forEach((carParts: any) => {

          if (carParts.habilitado) {
            enabledCarParts.push(carParts);
          }
        });


        this.dataSource = new MatTableDataSource(enabledCarParts);
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  selectProvider() {
    this.codigo = '';
    console.log(this.selectedProvider);
  }
  selectCarParts() {
    this.codigo = '';
    console.log(this.selectedCarParts);
  }

  changeCodigo() {
    this.selectedCarParts = null;
    console.log(this.codigo);

    this.loadingCarParts = true;
    this.api.getCarPartByCode(this.codigo).subscribe(
       (data: any) => {
         this.loadingCarParts = false;
         console.log(data);

         var enabledCarParts: any[] = [];

         data.forEach((carParts: any) => {

           if (carParts.habilitado) {
             enabledCarParts.push(carParts);
           }
         });


         this.dataSource = new MatTableDataSource(enabledCarParts);
         if (this.dataSource.data.length > 0) {
           this.updatePaginatorAndSort();
         }




       },
       (error: any) => {
         this.loadingCarParts = false;
         console.log(error);
       }
     );
  }

  changeNombre(){
    this.selectedCarParts = null;
    console.log(this.nombre);

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
          this.carParts = null;
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

          let activecarParts = [data].filter((vehicle: any) => vehicle.habilitado);


          if (activecarParts.length > 0) {
            this.carParts = activecarParts;

          } else {
            this.carParts = null;

          }
          // this.carParts = [data];
          this.loadingCarParts = false;
          console.log(data);
        }, error: (error: any) => {
          this.carParts = null;

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


  openDetails(carParts: any): void {
    console.log("carParts: "+carParts);

    this.dialog.open(CreateCarPartsComponent, {
      width: '1290px',
      data: {
        title: 'Detalles Repuestos',
        carParts: carParts,
        edit: false
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllCarParts();
      }
    });
  }

  openEdit(carParts: any): void {
    this.dialog.open(CreateCarPartsComponent, {
      width: '1290px',
      data: {
        title: 'Editar Repuesto',
        carParts: carParts,
        edit: true
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllCarParts();
      }
    });
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
