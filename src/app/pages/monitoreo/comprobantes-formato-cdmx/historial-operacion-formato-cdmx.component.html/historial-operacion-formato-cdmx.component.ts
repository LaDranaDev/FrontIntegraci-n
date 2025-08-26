import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ComprobanteFormatoCDMXService } from 'src/app/services/monitoreo/comprobantes-formato-cdmx.service';

@Component({
  selector: 'app-historial-operacion-formato-cdmx',
  templateUrl: './historial-operacion-formato-cdmx.component.html'
})
export class HistorialOperacionFormatoCdmxComponent implements OnInit {
/** Variable para indicar en que pagina se encuentra */
page: number = 0;
/** Variable para indicar el total de elementos que regresa la peticion */
totalElements: number = 0;
/** Variable para identificar si el listado contiene o no valores*/
banderaHasRows:boolean = false;
//Variable para llenar la tabla
tablaHistorial: any;
operacion: any;
/**
* @description Objeto para el evento de paginacion
* con el parametro a buscar
* @type {IPaginationRequest}
* @memberof ParametrosComponent 
*/
objPagination:IPaginationRequest;

constructor(
  private formBuilder: UntypedFormBuilder,
  public dialog: MatDialog,
  public comprobanteService: ComprobanteFormatoCDMXService,
  private fc: FuncionesComunesComponent, 
  private cd: ChangeDetectorRef,
  private globals: Globals,
  private router: Router,
  public datePipe: DatePipe,
  private translate: TranslateService,
  public gestionComprobantesService: ComprobanteFormatoCDMXService
) { 
  
}

ngOnInit(): void {
  this.operacion = this.gestionComprobantesService.getSaveLocalStorage('operacion');
  this.getHistorial(); 
}

resultRequest(result:any){
  this.tablaHistorial= result;
  this.totalElements = result.length;
  if(this.totalElements > 0){
    this.banderaHasRows = true;
  }else{
    this.banderaHasRows = false;
  }
}

open(
  titulo: string,
  obser: string,
  type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
  errorCode?: string,
  sugerencia?: string
) {
  this.dialog.open(ModalInfoComponent, {
    data: new ModalInfoBeanComponents(
      titulo,
      obser,
      type,
      errorCode,
      sugerencia
    ), hasBackdrop: true
  });
}


/**
  * @descripcion Metodo para poder obtener el listado inicial de los parametros
  * 
  * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
async getHistorial(){
  try{
     await this.comprobanteService.obtieneHistorial(this.operacion).then(
         async (result:any) => {
           this.resultRequest(result);
           this.globals.loaderSubscripcion.emit(false);
         }
     )
  }catch(e){
    this.tablaHistorial = [];
    /** Se establece el page en el 0 */
    this.page=0;
    this.globals.loaderSubscripcion.emit(false);
    this.open(
      this.translate.instant('modal.msjERRGEN0001Titulo'),
      this.translate.instant('modal.msjERRGEN0001Observacion'),
      'error',
      this.translate.instant('modal.msjERRGEN0001Codigo'),
      this.translate.instant('modal.msjERRGEN0001Observacion')
    );
  }
}

/**
   * Metodo para poder realizar la exportacion de archivos
   */

async onExportar() {
  try {
    await this.comprobanteService.exportar(this.operacion).then(
      async (result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
        } else {
          if (result.code === '404') {
            this.open('Error', result.message, 'error');
          } else {
            this.open('Error', this.translate.instant('modals.error.exportacion'), 'error');
          }
        }
        this.globals.loaderSubscripcion.emit(false);
      })
  } catch (e) {
    this.globals.loaderSubscripcion.emit(false);
    this.open('Error', this.translate.instant('modals.error.exportacion'), 'error');
  }
}

regresar() {
  this.router.navigate(['/monitoreo/detalleOperacionFormatoCDMX']);
}

}
