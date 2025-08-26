import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuentaBeneficiariaComponent } from './cuenta-beneficiaria/cuenta-beneficiaria.component';
import { ReportesComponent } from './reportes/reportes.component';
import { BitacoraEnvioEstadoCuentaComponent } from './bitacora-envio-estado-cuenta/bitacora-envio-estado-cuenta.component';
import { CobroComisionesComponent } from '../open-road/cobro-comisiones/cobro-comisiones.component';
import { ConsultaPistasAuditoriaComponent } from './consulta-pistas-auditoria/consulta-pistas-auditoria.component';

const routes: Routes = [
  { path: 'cuentaBeneficiaria', component: CuentaBeneficiariaComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'bitacoraEnvioEstadoCuenta', component: BitacoraEnvioEstadoCuentaComponent },
  { path: 'consultaComisiones', component: CobroComisionesComponent },
  { path: 'consultaPistasAuditoria', component: ConsultaPistasAuditoriaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasReportesRoutingModule { }
