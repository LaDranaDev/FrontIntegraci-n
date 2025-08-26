import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegeneraReporteCobranzaComponent } from './regenera-reporte-cobranza/regenera-reporte-cobranza.component';
import { AltaContratosComponent } from './alta-contratos/alta-contratos.component';
import { GestionComprobantesComponent } from './gestion-comprobantes/gestion-comprobantes.component';
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
import { ConsultaContratosComponent } from './consulta-contratos/consulta-contratos.component';
import { ConveniosContratosComponent } from './convenios-contratos/convenios-contratos.component';
import { TipoCobroComponent } from './tipo-cobro/tipo-cobro.component'
import { ReportesCobranzaIntradiaComponent } from './reportes-cobranza-intradia/reportes-cobranza-intradia.component';
import { EsquemaDeComisionesComponent } from './esquema-de-comisiones/esquema-de-comisiones.component';
import { EdoCuentaIntradiaComponent } from './edo-cuenta-intradia/edo-cuenta-intradia.component';
import { EdoCuentaConsolidadoComponent } from './edo-cuenta-consolidado/edo-cuenta-consolidado.component';
import { ParametrosComponent } from '../contingencia/parametros/parametros.component';
import { EditarParametroComponent } from '../contingencia/parametros/editar-parametro/editar-parametro.component';
import { CuentasOrdenantesComponent } from './cuentas-ordenantes/cuentas-ordenantes.component';
import { ReporteCobranzaComponent } from './reporte-cobranza/reporte-cobranza.component';
import { ParametrosDomiciliacionesComponent } from './parametros-domiciliaciones/parametros-domiciliaciones/parametros-domiciliaciones.component';
import { ReportesConfirmingComponent } from './reportes-confirming/reportes-confirming.component';
import { OtroComponent } from './otro/otro.component';
import { PagoDirectoComponent } from './pago-directo/pago-directo.component';

const routes: Routes = [
  { path: 'regeneraRepCobranza', component: RegeneraReporteCobranzaComponent },
  { path: 'otro', component: OtroComponent },
  { path: 'regeneraReporteCobranza', component: ReporteCobranzaComponent },
  { path: 'usuarioOperante', component: UsuariosOperantesComponent },
  { path: 'altaContratos', component: AltaContratosComponent },
  {  path: 'consultaGestionComprobantes', component: GestionComprobantesComponent,},
  { path:'parametrosDomiciliaciones', component:ParametrosDomiciliacionesComponent },
  {
    path: 'cuentasbeneficiariasContratos',
    component: CuentasBeneficiariasContratosComponent,
  },
  { path: 'consultaParametros', component: ParametrosComponent },
  { path: 'editarParametro', component: EditarParametroComponent },
  {
    path: 'consultaParametriaAdicional',
    component: ParametriaAdicionalComponent,
  },
  { path: 'consultaParametriaAdicionalDos', component: ParametriaAdicionalDosComponent },
  {
    path: 'consultaContratosUsuario',
    component: ConsultaContratosUsuarioComponent,
  },
  { path: 'cobroComision', component: OtroComponent },
  //{ path: 'cobroComision', component: CobroComisionComponent },
  { path: 'parametrosDelContrato', component: ParametrosDelContratoComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'productos/:register', component: ProductosComponent },
  { path: 'notificaciones', component: NotificacionesComponent },
  {
    path: 'notificaciones/destinatarios/:register',
    component: DestinatariosComponent,
  },
  { path: 'consultaContratos', component: ConsultaContratosComponent },
  { path: 'notificaciones', component: NotificacionesComponent },
  { path: 'conveniosContratos', component: ConveniosContratosComponent },
  { path: 'tipoCobro', component: TipoCobroComponent },
  {
    path: 'reportesCobranzaIntradia',
    component: ReportesCobranzaIntradiaComponent,
  },
  { path: 'esquemaComision', component: EsquemaDeComisionesComponent },
  { path: 'edoCuentaIntradia', component: EdoCuentaIntradiaComponent },
  { path: 'edoCuentaconsolidado', component: EdoCuentaConsolidadoComponent },
  { path: 'cuentasOrdenantes', component: CuentasOrdenantesComponent },
  { path: 'reportesConfirming', component: ReportesConfirmingComponent },
  { path: 'pagoDirecto', component: PagoDirectoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminContratosRoutingModule {}
