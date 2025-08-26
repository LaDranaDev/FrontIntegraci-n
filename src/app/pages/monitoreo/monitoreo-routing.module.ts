import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaTrackingComponent } from './consulta-tracking/consulta-tracking.component';
import { MonitorOperacionesOnlineComponent } from './monitor-operaciones-online/monitor-operaciones-online.component';
import { MonitorOperacionesComponent } from './monitor-operaciones/monitor-operaciones.component';
import { MonitorSaldosComponent } from './monitor-saldos/monitor-saldos.component';
import { ComprobantesFormatoCdmxComponent } from './comprobantes-formato-cdmx/comprobantes-formato-cdmx.component';
import { ConsultaOperacionesFormatoCdmxComponent } from './comprobantes-formato-cdmx/consulta-operaciones-formato-cdmx/consulta-operaciones-formato-cdmx.component';
import { HistorialOperacionFormatoCdmxComponent } from './comprobantes-formato-cdmx/historial-operacion-formato-cdmx.component.html/historial-operacion-formato-cdmx.component';
import { DetalleOperacionFormatoCdmxComponent } from './comprobantes-formato-cdmx/detalle-operacion-formato-cdmx.component.html/detalle-operacion-formato-cdmx.component';
import { MonitorArchivoCursoComponent } from './monitor-archivo-curso/monitor-archivo-curso.component';
import { ArchivoComponent } from './monitor-archivo-curso/archivo/archivo.component';
import { ConsultaTrakinArchivoComponent } from './consulta-tracking/consulta-trakin-archivo/consulta-trakin-archivo.component';
import { ConsultaArchivoComponent } from './consulta-tracking/consulta-archivo/consulta-archivo.component';
import { ConsultaOperacionComponent } from './consulta-tracking/consulta-operacion/consulta-operacion.component';
import { ConsultaHistoricaComponent } from './consulta-tracking/consulta-historica/consulta-historica.component';
import { DetallesOperacionesComponent } from './monitor-operaciones/detalles-operaciones/detalles-operaciones.component';
import { DetallesOperacionesAdmProvConfComponent } from './monitor-operaciones/detalles-operaciones-adm-prov-conf/detalles-operaciones-adm-prov-conf.component';
import { DetallesOperacionesAltaMasivaComponent } from './monitor-operaciones/detalles-operaciones-alta-masiva/detalles-operaciones-alta-masiva.component';
import { DetallesOperacionesDomisComponent } from './monitor-operaciones/detalles-operaciones-domis/detalles-operaciones-domis.component';
import { DetallesOperacionesOrdenPagoATMComponent } from './monitor-operaciones/detalles-operaciones-orden-pago-atm/detalles-operaciones-orden-pago-atm.component';
import { DetallesOperacionesOrdenPagoComponent } from './monitor-operaciones/detalles-operaciones-orden-pago/detalles-operaciones-orden-pago.component';
import { DetallesOperacionesPagImpAduaComponent } from './monitor-operaciones/detalles-operaciones-pag-imp-adua/detalles-operaciones-pag-imp-adua.component';
import { DetallesOperacionesPagoDirectComponent } from './monitor-operaciones/detalles-operaciones-pago-direct/detalles-operaciones-pago-direct.component';
import { DetallesOperacionesSPIDComponent } from './monitor-operaciones/detalles-operaciones-spid/detalles-operaciones-spid.component';
import { DetallesOperacionesTarjetasPropComponent } from './monitor-operaciones/detalles-operaciones-tarjetas-prop/detalles-operaciones-tarjetas-prop.component';
import { DetallesOperacionesTransferComponent } from './monitor-operaciones/detalles-operaciones-transfer/detalles-operaciones-transfer.component';
import { DetallesPIFComponent } from './monitor-operaciones/detalles-pif/detalles-pif.component';
import { HistorialComponent } from './monitor-operaciones/historial/historial.component';
import { NivelOperacionComponent } from './monitor-archivo-curso/nivel-operacion/nivel-operacion.component';
import { NivelOperacionHistoricoComponent } from './monitor-archivo-curso/nivel-operacion-historico/nivel-operacion-historico.component';

const routes: Routes = [
  {path: 'monitorOperacionesOnline', component: MonitorOperacionesOnlineComponent},
  {path: 'monitorOperaciones', component: MonitorOperacionesComponent},
  {path: 'consultaTracking', component: ConsultaTrackingComponent},
  {path: 'consultaTracking/consultaTrackingArchivo', component: ConsultaTrakinArchivoComponent},
  {path: 'consultaTracking/consultaArchivo', component: ConsultaArchivoComponent},
  {path: 'consultaTracking/consultaOperacion', component: ConsultaOperacionComponent},
  {path: 'consultaTracking/consultaOperacionHistorica', component: ConsultaHistoricaComponent},
  {path: 'monitorSaldos', component: MonitorSaldosComponent},
  
  {path: 'comprobantesFormatoCDMX', component: ComprobantesFormatoCdmxComponent},
  {path: 'consultaOperacionFormatoCDMX', component: ConsultaOperacionesFormatoCdmxComponent},
  {path: 'historialOperacionFormatoCDMX', component: HistorialOperacionFormatoCdmxComponent},
  {path: 'detalleOperacionFormatoCDMX', component: DetalleOperacionFormatoCdmxComponent},

  {path: 'monitorArchivosEnCurso', component: MonitorArchivoCursoComponent},
  {path: 'monitorArchivosEnCurso/nivelProducto/:register', component: ArchivoComponent},
  {path: 'monitorArchivosEnCurso/nivelProducto/nivelOperacion/:register', component: NivelOperacionComponent},
  {path: 'monitorArchivosEnCurso/nivelProducto/nivelOperacion/nivelOperacionHistorico/:register', component: NivelOperacionHistoricoComponent},
  {path: 'detallesOperaciones', component: DetallesOperacionesComponent},
  {path: 'detallesOperacionesAdmProvConf', component: DetallesOperacionesAdmProvConfComponent},
  {path: 'detallesOperacionesAltaMasiva', component: DetallesOperacionesAltaMasivaComponent},
  {path: 'detallesOperacionesDomis', component: DetallesOperacionesDomisComponent},
  {path: 'detallesOperacionesOrdenPago', component: DetallesOperacionesOrdenPagoComponent},
  {path: 'detallesOperacionesOrdenPagoATM', component: DetallesOperacionesOrdenPagoATMComponent},
  {path: 'detallesOperacionesPagImpAdua', component: DetallesOperacionesPagImpAduaComponent},
  {path: 'detallesOperacionesPagoDirect', component: DetallesOperacionesPagoDirectComponent},
  {path: 'detallesOperacionesSPID', component: DetallesOperacionesSPIDComponent},
  {path: 'detallesOperacionesTarjetasProp', component: DetallesOperacionesTarjetasPropComponent},
  {path: 'detallesOperacionesTransfer', component: DetallesOperacionesTransferComponent},
  {path: 'detallesPIF', component: DetallesPIFComponent},
  {path: 'historial', component: HistorialComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoreoRoutingModule { }
