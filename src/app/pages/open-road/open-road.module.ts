import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenRoadRoutingModule } from './open-road-routing.module';
import { ClientesComponent } from './clientes/clientes.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomModule } from '../../layout/custom/custom.module';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {MatIconModule} from '@angular/material/icon';
import { CobroComisionesComponent } from './cobro-comisiones/cobro-comisiones.component'
import { FiltrosConsultasComponent } from 'src/app/components/filtros-consultas/filtros-consultas.component';
import { MonitorizacionComponent } from './monitorizacion/monitorizacion.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

@NgModule({
  declarations: [
    ClientesComponent,
    CobroComisionesComponent,
    FiltrosConsultasComponent,
    MonitorizacionComponent,
    UsuariosComponent,
  ],
  imports: [
    CommonModule,
    OpenRoadRoutingModule,
    CustomModule,
    PaginationModule,
    MatIconModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
                MatDatepickerModule, MatNativeDateModule]
})
export class OpenRoadModule { }
