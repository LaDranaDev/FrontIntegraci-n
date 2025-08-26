import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaDocumentosCfdiComponent } from './consulta-documentos-cfdi/consulta-documentos-cfdi.component';
import { ConsultaContratosCfdiDetalleComponent } from './consulta-documentos-cfdi/consulta-contratos-cfdi-detalle/consulta-contratos-cfdi-detalle.component';

const routes: Routes = [
  { path: 'consultaDocumentosCFDI', component: ConsultaDocumentosCfdiComponent},
  { path: 'consultaDocumentosCFDIDetalle', component: ConsultaContratosCfdiDetalleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaDocumentosCfdiRoutingModule { }
