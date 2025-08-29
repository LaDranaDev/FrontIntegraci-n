import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MonitoreoApiRoutingModule } from './monitoreo-api-routing.module';
import { ConsultaTrackingApiComponent } from './consulta-tracking-api/consulta-tracking-api.component';
import { MonitoreoOperacionesComponent } from './monitoreo-operaciones/monitoreo-operaciones.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomModule } from '../../layout/custom/custom.module';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyInputModule } from 'src/app/directivas/currency-input.module';

@NgModule({
  declarations: [
    ConsultaTrackingApiComponent,
    MonitoreoOperacionesComponent,
  ],
  imports:[CommonModule,
      MonitoreoApiRoutingModule,
      PaginationModule,
          CustomModule,
          MatExpansionModule,
          CurrencyInputModule
    ],
      providers: [CurrencyPipe, BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
                    MatDatepickerModule, MatNativeDateModule]
    })
export class MonitoreoApiModule { }
