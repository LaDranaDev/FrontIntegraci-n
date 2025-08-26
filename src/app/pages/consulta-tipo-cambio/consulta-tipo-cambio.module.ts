import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModule } from '../../layout/custom/custom.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConsultaTipoCambioRoutingModule } from './consulta-tipo-cambio-routing.module';
import { TipoCambioComponent } from './tipo-cambio/tipo-cambio.component';


@NgModule({
  declarations: [
    TipoCambioComponent
  ],
  imports: [
    CommonModule,
    ConsultaTipoCambioRoutingModule,
    PaginationModule,
    CustomModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
    MatDatepickerModule, MatNativeDateModule]
})
export class ConsultaTipoCambioModule { }
