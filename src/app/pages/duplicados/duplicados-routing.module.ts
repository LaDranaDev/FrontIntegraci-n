import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitorArchivosDuplicadosComponent } from './monitor-archivos-duplicados/monitor-archivos-duplicados.component';
import { DetallesOperacionesDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-duplicadas/detalles-operaciones-duplicadas.component';
import { MonitorOperacionesDuplicadasComponent } from './monitor-operaciones-duplicadas/monitor-operaciones-duplicadas.component';
import { DetallesOperacionesAdmProvConfDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-adm-prov-conf-duplicadas/detalles-operaciones-adm-prov-conf-duplicadas.component';
import { DetallesOperacionesAltaMasivaDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-alta-masiva-duplicadas/detalles-operaciones-alta-masiva-duplicadas.component';
import { DetallesOperacionesDomisDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-domis-duplicadas/detalles-operaciones-domis-duplicadas.component';
import { DetallesOperacionesOrdenDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-orden-duplicadas/detalles-operaciones-orden-duplicadas.component';
import { DetallesOperacionesOrdenPagoAtmDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-orden-pago-atm-duplicadas/detalles-operaciones-orden-pago-atm-duplicadas.component';
import { DetallesOperacionesPagImpAduaDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-pag-imp-adua-duplicadas/detalles-operaciones-pag-imp-adua-duplicadas.component';
import { DetallesOperacionesPagoDirectDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-pago-direct-duplicadas/detalles-operaciones-pago-direct-duplicadas.component';
import { DetallesOperacionesSPIDDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-spid-duplicadas/detalles-operaciones-spid-duplicadas.component';
import { DetallesOperacionesTarjetasPropDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-tarjetas-prop-duplicadas/detalles-operaciones-tarjetas-prop-duplicadas.component';
import { DetallesPIFDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-pif-duplicadas/detalles-pif-duplicadas.component';
import { DetallesOperacionesTransferDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-transfer-duplicadas/detalles-operaciones-transfer-duplicadas.component';

const routes: Routes = [
  { path: 'monitorArchivosDuplicados', component: MonitorArchivosDuplicadosComponent},
  { path: 'monitorOperacionesDuplicadas', component: MonitorOperacionesDuplicadasComponent},
  { path: 'detallesOperacionesDuplicadas', component: DetallesOperacionesDuplicadasComponent},
  { path: 'detallesOperacionesAdmProvConfDuplicadas', component: DetallesOperacionesAdmProvConfDuplicadasComponent},
  { path: 'detallesOperacionesAdmProvConfDuplicadas', component: DetallesOperacionesAdmProvConfDuplicadasComponent},
  { path: 'detallesOperacionesAltaMasivaDuplicadas', component: DetallesOperacionesAltaMasivaDuplicadasComponent},
  { path: 'detallesOperacionesDomisDuplicadas', component: DetallesOperacionesDomisDuplicadasComponent},
  { path: 'detallesOperacionesOrdenPagoDuplicadas', component: DetallesOperacionesOrdenDuplicadasComponent},
  { path: 'detallesOperacionesOrdenPagoATMDuplicados', component: DetallesOperacionesOrdenPagoAtmDuplicadasComponent},
  { path: 'detallesOperacionesPagImpAduaDuplicadas', component: DetallesOperacionesPagImpAduaDuplicadasComponent},
  { path: 'detallesOperacionesPagoDirectDuplicadas', component: DetallesOperacionesPagoDirectDuplicadasComponent},
  { path: 'detallesOperacionesSPIDDuplicadas', component: DetallesOperacionesSPIDDuplicadasComponent},
  { path: 'detallesOperacionesTarjetasPropDuplicadas', component: DetallesOperacionesTarjetasPropDuplicadasComponent},
  { path: 'detallesOperacionesTransferDuplicadas', component: DetallesOperacionesTransferDuplicadasComponent},
  { path: 'detallesPIFDuplicadas', component: DetallesPIFDuplicadasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuplicadosRoutingModule { }
