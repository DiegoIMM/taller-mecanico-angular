import {Component, OnInit} from '@angular/core';
import {CreateWorkOrderComponent} from './create-work-order/create-work-order.component';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.scss']
})
export class WorkOrdersComponent implements OnInit {
  loadingTable = true;

  constructor(private dialog: MatDialog, private api: ApiService) {
  }

  ngOnInit(): void {
  }


  openCreateWorkOrder(): void {
    this.dialog.open(CreateWorkOrderComponent, {
      width: '1290px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
      if (result != null) {
      }
    });
  }

}
