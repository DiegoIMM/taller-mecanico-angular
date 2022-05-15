import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';
import esCL from '@angular/common/locales/es-CL';
import {A11yModule} from '@angular/cdk/a11y';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

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
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-CL'},
    {provide: MAT_DATE_LOCALE, useValue: 'es-CL'},
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class SharedModule {
}
