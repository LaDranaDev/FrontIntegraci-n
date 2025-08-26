import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficaArchivoClienteComponent } from './grafica-archivo-cliente/grafica-archivo-cliente.component';
import { GraficaEstatusClienteComponent } from './grafica-estatus-cliente/grafica-estatus-cliente.component';
import { GraficaEstatusClienteParametrizadaComponent } from './grafica-estatus-cliente-parametrizada/grafica-estatus-cliente-parametrizada.component';
import { GraficaPorClientesComponent } from './grafica-por-clientes/grafica-por-clientes.component';
import { TotalOperacionesProductoComponent } from './total-operaciones-producto/total-operaciones-producto.component';
import { ConsolidadoHistoricoOperacionesComponent } from './consolidado-historico-operaciones/consolidado-historico-operaciones.component';
import { TotalOperacionesClienteComponent } from './total-operaciones-cliente/total-operaciones-cliente.component';
import { ConsolidadoHistoricoLayoutComponent } from './consolidado-historico-layout/consolidado-historico-layout.component';
import { ConsolidadoHistoricoClientesComponent } from './consolidado-historico-clientes/consolidado-historico-clientes.component';


const routes: Routes = [
  { path: 'graficaPorCliente', component:GraficaPorClientesComponent},
  { path: 'graficaArchivosCliente', component:GraficaArchivoClienteComponent },
  { path: 'graficaEstatusCliente', component:GraficaEstatusClienteComponent},
  { path: 'graficaEstatusClienteParamtetrizada', component:GraficaEstatusClienteParametrizadaComponent},
  { path: 'totalOperacionesProducto', component: TotalOperacionesProductoComponent},
  { path: 'consolidadosHistoricosOperaciones', component: ConsolidadoHistoricoOperacionesComponent},
  { path: 'totalOperacionesCliente', component: TotalOperacionesClienteComponent },
  { path: 'consolidadosHistoricosLayout', component: ConsolidadoHistoricoLayoutComponent },
  { path: 'consolidadosHistoricosCliente', component: ConsolidadoHistoricoClientesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlVolumenOperativoRoutingModule { }
