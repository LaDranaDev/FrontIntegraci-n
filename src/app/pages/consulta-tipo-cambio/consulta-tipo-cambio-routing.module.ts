import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoCambioComponent } from './tipo-cambio/tipo-cambio.component';

const routes: Routes = [
  { path: 'tipoCambio', component: TipoCambioComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaTipoCambioRoutingModule { }
