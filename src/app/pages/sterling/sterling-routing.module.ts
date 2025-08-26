import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficaHistorialBuzonComponent } from './grafica-historial-buzon/grafica-historial-buzon.component';
import { GraficaTamanoBuzonComponent } from './grafica-tamano-buzon/grafica-tamano-buzon.component';
import { HistorialAnualBuzonComponent } from './historial-anual-buzon/historial-anual-buzon.component';

const routes: Routes = [
  { path: 'tamanobuzon', component: GraficaTamanoBuzonComponent },
  { path: 'historialBuzon', component: GraficaHistorialBuzonComponent },
  {
    path: 'historialAnualBuzon',
    component: HistorialAnualBuzonComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SterlingRoutingModule {}
