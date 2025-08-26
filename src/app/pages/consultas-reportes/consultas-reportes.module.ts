import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultasReportesRoutingModule } from './consultas-reportes-routing.module';
import { CustomModule } from '../../layout/custom/custom.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CuentaBeneficiariaComponent } from './cuenta-beneficiaria/cuenta-beneficiaria.component';
import { ReportesComponent } from './reportes/reportes.component';
import { BitacoraEnvioEstadoCuentaComponent } from './bitacora-envio-estado-cuenta/bitacora-envio-estado-cuenta.component';
import { ConsultaPistasAuditoriaComponent } from './consulta-pistas-auditoria/consulta-pistas-auditoria.component';


@NgModule({
  declarations: [
    CuentaBeneficiariaComponent,
    ReportesComponent,
    BitacoraEnvioEstadoCuentaComponent,
    ConsultaPistasAuditoriaComponent,
  ],
  imports: [
    CommonModule,
    ConsultasReportesRoutingModule,
    PaginationModule,
    CustomModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
    MatDatepickerModule, MatNativeDateModule]
})
export class ConsultasReportesModule { }
