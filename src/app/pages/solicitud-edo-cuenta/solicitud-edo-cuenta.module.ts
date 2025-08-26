import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SolicitudEdoCuentaRoutingModule } from './solicitud-edo-cuenta-routing.module';
import { CustomModule } from '../../layout/custom/custom.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PorDemandaComponent } from './por-demanda/por-demanda.component';


@NgModule({
  declarations: [
    PorDemandaComponent
  ],
  imports: [
    SolicitudEdoCuentaRoutingModule,CustomModule,CommonModule,PaginationModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
                MatDatepickerModule, MatNativeDateModule]
  
})
export class SolicitudEdoCuentaModule { }
