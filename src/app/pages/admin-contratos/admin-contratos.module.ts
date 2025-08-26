import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AltaContratosComponent } from './alta-contratos/alta-contratos.component';
import { RegeneraReporteCobranzaComponent } from './regenera-reporte-cobranza/regenera-reporte-cobranza.component';
import { CustomModule } from '../../layout/custom/custom.module';
import { LoaderInterceptor } from '../../interceptor/loader-interceptor';
import { AdminContratosRoutingModule } from './admin-contratos-routing.module';
import { GestionComprobantesComponent } from './gestion-comprobantes/gestion-comprobantes.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ParametriaAdicionalComponent } from './parametria-adicional/parametria-adicional.component';
import { ParametriaAdicionalDosComponent } from './parametria-adicional-dos/parametria-adicional-dos.component';
import { UsuariosOperantesComponent } from './usuarios-operantes/usuarios-operantes.component';
import { CuentasBeneficiariasContratosComponent } from './cuentas-beneficiarias-contratos/cuentas-beneficiarias-contratos.component';
import { ConsultaContratosUsuarioComponent } from './consulta-contratos-usuario/consulta-contratos-usuario.component';
import { CobroComisionComponent } from './cobro-comision/cobro-comision.component';
import { ParametrosDelContratoComponent } from './parametros-del-contrato/parametros-del-contrato.component';
import { ProductosComponent } from './productos/productos.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { DestinatariosComponent } from './notificaciones/destinatarios/destinatarios.component';
import { ConveniosContratosComponent } from './convenios-contratos/convenios-contratos.component';
import { ConsultaContratosComponent } from './consulta-contratos/consulta-contratos.component';
import { EsquemaDeComisionesComponent } from './esquema-de-comisiones/esquema-de-comisiones.component';
import { MatListModule } from '@angular/material/list';

import { TipoCobroComponent } from './tipo-cobro/tipo-cobro.component';
import { ValidarProductoCL } from './productos/validaciones-productos.';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ReportesCobranzaIntradiaComponent } from './reportes-cobranza-intradia/reportes-cobranza-intradia.component';
import { EdoCuentaIntradiaComponent } from './edo-cuenta-intradia/edo-cuenta-intradia.component';
import { EdoCuentaConsolidadoComponent } from './edo-cuenta-consolidado/edo-cuenta-consolidado.component';
import { ReporteCobranzaValidacionesCL } from './regenera-reporte-cobranza/reporte-cobranza-validaciones';
import { CuentasOrdenantesComponent } from './cuentas-ordenantes/cuentas-ordenantes.component';
import { ReporteCobranzaComponent } from './reporte-cobranza/reporte-cobranza.component';
import { ParametrosDomiciliacionesComponent } from './parametros-domiciliaciones/parametros-domiciliaciones/parametros-domiciliaciones.component';
import { ReportesConfirmingComponent } from './reportes-confirming/reportes-confirming.component';
import { CurrencyInputModule } from 'src/app/directivas/currency-input.module';
import { OtroComponent } from './otro/otro.component';
import { PagoDirectoComponent } from './pago-directo/pago-directo.component';

@NgModule({
  declarations: [
    TipoCobroComponent,
    GestionComprobantesComponent,
    RegeneraReporteCobranzaComponent,
    UsuariosOperantesComponent,
    AltaContratosComponent,
    ParametriaAdicionalComponent,
    ParametriaAdicionalDosComponent,
    ConsultaContratosUsuarioComponent,
    CobroComisionComponent,
    CuentasBeneficiariasContratosComponent,
    ParametrosDelContratoComponent,
    ProductosComponent,
    NotificacionesComponent,
    DestinatariosComponent,
    ConveniosContratosComponent,
    ConsultaContratosComponent,
    ReportesCobranzaIntradiaComponent,
    EsquemaDeComisionesComponent,
    EdoCuentaIntradiaComponent,
    EdoCuentaConsolidadoComponent,
    CuentasOrdenantesComponent,
    ReporteCobranzaComponent,
    ParametrosDomiciliacionesComponent,
    ReportesConfirmingComponent,
    OtroComponent,
    PagoDirectoComponent
  ],
  imports: [
    AdminContratosRoutingModule,
    CustomModule,
    CommonModule,
    PaginationModule,
    MatListModule,
    DragDropModule,
    CurrencyInputModule
  ],
  providers: [
    BsModalService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    MatDatepickerModule,
    MatNativeDateModule,
    ValidarProductoCL,
    ReporteCobranzaValidacionesCL,
    CurrencyPipe

  ],
})
export class AdminContratosModule { }
