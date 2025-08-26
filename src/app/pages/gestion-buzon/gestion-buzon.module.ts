import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomModule } from '../../layout/custom/custom.module';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { GestionBuzonRoutingModule } from './gestion-buzon-routing.module';
import { CrearBuzonComponent } from './crear-buzon/crear-buzon.component';
import { GestionConexionContratoComponent } from './gestion-conexion-contrato/gestion-conexion-contrato.component';
import { ModificarConexionContratoComponent } from './gestion-conexion-contrato/modificar-conexion-contrato/modificar-conexion-contrato.component';
import { ConfigurarConexionContratoComponent } from './gestion-conexion-contrato/configurar-conexion-contrato/configurar-conexion-contrato.component';
import { ModificarParametrosParaContratoComponent } from './gestion-conexion-contrato/modificar-parametros-para-contrato/modificar-parametros-para-contrato.component';
import { ConfigurarParametrosParaContratoComponent } from './gestion-conexion-contrato/configurar-parametros-para-contrato/configurar-parametros-para-contrato.component';
import { GestionParametrosCanalComponent } from './gestion-parametros-canal/gestion-parametros-canal.component';
import { CanalParametrosComponent } from './gestion-parametros-canal/canal-parametros/canal-parametros.component';
import { EditarCanalComponent } from './gestion-parametros-canal/editar-canal/editar-canal.component';
import { GestionProtocolosComponent } from './gestion-protocolos/gestion-protocolos.component';
import { AltaProtocolosComponent } from './gestion-protocolos/alta-protocolos/alta-protocolos.component';
import { ParametrosProtocoloComponent } from './gestion-protocolos/parametros-protocolo/parametros-protocolo.component';
import { AltaParametroProtocoloComponent } from './gestion-protocolos/parametros-protocolo/alta-parametro-protocolo/alta-parametro-protocolo.component';
import { AltaBuzonComponent } from "./vigencia-buzones/alta-vigencia-buzon/alta-buzon.component";
import { ConsultarBuzonesComponent } from "./vigencia-buzones/consultar-buzones.component";
import { ModificacionProtocolosComponent } from './gestion-protocolos/modificacion-protocolos/modificacion-protocolos.component';
import { ModificacionParametroProtocoloComponent } from './gestion-protocolos/parametros-protocolo/modificacion-parametro-protocolo/modificacion-parametro-protocolo.component';

@NgModule({
  declarations: [
    ConsultarBuzonesComponent,
    AltaBuzonComponent,
    CrearBuzonComponent,
    GestionConexionContratoComponent,
    ModificarConexionContratoComponent,
    ConfigurarConexionContratoComponent,
    ModificarParametrosParaContratoComponent,
    ConfigurarParametrosParaContratoComponent,
    GestionParametrosCanalComponent,
    EditarCanalComponent,
    CanalParametrosComponent,
    GestionProtocolosComponent,
    AltaProtocolosComponent,
    ParametrosProtocoloComponent,
    AltaParametroProtocoloComponent,
    ModificacionProtocolosComponent,
    ModificacionParametroProtocoloComponent,
  ],
  imports: [
    GestionBuzonRoutingModule,CustomModule,CommonModule,PaginationModule
  ],
  providers: [BsModalService, {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true  },
                MatDatepickerModule, MatNativeDateModule]
  
})
export class GestionBuzonModule { }
