import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {NotFoundComponent} from '../not-found/not-found.component';
import {ProfileComponent} from './profile/profile.component';
import {IndexComponent} from './index/index.component';
import {ClientsComponent} from './clients/clients.component';
import {VehiclesComponent} from './vehicles/vehicles.component';
import {WorkOrdersComponent} from './work-orders/work-orders.component';
import {CarPartsComponent} from './car-parts/car-parts.component';
import {ProvidersComponent} from './providers/providers.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children:
      [
        {path: 'inicio', component: IndexComponent},
        {path: 'clientes', component: ClientsComponent},
        {path: 'vehiculos', component: VehiclesComponent},
        {path: 'ordenes-de-trabajo', component: WorkOrdersComponent},
        {path: 'repuestos', component: CarPartsComponent},
        {path: 'proveedores', component: ProvidersComponent},
        {path: 'clientes/:username', component: ProfileComponent},
        {path: '**', redirectTo: 'preguntas'}
      ]
  },
  {path: '**', redirectTo: '404'},
  {path: '404', component: NotFoundComponent}

// TODO: Implementar los componentes faltantes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
