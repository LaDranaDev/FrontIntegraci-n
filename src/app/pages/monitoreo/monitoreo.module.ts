import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { MonitoreoRoutingModule } from './monitoreo-routing.module';
import { CustomModule } from '../../layout/custom/custom.module';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MonitorOperacionesOnlineComponent } from './monitor-operaciones-online/monitor-operaciones-online.component';
import { MonitorOperacionesComponent } from './monitor-operaciones/monitor-operaciones.component';
import { ConsultaTrackingComponent } from './consulta-tracking/consulta-tracking.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MonitorSaldosComponent } from './monitor-saldos/monitor-saldos.component';
import { ComprobantesFormatoCdmxComponent } from './comprobantes-formato-cdmx/comprobantes-formato-cdmx.component';
import { HistorialOperacionFormatoCdmxComponent } from './comprobantes-formato-cdmx/historial-operacion-formato-cdmx.component.html/historial-operacion-formato-cdmx.component';
import { DetalleOperacionFormatoCdmxComponent } from './comprobantes-formato-cdmx/detalle-operacion-formato-cdmx.component.html/detalle-operacion-formato-cdmx.component';
import { MonitorArchivoCursoComponent } from './monitor-archivo-curso/monitor-archivo-curso.component';
import { ArchivoComponent } from './monitor-archivo-curso/archivo/archivo.component';
import { NivelOperacionComponent } from './monitor-archivo-curso/nivel-operacion/nivel-operacion.component';
import { NivelOperacionHistoricoComponent } from './monitor-archivo-curso/nivel-operacion-historico/nivel-operacion-historico.component';
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
import { ConsultaOperacionesFormatoCdmxComponent } from './comprobantes-formato-cdmx/consulta-operaciones-formato-cdmx/consulta-operaciones-formato-cdmx.component';
import { CurrencyInputModule } from 'src/app/directivas/currency-input.module';

@NgModule({
  declarations: [ConsultaOperacionesFormatoCdmxComponent, HistorialOperacionFormatoCdmxComponent, DetalleOperacionFormatoCdmxComponent, MonitorOperacionesOnlineComponent, MonitorOperacionesComponent, ConsultaTrackingComponent, MonitorSaldosComponent, ComprobantesFormatoCdmxComponent, MonitorArchivoCursoComponent, ArchivoComponent, NivelOperacionComponent, NivelOperacionHistoricoComponent, ConsultaTrakinArchivoComponent, ConsultaArchivoComponent, ConsultaOperacionComponent, ConsultaHistoricaComponent, DetallesOperacionesComponent, DetallesOperacionesAdmProvConfComponent, DetallesOperacionesAltaMasivaComponent, DetallesOperacionesDomisComponent, DetallesOperacionesOrdenPagoATMComponent, DetallesOperacionesOrdenPagoComponent, DetallesOperacionesPagImpAduaComponent, DetallesOperacionesPagoDirectComponent, DetallesOperacionesSPIDComponent, DetallesOperacionesTarjetasPropComponent, DetallesOperacionesTransferComponent, DetallesPIFComponent, HistorialComponent],
  imports: [
    CommonModule,
    MonitoreoRoutingModule,
    PaginationModule,
    CustomModule,
    MatExpansionModule,
    CurrencyInputModule
  ],
  providers: [CurrencyPipe, BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
                MatDatepickerModule, MatNativeDateModule]
})
export class MonitoreoModule { }
