import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaCfdiComponent } from './consulta-cfdi/consulta-cfdi.component';

const routes: Routes = [
  { path: 'consultaCFDI', component: ConsultaCfdiComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCfdiRoutingModule { }
