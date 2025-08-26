import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModule } from '../../layout/custom/custom.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConsultaDocumentosCfdiRoutingModule } from './consulta-documentos-cfdi-routing.module';
import { ConsultaDocumentosCfdiComponent } from './consulta-documentos-cfdi/consulta-documentos-cfdi.component';
import { ConsultaContratosCfdiDetalleComponent } from './consulta-documentos-cfdi/consulta-contratos-cfdi-detalle/consulta-contratos-cfdi-detalle.component';


@NgModule({
  declarations: [
    ConsultaDocumentosCfdiComponent,
    ConsultaContratosCfdiDetalleComponent
  ],
  imports: [
    CommonModule,
    ConsultaDocumentosCfdiRoutingModule,
    PaginationModule,
    CustomModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
    MatDatepickerModule, MatNativeDateModule]
})
export class ConsultaDocumentosCfdiModule { }
