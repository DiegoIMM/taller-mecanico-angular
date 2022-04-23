import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CreateCarPartsComponent} from './create-car-parts/create-car-parts.component';

@Component({
  selector: 'app-car-parts',
  templateUrl: './car-parts.component.html',
  styleUrls: ['./car-parts.component.scss']
})
export class CarPartsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['Código', 'Nombre', 'Modelo', 'Año', 'Proveedor', 'Valor'];
  loadingTable = true;
  dataSource: MatTableDataSource<any> | undefined;


  constructor(private dialog: MatDialog, private api: ApiService) {

  }

  ngOnInit(): void {
  }

  updatePaginatorAndSort() {
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator!;
      this.getAndInitTranslations();
      this.dataSource!.sort = this.sort!;
    }, 50);

  }


  openCreateCarParts(): void {
    this.dialog.open(CreateCarPartsComponent, {
      width: '1290px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        // this.getAllCarParts();
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
