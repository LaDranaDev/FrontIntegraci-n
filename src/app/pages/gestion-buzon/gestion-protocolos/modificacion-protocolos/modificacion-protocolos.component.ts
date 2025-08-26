import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalConfirmacionOkCancelComponent } from 'src/app/components/modals/modal-confirmacion-ok-cancel/modal-confirmacion-ok-cancel.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GestionProtocolos } from 'src/app/interface/gestionProtocoloRespuesta.interface';
import { GestionProtocolosService } from 'src/app/services/gestion-buzon/gestion-protocolos.service';

@Component({
  selector: 'app-modificacion-protocolos',
  templateUrl: './modificacion-protocolos.component.html',
  styleUrls: ['./modificacion-protocolos.component.css']
})
export class ModificacionProtocolosComponent implements OnInit, OnDestroy {
  /** variable de control para saber si se realizo el submit del alta */
  submittedAltaProtocolo = false;
  /** Propiedad para poder guardar o actualizar el parametro */
  objProtocolo:GestionProtocolos;
  /** Variables para guardar la informacion del protocolo */
  nombre:any;
  bandActivo: any;

  /**
   * @description Formulario para la busqueda de protocolos
   * @type {FormGroup}
   * @memberOf ModificacionProtocolosComponent
  */
  modProtocoloForm: UntypedFormGroup;
  /**
   * @description Id del protocolo
   * @type {any}
   * @memberOf ModificacionProtocolosComponent
  */
  id:any
  statusNum : any;

  constructor(
    private fc:FuncionesComunesComponent,
    private formBuilder: UntypedFormBuilder,
    private gestionProtocoloService:GestionProtocolosService,
    private router:Router,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService){

      /** Se inicia el formulario de busqueda */
      this.modProtocoloForm = this.initializeForm();
  }

  /**
  * Metodo getter para utilziacion y validacion de formulario
  * en la vista
  */
  get formControlProtocolo() {
    return this.modProtocoloForm.controls;
  }

  /**
     * Metodo para poder inicializar el formulario
     */
  private initializeForm() {
    return this.formBuilder.group({
      id:[''],
      nombre:[''],
      activo:[false],
    })
  }

  //Inicialización de componentes
  async ngOnInit(){
     this.id = this.gestionProtocoloService.getSaveLocalStorage('protocolo');
     if(this.id !== null){
      this.modProtocoloForm.patchValue({
        id: this.id.idProtocolo,
        nombre: this.id.nombre,
        activo: this.id.activo
      });
     }
  }
  ngOnDestroy() {
    if (localStorage.getItem('flagBorrarContenido') == 'true') {
      localStorage.removeItem('objPagination');
      localStorage.removeItem('flagBorrarContenido');
    }
  }


  /**
  * @description Metodo que se ejecutara al momento de dar click en limpiar
  */
  cleanForm(){
      /** Se reinicia el formulario de busqueda */
      this.modProtocoloForm = this.initializeForm();
  }

  /**
   * Metodo para regresar a la vista de consulta
   * de protocolos
  */
  regresarToConsult(){
    localStorage.setItem('flagBorrarContenido', 'false');
    this.router.navigate(['/gestionBuzon','gestionProtocolos']);
  }

  public async guardar(){
    try{
      await this.gestionProtocoloService.updateInformacionProtocolo(this.modProtocoloForm.value).then(
        async (result:any) => {
          if (result.code === '400' || result.code === null){
            if (result.message){
              this.open(
                this.translate.instant('modal.msjERRGEN0001Titulo'),
                result.message,
                'error',
                this.translate.instant('pantalla.administracion.protocolos.guardar.PROTOCOLOS9999Codigo'),
                this.translate.instant('menu.sterling.historialBuzon.error'),
              );

            }
        }else{
          this.submittedAltaProtocolo = false;
          this.globals.loaderSubscripcion.emit(false);
          /** Se hace el redirect a la vista de alta */
          this.regresarToConsult();
          }
        }
      )
    }catch(e){
      this.submittedAltaProtocolo = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia'),
       );      }

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

/*  patchValueD(protocolo:any, bandActivo:any){
    this.modProtocoloForm.patchValue({
      nombre: protocolo.nombre,
      bandActivo: bandActivo
    });
  }
*/
  /**
  * Función que valida y muestra mensaje individual
  * de cada campo  obligatorio
  */
  validaCadaCampoObligatorio(){
    var nombre = this.modProtocoloForm.get('nombre')?.value;
    if (nombre === '' ){
      this.open(
        this.translate.instant('modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'),
        this.translate.instant('pantalla.alta.protocolos.nombreObligatorio'),
        'alert',
        '',
        '',
       );
    }else {
      this.pregunta();
    }

  }

  pregunta(){
    this.openConfirmYN(this.translate.instant('administracion.protocolos.confirm.Titulo'),
    this.translate.instant('administracion.protocolos.confirm.Observacion'));
  }

  //Modal de confirmación
/*  openConfirmYN(titulo: string, contenido:string){
    const dialogo = this.dialog.open(ModalConfirmacionOkCancelComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido)});
      dialogo.afterClosed().subscribe(result => {
        if(result == 'si'){
          this.guardar()
        }
  });
  }
*/

  openConfirmYN(titulo: string, contenido: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm', ''), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.guardar();
      }
    });
  }

    /**
 * @description Evento para solo permitir valores del alphabeto,numeros,
 * punto, espacio y /
 * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
 * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
 * (keycode >= 48 && keycode <= 57) => numeros
 * (keycode) == 46 => point
 * (keycode) == 32 => espacio
 * (keycode) == 44 => coma
 * (keycode == 47) => /
 */
onlyAlphabeticAndNumbersAndSomeCaracEsp(event:KeyboardEvent){
  var charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)
      || charCode == 46 || charCode == 32 || charCode == 44 || (charCode == 47)){
      return true;
  }else{
      event.preventDefault();
      return false;
  }
}

/**
 * @param event Evento Disable
 * @returns la respuesta del evento
 */
disableEvent(event:any) {
  event.preventDefault();
  return false;
}

/**
 * Evento para al momento de realizar el pegado
 * en cualquier input este evento no ocurra
 */
eventoOnPasteBlock(event: ClipboardEvent) {
  return false;
}


}
