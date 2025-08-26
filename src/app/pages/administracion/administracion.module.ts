import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModule } from '../../layout/custom/custom.module';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GestionPaisesComponent } from './gestion-paises/gestion-paises.component';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { LoaderInterceptor } from 'src/app/interceptor/loader-interceptor';
import { GestionBackendsComponent } from './gestion-backends/gestion-backends.component';
import { GestionAlarmaComponent } from './gestion-alarma/gestion-alarma.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CatalogoDinamicoComponent } from './catalogo-dinamico/catalogo-dinamico.component';
import { ModificarCatalogoDinamicoComponent } from './catalogo-dinamico/modificar-catalogo-dinamico/modificar-catalogo-dinamico.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GestionSucursalesComponent } from './gestion-sucursales/gestion-sucursales.component';
import { SucursalesComponent } from './gestion-sucursales/sucursales/sucursales.component';
import { BackendComponent } from './gestion-backends/backend/backend.component';
import { GestionProductosComponent } from './gestion-productos/gestion-productos.component';
import { GestionBancosComponent } from './gestion-bancos/gestion-bancos.component';
import { AltaBancoComponent } from './gestion-bancos/alta-banco/alta-banco.component';
import { GestionMensajesErrorComponent } from './gestion-mensajes-error/gestion-mensajes-error.component';
import { MensajeErrorComponent } from './gestion-mensajes-error/mensaje-error/mensaje-error.component';
import { GestionCodigosPostalesComponent } from './gestion-codigos-postales/gestion-codigos-postales.component';
import { AltaCodigoPostalComponent } from './gestion-codigos-postales/alta-codigo-postal/alta-codigo-postal.component';
import { ConsultaAbaComponent } from './consulta-aba/consulta-aba.component';
import { VisualizacionLayoutComponent } from './visualizacion-layout/visualizacion-layout.component';
import { ProductoComponent } from './gestion-productos/producto/producto.component';
import { ContingenciaComponent } from './gestion-productos/contingencia/contingencia.component';
import { ConsultaBicComponent } from './consulta-bic/consulta-bic.component';
import { ConsultaValidacionesCanalComponent } from './consulta-validaciones-canal/consulta-validaciones-canal.component';
import { GestionValidacionesCanalComponent } from './gestion-validaciones-canal/gestion-validaciones-canal.component';
import { DetalleMensajeErrorComponent } from './gestion-mensajes-error/detalle-mensaje-error/detalle-mensaje-error.component';
import { AgregarCampoComponent } from './gestion-validaciones-canal/agregar-campo/agregar-campo.component';
import { AgregarValidacionComponent } from './gestion-validaciones-canal/agregar-validacion/agregar-validacion.component';
import { ModificarBancoComponent } from './gestion-bancos/modificar-banco/modificar-banco.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { GestionNotificacionesComponent } from './gestion-notificaciones/gestion-notificaciones.component';
import { CancelacionOperacionesComponent } from './cancelacion-operaciones/cancelacion-operaciones.component';
import { GestionLayoutsComponent } from './gestion-layouts/gestion-layouts.component';
import { EsquemaComisionDefaultComponent } from './esquema-comision-default/esquema-comision-default.component';
import { CurrencyInputModule } from 'src/app/directivas/currency-input.module';
import { AutorizacionEnrolamientoComponent } from './autorizacion-enrolamiento/autorizacion-enrolamiento.component';
import { ValidacionesEsquemaDefault } from './esquema-comision-default/validaciones-esquema-default';

@NgModule({
  declarations: [
    GestionPaisesComponent,
    GestionBackendsComponent,
    GestionAlarmaComponent,
    CatalogoDinamicoComponent,
    ModificarCatalogoDinamicoComponent,
    GestionBancosComponent,
    AltaBancoComponent,
    GestionSucursalesComponent,
    SucursalesComponent,
    BackendComponent,
    GestionProductosComponent,
    GestionMensajesErrorComponent,
    MensajeErrorComponent,
    ConsultaAbaComponent,
    VisualizacionLayoutComponent,
    GestionCodigosPostalesComponent,
    AltaCodigoPostalComponent,
    ConsultaValidacionesCanalComponent,
    ProductoComponent,
    ContingenciaComponent,
    ConsultaBicComponent,
    GestionValidacionesCanalComponent,
    DetalleMensajeErrorComponent,
    AgregarCampoComponent,
    AgregarValidacionComponent,
    ModificarBancoComponent,
    GestionNotificacionesComponent,
    CancelacionOperacionesComponent,
    GestionLayoutsComponent,
    EsquemaComisionDefaultComponent,
    AutorizacionEnrolamientoComponent,
  ],
  imports: [
    AdministracionRoutingModule,
    CustomModule,
    CommonModule,
    BsDatepickerModule,
    PaginationModule,
    NgbModule,
    CurrencyInputModule
  ],

  providers: [
    BsModalService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    MatDatepickerModule,
    MatNativeDateModule,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    ValidacionesEsquemaDefault,
  ],
})
export class AdministracionModule {}
