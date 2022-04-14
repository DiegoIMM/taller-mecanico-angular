import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../services/api.service';
import {CreateCarPartsComponent} from '../car-parts/create-car-parts/create-car-parts.component';
import {CreateProviderComponent} from './create-provider/create-provider.component';
import {DeleteContentModalComponent} from '../shared/delete-content-modal/delete-content-modal.component';
import {DeleteDataModal} from '../../../models/DeleteDataModal';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['Nombre', 'Dirección', 'Email', 'Teléfono', 'Acciones'];
  loadingTable = true;
  dataSource: MatTableDataSource<any> | undefined;


  constructor(private dialog: MatDialog, private api: ApiService) {

  }

  ngOnInit(): void {
    this.getAllProviders();
  }

  updatePaginatorAndSort() {
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator!;
      this.getAndInitTranslations();
      this.dataSource!.sort = this.sort!;
    }, 50);

  }

  getAllProviders(): void {
    this.loadingTable = true;
    // limpiar dataSource
    if (this.dataSource) {
      this.dataSource.data = [];
    }

    this.api.getAllProviders().subscribe({
      next: data => {
        console.warn(data);
        var enabledProviders: any[] = [];

        data.forEach((provider: any) => {

          if (provider.habilitado) {
            enabledProviders.push(provider);
          }
        });


        this.dataSource = new MatTableDataSource(enabledProviders);
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


  openCreateProvider(): void {
    this.dialog.open(CreateProviderComponent, {
      width: '1290px',
      data: {
        title: 'Crear proveedor',
        provider: null,
        edit: true
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllProviders();
      }
    });
  }


  openDetails(provider: any): void {
    this.dialog.open(CreateProviderComponent, {
      width: '1290px',
      data: {
        title: 'Detalles proveedor',
        provider: provider,
        edit: false
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllProviders();
      }
    });
  }

  openEdit(provider: any): void {
    this.dialog.open(CreateProviderComponent, {
      width: '1290px',
      data: {
        title: 'Editar proveedor',
        provider: provider,
        edit: true
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllProviders();
      }
    });
  }

  openDelete(provider: any): void {
    const data: DeleteDataModal = {
      title: provider.nombre,
      categoryToDelete: 'Proveedor',
      idToDelete: provider.id,
      endpoint: 'proveedor'
    };

    this.dialog.open(DeleteContentModalComponent, {
      width: '500px',
      data: data
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllProviders();
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
