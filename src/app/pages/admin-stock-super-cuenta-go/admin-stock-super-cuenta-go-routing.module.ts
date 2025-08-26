import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminStockSuperCuentaGoComponent } from './admin-stock-super-cuenta-go/admin-stock-super-cuenta-go.component';
import { ConsultaTarjetasComponent } from './consulta-tarjetas/consulta-tarjetas.component';

const routes: Routes = [
  { path: 'adminStockSuperCuentaGo', component: AdminStockSuperCuentaGoComponent},
  { path: 'consultaTarjetas', component: ConsultaTarjetasComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminStockSuperCuentaGoRoutingModule { }
