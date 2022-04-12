import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeleteDataModal} from '../../../../models/DeleteDataModal';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-delete-content-modal',
  templateUrl: './delete-content-modal.component.html',
  styleUrls: ['./delete-content-modal.component.scss']
})
export class DeleteContentModalComponent implements OnInit {

  loadingButton = false;
  categoryToDelete: string;


  constructor(private api: ApiService, public dialogRef: MatDialogRef<DeleteContentModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DeleteDataModal) {
    console.log(data);
    this.categoryToDelete = data.categoryToDelete;
  }

  ngOnInit(): void {
  }

  delete() {
    this.loadingButton = true;

    this.api.deleteElement(this.data.endpoint, {id: this.data.idToDelete}).subscribe({
        next: () => {
          this.loadingButton = false;
          this.dialogRef.close(true);
        }, error: () => {
          this.loadingButton = false;
          this.dialogRef.close(false);
        }
      }
    );

  }

}
