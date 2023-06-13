import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../services/api.service';
import {DeleteContentModalComponent} from '../shared/delete-content-modal/delete-content-modal.component';
import {DeleteDataModal} from '../../../models/DeleteDataModal';
import {MatIconModule} from '@angular/material/icon';


import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {AppComponent} from "../app.component";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-index',
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
  //standalone: true,

})
export class IndexComponent implements OnInit {

  constructor(private dialog: MatDialog, public auth: AuthService) {

  }

  ngOnInit(): void {
  }


}
