import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { Globals } from "src/app/bean/globals-bean.component";
import { ModalInfoBeanComponents } from "src/app/bean/modal-info-bean.component";
import { ModalInfoComponent } from "src/app/components/modals/modal-info/modal-info.component";
import { MonitorArchivosDuplicadosService } from "src/app/services/duplicados/monitor-archivos-duplicados.service";

@Injectable()
export class ProcesarDatos {
      constructor(
            private translate: TranslateService,
            private globals: Globals,
            private service: MonitorArchivosDuplicadosService,
            public dialog: MatDialog,
      ){

      }
      openGeneralError() {
            this.dialog.open(ModalInfoComponent, {
                  data: new ModalInfoBeanComponents(
                        this.translate.instant('modal.msjERRGEN0001Titulo'),
                        this.translate.instant('modal.msjERRGEN0001Observacion'),
                        'error',
                        this.translate.instant('modal.msjERRGEN0001Codigo'),
                        this.translate.instant('modal.msjERRGEN0001Sugerencia')
                  ),
            });
      }

      async procesar(flag: boolean, motivoRechazo: string, idArchivo: string , nameFile:string) {
            const resp = await this.service.setMotivoRechazo(idArchivo, motivoRechazo).catch((e) => {
                  return null;
            });
            this.globals.loaderSubscripcion.emit(false);

            if (!resp) {
                  return this.openGeneralError()
            }

            const txt = flag ? 'monitorArchivoOperaciones.nivelProducto.rechazado' : 'monitorArchivoOperaciones.nivelProducto.procesado';
            return this.dialog.open(ModalInfoComponent, {
                  data: new ModalInfoBeanComponents(
                        this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
                        `${this.translate.instant(txt)}: ${nameFile}`,
                        'info',
                        '',
                        this.translate.instant('pantalla.envio.archivos.seccion.archivo')
                  ),
            });
      }
}
