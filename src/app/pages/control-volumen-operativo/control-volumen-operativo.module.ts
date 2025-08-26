import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from 'src/app/interceptor/loader-interceptor';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { CustomModule } from '../../layout/custom/custom.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ControlVolumenOperativoRoutingModule } from './control-volumen-operativo-routing.module';
import { GraficaArchivoClienteComponent } from './grafica-archivo-cliente/grafica-archivo-cliente.component';
import { GraficaEstatusClienteComponent } from './grafica-estatus-cliente/grafica-estatus-cliente.component';
import { GraficaEstatusClienteParametrizadaComponent } from './grafica-estatus-cliente-parametrizada/grafica-estatus-cliente-parametrizada.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { GraficaPorClientesComponent } from './grafica-por-clientes/grafica-por-clientes.component';
import { TotalOperacionesProductoComponent } from './total-operaciones-producto/total-operaciones-producto.component';
import { ConsolidadoHistoricoOperacionesComponent } from './consolidado-historico-operaciones/consolidado-historico-operaciones.component';
import { TotalOperacionesClienteComponent } from './total-operaciones-cliente/total-operaciones-cliente.component';
import { ConsolidadoHistoricoLayoutComponent } from './consolidado-historico-layout/consolidado-historico-layout.component';
import { ConsolidadoHistoricoClientesComponent } from './consolidado-historico-clientes/consolidado-historico-clientes.component';

@NgModule({
  declarations: [
    GraficaArchivoClienteComponent,
    GraficaEstatusClienteComponent,
    GraficaEstatusClienteParametrizadaComponent,
    GraficaPorClientesComponent,
    TotalOperacionesProductoComponent,
    ConsolidadoHistoricoOperacionesComponent,
    TotalOperacionesClienteComponent,
    ConsolidadoHistoricoLayoutComponent,
    ConsolidadoHistoricoClientesComponent,
  ],
  imports: [
    ControlVolumenOperativoRoutingModule,
    CustomModule,
    CommonModule,
    BsDatepickerModule,
    PaginationModule,
    NgbModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
    MatDatepickerModule, MatNativeDateModule]
})
export class ControlVolumenOperativoModule { }
