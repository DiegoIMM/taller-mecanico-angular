import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CreateClientComponent} from './create-client/create-client.component';
import {ApiService} from '../../../services/api.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['Nombre', 'Comuna', 'Dirección', 'Teléfono'];
  loadingTable = true;
  dataSource: MatTableDataSource<any> | undefined;


  constructor(private dialog: MatDialog, private api: ApiService) {

  }

  ngOnInit(): void {
    this.getAllClients();
  }

  updatePaginatorAndSort() {
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator!;
      this.getAndInitTranslations();
      this.dataSource!.sort = this.sort!;
    }, 50);

  }

  getAllClients(): void {
    this.loadingTable = true;
    this.api.getAllClients().subscribe({
      next: data => {
        console.warn(data);
        //console.warn(data.clienteDtoList);
        this.dataSource = new MatTableDataSource(data);
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


  openCreateClient(): void {
    this.dialog.open(CreateClientComponent, {
      width: '1290px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllClients();
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
