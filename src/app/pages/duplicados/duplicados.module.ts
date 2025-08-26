import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DuplicadosRoutingModule } from './duplicados-routing.module';
import { CustomModule } from '../../layout/custom/custom.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MonitorArchivosDuplicadosComponent } from './monitor-archivos-duplicados/monitor-archivos-duplicados.component';
import { MonitorOperacionesDuplicadasComponent } from './monitor-operaciones-duplicadas/monitor-operaciones-duplicadas.component';
import { DetallesOperacionesDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-duplicadas/detalles-operaciones-duplicadas.component';
import { DetallesOperacionesAdmProvConfDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-adm-prov-conf-duplicadas/detalles-operaciones-adm-prov-conf-duplicadas.component';
import { DetallesOperacionesAltaMasivaDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-alta-masiva-duplicadas/detalles-operaciones-alta-masiva-duplicadas.component';
import { DetallesOperacionesDomisDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-domis-duplicadas/detalles-operaciones-domis-duplicadas.component';
import { DetallesOperacionesOrdenDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-orden-duplicadas/detalles-operaciones-orden-duplicadas.component';
import { DetallesOperacionesOrdenPagoAtmDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-orden-pago-atm-duplicadas/detalles-operaciones-orden-pago-atm-duplicadas.component';
import { DetallesOperacionesPagImpAduaDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-pag-imp-adua-duplicadas/detalles-operaciones-pag-imp-adua-duplicadas.component';
import { DetallesOperacionesPagoDirectDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-pago-direct-duplicadas/detalles-operaciones-pago-direct-duplicadas.component';
import { DetallesOperacionesSPIDDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-spid-duplicadas/detalles-operaciones-spid-duplicadas.component';
import { DetallesOperacionesTarjetasPropDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-tarjetas-prop-duplicadas/detalles-operaciones-tarjetas-prop-duplicadas.component';
import { DetallesOperacionesTransferDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-operaciones-transfer-duplicadas/detalles-operaciones-transfer-duplicadas.component';
import { DetallesPIFDuplicadasComponent } from './monitor-operaciones-duplicadas/detalles-pif-duplicadas/detalles-pif-duplicadas.component';
import { ProcesarDatos } from './monitor-operaciones-duplicadas/procesar-datos';

@NgModule({
  declarations: [
    MonitorArchivosDuplicadosComponent,
    MonitorOperacionesDuplicadasComponent,
    DetallesOperacionesDuplicadasComponent,
    DetallesOperacionesAdmProvConfDuplicadasComponent,
    DetallesOperacionesAltaMasivaDuplicadasComponent,
    DetallesOperacionesDomisDuplicadasComponent,
    DetallesOperacionesOrdenDuplicadasComponent,
    DetallesOperacionesOrdenPagoAtmDuplicadasComponent,
    DetallesOperacionesPagImpAduaDuplicadasComponent,
    DetallesOperacionesPagoDirectDuplicadasComponent,
    DetallesOperacionesSPIDDuplicadasComponent,
    DetallesOperacionesTarjetasPropDuplicadasComponent,
    DetallesOperacionesTransferDuplicadasComponent,
    DetallesPIFDuplicadasComponent,
  ],
  imports: [
    CommonModule,
    DuplicadosRoutingModule,
    PaginationModule,
    CustomModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
    MatDatepickerModule, MatNativeDateModule, ProcesarDatos]
})
export class DuplicadosModule { }
