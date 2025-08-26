import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { LoaderInterceptor } from "src/app/interceptor/loader-interceptor";
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, esLocale } from 'ngx-bootstrap/chronos';
import { CustomModule } from "../../layout/custom/custom.module";
import { ContingenciaRouterModule } from "./contingencia-routing.module";
import { RecargarCatalogoSfgComponent } from "./recargar-catalogo-sfg/recargar-catalogo-sfg.component";
import { ArchivosConsultaComponent } from "./descarga-archivos/archivos-consulta.component";
import { CierreProductosComponent } from './cierre-productos/cierre-productos.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { EditarParametroComponent } from './parametros/editar-parametro/editar-parametro.component';
import { ConsultarBuzonComponent } from "./consultar-buzon/consultar-buzon.component";
import { EnvioArchivosComponent } from './envio-archivos/envio-archivos.component';
import { SolicitudEdoCtaComponent } from './solicitud-edo-cta/solicitud-edo-cta.component';
import { SolicitudCambioEstatusComponent } from './solicitud-cambio-estatus/solicitud-cambio-estatus.component';
import { CifradoDescifradoComponent } from "./cifrado-descifrado/cifrado-descifrado.component";
defineLocale('es', esLocale);

@NgModule({
    declarations: [
        ArchivosConsultaComponent, RecargarCatalogoSfgComponent, ConsultarBuzonComponent,
        CierreProductosComponent, ParametrosComponent, EditarParametroComponent, EnvioArchivosComponent, SolicitudEdoCtaComponent, SolicitudCambioEstatusComponent, CifradoDescifradoComponent],

    imports: [ContingenciaRouterModule, CustomModule, CommonModule, ModalModule, PaginationModule, BsDatepickerModule],
    providers: [
        BsModalService,
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
    ]
})
export class ContingenciaModule { }