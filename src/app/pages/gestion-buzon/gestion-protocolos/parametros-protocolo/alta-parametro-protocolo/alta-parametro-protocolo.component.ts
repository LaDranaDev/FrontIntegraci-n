import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalConfirmacionOkCancelComponent } from 'src/app/components/modals/modal-confirmacion-ok-cancel/modal-confirmacion-ok-cancel.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GestionParametrosdelProtocoloService } from 'src/app/services/gestion-buzon/gestion-parametros.service';

@Component({
  selector: 'app-alta-parametro-protocolo',
  templateUrl: './alta-parametro-protocolo.component.html',
  styleUrls: ['./alta-parametro-protocolo.component.css']
})
export class AltaParametroProtocoloComponent implements OnInit {

/** variable de control para saber si se realizo el submit del alta */
submittedAltaParametro = false;

/** Propiedad para poder guardar o actualizar el banco */
objParametro:GestionParametrosdelProtocoloService;

/**
 * @description Formulario para la busqueda de bancos
 * @type {FormGroup}
 * @memberOf AltaParametroProtocoloComponent
*/
altaParametroForm: UntypedFormGroup;
parametro: any;

constructor(
  private fc:FuncionesComunesComponent,
  private formBuilder: UntypedFormBuilder,
  private gestionParametroService:GestionParametrosdelProtocoloService,
  private router:Router,
  private globals: Globals,
  public dialog: MatDialog,
  private translate: TranslateService
) {
    
    /** Se inicia el formulario de busqueda */
    this.altaParametroForm = this.initializeForm();
}

/**
* Metodo getter para utilziacion y validacion de formulario
* en la vista
*/
get formControlProtocolo() {
  return this.altaParametroForm.controls;
}

/**
   * Metodo para poder inicializar el formulario
   */
private initializeForm() {
  return this.formBuilder.group({
    idParametro: [],
    idProtocolo: [0],
    nombreParametro: [''],
    paraActivo: [true],
    requerido: [false],
    cifrado: [false],
    formato: ['0'],
    longitud: [],
    editable: [false],
    codigo: ['']
  })
}

//Inicialización de componentes 
async ngOnInit(){
   this.parametro = this.gestionParametroService.getSaveLocalStorage('parametro');
   let idParametro = this.parametro;
   if(this.parametro !== null){ 

    this.altaParametroForm.patchValue({
      idParametro: idParametro.idParametro,
      nombreParametro: idParametro.nombreParametro,
      paraActivo: idParametro.paraActivo,
      codigo: idParametro.codigo,
      longitud: idParametro.longitud,
      formato: idParametro.formato,
      cifrado: idParametro.cifrado,
      requerido: idParametro.requerido,
      idProtocolo: idParametro.idProtocolo,
      editable: idParametro.editable
    });
   }
}

/**
* @description Metodo que se ejecutara al momento de dar click en limpiar 
*/
cleanForm(){
    /** Se reinicia el formulario de busqueda */
    this.altaParametroForm = this.initializeForm();
}

/**
 * Metodo para regresar a la vista de consulta
 * de bancos
*/
regresarToConsult(){
  this.router.navigate(['/gestionBuzon','parametrosProtocolo']);
}

public async guardar(){
  this.submittedAltaParametro = true;
   /** llenar el objeto con los nuevos valores */
   if(this.altaParametroForm.invalid){
    return;
  }
  if(this.parametro === null){
    let nuevoParametro = this.altaParametroForm.value;
    const protocolo = this.gestionParametroService.getSaveLocalStorage('protocolo');
    nuevoParametro.idProtocolo = protocolo.idProtocolo;
//    this.convertBoolean(nuevoParametro);
    
   try{
      await this.gestionParametroService.saveInformacionParametro(nuevoParametro).then(
        async (result:any) => {
          if (result.code === '400'|| result.code === null ){
            if (result.message) {
              this.open('Error', result.message, 'error', this.translate.instant('pantalla.administracion.protocolos.guardar.PROTOCOLOS9999Codigo'),
                ''
              );
            } else {
              this.open(
                this.translate.instant('modal.msjERRGEN0001Titulo'),
                this.translate.instant('modal.msjERRGEN0001Observacion'),
                'error',
                this.translate.instant('modal.msjERRGEN0001Codigo'),
                this.translate.instant('modal.msjERRGEN0001Sugerencia'),
              );
            }
          } else if (result.code === '500'){
              this.open(
                this.translate.instant('modal.msjERRGEN0001Titulo'),
                this.translate.instant('modal.msjERRGEN0001Observacion'),
                'error',
                this.translate.instant('modal.msjERRGEN0001Codigo'),
                this.translate.instant('modal.msjERRGEN0001Sugerencia'),
               );

          } else {
          this.submittedAltaParametro = false;
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('buzon.msjINFOOKTitulo'),
            this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.PROTOCOLOS0000Observacion'),
            'info',
            this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.PROTOCOLOS0000Codigo')
          );
          /** Se hace el redirect a la vista de alta */
          this.regresarToConsult();
        }
    });
    }catch(e){
      this.submittedAltaParametro = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }

  }else{
    const update = this.altaParametroForm.value
//    this.convertBoolean(update);
    
    try{
      await this.gestionParametroService.updateInformacionParametro(this.parametro.idParametro,this.altaParametroForm.value).then(
        async (result:any) => {
          if (result.message) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              'Error',
              this.translate.instant(result.message),
              'error',
              this.translate.instant('pantalla.productos.admin.productos.error.CTERR03')
            );
          } else {
            this.submittedAltaParametro = false;
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant('buzon.msjINFOOKTitulo'),
              this.translate.instant('modificacion.correcta'),
              'aviso');
            /** Se hace el redirect a la vista de alta */
            this.regresarToConsult();
          }
        }
      )
    }catch(e){
      this.submittedAltaParametro = false;
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
  * Función que valida y muestra mensaje individual
  * de cada campo  obligatorio
  */
  validaCadaCampoObligatorio(){
    var nombreParametro = this.altaParametroForm.get('nombreParametro')?.value;
    var codigo = this.altaParametroForm.get('codigo')?.value;
    var longitud = this.altaParametroForm.get('longitud')?.value;
    var formato = this.altaParametroForm.get('formato')?.value;
    if (nombreParametro === ''){
      this.open('Error',
      this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.nombre.VAL001Observacion'), 
      'error',
      this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.VAL001Error'));
    }else if (codigo === ''){
      this.open('Error',
      this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.codigo.VAL001Observacion'), 
      'error',
      this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.VAL001Error'));
    }else if (!longitud){
      this.open('Error',
      this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.longitud.VAL001Observacion'), 
      'error',
      this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.VAL001Error'));
    }else if (formato === ''){
      this.open('Error',
      this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.formato.VAL001Observacion'), 
      'error',
      this.translate.instant('pantalla.administracion.protocolos.parametros.guardar.VAL001Error'));
    } else {
    this.pregunta(); 
    }
  }

  pregunta(){
    this.openConfirmYN(this.translate.instant('administracion.protocolos.confirm.Titulo'), 
    this.translate.instant('administracion.protocolos.confirm.Observacion'));
  }

  //Modal de confirmación
  openConfirmYN(titulo: string, contenido:string){
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm',''), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe(result => {
      if(result == 'ok'){
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
   * Metodo para solo ingrese numeros
   * en el input de numero de contrato
   */
eventOnlyNumbers(event: KeyboardEvent) {
  this.fc.numberOnly(event);
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

/**
   * Evento para solo permitir escritura
   * del alphabeto
   */
onlyAlphabeticAndNumbers(event: KeyboardEvent) {
  this.fc.onlyAlphabeticAndNumbers(event);
}

}
