import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { PaginaInicioComponent } from './pagina-inicio/pagina-inicio.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomModule } from '../../layout/custom/custom.module';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [
    PaginaInicioComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,CustomModule,CommonModule,PaginationModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
                MatDatepickerModule, MatNativeDateModule]
})
export class InicioModule { }
