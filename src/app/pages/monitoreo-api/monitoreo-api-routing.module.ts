import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaTrackingApiComponent } from './consulta-tracking-api/consulta-tracking-api.component';
import { MonitoreoOperacionesComponent } from './monitoreo-operaciones/monitoreo-operaciones.component';

const routes: Routes = [
  { path: 'consultaTrackingApi', component:ConsultaTrackingApiComponent},
  { path: 'monitorOperaciones', component:MonitoreoOperacionesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoreoApiRoutingModule { }