import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { CobroComisionesComponent } from './cobro-comisiones/cobro-comisiones.component';
import { MonitorizacionComponent } from './monitorizacion/monitorizacion.component';
import { TipoCobroComponent } from '../admin-contratos/tipo-cobro/tipo-cobro.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  {path:'clientes',component:ClientesComponent},
  {path:'cobroComisiones',component:CobroComisionesComponent},
  {path:'monitorizacion',component:MonitorizacionComponent},
  {path:'usuarios',component:UsuariosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenRoadRoutingModule { }
