import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule, Routes } from '@angular/router';
import { MonitorOperacionesOnlineComponent } from '../pages/monitoreo/monitor-operaciones-online/monitor-operaciones-online.component';
import { SolicitudEdoCuentaModule } from '../pages/solicitud-edo-cuenta/solicitud-edo-cuenta.module';
import { ControlVolumenOperativoModule } from '../pages/control-volumen-operativo/control-volumen-operativo.module';
import { ConsultaTrackingApiComponent } from '../pages/monitoreo-api/consulta-tracking-api/consulta-tracking-api/consulta-tracking-api.component';
import { MonitoreoOperacionesComponent } from '../pages/monitoreo-api/monitoreo-operaciones/monitoreo-operaciones/monitoreo-operaciones.component';
const routes: Routes = [
  { path: '',component: LayoutComponent,
  children: [
    { path: '',loadChildren: () => import('../pages/inicio/inicio.module').then(m => m.InicioModule)},
    { path: 'admin-contratos',loadChildren: () => import('../pages/admin-contratos/admin-contratos.module').then(m => m.AdminContratosModule)},
    { path: 'contingencia',loadChildren: () => import('../pages/contingencia/contingencia.module').then(m => m.ContingenciaModule)},
    { path: 'solicitudEdoCuenta',loadChildren: () => import('../pages/solicitud-edo-cuenta/solicitud-edo-cuenta.module').then(m => m.SolicitudEdoCuentaModule)},
    { path: 'gestionBuzon', loadChildren: () => import('../pages/gestion-buzon/gestion-buzon.module').then(m => m.GestionBuzonModule)},
    { path: 'moduloAdministracion', loadChildren: () => import('../pages/administracion/administracion.module').then(m => m.AdministracionModule)},
    { path: 'administracionCliente', loadChildren: () => import('../pages/admin-cliente/admin-cliente.module').then(m => m.AdminClienteModule)},
    { path: 'monitoreo', loadChildren: () => import('../pages/monitoreo/monitoreo.module').then(m => m.MonitoreoModule)},
    { path: 'controlVolumenOperativo', loadChildren: () => import('../pages/control-volumen-operativo/control-volumen-operativo.module').then(m => m.ControlVolumenOperativoModule)},
    { path: 'duplicados', loadChildren: () => import('../pages/duplicados/duplicados.module').then(m => m.DuplicadosModule)},
    { path: 'consultasYreportes', loadChildren: () => import('../pages/consultas-reportes/consultas-reportes.module').then(m => m.ConsultasReportesModule)},
    { path: 'administracionStockSuperCuentaGo', loadChildren: () => import('../pages/admin-stock-super-cuenta-go/admin-stock-super-cuenta-go.module').then(m => m.AdminStockSuperCuentaGoModule)},
    { path: 'consultaCFDI', loadChildren: () => import('../pages/consulta-cfdi/consulta-cfdi.module').then(m => m.ConsultaCfdiModule)},
    { path: 'consultaTipoCambio', loadChildren: () => import('../pages/consulta-tipo-cambio/consulta-tipo-cambio.module').then(m => m.ConsultaTipoCambioModule)},
    { path: 'consultaDocumentosCFDI', loadChildren: () => import('../pages/consulta-documentos-cfdi/consulta-documentos-cfdi.module').then(m => m.ConsultaDocumentosCfdiModule)},
    { path: 'open-road', loadChildren: () => import('../pages/open-road/open-road.module').then(m => m.OpenRoadModule)},
    { path: 'sterling', loadChildren: () => import('../pages/sterling/sterling.module').then(m => m.SterlingModule)},
    { path: 'monitoreoApi/consultaTrackingApi',component: ConsultaTrackingApiComponent },
     { path: 'monitoreoApi/monitorOperaciones', component: MonitoreoOperacionesComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
