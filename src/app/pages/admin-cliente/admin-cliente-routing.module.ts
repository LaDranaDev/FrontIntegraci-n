import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionCertificadosComponent } from './administracion-certificados/administracion-certificados.component';
import { DescargaApiComponent } from './descarga-api/descarga-api.component';
import { DescargaLlavePublicaCanalComponent } from './descarga-llave-publica-canal/descarga-llave-publica-canal.component';
import {AdminBuzonComponent} from './admin-buzon/admin-buzon/admin-buzon.component'

const routes: Routes = [
  { path: 'descargaApi', component:DescargaApiComponent},
  { path: 'adminitracionCertificados', component: AdministracionCertificadosComponent},
  { path: 'descargaLlavePublicaCanal', component:DescargaLlavePublicaCanalComponent},
  { path: 'adminBuzon', component:AdminBuzonComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminClienteRoutingModule { }
