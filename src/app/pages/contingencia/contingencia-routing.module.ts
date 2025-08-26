import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CierreProductosComponent } from "./cierre-productos/cierre-productos.component";
import { ConsultarBuzonComponent } from "./consultar-buzon/consultar-buzon.component";
import { ArchivosConsultaComponent } from "./descarga-archivos/archivos-consulta.component";
import { EditarParametroComponent } from "./parametros/editar-parametro/editar-parametro.component";
import { ParametrosComponent } from "./parametros/parametros.component";
import { RecargarCatalogoSfgComponent } from "./recargar-catalogo-sfg/recargar-catalogo-sfg.component";
import { EnvioArchivosComponent } from "./envio-archivos/envio-archivos.component";
import { SolicitudEdoCtaComponent } from "./solicitud-edo-cta/solicitud-edo-cta.component";
import { SolicitudCambioEstatusComponent } from './solicitud-cambio-estatus/solicitud-cambio-estatus.component';
import { CifradoDescifradoComponent } from "./cifrado-descifrado/cifrado-descifrado.component";

const routes: Routes = [
    { path: 'consultaDescargaArchivos', component: ArchivosConsultaComponent },
    { path: 'recargarCatalogoSFG', component: RecargarCatalogoSfgComponent },
    { path: 'cierreProductos', component: CierreProductosComponent },
    { path: 'parametros', component: ParametrosComponent },
    { path: 'editarParametro', component: EditarParametroComponent },
    { path: 'consultarBuzon', component: ConsultarBuzonComponent },
    { path: 'envioArchivos', component: EnvioArchivosComponent },
    { path: 'solicitudEdoCuentaContingencia', component: SolicitudEdoCtaComponent },
    { path: 'solicitudCambioEstatus', component: SolicitudCambioEstatusComponent },
    { path: 'cifradoDescifrado', component: CifradoDescifradoComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContingenciaRouterModule { }