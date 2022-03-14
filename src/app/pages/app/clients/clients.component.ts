import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CreateClientComponent} from './create-client/create-client.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }


  openCreateClient(): void {
    this.dialog.open(CreateClientComponent, {
      width: '500px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
    });
  }
}
