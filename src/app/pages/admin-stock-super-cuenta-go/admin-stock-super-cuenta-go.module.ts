import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModule } from '../../layout/custom/custom.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminStockSuperCuentaGoRoutingModule } from './admin-stock-super-cuenta-go-routing.module';
import { AdminStockSuperCuentaGoComponent } from './admin-stock-super-cuenta-go/admin-stock-super-cuenta-go.component';
import { ConsultaTarjetasComponent } from './consulta-tarjetas/consulta-tarjetas.component';


@NgModule({
  declarations: [
    AdminStockSuperCuentaGoComponent,
    ConsultaTarjetasComponent,
  ],
  imports: [
    CommonModule,
    AdminStockSuperCuentaGoRoutingModule,
    PaginationModule,
    CustomModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
    MatDatepickerModule, MatNativeDateModule]
})
export class AdminStockSuperCuentaGoModule { }
