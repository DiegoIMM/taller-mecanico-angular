import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {SharedModule} from '../../shared.module';

import {NotFoundComponent} from './not-found/not-found.component';

import {ProfileComponent} from './profile/profile.component';
import { ClientsComponent } from './clients/clients.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { CarPartsComponent } from './car-parts/car-parts.component';
import { ProvidersComponent } from './providers/providers.component';
import { CreateClientComponent } from './clients/create-client/create-client.component';
import { EditClientComponent } from './clients/edit-client/edit-client.component';
import { DetailClientComponent } from './clients/detail-client/detail-client.component';
import { DeleteClientComponent } from './clients/delete-client/delete-client.component';
import { CreateCarPartsComponent } from './car-parts/create-car-parts/create-car-parts.component';
import { CreateProviderComponent } from './providers/create-provider/create-provider.component';


@NgModule({
  declarations: [
    AppComponent, NotFoundComponent, ProfileComponent, ClientsComponent, VehiclesComponent, WorkOrdersComponent, CarPartsComponent, ProvidersComponent, CreateClientComponent, EditClientComponent, DetailClientComponent, DeleteClientComponent, CreateCarPartsComponent, CreateProviderComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule
    // QuillModule.forRoot()
  ]
})
export class AppModule {}
