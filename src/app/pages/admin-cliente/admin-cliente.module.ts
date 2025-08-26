import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminClienteRoutingModule } from './admin-cliente-routing.module';
import { DescargaApiComponent } from './descarga-api/descarga-api.component';

import { CustomModule } from '../../layout/custom/custom.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdministracionCertificadosComponent } from './administracion-certificados/administracion-certificados.component';
import { DescargaLlavePublicaCanalComponent } from './descarga-llave-publica-canal/descarga-llave-publica-canal.component';
import { AdminBuzonComponent } from './admin-buzon/admin-buzon/admin-buzon.component';


@NgModule({
  declarations: [
    DescargaApiComponent,
    DescargaLlavePublicaCanalComponent,
    AdministracionCertificadosComponent,
    AdminBuzonComponent
  ],
  imports: [
    CommonModule,
    AdminClienteRoutingModule,
    CustomModule,
    PaginationModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
    MatDatepickerModule, MatNativeDateModule]

})
export class AdminClienteModule { }
