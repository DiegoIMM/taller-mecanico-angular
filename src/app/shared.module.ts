import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';
import esCL from '@angular/common/locales/es-CL';
import {A11yModule} from '@angular/cdk/a11y';

registerLocaleData(esCL, 'es-CL');


@NgModule({
  declarations: [],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    A11yModule

  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    A11yModule
  ]
})
export class SharedModule {
}
