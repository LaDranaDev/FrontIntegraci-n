import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SterlingRoutingModule } from './sterling-routing.module';

import { CustomModule } from '../../layout/custom/custom.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { LoaderInterceptor } from 'src/app/interceptor/loader-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import { GraficaTamanoBuzonComponent } from './grafica-tamano-buzon/grafica-tamano-buzon.component';
import { GraficaHistorialBuzonComponent } from './grafica-historial-buzon/grafica-historial-buzon.component';
import { HistorialAnualBuzonComponent } from './historial-anual-buzon/historial-anual-buzon.component';


@NgModule({
  declarations: [
    GraficaTamanoBuzonComponent,
    GraficaHistorialBuzonComponent,
    HistorialAnualBuzonComponent,
  ],
  imports: [
    SterlingRoutingModule,
    CommonModule,
    CommonModule,
    CustomModule,
    CommonModule,
    BsDatepickerModule,
    PaginationModule,
    MatExpansionModule,
    NgbModule
  ],

  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
  MatDatepickerModule, MatNativeDateModule]
})
export class SterlingModule { }
