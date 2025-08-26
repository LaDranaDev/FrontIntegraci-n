import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionPaisesComponent } from './gestion-paises/gestion-paises.component';
import { GestionBackendsComponent } from './gestion-backends/gestion-backends.component';
import { GestionAlarmaComponent } from './gestion-alarma/gestion-alarma.component';
import { CatalogoDinamicoComponent } from './catalogo-dinamico/catalogo-dinamico.component';
import { ModificarCatalogoDinamicoComponent } from './catalogo-dinamico/modificar-catalogo-dinamico/modificar-catalogo-dinamico.component';
import { GestionSucursalesComponent } from './gestion-sucursales/gestion-sucursales.component';
import { SucursalesComponent } from './gestion-sucursales/sucursales/sucursales.component';
import { BackendComponent } from './gestion-backends/backend/backend.component';
import { GestionProductosComponent } from './gestion-productos/gestion-productos.component';
import { GestionBancosComponent } from './gestion-bancos/gestion-bancos.component';
import { AltaBancoComponent } from './gestion-bancos/alta-banco/alta-banco.component';
import { ModificarBancoComponent } from './gestion-bancos/modificar-banco/modificar-banco.component';
import { GestionMensajesErrorComponent } from './gestion-mensajes-error/gestion-mensajes-error.component';
import { MensajeErrorComponent } from './gestion-mensajes-error/mensaje-error/mensaje-error.component';
import { ProductoComponent } from './gestion-productos/producto/producto.component';
import { ContingenciaComponent } from './gestion-productos/contingencia/contingencia.component';
import { GestionCodigosPostalesComponent } from './gestion-codigos-postales/gestion-codigos-postales.component';
import { AltaCodigoPostalComponent } from './gestion-codigos-postales/alta-codigo-postal/alta-codigo-postal.component';
import { ConsultaAbaComponent } from './consulta-aba/consulta-aba.component';
import { VisualizacionLayoutComponent } from './visualizacion-layout/visualizacion-layout.component';
import { ConsultaBicComponent } from './consulta-bic/consulta-bic.component';
import { ConsultaValidacionesCanalComponent } from './consulta-validaciones-canal/consulta-validaciones-canal.component';
import { GestionValidacionesCanalComponent } from './gestion-validaciones-canal/gestion-validaciones-canal.component';
import { DetalleMensajeErrorComponent } from './gestion-mensajes-error/detalle-mensaje-error/detalle-mensaje-error.component';
import { AgregarValidacionComponent } from './gestion-validaciones-canal/agregar-validacion/agregar-validacion.component';
import { AgregarCampoComponent } from './gestion-validaciones-canal/agregar-campo/agregar-campo.component';
import { GestionNotificacionesComponent } from './gestion-notificaciones/gestion-notificaciones.component';
import { CancelacionOperacionesComponent } from './cancelacion-operaciones/cancelacion-operaciones.component';
import { GestionLayoutsComponent } from './gestion-layouts/gestion-layouts.component';
import { EsquemaComisionDefaultComponent } from './esquema-comision-default/esquema-comision-default.component';
import { AutorizacionEnrolamientoComponent } from './autorizacion-enrolamiento/autorizacion-enrolamiento.component';

const routes: Routes = [
  { path: 'gestionPaises', component: GestionPaisesComponent },
  { path: 'gestionBackends', component: GestionBackendsComponent },
  { path: 'backend', component: BackendComponent },
  { path: 'gestionAlarma', component: GestionAlarmaComponent },
  { path: 'consultaCatalogoDinamico', component: CatalogoDinamicoComponent },
  {
    path: 'modificarCatalogoDinamico',
    component: ModificarCatalogoDinamicoComponent,
  },
  { path: 'gestionSucursales', component: GestionSucursalesComponent },
  { path: 'sucursal', component: SucursalesComponent },
  /** Gestion Productos */
  { path: 'gestionProductos', component: GestionProductosComponent },
  { path: 'producto/:origen', component: ProductoComponent },
  { path: 'productos/:origen/:id', component: ProductoComponent },
  {
    path: 'contingencia/:origen/:id/:descProd',
    component: ContingenciaComponent,
  },
  { path: 'consultaBICS', component: ConsultaBicComponent },
  /** Gestion Bancos */
  { path: 'gestionBancos', component: GestionBancosComponent },
  { path: 'altaBancos', component: AltaBancoComponent },
  { path: 'modificarBancos', component: ModificarBancoComponent },
  { path: 'gestionMensajesError', component: GestionMensajesErrorComponent },
  { path: 'mensajeError', component: MensajeErrorComponent },
  { path: 'codigosPostales', component: GestionCodigosPostalesComponent },
  { path: 'altaCodigoPostal', component: AltaCodigoPostalComponent },
  { path: 'consultaClaveABA', component: ConsultaAbaComponent },
  { path: 'vizualizacionLayouts', component: VisualizacionLayoutComponent },
  {
    path: 'consultaValidacionesCanal',
    component: ConsultaValidacionesCanalComponent,
  },
  {
    path: 'gestionValidacionesCanal',
    component: GestionValidacionesCanalComponent,
  },
  { path: 'agregarCampo', component: AgregarCampoComponent },
  { path: 'editarCampo', component: AgregarCampoComponent },
  { path: 'agregarValidacion', component: AgregarValidacionComponent },
  { path: 'editarValidacion', component: AgregarValidacionComponent },
  { path: 'detalleMensajeError', component: DetalleMensajeErrorComponent },
  { path: 'gestionNotificaciones', component: GestionNotificacionesComponent },
  { path: 'cancelacionOperaciones', component: CancelacionOperacionesComponent },
  { path: 'gestionLayouts', component: GestionLayoutsComponent },
  { path: 'esquemaComicionDefault', component: EsquemaComisionDefaultComponent },
  { path: 'autorizacionEnrolamiento', component: AutorizacionEnrolamientoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionRoutingModule {}
