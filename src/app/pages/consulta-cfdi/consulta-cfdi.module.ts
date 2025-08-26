import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModule } from '../../layout/custom/custom.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConsultaCfdiRoutingModule } from './consulta-cfdi-routing.module';
import { ConsultaCfdiComponent } from './consulta-cfdi/consulta-cfdi.component';


@NgModule({
  declarations: [
    ConsultaCfdiComponent
  ],
  imports: [
    CommonModule,
    CustomModule,
    ConsultaCfdiRoutingModule,
    PaginationModule,
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
    MatDatepickerModule, MatNativeDateModule]
})
export class ConsultaCfdiModule { }
