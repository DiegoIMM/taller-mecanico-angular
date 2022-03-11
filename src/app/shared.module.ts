import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';
import esCL from '@angular/common/locales/es-CL';
registerLocaleData(esCL, 'es-CL');


@NgModule({
  declarations: [],
  imports: [
    MaterialModule,
    ReactiveFormsModule

  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
