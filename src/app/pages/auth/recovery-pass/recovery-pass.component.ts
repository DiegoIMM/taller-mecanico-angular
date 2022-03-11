import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.scss']
})
export class RecoveryPassComponent implements OnInit {
  recoveryPassForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.recoveryPassForm = fb.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnInit(): void {
  }


  sendRequest(): void {

  }

}
