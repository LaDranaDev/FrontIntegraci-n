import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalConfirmacionOkCancelComponent } from 'src/app/components/modals/modal-confirmacion-ok-cancel/modal-confirmacion-ok-cancel.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GestionParametrosdelProtocoloService } from 'src/app/services/gestion-buzon/gestion-parametros.service';

@Component({
  selector: 'app-modificacion-parametro-protocolo',
  templateUrl: './modificacion-parametro-protocolo.component.html',
  styleUrls: ['./modificacion-parametro-protocolo.component.css']
})
export class ModificacionParametroProtocoloComponent implements OnInit {

  /** variable de control para saber si se realizo el submit del alta */
  submittedAltaParametro = false;
  /** Variables para guardar la informacion del protocolo */
  nombreProtocolo= "";
  nombreParametro= "";
  codigo= "";
  longitud= "";
  formato= "";
  status= "";
  cifrado= "";
  requerido= "";
  
  /** Propiedad para poder guardar o actualizar el banco */
  objParametro:GestionParametrosdelProtocoloService;
  
  /**
   * @description Formulario para la busqueda de bancos
   * @type {FormGroup}
   * @memberOf AltaParametroProtocoloComponent
  */
  altaParametroForm: UntypedFormGroup;
  idParametro:any
  statusNum : number;
  cifradoNum : number;
  requeridoNum : number;
  
  
  constructor(
    private fc:FuncionesComunesComponent,
    private formBuilder: UntypedFormBuilder,
    private gestionParametroService:GestionParametrosdelProtocoloService,
    private router:Router,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService
  ){
      
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
      nombreParametro:[''],
      codigo: [''],
      longitud: [''],
      formato: [''],
      status: [''],
      cifrado: [''],
      requerido: [''],
      usuario: [''],
    })
  }
  
  //Inicialización de componentes 
  async ngOnInit(){
     this.idParametro = this.gestionParametroService.getSaveLocalStorage('parametro');
     if(this.idParametro !== null){
      this.altaParametroForm.patchValue({
        nombreParametro: this.idParametro.nombreParametro,
        status: this.idParametro.status,
        codigo: this.idParametro.codigo,
        longitud: this.idParametro.longitud,
        formato: this.idParametro.formato,
        cifrado: this.idParametro.cifrado,
        requerido: this.idParametro.requerido
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
    if(this.idParametro === null){
      const nuevoParametro = this.altaParametroForm.value
      if(nuevoParametro.status === true){
        this.statusNum = 1
      }else{
        this.statusNum = 0
      }
      if(nuevoParametro.cifrado === true){
        this.cifradoNum = 1
      }else{
        this.cifradoNum = 0
      }
      if(nuevoParametro.requerido === true){
        this.requeridoNum = 1
      }else{
        this.requeridoNum = 0
      }
      this.patchValueD(nuevoParametro, this.statusNum)
      
     try{
        await this.gestionParametroService.saveInformacionParametro(this.altaParametroForm.value).then(
          async (result:any) => {
            this.submittedAltaParametro = false;
            this.globals.loaderSubscripcion.emit(false);
            this.open('', result['message'], 'info');
            /** Se hace el redirect a la vista de alta */
            this.regresarToConsult();
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
  
    }else{
      const update = this.altaParametroForm.value
      if(update.status === true){
        this.statusNum = 1
      }else{
        this.statusNum = 0
      }
      this.patchValueD(update, this.cifradoNum)
      if(update.cifrado === true){
        this.cifradoNum = 1
      }else{
        this.cifradoNum = 0
      }
      this.patchValueD(update, this.cifradoNum)
      if(update.requerido === true){
        this.requeridoNum = 1
      }else{
        this.requeridoNum = 0
      }
      this.patchValueD(update, this.requeridoNum)
      
      try{
        await this.gestionParametroService.updateInformacionParametro(this.idParametro.id,this.altaParametroForm.value).then(
          async (result:any) => {
            this.submittedAltaParametro = false;
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant('buzon.msjINFOOKTitulo'),
              this.translate.instant('modificacion.correcta'),
              'aviso');
            /** Se hace el redirect a la vista de alta */
            this.regresarToConsult();
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

  patchValueD(protocolo:any, status:any){
    this.altaParametroForm.patchValue({
      nombreParametro: protocolo.nombreParametro,
      codigo: protocolo.codigo,
      longitud: protocolo.longitud,
      formato: protocolo.formato,
      status: status, 
      cifrado: protocolo.cifrado,
      requerido: protocolo.requerido
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
      this.open('Error','El campo Nombre Parámetro es obligatorio', 'error');
    }else if (codigo === ''){
      this.open('Error','El campo Codigo es obligatorio', 'error');
    }else if (longitud === ''){
      this.open('Error','El campo Longitud es obligatorio', 'error');
    }else if (formato === ''){
      this.open('Error','El campo Formato es obligatorio', 'error');
    } else {
    this.pregunta(); 
    }
  }

  pregunta(){
    this.openConfirmYN('Guardar Registro', '¿Está seguro que desea guardar los datos ingresados?')
  }

  //Modal de confirmación
  openConfirmYN(titulo: string, contenido:string){
    const dialogo = this.dialog.open(ModalConfirmacionOkCancelComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'), hasBackdrop: true});
      dialogo.afterClosed().subscribe(result => {
        if(result == 'si'){
          this.guardar()
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

}
