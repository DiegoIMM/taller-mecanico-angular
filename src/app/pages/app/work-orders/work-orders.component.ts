import {Component, OnInit, ViewChild} from '@angular/core';
import {CreateWorkOrderComponent} from './create-work-order/create-work-order.component';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../services/api.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class WorkOrdersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['numeroOrden', 'marca', 'modelo' ,'patenteVehiculo', 'rutCliente', 'valorOt', 'fechaIngreso', 'estado'];
  expandedElement: any | null;

  loadingTable = true;
  dataSource: MatTableDataSource<any> | undefined;

  constructor(private dialog: MatDialog, private api: ApiService) {
  }

  ngOnInit(): void {
    this.getAllWorkOrders();
  }

  updatePaginatorAndSort() {
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator!;
      this.getAndInitTranslations();
      this.dataSource!.sort = this.sort!;
    }, 50);

  }

  getAllWorkOrders(): void {
    this.loadingTable = true;
    this.api.getAllWorkOrders().subscribe({
      next: data => {
        console.log("getAllWorkOrders");
        console.warn(data.length);
        console.warn(data);
        //for(let i =0; i < (data.length)-1; i++){
        //  console.warn("data[i]"+i);
        //  console.warn(data[i]);
        //}
        //console.warn(data[0].vehiculo);
        //console.warn(data[0].vehiculo.marca);
        //console.warn(data[0].vehiculo.modelo);
        //console.warn(data.vehiculo);
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

  openCreateWorkOrder(): void {
    this.dialog.open(CreateWorkOrderComponent, {
      width: '1290px',
      data: {
        title: 'Crear Orden de trabajo',
        work_order: null,
        edit: true
      }
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllWorkOrders();
      }
    });
  }

  openEditWorkOrder(work_order: any): void {
    this.dialog.open(CreateWorkOrderComponent, {
      width: '1290px',
      data: {
        title: 'Editar Orden de trabajo',
        work_order: work_order,
        edit: true
      }

    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
        this.getAllWorkOrders();
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
