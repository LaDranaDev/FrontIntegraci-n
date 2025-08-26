import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionComprobantesComponent } from '../admin-contratos/gestion-comprobantes/gestion-comprobantes.component';
import { CrearBuzonComponent } from './crear-buzon/crear-buzon.component';
import { GestionConexionContratoComponent } from './gestion-conexion-contrato/gestion-conexion-contrato.component';
import { ModificarConexionContratoComponent } from './gestion-conexion-contrato/modificar-conexion-contrato/modificar-conexion-contrato.component';
import { ConfigurarConexionContratoComponent } from './gestion-conexion-contrato/configurar-conexion-contrato/configurar-conexion-contrato.component';
import { ModificarParametrosParaContratoComponent } from './gestion-conexion-contrato/modificar-parametros-para-contrato/modificar-parametros-para-contrato.component';
import { ConfigurarParametrosParaContratoComponent } from './gestion-conexion-contrato/configurar-parametros-para-contrato/configurar-parametros-para-contrato.component';
import { GestionParametrosCanalComponent } from './gestion-parametros-canal/gestion-parametros-canal.component';
import { EditarCanalComponent } from './gestion-parametros-canal/editar-canal/editar-canal.component';
import { GestionProtocolosComponent } from './gestion-protocolos/gestion-protocolos.component';
import { AltaProtocolosComponent } from './gestion-protocolos/alta-protocolos/alta-protocolos.component';
import { ParametrosProtocoloComponent } from './gestion-protocolos/parametros-protocolo/parametros-protocolo.component';
import { AltaParametroProtocoloComponent } from './gestion-protocolos/parametros-protocolo/alta-parametro-protocolo/alta-parametro-protocolo.component';
import { ModificacionParametroProtocoloComponent } from './gestion-protocolos/parametros-protocolo/modificacion-parametro-protocolo/modificacion-parametro-protocolo.component';
import { ModificacionProtocolosComponent } from './gestion-protocolos/modificacion-protocolos/modificacion-protocolos.component';
import { CanalParametrosComponent } from './gestion-parametros-canal/canal-parametros/canal-parametros.component';
import { AltaBuzonComponent } from "./vigencia-buzones/alta-vigencia-buzon/alta-buzon.component";
import { ConsultarBuzonesComponent } from "./vigencia-buzones/consultar-buzones.component";



const routes: Routes = [
  {path:'crearBuzon',component:CrearBuzonComponent},
  {path:'gestionConexionContrato',component:GestionConexionContratoComponent},
  {path:'modificarConexionContrato', component: ModificarConexionContratoComponent},
  {path:'configurarConexionContrato', component: ConfigurarConexionContratoComponent},
  {path:'agregarProtocolo', component: ModificarParametrosParaContratoComponent},
  {path:'modificarProtocolo', component: ModificarParametrosParaContratoComponent},
  {path:'putGet', component: ConfigurarParametrosParaContratoComponent},
  {path:'putGet/:id', component: ConfigurarParametrosParaContratoComponent},
  {path:'gestionParametrosCanal', component:GestionParametrosCanalComponent},
  {path:'gestionParametrosCanal/:id', component:EditarCanalComponent},
  {path:'gestionParametrosCanal/:id/:idReg', component:CanalParametrosComponent},
  {path:'gestionProtocolos', component:GestionProtocolosComponent},
  {path: 'altaProtocolos', component:AltaProtocolosComponent}, 
  {path: 'modificacionProtocolos', component:ModificacionProtocolosComponent}, 
  {path: 'parametrosProtocolo', component:ParametrosProtocoloComponent},
  {path: 'altaParametrosProtocolo', component:AltaParametroProtocoloComponent},
  {path: 'modificacionParametrosProtocolo', component:ModificacionParametroProtocoloComponent},
  {path:'consultaVigenciaBuzones',component:ConsultarBuzonesComponent},
  {path:'altaVigenciaBuzones',component:AltaBuzonComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionBuzonRoutingModule { }
