import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
// import {CreateQuestionComponent} from './create-question/create-question.component';
import {ApiService} from '../../services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  question: string | undefined;

  constructor(private router: Router, public auth: AuthService, private dialog: MatDialog, private api: ApiService, private snackbar: MatSnackBar) {

  }

  search(): void {
    if (this.question !== undefined || this.question !== '') {
      console.log('Navegar');
      this.router.navigate(['/app/resultados/' + this.question]).then((res) => {
        console.log(res);
        this.question = '';
      });
    } else {
      alert('Error');
    }
  }

  openModalCreateQuestion(): void {

    // this.dialog.open(CreateQuestionComponent, {width: '1290px'}).afterClosed().subscribe(question_id => {
    //
    //
    //   if (question_id) {
    //     console.log('The dialog was closed' + question_id);
    //
    //     this.snackbar.open('Pregunta creada', 'Ver', {
    //       duration: 5000
    //     }).onAction().subscribe(() => {
    //       this.router.navigateByUrl('/app/pregunta/' + question_id);
    //     });
    //
    //   }
    //
    //
    // });


  }


  ngOnInit(): void {
  }

}
