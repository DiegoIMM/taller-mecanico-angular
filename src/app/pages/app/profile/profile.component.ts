import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {User} from '../../../models/User';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading = true;
  profile: User | undefined;

  constructor(private activeRoute: ActivatedRoute, private api: ApiService, private router: Router, private snackBar: MatSnackBar) {
    console.log('Get Router Params:', this.activeRoute.snapshot.params['username']);

  }

  ngOnInit(): void {
    this.getProfile();
  }


  getProfile(): void {
    this.loading = true;
    this.api.getProfile(this.activeRoute.snapshot.params['username']).subscribe(
      (data: User) => {
        this.profile = data;
        this.loading = false;
      },
      error => {


      }
    );

  }

}
