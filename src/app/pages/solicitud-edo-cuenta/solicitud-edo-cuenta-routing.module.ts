import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PorDemandaComponent } from './por-demanda/por-demanda.component';

const routes: Routes = [
  { path: 'porDemanda', component:PorDemandaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudEdoCuentaRoutingModule { }
