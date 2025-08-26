import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { VisualizacionLayoutService } from 'src/app/services/administracion/visualizacion-layout.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';

@Component({
  selector: 'app-visualizacion-layout',
  templateUrl: './visualizacion-layout.component.html'
})
export class VisualizacionLayoutComponent implements OnInit, OnDestroy {

/**Variable para guardar el contenido del archivo seleccionado*/
archivoSelec: any = null;
/**Variable para guardar el contenido del archivo*/
archivo: any = null;
// Define la referencia al boton de cargar archivo
@ViewChild('btnCargarArchivo', { static: false })
// Referencia al boton cargar archivo para resetear su valor despues de una error.
btnCargarArchivo!: ElementRef;
nombreArchivo: string;
  clickSuscliption: Subscription | undefined;

  constructor(
    public dialog: MatDialog,
    public layoutService: VisualizacionLayoutService,
    private globals: Globals,
    private translate: TranslateService,
    private comunService: ComunesService,
    private fc: FuncionesComunesComponent,
  ) { }

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;

      if (codeMenu === 16) {
        this.eventClean();
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */
  open(titulo: String, contenido: String, type?:any, errorCode?:string, sugerencia?:string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido,type,errorCode,sugerencia), hasBackdrop: true
    }
    );
  }

  /**
   * Metodo que lee el contenido del archivo seleccionado y lo guarda en una variable para su uso posterior.
   */
  readArchivo(fileEvent: any) {
    this.archivoSelec = fileEvent.target.files[0];
    this.nombreArchivo = this.archivoSelec.name;
  }

  /**
   * Metodo que valida la extensión del archivo seleccionado
   */
  validateExtensionArchivo(nombreArchivo: string): boolean{
    if (nombreArchivo.includes('.xls')) {
      return true;
    } else {
      return false;
    }

  }

  /**
   * Metodo para resetear el valor del archivo
   * de crear buzon.
   */
  eventClean() {
    this.btnCargarArchivo.nativeElement.value = '';
    this.nombreArchivo = '';
  }

   /**
  * @descripcion Metodo para poder obtener el listado inicial de los parametros
  *
  * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
   async procesoLayout(){

    let formDataArchivo: FormData = new FormData();
    formDataArchivo.append('file', this.archivoSelec);
    this.archivo = formDataArchivo;

  //if ( !this.validateExtensionArchivo(this.archivoSelec.name)){
  //  this.open(this.translate.instant('pantalla.visualizarlayout.msjERRRC02Titulo'), this.translate.instant('pantalla.visualizarlayout.msjERRRC02Observacion'),'error',this.translate.instant('pantalla.visualizarlayout.msjERRRC02Codigo'));
  //} else {
    try{
      await this.layoutService.proLayout(this.archivo).then(
        async (result:any) => {
          if (result.code === '400'){
            this.open('Error', result.message);
            }else{
          this.globals.loaderSubscripcion.emit(false);
          this.open(this.translate.instant('pantalla.visualizarlayout.msjOKC0001Titulo'), this.translate.instant('pantalla.visualizarlayout.msjOKC0001Observacion'),'info',this.translate.instant('pantalla.visualizarlayout.msjOKC0001Codigo'));
              //download file:
              this.fc.convertBase64ToDownloadFileInExport(result);
          }
        }
      )
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
  }

 // }


} //Fin del ts
