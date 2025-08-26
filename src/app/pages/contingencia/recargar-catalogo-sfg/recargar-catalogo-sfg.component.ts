import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { Globals } from '../../../bean/globals-bean.component';
import { IConsultaRecargaSFG } from '../../../bean/iconsullta-recargasfg.component';
import { ModalInfoBeanComponents } from '../../../bean/modal-info-bean.component';
import { ModalInfoComponent } from '../../../components/modals/modal-info/modal-info.component';
import { RecargaCatalogosSFGService } from '../../../services/contingencia/recarga-catalogos-sfg.service';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recargar-catalogo-sfg',
  templateUrl: './recargar-catalogo-sfg.component.html'
})
export class RecargarCatalogoSfgComponent implements OnInit, OnDestroy {
   /** Variable para identificar si el listado contiene o no valores*/
   banderaHasRows: boolean = false;
   /**
    * Atributo que representa la lista de buzones
    * @type {IConsultaCatalogo[]}
    * @memberof RecargarCatalogoSfgComponent
   */
   listRecargaSFG: IConsultaRecargaSFG[] = [];
 
   constructor(private globals: Globals,
     private service: RecargaCatalogosSFGService,
     public dialog: MatDialog, 
     private fc: FuncionesComunesComponent,
     private translate: TranslateService,
     private router: Router,
     private comunService: ComunesService,
     ) { }
 
   clickSuscliption: Subscription | undefined;

   ngOnInit(){
    //this.initForm();
    
     this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 8) {
        this.initForm();
      }
     });
   }

   initForm(){
    this.findInfoRecargaSFG();
   }
 
   ngOnDestroy() {
     this.clickSuscliption?.unsubscribe();
   }
 
   /**
    * Metodo para enviar archivo a traves de sterling
    * 
    * @param idMensaje Identifiador del mensaje XML
    */
   async reloadCatSFG(idMensaje: string) {
     try {
       await this.service.sendFileRecargaSFG(idMensaje).then(
         async (resp: any) => {
           if (resp.error == "OK00000") {
             this.findInfoRecargaSFG();
             this.open(
              this.translate.instant("consultaadmonusuario.msjINF00001Titulo"), 
              this.translate.instant("mensaje.recargaSFG.exito"), 
              "info",
              this.translate.instant('pantalla.recarga.codigo.OK_SFG01'),
              this.translate.instant('pantalla.recarga.sugerencia.OK_SFG01'),
            );
             this.globals.loaderSubscripcion.emit(false);
           } else {
            this.open(
              this.translate.instant("consultaadmonusuario.msjINF00001Titulo"), 
              this.translate.instant("mensaje.recargaSFG.error"), 
              "error",
              this.translate.instant('pantalla.recarga.codigo.ERSFTP1'),
              this.translate.instant('pantalla.recarga.sugerencia.OK_SFG01'),
            );
             this.globals.loaderSubscripcion.emit(false);
           }
         });
     } catch (e) {
      this.open(
        this.translate.instant("modal.msjERRGEN0001Titulo"), 
        this.translate.instant("modal.msjERRGEN0001Observacion"), 
        "error",
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant("modal.msjERRGEN0001Sugerencia"), 
      );
       this.globals.loaderSubscripcion.emit(false);
     }
   }
 
   /**
    * Metodo para consultar la info de recarga del catalogo sfg.
   */
   private async findInfoRecargaSFG() {
     this.listRecargaSFG = [];
     try {
       await this.service.findRecargaSFG().then(
         async (resp: any) => {
           if (resp.length > 0) {
             resp.forEach((row: any) => {
               let consultaRecSFG: IConsultaRecargaSFG = {
                 valor: row['valor'],
                 descripcion: row['descr']
               }
               this.listRecargaSFG.push(consultaRecSFG);
             });
             this.banderaHasRows = true;
             this.globals.loaderSubscripcion.emit(false);
           } else {
            this.open(
              this.translate.instant("consultaadmonusuario.msjINF00001Titulo"), 
              this.translate.instant("mensaje.recargaSFG.consulta.vacia"), 
              "error",
              this.translate.instant('pantalla.recarga.codigo.ERRRC00'),
              this.translate.instant('pantalla.recarga.sugerencia.OK_SFG01'),
            );
        
             this.globals.loaderSubscripcion.emit(false);
           }
         });
     } catch (e) {
      this.open(
        this.translate.instant("modal.msjERRGEN0001Titulo"), 
        this.translate.instant("modal.msjERRGEN0001Observacion"), 
        "error",
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant("modal.msjERRGEN0001Sugerencia"), 
      );
       this.globals.loaderSubscripcion.emit(false);
     }
   }
 
   /**
    * @description evento para poder levantar el modal para
    * mostrar los mensajes de sucess o error
    * @param titulo indica si se ejecutara para error o success
    * @param contenido mensaje que se mostrara en el modal
   */
   open(  titulo: String,  contenido: String,  type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',  code: string,  sugerencia: string) {
    this.dialog.open(ModalInfoComponent, {
    data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
  });
}
 
 }